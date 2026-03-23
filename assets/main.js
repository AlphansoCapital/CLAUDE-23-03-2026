const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs   = require('fs');

let win;

function createWindow() {
  const winConfig = {
    width: 1100,
    height: 780,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#080a09',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
  };

  // Only set icon if it exists (avoids crash on missing icon)
  const iconPath = path.join(__dirname, 'assets', 'icon.png');
  if (fs.existsSync(iconPath)) winConfig.icon = iconPath;

  win = new BrowserWindow(winConfig);
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.once('ready-to-show', () => win.show());

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// ── IPC: Open folder picker ──────────────────────────────────
ipcMain.handle('pick-folder', async () => {
  try {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory'],
      title: 'Select your project folder',
    });
    if (result.canceled || !result.filePaths.length) return null;
    return result.filePaths[0];
  } catch(e) {
    console.error('pick-folder error:', e);
    return null;
  }
});

// ── IPC: Read files from folder ──────────────────────────────
ipcMain.handle('read-folder', async (_, folderPath) => {
  const files = [];
  const SKIP_DIRS = new Set([
    'node_modules','.git','.DS_Store','__MACOSX',
    'dist','build','.next','vendor','bower_components',
    'AppData','Program Files','Windows','System32',
  ]);
  const ALLOWED_EXT = new Set([
    'liquid','css','js','md','html','htm','zip',
    'json','txt','svg','png','jpg','jpeg','gif','webp',
  ]);

  // Safety: limit total files scanned to prevent crash on huge folders
  const MAX_FILES = 500;
  const MAX_DEPTH = 4;

  function walk(dir, rel, depth) {
    if (depth > MAX_DEPTH) return;
    if (files.length >= MAX_FILES) return;

    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch(e) { return; }

    for (const entry of entries) {
      if (files.length >= MAX_FILES) break;
      if (entry.name.startsWith('.')) continue;
      if (SKIP_DIRS.has(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);
      const relPath  = rel ? path.join(rel, entry.name) : entry.name;

      if (entry.isDirectory()) {
        walk(fullPath, relPath, depth + 1);
      } else if (entry.isFile()) {
        const ext = entry.name.split('.').pop().toLowerCase();
        if (!ALLOWED_EXT.has(ext)) continue;

        try {
          const stat = fs.statSync(fullPath);
          if (stat.size > 5 * 1024 * 1024) continue; // skip >5MB
          const content = fs.readFileSync(fullPath).toString('base64');
          files.push({
            name:    entry.name,
            ext:     ext,
            relPath: relPath,
            size:    stat.size,
            content: content,
          });
        } catch(e) { /* skip unreadable files */ }
      }
    }
  }

  try {
    walk(folderPath, '', 0);
  } catch(e) {
    console.error('read-folder error:', e);
  }

  return { folderName: path.basename(folderPath), files };
});

// ── IPC: Open URL in browser ─────────────────────────────────
ipcMain.handle('open-url', async (_, url) => {
  try { shell.openExternal(url); } catch(e) {}
});

// ── IPC: App version ─────────────────────────────────────────
ipcMain.handle('get-version', () => app.getVersion());
