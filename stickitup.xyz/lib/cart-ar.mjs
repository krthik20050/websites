import {page} from './theme.mjs';

export function cartArPage(){
 const content=`<section class="cart-ar" id="cart-review" aria-label="Review cart stickers in augmented reality">
  <header class="cart-ar-header"><a href="/cart" class="cart-ar-back">← Back to cart</a><div><p class="cart-ar-kicker">YOUR STICKERS, IN YOUR SPACE</p><h1>Review your stickers</h1><p>Inspect your cart, then open the camera and place each sticker on a wall, laptop lid, or flat surface.</p></div><a href="/checkout" class="cart-ar-buy">Buy these items →</a></header>
  <div class="cart-ar-review" id="cart-ar-review">
   <div class="cart-ar-object-stage"><div class="cart-ar-cards" id="cart-ar-cards" aria-label="Three dimensional preview of cart stickers"></div><p id="cart-ar-empty" hidden>No stickers are in your cart yet.</p></div>
   <div class="cart-ar-review-copy"><span class="cart-ar-kicker">3D REVIEW</span><h2>Your cart, ready to try</h2><p>Swipe through the sticker cards to inspect your selection. Tap <strong>View in AR</strong> when you are ready to try them in your surroundings.</p><button class="cart-ar-primary" id="cart-ar-start" type="button" disabled>Preparing your preview…</button><p class="cart-ar-size-note">Sticker preview size is an estimate of 7.62 cm wide until printed dimensions are supplied.</p></div>
  </div>
  <div class="cart-ar-live" id="cart-ar-live" hidden>
   <canvas id="cart-ar-canvas" aria-label="Live augmented reality camera and sticker placements"></canvas>
   <div class="cart-ar-tray-shell"><div class="cart-ar-tray-heading"><span><strong>Your cart</strong><small id="cart-ar-count">Select a sticker, then drag it onto your surface.</small></span><button id="cart-ar-close" type="button" aria-label="Close AR camera">×</button></div><div class="cart-ar-tray" id="cart-ar-tray" aria-label="Drag a sticker onto the camera view"></div></div>
   <div class="cart-ar-live-tools"><div class="cart-ar-surface-tools" role="group" aria-label="Surface orientation"><button type="button" data-surface="wall" aria-pressed="false">Wall / upright screen</button><button type="button" data-surface="flat" aria-pressed="false">Laptop / flat</button></div><p id="cart-ar-status" role="status" aria-live="polite">Starting AR…</p></div>
   <p class="cart-ar-credit">World tracking by 8th Wall · <a href="https://github.com/8thwall/engine/blob/main/LICENSE" target="_blank" rel="noopener">engine licence</a></p>
  </div>
  <p class="cart-ar-disclaimer">AR uses camera and motion sensors to estimate placement. Phone tilt chooses upright vs flat sticker orientation; the buttons override it. This preview does not identify laptop screens as a separate object. Camera frames stay in this browser session.</p>
 </section>`;
 return page('Review your cart in AR',content).replace('</head>','<link rel="stylesheet" href="/cart-ar.css"><!-- This product includes the XR Engine software developed by Niantic Spatial, Inc. Copyright © 2026 Niantic Spatial, Inc. All rights reserved. License: https://github.com/8thwall/engine/blob/main/LICENSE --></head>').replace('</body>','<script type="module" src="/cart-ar.js"></script></body>');
}
