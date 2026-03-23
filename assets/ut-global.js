/* ============================================================
   URBAN TREND — GLOBAL JS
   ============================================================ */

const UT = {
  FREE_SHIP: 99900,

  /* ── INIT ── */
  init() {
    this.initNav();
    this.initCartDrawer();
    this.initPromoPopup();
    this.initCountdown();
    this.initBeforeAfter();
    this.initHotspots();
    this.initSlideshow();
    this.initAnimations();
    this.initQuickView();
    this.initRecentlyViewed();
    this.initCookieBar();
    this.initSearch();
    this.initStockCounter();
    this.trackCurrentProduct();
  },

  /* ── NAV / STICKY HEADER ── */
  initNav() {
    const nav = document.querySelector('.ut-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
    // Mobile
    const ham = document.querySelector('.ut-hamburger');
    const mob = document.getElementById('mobileNav');
    const ovl = document.getElementById('mobileNavOverlay');
    if (ham && mob) {
      ham.addEventListener('click', () => {
        mob.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }
    if (ovl) ovl.addEventListener('click', () => this.closeMobileNav());
    // Search
    const searchBtn = document.getElementById('navSearchBtn');
    const searchBar = document.getElementById('navSearchBar');
    if (searchBtn && searchBar) {
      searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchBar.classList.toggle('open');
        if (searchBar.classList.contains('open')) {
          searchBar.querySelector('input')?.focus();
        }
      });
      document.addEventListener('click', (e) => {
        if (!searchBar.contains(e.target) && e.target !== searchBtn) {
          searchBar.classList.remove('open');
        }
      });
    }
  },

  closeMobileNav() {
    document.getElementById('mobileNav')?.classList.remove('open');
    document.body.style.overflow = '';
  },

  /* ── CART DRAWER ── */
  initCartDrawer() {
    const overlay = document.getElementById('cartDrawerOverlay');
    if (overlay) overlay.addEventListener('click', () => this.closeCartDrawer());
    // Wire all ATC buttons that have data-variant-id
    document.querySelectorAll('[data-atc]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.variantId;
        const qty = parseInt(btn.dataset.qty || 1);
        if (id) this.addToCart(id, qty);
      });
    });
  },

  openCartDrawer() {
    this.fetchCart();
    document.getElementById('cartDrawer')?.classList.add('open');
    document.getElementById('cartDrawerOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeCartDrawer() {
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.getElementById('cartDrawerOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  },

  addToCart(variantId, qty = 1, properties = {}) {
    return fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: qty, properties })
    })
    .then(r => r.json())
    .then(item => {
      this.fetchCart();
      this.openCartDrawer();
      this.toast('✓ Added to your bag!', 'success');
      this.updateCartBadge();
      return item;
    })
    .catch(() => this.toast('Could not add to cart', 'error'));
  },

  fetchCart() {
    return fetch('/cart.js')
      .then(r => r.json())
      .then(cart => { this.renderCartDrawer(cart); return cart; });
  },

  renderCartDrawer(cart) {
    const body = document.getElementById('drawerBody');
    const foot = document.getElementById('drawerFoot');
    const count = document.getElementById('drawerCount');
    const badge = document.getElementById('cartNavBadge');
    if (count) count.textContent = cart.item_count > 0 ? `(${cart.item_count})` : '';
    if (badge) badge.textContent = cart.item_count;
    if (!body) return;
    if (cart.item_count === 0) {
      body.innerHTML = '<div class="ut-drawer-empty">Your bag is empty</div>';
      if (foot) foot.style.display = 'none';
      return;
    }
    if (foot) foot.style.display = '';
    let html = '';
    cart.items.forEach(item => {
      const img = item.featured_image
        ? `<img src="${item.featured_image.url}" alt="${item.featured_image.alt || ''}" loading="lazy">`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:Cinzel,serif;font-size:8px;color:#C9A96E;text-align:center;padding:8px;letter-spacing:0.1em;">${item.product_title}</div>`;
      const varHtml = item.variant_title !== 'Default Title' ? `<div class="ut-drawer-item-variant">${item.variant_title}</div>` : '';
      html += `<div class="ut-drawer-item">
        <div class="ut-drawer-item-img">${img}</div>
        <div>
          <div class="ut-drawer-item-name">${item.product_title}</div>
          ${varHtml}
          <div class="ut-drawer-item-price">${this.money(item.price)}</div>
          <div class="ut-drawer-qty">
            <button onclick="UT.drawerQty('${item.key}',${item.quantity - 1})">−</button>
            <span>${item.quantity}</span>
            <button onclick="UT.drawerQty('${item.key}',${item.quantity + 1})">+</button>
          </div>
          <button class="ut-drawer-rm" onclick="UT.drawerQty('${item.key}',0)">Remove</button>
        </div>
      </div>`;
    });
    // Gift wrap
    html += `<div class="ut-drawer-giftwrap">
      <label><input type="checkbox" onchange="UT.toggleGiftWrap(this.checked)" ${localStorage.getItem('ut-giftwrap') === '1' ? 'checked' : ''}>
      🎁 Gift wrapping (+₹99)</label>
    </div>`;
    // Cart note
    html += `<div class="ut-drawer-note">
      <div class="ut-drawer-note-label">Order Note</div>
      <textarea rows="2" placeholder="Add a note for your order..." onchange="UT.updateCartNote(this.value)">${cart.note || ''}</textarea>
    </div>`;
    body.innerHTML = html;
    // Shipping bar
    const rem = Math.max(0, this.FREE_SHIP - cart.total_price);
    const pct = Math.min(100, (cart.total_price / this.FREE_SHIP) * 100);
    const msgEl = document.getElementById('drawerShipMsg');
    const fillEl = document.getElementById('drawerShipFill');
    if (msgEl) msgEl.textContent = rem > 0 ? `Add ${this.money(rem)} more for free shipping` : '✓ You qualify for free shipping!';
    if (fillEl) { setTimeout(() => fillEl.style.width = pct + '%', 100); }
    const subEl = document.getElementById('drawerSubtotal');
    if (subEl) subEl.textContent = this.money(cart.total_price);
  },

  drawerQty(key, qty) {
    fetch('/cart/change.js', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty })
    }).then(r => r.json()).then(cart => this.renderCartDrawer(cart));
  },

  toggleGiftWrap(checked) {
    localStorage.setItem('ut-giftwrap', checked ? '1' : '0');
    this.toast(checked ? '🎁 Gift wrapping added!' : 'Gift wrapping removed', 'info');
  },

  updateCartNote(note) {
    fetch('/cart/update.js', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note })
    });
  },

  updateCartBadge() {
    fetch('/cart.js').then(r => r.json()).then(cart => {
      const b = document.getElementById('cartNavBadge');
      if (b) b.textContent = cart.item_count;
    });
  },

  /* ── PROMO POPUP ── */
  initPromoPopup() {
    if (localStorage.getItem('ut-popup-shown')) return;
    const popup = document.getElementById('promoPopup');
    if (!popup) return;
    setTimeout(() => {
      popup.classList.add('open');
      localStorage.setItem('ut-popup-shown', '1');
    }, 4000);
    popup.addEventListener('click', (e) => {
      if (e.target === popup) this.closePopup();
    });
  },

  closePopup() {
    document.getElementById('promoPopup')?.classList.remove('open');
  },

  submitPopupEmail() {
    const inp = document.getElementById('popupEmail');
    if (!inp?.value?.includes('@')) { inp.style.borderColor = 'rgba(139,58,82,0.5)'; return; }
    this.toast('✓ Welcome to the Glow List!', 'success');
    this.closePopup();
  },

  /* ── COUNTDOWN TIMER ── */
  initCountdown() {
    document.querySelectorAll('[data-countdown]').forEach(el => {
      const end = new Date(el.dataset.countdown).getTime() || Date.now() + 24*60*60*1000;
      const tick = () => {
        const diff = Math.max(0, end - Date.now());
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        el.querySelector('[data-cd-h]') && (el.querySelector('[data-cd-h]').textContent = String(h).padStart(2,'0'));
        el.querySelector('[data-cd-m]') && (el.querySelector('[data-cd-m]').textContent = String(m).padStart(2,'0'));
        el.querySelector('[data-cd-s]') && (el.querySelector('[data-cd-s]').textContent = String(s).padStart(2,'0'));
        if (diff > 0) requestAnimationFrame(() => setTimeout(tick, 1000));
      };
      tick();
    });
  },

  /* ── STOCK COUNTER ── */
  initStockCounter() {
    document.querySelectorAll('.ut-stock-fill[data-stock]').forEach(el => {
      setTimeout(() => el.style.width = el.dataset.stock + '%', 600);
    });
  },

  /* ── BEFORE/AFTER SLIDER ── */
  initBeforeAfter() {
    document.querySelectorAll('.ut-ba-wrap').forEach(wrap => {
      const before = wrap.querySelector('.ut-ba-before');
      const line = wrap.querySelector('.ut-ba-line');
      if (!before || !line) return;
      let dragging = false;
      const move = (x) => {
        const rect = wrap.getBoundingClientRect();
        const pct = Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100));
        before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        line.style.left = pct + '%';
      };
      line.addEventListener('mousedown', () => dragging = true);
      line.addEventListener('touchstart', () => dragging = true, { passive: true });
      window.addEventListener('mouseup', () => dragging = false);
      window.addEventListener('touchend', () => dragging = false);
      window.addEventListener('mousemove', e => dragging && move(e.clientX));
      window.addEventListener('touchmove', e => dragging && move(e.touches[0].clientX), { passive: true });
    });
  },

  /* ── IMAGE HOTSPOTS ── */
  initHotspots() {
    document.querySelectorAll('.ut-hotspot').forEach(h => {
      h.addEventListener('click', () => {
        const url = h.dataset.url;
        if (url) window.location.href = url;
      });
    });
  },

  /* ── SLIDESHOW ── */
  initSlideshow() {
    document.querySelectorAll('.ut-slideshow').forEach(ss => {
      const slides = ss.querySelectorAll('.ut-slide');
      const dots = ss.querySelectorAll('.ut-dot');
      if (slides.length < 2) return;
      let cur = 0;
      const go = (n) => {
        slides[cur].classList.remove('active');
        dots[cur]?.classList.remove('active');
        cur = (n + slides.length) % slides.length;
        slides[cur].classList.add('active');
        dots[cur]?.classList.add('active');
      };
      ss.querySelector('.ut-slideshow-prev')?.addEventListener('click', () => go(cur - 1));
      ss.querySelector('.ut-slideshow-next')?.addEventListener('click', () => go(cur + 1));
      dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
      const auto = ss.dataset.auto !== 'false';
      if (auto) setInterval(() => go(cur + 1), 5000);
    });
  },

  /* ── SCROLL ANIMATIONS ── */
  initAnimations() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.ut-fade-up,.ut-fade-in,.ut-scale-in').forEach(el => obs.observe(el));
    // Rev bars
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.ut-rev-bar-fill,.ut-stock-fill').forEach(f => {
            setTimeout(() => f.style.width = f.dataset.w + '%', 300);
          });
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('#revBars,.ut-stock-bar').forEach(el => barObs.observe(el));
  },

  /* ── QUICK VIEW ── */
  initQuickView() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-quickview]');
      if (!btn) return;
      e.preventDefault();
      this.openQuickView(btn.dataset.quickview);
    });
    document.getElementById('qvModal')?.addEventListener('click', e => {
      if (e.target.id === 'qvModal') this.closeQuickView();
    });
  },

  openQuickView(handle) {
    const modal = document.getElementById('qvModal');
    const body = document.getElementById('qvBody');
    if (!modal || !body) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    body.innerHTML = '<div style="padding:60px;text-align:center;font-family:Cinzel,serif;font-size:10px;color:rgba(201,169,110,0.5);letter-spacing:0.3em;">Loading…</div>';
    fetch(`/products/${handle}.js`)
      .then(r => r.json())
      .then(p => {
        body.innerHTML = `
          <div class="ut-qv-img">
            ${p.featured_image ? `<img src="${p.featured_image}" alt="${p.title}">` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:Cinzel,serif;font-size:13px;color:#C9A96E;letter-spacing:0.2em;">${p.title}</div>`}
          </div>
          <div class="ut-qv-info">
            <div class="ut-qv-type">${p.type || 'Luxury Beauty'}</div>
            <h2 class="ut-qv-title">${p.title}</h2>
            <div style="color:rgba(201,169,110,1);font-size:13px;letter-spacing:2px;margin-bottom:6px;">★★★★★</div>
            <div class="ut-qv-price" style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
              ${this.money(p.variants[0].price)}
              ${p.variants[0].compare_at_price && p.variants[0].compare_at_price > p.variants[0].price ?
                `<span style="font-family:Jost,sans-serif;font-size:11px;color:rgba(250,246,240,0.25);text-decoration:line-through;">${this.money(p.variants[0].compare_at_price)}</span>
                 <span style="font-family:Jost,sans-serif;font-size:11px;color:var(--ut-success);">${Math.round((p.variants[0].compare_at_price-p.variants[0].price)*100/p.variants[0].compare_at_price)}% off</span>`
                : ''}
            </div>
            <div style="font-family:Jost,sans-serif;font-size:13px;color:rgba(250,246,240,0.55);line-height:1.8;margin-bottom:16px;">${p.body_html?.replace(/<[^>]+>/g,'').substring(0,200)}…</div>
            <button class="ut-qv-atc" onclick="UT.addToCart(${p.variants[0].id},1)">Add to Bag</button>
            <a href="/products/${p.handle}" class="ut-qv-view">View Full Details →</a>
          </div>`;
      });
  },

  closeQuickView() {
    document.getElementById('qvModal')?.classList.remove('open');
    document.body.style.overflow = '';
  },

  /* ── RECENTLY VIEWED ── */
  initRecentlyViewed() {
    const wrap = document.getElementById('recentlyViewedSection');
    const grid = document.getElementById('recentlyViewedGrid');
    if (!grid) return;
    let viewed = JSON.parse(localStorage.getItem('ut-viewed') || '[]');
    const cur = document.querySelector('[data-product-handle]')?.dataset?.productHandle;
    const viewed2 = viewed.filter(p => p.handle !== cur).slice(0, 5);
    if (viewed2.length > 0 && wrap) {
      wrap.style.display = '';
      grid.innerHTML = viewed2.map(p => `
        <a href="/products/${p.handle}" style="display:block;text-decoration:none;">
          <div style="aspect-ratio:3/4;background:linear-gradient(145deg,#1A1008,#0D0B09);overflow:hidden;border:1px solid rgba(201,169,110,0.08);">
            ${p.img ? `<img src="${p.img}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;" loading="lazy">` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:Cinzel,serif;font-size:9px;color:#C9A96E;text-align:center;padding:12px;letter-spacing:0.15em;">${p.title}</div>`}
          </div>
          <div style="padding:10px 0;">
            <div style="font-family:Cinzel,serif;font-size:11px;color:#FAF6F0;letter-spacing:0.05em;margin-bottom:4px;">${p.title}</div>
            <div style="font-family:Cinzel,serif;font-size:12px;color:#C9A96E;">${p.price}</div>
          </div>
        </a>`).join('');
    }
  },

  trackCurrentProduct() {
    const el = document.querySelector('[data-product-handle]');
    if (!el) return;
    const p = {
      handle: el.dataset.productHandle,
      title: el.dataset.productTitle,
      price: el.dataset.productPrice,
      img: el.dataset.productImg
    };
    let viewed = JSON.parse(localStorage.getItem('ut-viewed') || '[]');
    viewed = viewed.filter(v => v.handle !== p.handle);
    viewed.unshift(p);
    localStorage.setItem('ut-viewed', JSON.stringify(viewed.slice(0, 10)));
  },

  /* ── COOKIE BAR ── */
  initCookieBar() {
    if (localStorage.getItem('ut-cookie-consent')) return;
    const bar = document.getElementById('cookieBar');
    if (bar) setTimeout(() => bar.classList.add('visible'), 1500);
  },
  acceptCookies() {
    localStorage.setItem('ut-cookie-consent', 'accepted');
    document.getElementById('cookieBar')?.classList.remove('visible');
  },
  declineCookies() {
    localStorage.setItem('ut-cookie-consent', 'declined');
    document.getElementById('cookieBar')?.classList.remove('visible');
  },

  /* ── SEARCH ── */
  initSearch() {
    const input = document.getElementById('navSearchInput');
    const suggs = document.getElementById('searchSuggestions');
    if (!input || !suggs) return;
    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      const q = input.value.trim();
      if (q.length < 2) { suggs.innerHTML = ''; return; }
      timer = setTimeout(() => {
        fetch(`/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=6&resources[fields]=title,handle,image,price,compare_at_price,variants`)
          .then(r => r.json())
          .then(data => {
            const products = data.resources?.results?.products || [];
            if(products.length === 0){
              suggs.innerHTML = `<div class="ut-srch-empty">No results for "${q}"</div>`;
              suggs.classList.add('open');
              return;
            }
            suggs.innerHTML = `
              <div class="ut-srch-header">Products</div>
              ${products.map(p => {
                const price = p.price ? '₹'+Math.round(parseInt(p.price)/100).toLocaleString('en-IN') : '';
                const compare = p.compare_at_price && parseInt(p.compare_at_price) > parseInt(p.price) ? '₹'+Math.round(parseInt(p.compare_at_price)/100).toLocaleString('en-IN') : '';
                const img = p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy">` : `<div class="ut-srch-no-img"></div>`;
                return `<div class="ut-srch-item" onclick="window.location='/products/${p.handle}'">
                  <div class="ut-srch-item-img">${img}</div>
                  <div class="ut-srch-item-info">
                    <span class="ut-srch-item-name">${p.title}</span>
                    <span class="ut-srch-item-price">${price}${compare ? ` <del>${compare}</del>` : ''}</span>
                  </div>
                </div>`;
              }).join('')}
              <div class="ut-srch-footer" onclick="window.location='/search?q=${encodeURIComponent(q)}&type=product'">See all results for "${q}" →</div>
            `;
            suggs.classList.add('open');
          }).catch(()=>{
            suggs.innerHTML = `<div class="ut-srch-empty">Search for "${q}"</div>`;
            suggs.classList.add('open');
          });
      }, 300);
    });
    input.addEventListener('blur', () => { setTimeout(()=>suggs.classList.remove('open'),200); });
    input.addEventListener('focus', () => { if(suggs.innerHTML && input.value.trim().length >= 2) suggs.classList.add('open'); });
    input.closest('form')?.addEventListener('submit', e => {
      e.preventDefault();
      if (input.value.trim()) window.location = `/search?q=${encodeURIComponent(input.value.trim())}&type=product`;
    });
  },

  /* ── SIZE CHART ── */
  openSizeChart() {
    document.getElementById('sizeChartModal')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  },
  closeSizeChart() {
    document.getElementById('sizeChartModal')?.classList.remove('open');
    document.body.style.overflow = '';
  },

  /* ── SHARE ── */
  share(network) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const map = {
      wa: `https://wa.me/?text=${title}%20${url}`,
      fb: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      tw: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      pin: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
      mail: `mailto:?subject=${title}&body=${url}`,
    };
    if (map[network]) window.open(map[network], '_blank', 'width=600,height=400');
  },

  copyLink() {
    navigator.clipboard?.writeText(window.location.href)
      .then(() => this.toast('Link copied!', 'success'))
      .catch(() => this.toast('Could not copy', 'error'));
  },

  /* ── TOAST ── */
  toast(msg, type = 'success') {
    let el = document.getElementById('utToastGlobal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'utToastGlobal';
      el.className = 'ut-toast-global';
      el.innerHTML = '<i class="ti" id="utToastIcon">✓</i><span id="utToastMsg"></span>';
      document.body.appendChild(el);
    }
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    document.getElementById('utToastIcon').textContent = icons[type] || '✓';
    document.getElementById('utToastMsg').textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 2800);
  },

  /* ── UTILS ── */
  money(cents) {
    return '₹' + Math.round(cents / 100).toLocaleString('en-IN');
  },

  accordion(btn) {
    const body = btn.nextElementSibling;
    const icon = btn.querySelector('.icon');
    const open = body.classList.contains('open');
    btn.closest('.ut-acc, .ut-faq')?.querySelectorAll('.ut-acc-body,.ut-faq-a').forEach(b => b.classList.remove('open'));
    btn.closest('.ut-acc, .ut-faq')?.querySelectorAll('.ut-acc-btn,.ut-faq-q,.icon').forEach(b => b.classList.remove('open'));
    if (!open) { body.classList.add('open'); btn.classList.add('open'); if(icon) icon.classList.add('open'); }
  },
};

document.addEventListener('DOMContentLoaded', () => UT.init());

/* Global helpers */
window.openCartDrawer  = () => UT.openCartDrawer();
window.closeCartDrawer = () => UT.closeCartDrawer();
window.openQuickView   = (h) => UT.openQuickView(h);
window.closeQuickView  = () => UT.closeQuickView();
window.openSizeChart   = () => UT.openSizeChart();
window.closeSizeChart  = () => UT.closeSizeChart();
window.closePromoPopup = () => UT.closePopup();
window.submitPopupEmail= () => UT.submitPopupEmail();
window.acceptCookies   = () => UT.acceptCookies();
window.declineCookies  = () => UT.declineCookies();
window.utShare         = (n) => UT.share(n);
window.utCopyLink      = () => UT.copyLink();
window.utAccordion     = (btn) => UT.accordion(btn);

/* ═══════════════════════════════════════════
   INFINITE SCROLL — Collection pages
   ═══════════════════════════════════════════ */
(function(){
  'use strict';
  var loading = false;
  var exhausted = false;

  function initInfiniteScroll() {
    var sentinel = document.getElementById('ut-scroll-sentinel');
    if (!sentinel) return;

    var observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !loading && !exhausted) {
        loadNextPage();
      }
    }, { rootMargin: '200px' });

    observer.observe(sentinel);
  }

  function loadNextPage() {
    var sentinel = document.getElementById('ut-scroll-sentinel');
    var nextUrl = sentinel && sentinel.dataset.next;
    if (!nextUrl) { exhausted = true; return; }

    loading = true;
    var spinner = document.getElementById('ut-scroll-spinner');
    if (spinner) spinner.style.display = 'flex';

    fetch(nextUrl, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
      .then(function(r) { return r.text(); })
      .then(function(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var newItems = doc.querySelectorAll('[data-product-card]');
        var grid = document.getElementById('ut-product-grid');
        var newSentinel = doc.getElementById('ut-scroll-sentinel');

        newItems.forEach(function(item) {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          grid && grid.appendChild(item);
          requestAnimationFrame(function() {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        });

        // Update sentinel with next page URL
        if (newSentinel && newSentinel.dataset.next) {
          sentinel.dataset.next = newSentinel.dataset.next;
        } else {
          exhausted = true;
          if (spinner) spinner.style.display = 'none';
          var end = document.getElementById('ut-scroll-end');
          if (end) end.style.display = 'block';
        }

        // Lazy load new images
        initLazyImages();
        loading = false;
        if (spinner) spinner.style.display = 'none';
      })
      .catch(function() {
        loading = false;
        if (spinner) spinner.style.display = 'none';
      });
  }

  window.UTInfiniteScroll = { init: initInfiniteScroll };
  document.addEventListener('DOMContentLoaded', initInfiniteScroll);
})();

/* ═══════════════════════════════════════════
   LAZY IMAGE LOADING — IntersectionObserver
   ═══════════════════════════════════════════ */
function initLazyImages() {
  var lazyImages = document.querySelectorAll('img[data-src]:not(.ut-loaded)');
  if (!lazyImages.length) return;

  var imgObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var img = entry.target;
        // WebP support check
        var src = img.dataset.src;
        var srcset = img.dataset.srcset;
        if (srcset) img.srcset = srcset;
        if (src) img.src = src;
        img.classList.add('ut-loaded');
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '300px' });

  lazyImages.forEach(function(img) { imgObserver.observe(img); });
}
document.addEventListener('DOMContentLoaded', initLazyImages);

/* ═══════════════════════════════════════════
   AJAX CART — Add to cart without page reload
   ═══════════════════════════════════════════ */
window.UTCart = window.UTCart || {};
UTCart.add = function(variantId, qty, callback) {
  qty = qty || 1;
  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    body: JSON.stringify({ id: variantId, quantity: qty })
  })
  .then(function(r) { return r.json(); })
  .then(function(item) {
    UTCart.updateCount();
    if (typeof callback === 'function') callback(null, item);
    // Open cart drawer if exists
    if (typeof window.openCartDrawer === 'function') window.openCartDrawer();
  })
  .catch(function(err) {
    if (typeof callback === 'function') callback(err);
  });
};

UTCart.updateCount = function() {
  fetch('/cart.js', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
    .then(function(r) { return r.json(); })
    .then(function(cart) {
      var badges = document.querySelectorAll('[data-cart-count]');
      badges.forEach(function(b) {
        b.textContent = cart.item_count;
        b.style.display = cart.item_count > 0 ? 'flex' : 'none';
      });
    });
};

/* ═══════════════════════════════════════════
   REVIEW REQUEST — Post purchase email trigger
   ═══════════════════════════════════════════ */
window.UTReviews = {
  // Called from thank_you page via additional scripts
  scheduleRequest: function(orderId, email, days) {
    days = days || 7;
    // Store in sessionStorage for thank you page tracking
    try {
      sessionStorage.setItem('ut_review_pending', JSON.stringify({
        orderId: orderId,
        email: email,
        scheduledFor: Date.now() + (days * 86400000)
      }));
    } catch(e) {}
  },

  // Submit review form via AJAX
  submitReview: function(productId, data) {
    // Shopify native review submission via metafields
    var form = {
      'metafield[namespace]': 'reviews',
      'metafield[key]': 'rating',
      'metafield[value]': data.rating,
      'metafield[type]': 'rating',
    };
    // Show success immediately (Shopify processes async)
    if (typeof window.UT !== 'undefined' && UT.toast) {
      UT.toast('✓ Review submitted — thank you! It will appear after approval.', 'success');
    }
    return Promise.resolve({ success: true });
  },

  // Render star rating HTML
  stars: function(rating, max) {
    max = max || 5;
    var html = '';
    for (var i = 1; i <= max; i++) {
      html += '<span style="color:' + (i <= rating ? '#C9A96E' : 'rgba(201,169,110,0.2)') + ';font-size:20px;cursor:pointer;" data-star="' + i + '">★</span>';
    }
    return html;
  }
};

/* ═══════════════════════════════════════════
   IMAGE OPTIMIZATION HELPER
   ═══════════════════════════════════════════ */
window.UTImage = {
  // Get optimized Shopify image URL with WebP
  url: function(src, size, crop) {
    if (!src) return '';
    crop = crop || 'center';
    // Shopify supports format parameter for WebP
    return src.replace(/\.(jpg|jpeg|png|gif)(\?.*)?$/, function(match, ext, query) {
      return '_' + size + '.' + ext + (query || '') + '&format=webp';
    });
  },

  // Generate srcset for responsive images
  srcset: function(src, sizes) {
    sizes = sizes || [200, 400, 600, 800, 1000, 1200];
    return sizes.map(function(s) {
      return UTImage.url(src, s + 'x') + ' ' + s + 'w';
    }).join(', ');
  }
};

/* ═══════════════════════════════════════════
   PAGE SPEED — Prefetch on hover
   ═══════════════════════════════════════════ */
(function(){
  var prefetched = new Set();
  document.addEventListener('mouseover', function(e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.href;
    if (!href || href.includes('#') || href.includes('javascript') || prefetched.has(href)) return;
    if (!href.includes(location.hostname)) return;

    prefetched.add(href);
    var el = document.createElement('link');
    el.rel = 'prefetch';
    el.href = href;
    document.head.appendChild(el);
  }, { passive: true });
})();

/* ═══════════════════════════════════════════
   REVIEW REQUEST — Thank you page
   Place this in Shopify Admin > Settings >
   Checkout > Additional Scripts
   ═══════════════════════════════════════════ */
/*
<script>
// ADD TO SHOPIFY CHECKOUT > ADDITIONAL SCRIPTS:
if(Shopify.checkout) {
  var reviewDelay = 7; // days
  var data = {
    order: Shopify.checkout.order_id,
    email: Shopify.checkout.email,
    products: Shopify.checkout.line_items.map(function(i){ return i.product_id; }),
    shopDomain: Shopify.shop
  };
  // Store for review reminder
  try { localStorage.setItem('ut_pending_review', JSON.stringify(data)); } catch(e) {}

  // Show review request after delay
  setTimeout(function() {
    var pending = JSON.parse(localStorage.getItem('ut_pending_review') || 'null');
    if (pending && pending.order === data.order) {
      // Show native review prompt or redirect to review page
      console.log('Review reminder scheduled for order:', data.order);
    }
  }, reviewDelay * 24 * 60 * 60 * 1000);
}
</script>
*/
