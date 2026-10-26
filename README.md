# All In One Prints — website

Static one-page site (HTML + CSS + vanilla JS, no build step) for All In One Prints,
legal & property documentation, Fatorda, Margao, Goa.

## Run locally

```sh
cd ~/all-in-one-prints
python3 -m http.server 5230 --bind 127.0.0.1
# open http://127.0.0.1:5230
```

## Where things live

| What | Where |
| --- | --- |
| All text, services, contact details | `index.html` |
| WhatsApp number used by every WhatsApp button + enquiry form | `CONFIG.whatsapp` at the top of `js/main.js` |
| Office (call) number | `tel:+918767099065` links in `index.html` |
| Hero rotating headlines | `.hero__rot` spans in `index.html` |
| Brand colours, fonts | `:root` in `css/style.css` |
| Logo / QR / flyers | `assets/` (see Logo files below) |
| Local SEO (areas served, structured data) | `<head>` meta tags + JSON-LD in `index.html`, "Areas" section |

## Logo files (transparent PNGs, cut from `assets/logo-full.jpg`)

| File | Use |
| --- | --- |
| `logo-lockup.png` | Mark + "ALL IN ONE PRINTS", black text, for light backgrounds |
| `logo-lockup-light.png` | Same with white text, for dark backgrounds (site preloader, footer, mobile menu) |
| `logo-with-address.png` / `logo-with-address-light.png` | Full logo incl. address, dark / white text |
| `logo-mark.png` (600px) / `logo-transparent.png` (full size) | Mark only (nav, favicon, Areas radar) |

## Contact details in use

- Office: Shop No. ASH 8, L & L Correia Building, Opp Mathany Saldanha Administrative Complex, Behind KFC, Fatorda, Salcete, South Goa, Goa 403601
- Office number: +91 87670 99065
- WhatsApp: +91 83299 72387
- Email: allinoneprints.goa@gmail.com
- Map: https://maps.app.goo.gl/22tbWcWdrHFHjGqg8

## Motion

Preloader → hero headline rotator + document that writes, signs and gets stamped (loop)
→ velocity-skewed marquee → scroll-filled "Why it matters" text → filterable service
cards with tilt/spotlight → pinned horizontal "How we work" → life-moment cards →
scroll-drifting values → radar "Areas" map → stacked CTA → contact with WhatsApp form.
All motion is switched off for visitors who set "reduce motion" on their device.

## Live site

Hosted on GitHub Pages from the `main` branch: https://alliancestreetgoa-lang.github.io/All-in-One-Prints/
Pushing to `main` redeploys the site.
