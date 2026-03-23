# Urban Trend — PDP CTA + A+ Integration Guide
## 3 files · 6 steps · ~20 minutes total

---

## FILES YOU RECEIVED

| File | Upload to |
|------|-----------|
| `pdp-cta-aplus.liquid` | `snippets/` |
| `ut-pdp-cta-aplus.css` | `assets/` |
| `ut-pdp-cta-aplus.js`  | `assets/` |

---

## STEP 1 — Add CSS to theme.liquid

Shopify Admin → Online Store → Themes → Edit Code → `layout/theme.liquid`

Find the line that loads `ut-global.css` (or any existing CSS):
```html
{{ 'ut-global.css' | asset_url | stylesheet_tag }}
```

Add the new CSS **after** it:
```html
{{ 'ut-pdp-cta-aplus.css' | asset_url | stylesheet_tag }}
```

---

## STEP 2 — Add JS to theme.liquid

In the same file, just before `</body>`, add:
```html
<script src="{{ 'ut-pdp-cta-aplus.js' | asset_url }}" defer></script>
```

---

## STEP 3 — Update main-product.liquid: remove old CTA elements

Open `sections/main-product.liquid`.

### 3a. FIND and DELETE the old ATC row (the whole block):
```liquid
<!-- ATC Row -->
<div class="ut-pdp-atc-row">
  <div class="ut-pdp-qty">
    ...
  </div>
  {%- comment -%} BUNDLE WIDGET — TAVIO STYLE {%- endcomment -%}
  <div class="ut-bw" id="ut-bw">
    ...
  </div>
  ...
  <button class="ut-pdp-wish" ...>♡</button>
</div>
```
Delete everything from `<!-- ATC Row -->` down to and including the closing `</div>` of `ut-pdp-atc-row`.

### 3b. FIND and DELETE the Buy Now button:
```liquid
<button class="ut-pdp-buy" onclick="pdpBuyNow()" ...>Buy Now →</button>
```

### 3c. FIND and DELETE the Trust grid:
```liquid
<!-- Trust -->
<div class="ut-pdp-trust">
  ...6 trust items...
</div>
```

### 3d. FIND and DELETE the Trust strip:
```liquid
<div class="ut-trust-strip" style="margin-bottom:20px;">
  ...5 trust badges...
</div>
```

### 3e. DELETE the old countdown timer block:
```liquid
<!-- Countdown -->
<div class="ut-pdp-timer" id="pdpTimerWrap">
  ...
</div>
<script>
(function(){
  var KEY='ut-pdp-cd-end-...
  ...
})();
</script>
```

---

## STEP 4 — Add data attributes so JS reads variant ID

Find where the info column opens (just after `<div class="ut-pdp-info">`).

You'll see the existing hidden data div:
```html
<div id="pdpData"
  data-product-handle="{{ product.handle | escape }}"
  ...
  style="display:none;">
</div>
```

Add `id="utCta"` and the data attributes to the **render call location** (see Step 5).

---

## STEP 5 — Insert the snippet render call

After the delivery checker (`ut-pdp-delivery` block) and before the description/accordions, add:

```liquid
{% render 'pdp-cta-aplus', product: product %}
```

The exact location in main-product.liquid is after:
```html
<div id="pinResult" class="ut-pdp-pin-result"></div>
</div>
<!-- END delivery checker -->
```

Add the data-variant-id attribute to the render output. Replace the snippet's opening tag:
```html
<div class="utc" id="utCta">
```
with:
```liquid
<div class="utc" id="utCta"
  data-handle="{{ product.handle | escape }}"
  data-variant-id="{{ product.selected_or_first_available_variant.id }}">
```

This is already inside the snippet — just make sure the tag has both attributes.

---

## STEP 6 — Remove the below-fold duplicate bundle

Find this block near the bottom of the `ut-pdp-below` section:
```html
{%- comment -%} BUNDLE PRICING INLINE {%- endcomment -%}
{%- assign bid = product.id -%}
<div class="ut-bundle" id="ut-bundle-pd" ...>
  ...
</div>
```

Delete the entire block including its `<style>` and `<script>` tags immediately following it.

Also delete the old below-fold tabs block if you want the A+ content to flow naturally. The A+ content from the snippet replaces the tab system entirely.

---

## STEP 7 — Update sticky mobile bar to call utcAddBag

Find:
```liquid
<button class="ut-sticky-mob-btn" onclick="pdpAddBag()">Add to Bag</button>
```

Replace with:
```liquid
<button class="ut-sticky-mob-btn" onclick="utcAddBag()">Add to Bag</button>
```

---

## STEP 8 — Sync variantId on variant change

Find the existing `pdpSelectOpt` function in the `<script>` block of main-product.liquid.

At the end of the function, add one line:
```javascript
if (typeof utcSetVariant === 'function') utcSetVariant(match.id);
```

So the full function ends like:
```javascript
var match = pdpVariants.find(v => v.options.every((o,i) => o === pdpOptions[i]));
if (match) {
  pdpVariantId = match.id;
  pdpUpdatePrice(match);
  pdpUpdateVariantImage(match);
  if (typeof utcSetVariant === 'function') utcSetVariant(match.id);  // ADD THIS
}
```

---

## OPTIONAL: Add A+ content below the PDP grid (recommended)

The snippet currently renders both the CTA block AND the A+ sections together.
If you want the A+ sections to span the full page width (outside the 2-column grid),
split the render:

1. Inside the grid column: `{% render 'pdp-cta-aplus', product: product, mode: 'cta' %}`
2. After the grid closes: `{% render 'pdp-cta-aplus', product: product, mode: 'aplus' %}`

Then in the snippet, wrap each section with:
```liquid
{% if mode == 'cta' or mode == blank %}
  ... CTA block ...
{% endif %}
{% if mode == 'aplus' or mode == blank %}
  ... A+ block ...
{% endif %}
```

---

## METAFIELDS (optional — falls back to defaults if not set)

| Metafield | Namespace | Key | Default |
|-----------|-----------|-----|---------|
| Expert name | custom | expert_name | Dr. Priya |
| Expert title | custom | expert_title | Wellness Specialist |
| Stock units | custom | stock_units | 9 |
| Founder image URL | custom | founder_image | SVG placeholder |

---

## WHAT GETS REMOVED vs WHAT STAYS

| Old Element | Action |
|-------------|--------|
| `ut-pdp-atc-row` (qty + old bundle widget) | ✗ Delete |
| `ut-bw` inline bundle | ✗ Delete |
| `ut-bundle` below-fold duplicate | ✗ Delete |
| `ut-pdp-buy` Buy Now button | ✗ Delete |
| `ut-pdp-trust` grid | ✗ Delete |
| `ut-trust-strip` | ✗ Delete |
| Old countdown timer | ✗ Delete |
| Existing below-fold tabs | ✗ Delete (replaced by A+) |
| Gallery | ✓ Keep |
| Title, price, rating row | ✓ Keep |
| EMI line | ✓ Keep |
| Pin checker | ✓ Keep |
| Accordions | ✓ Keep |
| Sticky mobile bar | ✓ Keep (update onclick) |
| FBT section | ✓ Keep |
| Similar products | ✓ Keep |
| Recently viewed | ✓ Keep |
