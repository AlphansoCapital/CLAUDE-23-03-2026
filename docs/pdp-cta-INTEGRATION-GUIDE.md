# PDP CTA — Integration Guide
## Urban Trend · main-product.liquid

---

## STEP 1 — Add the snippet render call

In `main-product.liquid`, find this block (around line 370):

```liquid
<!-- ATC Row -->
<div class="ut-pdp-atc-row">
```

**REPLACE everything from that line down to and including:**

```liquid
    </div>
    {% unless product.available %}
      {% render 'back-in-stock', product: product %}
    {% endunless %}
    <button class="ut-pdp-buy" onclick="pdpBuyNow()" {% unless product.available %}style="display:none"{% endunless %}>Buy Now →</button>

    <!-- Trust -->
    <div class="ut-pdp-trust">
      ...6 trust items...
    </div>

    <!-- Trust strip -->
    <div class="ut-trust-strip" style="margin-bottom:20px;">
      ...5 trust badges...
    </div>
```

**WITH this single line:**

```liquid
{% render 'pdp-cta', product: product %}
```

---

## STEP 2 — Remove the below-fold duplicate bundle

In `main-product.liquid`, find and DELETE this entire block (near the bottom of ut-pdp-below):

```liquid
{%- comment -%} BUNDLE PRICING INLINE {%- endcomment -%}
{%- assign bid = product.id -%}
<div class="ut-bundle" id="ut-bundle-pd" ...>
  ...
</div>
```

Also delete its accompanying `<style>` block (the one with `.ut-bundle{background:linear-gradient...`) and its `<script>` block (the one with `selBundle` and `doBundleATC` functions).

---

## STEP 3 — Remove the old ut-bw inline bundle

The old bundle widget `<div class="ut-bw" id="ut-bw">` is also still inside the
`ut-pdp-atc-row`. This is already handled by Step 1 (you're replacing the whole row).
Nothing extra to do here.

---

## STEP 4 — Sync the sticky mobile ATC button

The sticky bar at the bottom still calls `pdpAddBag()`. Update it to call `ctaAddBag()` instead:

```liquid
<!-- FIND -->
<button class="ut-sticky-mob-btn" onclick="pdpAddBag()">Add to Bag</button>

<!-- REPLACE WITH -->
<button class="ut-sticky-mob-btn" onclick="ctaAddBag()">Add to Bag</button>
```

---

## STEP 5 — Remove the old countdown in the info section

The old `ut-pdp-timer` countdown block and its inline `<script>` can be deleted since
the new CTA has its own shared timer. Find and delete:

```liquid
<!-- Countdown -->
<div class="ut-pdp-timer" id="pdpTimerWrap">
  <div class="ut-countdown">
    ...
  </div>
</div>
<script>
(function(){
  var KEY='ut-pdp-cd-end-...
  ...
})();
</script>
```

---

## STEP 6 — Fix the stock counter conflict with Pre-order

The existing stock counter at the top of the info section shows unconditionally.
Wrap it so it only shows for in-stock, non-preorder products:

```liquid
<!-- FIND -->
<!-- Stock counter -->
<div class="ut-pdp-stock">

<!-- REPLACE WITH -->
{% unless product.tags contains 'pre-order' %}
{% if product.available %}
<div class="ut-pdp-stock">
```

And close it:
```liquid
</div>
{% endif %}
{% endunless %}
```

---

## WHAT THE NEW SNIPPET GIVES YOU

| Element               | Behaviour                                             |
|-----------------------|-------------------------------------------------------|
| Countdown timer       | 20-hr sale, persists via localStorage, one key only   |
| Dr. Priya endorsement | Always visible above bundle options                   |
| Bundle options        | Hidden when sold out or pre-order tagged              |
| Save % labels         | Calculated from real compare_at_price — no fake math  |
| Ships-by date         | Auto-calculated: today + 7 days                       |
| Refill checkbox       | Visual toggle (connect to subscription app as needed) |
| Add to Bag            | Handles qty 1 via UT helper, bundles via direct fetch |
| Buy Now               | Adds selected bundle qty then goes to /checkout       |
| Pre-order flow        | Shown only when product tagged 'pre-order'            |
| Sold out state        | Disabled button + back-in-stock widget                |
| Trust badges          | 6-item 2-column grid below every CTA state            |

---

## FILES CHANGED

- `snippets/pdp-cta.liquid` — NEW (the snippet)
- `sections/main-product.liquid` — EDITED (Steps 1–6 above)
