/* ================================================================
   URBAN TREND — PDP CTA + A+ CONTENT JAVASCRIPT
   File: assets/ut-pdp-cta-aplus.js
   Load via script tag in layout/theme.liquid (defer)
   Depends on: ut-global.js (UT object must exist)
================================================================ */

(function () {
  'use strict';

  /* ── Guard: only run on PDP ── */
  if (!document.getElementById('utCta')) return;

  /* ────────────────────────────────────────────
     STATE
  ──────────────────────────────────────────── */
  var _variantId   = window.__utcVariantId  || 0;
  var _selQty      = 2;   /* default: Most Popular */
  var _selPrice    = 0;   /* set on first selOpt call */
  var _wished      = false;
  var _refillOn    = true;

  /* ────────────────────────────────────────────
     1. COUNTDOWN — shared key per product handle
  ──────────────────────────────────────────── */
  (function initCountdown() {
    var handle  = document.getElementById('utCta')?.dataset.handle || 'pdp';
    var KEY     = 'ut-cta-end-' + handle;
    var SECS    = 20 * 3600;
    var stored  = parseInt(localStorage.getItem(KEY) || '0');
    var now     = Math.floor(Date.now() / 1000);
    var end     = (stored && stored > now) ? stored : now + SECS;

    if (!stored || stored <= now) localStorage.setItem(KEY, end);

    var hEl = document.getElementById('utcCdH');
    var mEl = document.getElementById('utcCdM');
    var sEl = document.getElementById('utcCdS');
    if (!hEl) return;

    function tick() {
      var rem = Math.max(0, end - Math.floor(Date.now() / 1000));
      hEl.textContent = String(Math.floor(rem / 3600)).padStart(2, '0');
      mEl.textContent = String(Math.floor((rem % 3600) / 60)).padStart(2, '0');
      sEl.textContent = String(rem % 60).padStart(2, '0');
      if (rem > 0) {
        setTimeout(tick, 1000);
      } else {
        var cd = document.querySelector('.utc-urgency');
        if (cd) cd.style.display = 'none';
        localStorage.removeItem(KEY);
      }
    }
    tick();
  })();

  /* ────────────────────────────────────────────
     2. SHIP DATE — today + 7 days
  ──────────────────────────────────────────── */
  (function setShipDate() {
    var el = document.getElementById('utcShipDate');
    if (!el) return;
    var d = new Date(Date.now() + 7 * 86400000);
    el.textContent = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
  })();

  /* ────────────────────────────────────────────
     3. BUNDLE OPTION SELECT
  ──────────────────────────────────────────── */
  window.utcSelOpt = function (el) {
    document.querySelectorAll('.utc-opt').forEach(function (o) {
      o.classList.remove('utc-sel');
    });
    el.classList.add('utc-sel');
    var radio = el.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;

    _selQty   = parseInt(el.dataset.qty   || '1');
    _selPrice = parseInt(el.dataset.price || '0');

    /* Update sticky bar price if it exists */
    var stickyPrice = document.querySelector('.ut-sticky-mob-price');
    if (stickyPrice) {
      stickyPrice.textContent = '₹' + Math.round(_selPrice / 100).toLocaleString('en-IN');
    }
  };

  /* ────────────────────────────────────────────
     4. REFILL TOGGLE
  ──────────────────────────────────────────── */
  window.utcToggleRefill = function (cb) {
    _refillOn = cb.checked;
    var box = document.getElementById('utcRbox');
    if (box) box.textContent = _refillOn ? '✓' : '';
    var wrap = document.getElementById('utcRefill');
    if (wrap) wrap.classList.toggle('utc-refill-off', !_refillOn);
  };

  /* ────────────────────────────────────────────
     5. ADD TO BAG
  ──────────────────────────────────────────── */
  window.utcAddBag = function () {
    var btn    = document.getElementById('utcMainBtn');
    var inner  = btn && btn.querySelector('.utc-btn-inner');
    var vId    = _variantId || window.pdpVariantId || 0;

    if (!vId) {
      if (typeof UT !== 'undefined') UT.toast('Please select a variant', 'error');
      return;
    }

    /* Set loading state */
    if (btn) { btn.classList.add('utc-loading'); btn.disabled = true; }
    if (inner) inner.textContent = 'Adding…';

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: vId, quantity: _selQty })
    })
    .then(function (res) {
      if (!res.ok) throw new Error('Cart add failed');
      return res.json();
    })
    .then(function () {
      /* Success state */
      if (btn) { btn.classList.remove('utc-loading'); btn.classList.add('utc-added'); btn.disabled = false; }
      if (inner) inner.textContent = '✓ Added to Bag';
      /* Global helpers */
      if (typeof UT !== 'undefined') {
        UT.updateCartBadge();
        UT.fetchCart();
      }
      if (typeof openCartDrawer === 'function') setTimeout(openCartDrawer, 350);
      /* Reset after 2.5s */
      setTimeout(function () {
        if (btn) btn.classList.remove('utc-added');
        if (inner) inner.textContent = 'Add to Bag';
      }, 2500);
    })
    .catch(function () {
      if (btn) { btn.classList.remove('utc-loading'); btn.disabled = false; }
      if (inner) inner.textContent = 'Add to Bag';
      if (typeof UT !== 'undefined') UT.toast('Could not add to cart. Please try again.', 'error');
    });
  };

  /* ────────────────────────────────────────────
     6. BUY NOW
  ──────────────────────────────────────────── */
  window.utcBuyNow = function () {
    var vId = _variantId || window.pdpVariantId || 0;
    if (!vId) return;
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: vId, quantity: _selQty })
    })
    .then(function () { window.location = '/checkout'; })
    .catch(function () { window.location = '/checkout'; });
  };

  /* ────────────────────────────────────────────
     7. PRE-ORDER
  ──────────────────────────────────────────── */
  window.utcPreOrder = function () {
    var btn   = document.getElementById('utcMainBtn');
    var inner = btn && btn.querySelector('.utc-btn-inner');
    var vId   = _variantId || window.pdpVariantId || 0;
    if (!vId) return;

    if (btn) { btn.disabled = true; }
    if (inner) inner.textContent = 'Reserving…';

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: vId,
        quantity: 1,
        properties: { 'Pre-order': 'Yes' }
      })
    })
    .then(function () {
      if (inner) inner.textContent = '✓ Pre-Order Confirmed!';
      if (btn) {
        btn.style.background = 'linear-gradient(90deg,rgba(40,74,40,0.9),#1A3A1A)';
        btn.disabled = false;
      }
      if (typeof UT !== 'undefined') {
        UT.fetchCart();
        UT.toast('✓ Pre-order placed!', 'success');
      }
      if (typeof openCartDrawer === 'function') setTimeout(openCartDrawer, 400);
      setTimeout(function () {
        if (inner) inner.textContent = 'Pre-Order Now →';
        if (btn) btn.style.background = '';
      }, 3200);
    })
    .catch(function () {
      if (inner) inner.textContent = 'Pre-Order Now →';
      if (btn) btn.disabled = false;
    });
  };

  /* ────────────────────────────────────────────
     8. WISHLIST
  ──────────────────────────────────────────── */
  window.utcToggleWish = function () {
    _wished = !_wished;
    var btn = document.getElementById('utcWishBtn');
    if (!btn) return;
    btn.textContent = _wished ? '♥' : '♡';
    btn.classList.toggle('utc-wished', _wished);
    if (typeof UT !== 'undefined') {
      UT.toast(_wished ? 'Added to wishlist ♥' : 'Removed from wishlist', 'info');
    }
  };

  /* ────────────────────────────────────────────
     9. SCROLL TO ATC (mid-page CTA buttons)
  ──────────────────────────────────────────── */
  window.utcScrollToAtc = function () {
    var btn = document.getElementById('utcMainBtn');
    if (!btn) return;
    btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    /* Pulse highlight */
    setTimeout(function () {
      btn.style.boxShadow = '0 0 0 3px rgba(201,169,110,0.55)';
      setTimeout(function () { btn.style.boxShadow = ''; }, 1200);
    }, 600);
  };

  /* ────────────────────────────────────────────
     10. ACCORDION (used in both CTA and FAQ sections)
  ──────────────────────────────────────────── */
  window.utcAcc = function (btn) {
    var body = btn.nextElementSibling;
    var isOpen = body.classList.contains('utap-open');
    btn.classList.toggle('utap-open', !isOpen);
    body.classList.toggle('utap-open', !isOpen);
  };

  /* ────────────────────────────────────────────
     11. SCROLL ANIMATIONS — IntersectionObserver
  ──────────────────────────────────────────── */
  (function initAnimations() {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('utap-vis');
          /* Animate review bars when they come into view */
          if (entry.target.classList.contains('utap-rev-summary')) {
            animateRevBars();
          }
        }
      });
    }, { threshold: 0.07 });

    document.querySelectorAll('.utap-fade').forEach(function (el) {
      obs.observe(el);
    });
  })();

  /* ────────────────────────────────────────────
     12. REVIEW BAR ANIMATION
  ──────────────────────────────────────────── */
  var _barsAnimated = false;
  function animateRevBars() {
    if (_barsAnimated) return;
    _barsAnimated = true;
    document.querySelectorAll('.utap-rev-fill').forEach(function (bar) {
      var w = bar.dataset.w || '0';
      setTimeout(function () { bar.style.width = w + '%'; }, 200);
    });
  }

  /* ────────────────────────────────────────────
     13. SYNC variantId when variant changes
         (existing pdpSelectOpt in main-product.liquid
          updates window.pdpVariantId — we just read it)
  ──────────────────────────────────────────── */
  /* Expose setter so main-product.liquid can call it on variant switch */
  window.utcSetVariant = function (id) {
    _variantId = id;
  };

  /* ────────────────────────────────────────────
     14. INITIALISE selected price from DOM
  ──────────────────────────────────────────── */
  (function initSelectedPrice() {
    var sel = document.querySelector('.utc-opt.utc-sel');
    if (sel) {
      _selQty   = parseInt(sel.dataset.qty   || '2');
      _selPrice = parseInt(sel.dataset.price || '0');
    }
    /* read variantId from data attribute on the CTA block */
    var ctaBlock = document.getElementById('utCta');
    if (ctaBlock && ctaBlock.dataset.variantId) {
      _variantId = parseInt(ctaBlock.dataset.variantId);
    }
  })();

})();
