#!/usr/bin/env python3
"""
Assembles cases / services / pricing / contact / privacy from the shell that
lives in index.html, so the header, footer and chat widget never drift apart.

Run from the project root:   python _tools/build_pages.py
index.html is the source of truth for the shell; edit it, then re-run.
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://aussiebuilder.com.au"

# ---------------------------------------------------------------- icons
CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>'
DASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>'
ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
ZOOM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/></svg>'
EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.8"/></svg>'
CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'


def head(title, desc, slug, extra=""):
    url = f"{SITE}/" if slug == "index.html" else f"{SITE}/{slug}"
    return f"""<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#14524A">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="manifest" href="manifest.webmanifest">

<meta property="og:type" content="website">
<meta property="og:site_name" content="Aussie Builder">
<meta property="og:locale" content="en_AU">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/assets/img/og-cover.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">

<link rel="alternate" hreflang="en-AU" href="{url}">
<link rel="alternate" hreflang="x-default" href="{url}">

<link rel="preload" as="font" type="font/woff2" href="assets/fonts/inter-latin.woff2" crossorigin>
<link rel="stylesheet" href="assets/css/site.css">
{extra}</head>
<body>
"""


# ---------------------------------------------------------------- shell
index_html = (ROOT / "index.html").read_text(encoding="utf-8")
SHELL_START = index_html.split("<body>", 1)[1].split("<main id=\"main\">", 1)[0]
SHELL_END = index_html.split("</main>", 1)[1]

NAV_MAP = {
    "cases.html": "cases.html",
    "services.html": "services.html",
    "pricing.html": "pricing.html",
    "contact.html": "contact.html",
}


def shell_for(slug):
    s = SHELL_START
    for href in NAV_MAP:
        needle = f'<a class="nav__link" href="{href}">'
        if href == slug and needle in s:
            s = s.replace(needle, f'<a class="nav__link" href="{href}" aria-current="page">')
    return s


def page(slug, title, desc, body, extra_head=""):
    html = head(title, desc, slug, extra_head) + shell_for(slug) + "<main id=\"main\">\n" + body + "\n</main>" + SHELL_END
    (ROOT / slug).write_text(html, encoding="utf-8")
    print(f"wrote {slug}  ({len(html) // 1024} KB)")


# ================================================================ CASES
CASES = [
    dict(key="restaurant", n="c1", city="Sydney NSW", name="Bistro Nord",
         alt="Restaurant website for Bistro Nord showing the current menu and trading hours",
         tag="Restaurant &amp; café",
         desc="Menu, bookings and trading hours on one screen.",
         long="A single-page restaurant site with tonight's menu on the homepage — a PDF menu is the first thing people give up on. Bookings run through the owner's existing OpenTable widget; we didn't rebuild what already worked.",
         specs=["5 pages", "Menu + bookings", "Google Maps", "Contact form"],
         left="No online ordering. The kitchen takes orders by phone and wants to keep it that way.",
         summary="A 32-seat room in Neutral Bay that was tired of answering the same three questions on the phone.",
         brief=[
             "Bistro Nord had a menu PDF from 2019 floating around, a Facebook page nobody updated, and a phone that rang during service. The owner wanted three things answered before anyone walked in: what's on tonight, when are you open, and can I get a table.",
             "They already paid for OpenTable and were happy with it. The site's job was to sit in front of that, not replace it.",
         ],
         built=[
             ("Tonight's menu, on the homepage", "Pulled from a plain text file the chef edits each morning. No PDF anywhere."),
             ("Bookings, handed off", "The OpenTable widget opens in a panel. We didn't rebuild what already worked."),
             ("Trading hours, stated twice", "Once in the header, once beside the map — because that's the actual question."),
             ("One page, five anchors", "Nobody reads a restaurant's About page. We didn't build one."),
         ],
         caption="The homepage: tonight's menu, the hours, and a way to book — all above the fold.",
         pkg="Professional", days="7 business days"),
    dict(key="salon", n="c2", city="Melbourne VIC", name="Fern &amp; File",
         alt="Nail salon website for Fern and File with a service price list",
         tag="Nail &amp; beauty",
         desc="Service menu, online booking, Afterpay explained.",
         long="Price list above the fold, because that's what people came for. Booking is a Fresha embed. Afterpay and gift cards sit on their own page so the homepage stays quiet.",
         specs=["4 pages", "Price list", "Fresha booking", "Instagram feed"],
         left="No e-commerce. Products are sold in the chair, not shipped from a warehouse.",
         summary="A four-chair studio where the price list was, honestly, the whole website.",
         brief=[
             "Fern &amp; File's customers arrive already knowing what they want — the studio's Instagram does the selling. What they couldn't find was a price, and what the owner couldn't stop doing was answering DMs to give one.",
             "So the price list went above the fold, and the booking button went next to it.",
         ],
         built=[
             ("Prices, first", "Three services, three prices. No 'contact us for a quote'."),
             ("Fresha, embedded", "The booking system they already used, one click from the price."),
             ("Afterpay, explained once", "On its own page, so the homepage stays quiet."),
             ("Instagram, linked not embedded", "Feeds load slowly and nobody scrolls one on a website."),
         ],
         caption="Prices above the fold, booking beside them.",
         pkg="Starter", days="5 business days"),
    dict(key="hardware", n="c3", city="Brisbane QLD", name="Rivet &amp; Co.",
         alt="Hardware store website for Rivet and Co with product categories and trade account signup",
         tag="Hardware &amp; trade",
         desc="Product catalogue, stock check, trade account signup.",
         long="Built around a trade counter, not a shopping cart. Twelve thousand lines are searchable, but checkout is a phone call — that's how this shop actually sells. The trade account form drops straight into their inbox.",
         specs=["8 pages", "Catalogue search", "Trade account form", "Store locator"],
         left="No checkout. Trade customers ring the counter — a cart would have been decoration.",
         summary="A trade counter with twelve thousand lines and no intention of becoming an online shop.",
         brief=[
             "Rivet &amp; Co. sells to tradespeople who ring the counter, and they wanted to keep it that way. What they didn't have was a way for a new customer to check whether they stocked a particular fastener before driving to Virginia.",
             "The brief was a catalogue you can search, a store locator, and a trade account form that lands in the right inbox. Nothing that takes an order.",
         ],
         built=[
             ("Searchable catalogue", "Twelve thousand lines, filterable by trade and by brand."),
             ("Trade account form", "Name, ABN, two referees. Goes straight to the accounts inbox."),
             ("Store locator and hours", "By day, including the 6am trade-counter start."),
             ("No cart, anywhere", "Checkout is a phone call. We didn't pretend otherwise."),
         ],
         caption="The catalogue is the product; the counter is the checkout.",
         pkg="Custom", days="12 business days"),
    dict(key="sports", n="c4", city="Perth WA", name="Coastline Sports",
         alt="Sports store website for Coastline Sports with category navigation and gait fit booking",
         tag="Sports store",
         desc="Category navigation, free gait-fit booking, store info.",
         long="Five categories, one page each. The gait fit is the point — it's what separates them from the big-box stores, so it gets its own booking form and a Saturday slot.",
         specs=["6 pages", "Category pages", "Gait-fit booking", "Click &amp; collect"],
         left="No membership portal. Club sign-ups still run through the clubs themselves.",
         summary="A beachside sports store whose real differentiator is a free gait fit.",
         brief=[
             "Coastline competes with big-box retailers on the same brands at worse prices. What they have that the chains don't is someone who will watch you run and tell you your old shoes are wrong.",
             "So the gait fit became the homepage's main call to action, with its own booking form and Saturday slots.",
         ],
         built=[
             ("Five category pages", "Run, footy, swim, gym, cricket. A page each, not a filter."),
             ("Gait-fit booking", "A form with time slots, capped at six a Saturday."),
             ("Click and collect", "Order online, pick up from the counter the same day."),
             ("Club notices", "A plain list local clubs can ask us to update."),
         ],
         caption="The gait fit is the offer, so it gets the button.",
         pkg="Professional", days="7 business days"),
    dict(key="golf", n="c5", city="Adelaide SA", name="Fairway Golf",
         alt="Golf retail website for Fairway Golf with custom fitting booking",
         tag="Golf retail",
         desc="Custom fitting, pre-owned trade-in, member benefits.",
         long="A premium shop needs restraint: four brands, generous whitespace, and the fitting service up front. The pre-owned section is a plain table the owner updates herself.",
         specs=["7 pages", "Fitting booking", "Pre-owned listing", "Member page"],
         left="No tee-time booking. That lives in the course's own system, not the shop's site.",
         summary="A premium golf shop that needed restraint more than features.",
         brief=[
             "Fairway stocks four brands, not fourteen, and will tell you when the driver you already own is fine. That honesty is the business — a busy website would have undermined it.",
             "The build is deliberately quiet: generous whitespace, the fitting service up front, and a pre-owned section the owner maintains herself.",
         ],
         built=[
             ("Fitting, up front", "A 60-minute TrackMan session, bookable from the homepage."),
             ("Pre-owned, as a table", "Plain HTML the owner edits. No inventory system to learn."),
             ("Four brands", "Listed properly, not as a wall of logos."),
             ("Members page", "Benefits, opening hours, and how to join."),
         ],
         caption="Restraint as a design decision.",
         pkg="Custom", days="10 business days"),
]


cards = []
for c in CASES:
    specs = "\n".join(
        f'              <li data-i18n="{c["n"]}.s{i+1}">{s}</li>' for i, s in enumerate(c["specs"])
    )
    cards.append(f"""
        <article class="case" data-industry="{c['key']}">
          <div class="case__media">
            <img src="assets/img/cases/{c['key']}-1080.webp" width="1080" height="675" loading="lazy" decoding="async"
                 alt="{c['alt']}">
          </div>
          <div class="case__body">
            <span class="tag" data-i18n="{c['n']}.tag">{c['tag']}</span>
            <h3><a href="case-{c['key']}.html" data-i18n="{c['n']}.name">{c['name']}</a></h3>
            <p data-i18n="{c['n']}.desc">{c['desc']}</p>
            <div class="case__meta"><span>{c['city']}</span><span data-i18n="{c['n']}.s1">{c['specs'][0]}</span></div>
            <button class="case__quick" type="button" data-quick>
              {EYE}<span data-i18n="cases.quick">Quick look</span>
            </button>
            <p class="case__long" hidden data-i18n="{c['n']}.long">{c['long']}</p>
            <p class="case__left" hidden data-i18n="{c['n']}.left">{c['left']}</p>
            <ul class="case__spec-list" hidden>
{specs}
            </ul>
          </div>
        </article>""")

cases_body = f"""
<section class="page-hero">
  <div class="wrap">
    <span class="eyebrow" data-i18n="cases.hero.eyebrow">Case studies</span>
    <h1 data-i18n="cases.hero.title">Five industries, and what changes between them</h1>
    <p class="lede" data-i18n="cases.hero.sub">Same engine, different builds. A restaurant needs bookings and a menu; a hardware shop needs a catalogue and a store locator. Open any card for the full screenshot and what's inside.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 class="sr-only">All case studies</h2>
    <div class="filters" role="group" aria-label="Filter by industry" data-i18n-aria="cases.filter.label">
      <button class="chip" type="button" data-filter="all" aria-pressed="true" data-i18n="cases.filter.all">All</button>
      <button class="chip" type="button" data-filter="restaurant" aria-pressed="false" data-i18n="c1.tag">Restaurant &amp; café</button>
      <button class="chip" type="button" data-filter="salon" aria-pressed="false" data-i18n="c2.tag">Nail &amp; beauty</button>
      <button class="chip" type="button" data-filter="hardware" aria-pressed="false" data-i18n="c3.tag">Hardware &amp; trade</button>
      <button class="chip" type="button" data-filter="sports" aria-pressed="false" data-i18n="c4.tag">Sports store</button>
      <button class="chip" type="button" data-filter="golf" aria-pressed="false" data-i18n="c5.tag">Golf retail</button>
    </div>

    <p id="caseCount" aria-live="polite" style="margin:0 0 24px;font-size:.85rem;color:var(--muted)"></p>

    <div class="case-grid" id="caseGrid">{''.join(cards)}
    </div>

    <p style="margin-top:36px;font-size:.82rem;color:var(--muted);max-width:72ch;line-height:1.7" data-i18n="cases.disclaimer">Every card above is a sample site built for an industry, using anonymised demo brands. Real client work is only published once we have written permission.</p>
  </div>
</section>

<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-labelledby="lbTitle" aria-hidden="true">
  <div class="lightbox__panel">
    <button class="lightbox__close" type="button" data-i18n-aria="cases.lightboxClose" aria-label="Close preview">{CLOSE}</button>
    <div class="lightbox__media"><img src="" alt="" width="1440" height="900"></div>
    <div class="lightbox__body">
      <span class="tag" data-lb-tag></span>
      <h3 id="lbTitle" data-lb-title></h3>
      <p data-lb-body></p>
      <div class="lightbox__specs" data-lb-specs></div>
      <p class="lb-note" data-lb-note hidden></p>
    </div>
  </div>
</div>

<section class="cta-band">
  <div class="wrap">
    <div class="cta-band__inner">
      <div>
        <h2 data-i18n="cta.title">Want to see what your site would look like?</h2>
        <p data-i18n="cta.body">Tell us what the business does and we'll come back with a specific quote within one business day. No contract, no follow-up calls.</p>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <a class="btn btn--accent btn--lg" href="contact.html" data-i18n="cta.primary">Get my free quote</a>
        <a class="btn btn--ghost btn--lg" href="pricing.html" data-i18n="nav.pricing">Pricing</a>
      </div>
    </div>
  </div>
</section>
"""

page(
    "cases.html",
    "Case studies — websites built for five Australian industries | Aussie Builder",
    "Restaurant, nail salon, hardware, sports store and golf retail websites. See the full build and what's included in each.",
    cases_body,
)

# ================================================================ SERVICES
services_body = f"""
<section class="page-hero">
  <div class="wrap">
    <span class="eyebrow" data-i18n="services.hero.eyebrow">How it works</span>
    <h1 data-i18n="services.hero.title">What "AI-built website" actually means here</h1>
    <p class="lede" data-i18n="services.hero.sub">There are two kinds of AI website tool. One hands you a drag-and-drop editor and wishes you luck. The other builds the thing first and shows you. We're the second kind.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><i>01</i><span data-i18n="services.how.eyebrow">Process</span></span>
      <h2 data-i18n="services.how.title">Four steps, and you see something at every one</h2>
    </div>

    <div class="grid-2 grid-2--fixed">
      <article class="card card--hover reveal">
        <span class="step__n" data-i18n="services.step1n">You</span>
        <h3 data-i18n="services.step1t">Step 1 — the questionnaire</h3>
        <p data-i18n="services.step1d">Ten minutes, about fifteen questions. Industry, location, trading hours, what you want to be known for, whether you already have photos. Skip what you don't know — we'll chase it.</p>
      </article>

      <article class="card card--hover reveal">
        <span class="step__n" data-i18n="services.step2n">We do</span>
        <h3 data-i18n="services.step2t">Step 2 — AI drafts the site</h3>
        <p data-i18n="services.step2d">An industry template sets the structure. Your answers become the copy. Colour and type come from a set of palettes tuned for Australian local business. What comes back is a clickable draft, not a mockup.</p>
      </article>

      <article class="card card--hover reveal">
        <span class="step__n" data-i18n="services.step3n">You</span>
        <h3 data-i18n="services.step3t">Step 3 — you review it</h3>
        <p data-i18n="services.step3d">You get a preview link that works on a phone and a desktop. Mark up what's wrong directly on the page, or send us a list. Starter includes one revision round, Professional three.</p>
      </article>

      <article class="card card--hover reveal">
        <span class="step__n" data-i18n="services.step4n">We do</span>
        <h3 data-i18n="services.step4t">Step 4 — deliver and publish</h3>
        <p data-i18n="services.step4d">Domain, business email, Google indexing, analytics. On launch day you get a written guide to editing text and swapping photos yourself.</p>
      </article>
    </div>
  </div>
</section>

<section class="section section--soft">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><i>02</i><span data-i18n="services.inc.eyebrow">What's included</span></span>
      <h2 data-i18n="services.inc.title">The baseline, on every package</h2>
      <p class="lede" data-i18n="services.inc.lede">None of this is an add-on. It's the floor.</p>
    </div>

    <div class="grid-3">
      <article class="card reveal">
        <h3 data-i18n="services.inc.i1t">Mobile-first layout</h3>
        <p data-i18n="services.inc.i1d">Laid out at 375px first, then scaled up. Not a desktop design squeezed down.</p>
      </article>
      <article class="card reveal">
        <h3 data-i18n="services.inc.i2t">Contact and enquiry forms</h3>
        <p data-i18n="services.inc.i2d">With a honeypot and rate limiting, so most of the junk never reaches you.</p>
      </article>
      <article class="card reveal">
        <h3 data-i18n="services.inc.i3t">Google Maps and trading hours</h3>
        <p data-i18n="services.inc.i3d">Location, opening hours and tap-to-call, where customers actually look for them.</p>
      </article>
      <article class="card reveal">
        <h3 data-i18n="services.inc.i4t">Basic SEO structure</h3>
        <p data-i18n="services.inc.i4d">Titles, descriptions, structured data, sitemap. Keyword work starts at Professional.</p>
      </article>
      <article class="card reveal">
        <h3 data-i18n="services.inc.i5t">HTTPS and Australian hosting</h3>
        <p data-i18n="services.inc.i5d">Sydney edge by default, so local visitors aren't waiting on a server in another hemisphere.</p>
      </article>
      <article class="card reveal">
        <h3 data-i18n="services.inc.i6t">A written handover guide</h3>
        <p data-i18n="services.inc.i6d">Delivered on launch day. How to change text, swap photos, read your traffic numbers.</p>
      </article>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><i>03</i><span data-i18n="services.hand.eyebrow">On launch day</span></span>
      <h2 data-i18n="services.hand.title">What actually lands in your hands</h2>
      <p class="lede" data-i18n="services.hand.lede">Not a promise — the literal list of what you get handed when the site goes live.</p>
    </div>

    <ul class="checklist reveal">
      <li>{CHECK}<div><strong data-i18n="services.hand.i1t">Domain, pointed and live</strong><span data-i18n="services.hand.i1d">Registered in your name, DNS configured, HTTPS enforced.</span></div></li>
      <li>{CHECK}<div><strong data-i18n="services.hand.i2t">The site files</strong><span data-i18n="services.hand.i2d">Static files you own outright. No proprietary platform to rent back.</span></div></li>
      <li>{CHECK}<div><strong data-i18n="services.hand.i3t">An admin login</strong><span data-i18n="services.hand.i3d">Change text, swap photos, edit prices — without calling us.</span></div></li>
      <li>{CHECK}<div><strong data-i18n="services.hand.i4t">A written handover guide</strong><span data-i18n="services.hand.i4d">How to do the three things you'll actually do, with screenshots.</span></div></li>
      <li>{CHECK}<div><strong data-i18n="services.hand.i5t">Analytics, already wired</strong><span data-i18n="services.hand.i5d">GA4 or Plausible connected, with the events that matter firing.</span></div></li>
      <li>{CHECK}<div><strong data-i18n="services.hand.i6t">Search Console set up</strong><span data-i18n="services.hand.i6d">Sitemap submitted, indexing requested, property verified.</span></div></li>
      <li>{CHECK}<div><strong data-i18n="services.hand.i7t">Business email working</strong><span data-i18n="services.hand.i7d">hello@yourdomain, set up, tested, and forwarding where you want it.</span></div></li>
      <li>{CHECK}<div><strong data-i18n="services.hand.i8t">A speed report</strong><span data-i18n="services.hand.i8d">Lighthouse scores on mobile and desktop, handed over with the site.</span></div></li>
    </ul>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><i>04</i><span data-i18n="services.not.eyebrow">What we don't do</span></span>
      <h2 data-i18n="services.not.title">Out of scope, said plainly</h2>
      <p class="lede" data-i18n="services.not.lede">Better to draw the line now than argue about it later.</p>
    </div>

    <ul class="scope-list reveal">
      <li>{DASH}<span data-i18n="services.not.i1">Online payments and e-commerce checkout</span></li>
      <li>{DASH}<span data-i18n="services.not.i2">Customer logins, memberships, self-service dashboards</span></li>
      <li>{DASH}<span data-i18n="services.not.i3">Booking and scheduling engines (we can embed a third-party one)</span></li>
      <li>{DASH}<span data-i18n="services.not.i4">Multi-language site clusters</span></li>
      <li>{DASH}<span data-i18n="services.not.i5">Ad campaigns and ongoing content marketing</span></li>
    </ul>
  </div>
</section>

<section class="section section--soft">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><i>05</i><span data-i18n="services.ind.eyebrow">Industries</span></span>
      <h2 data-i18n="services.ind.title">The five we know best</h2>
      <p class="lede" data-i18n="services.ind.lede">Each has a template that's been tuned, not the same layout with a different colour.</p>
    </div>

    <div class="grid-3">
      <article class="card reveal">
        <span class="tag" data-i18n="home.strip.i1">Restaurants &amp; cafés</span>
        <h3 style="margin-top:12px" data-i18n="c1.name">Bistro Nord</h3>
        <p data-i18n="services.ind.i1">Menu, bookings and trading hours up front.</p>
      </article>
      <article class="card reveal">
        <span class="tag" data-i18n="home.strip.i2">Nail &amp; beauty</span>
        <h3 style="margin-top:12px" data-i18n="c2.name">Fern &amp; File</h3>
        <p data-i18n="services.ind.i2">Price list, online booking, Afterpay.</p>
      </article>
      <article class="card reveal">
        <span class="tag" data-i18n="home.strip.i3">Hardware &amp; trade</span>
        <h3 style="margin-top:12px" data-i18n="c3.name">Rivet &amp; Co.</h3>
        <p data-i18n="services.ind.i3">Catalogue, stock, trade accounts.</p>
      </article>
      <article class="card reveal">
        <span class="tag" data-i18n="home.strip.i4">Sports stores</span>
        <h3 style="margin-top:12px" data-i18n="c4.name">Coastline Sports</h3>
        <p data-i18n="services.ind.i4">Category pages, click and collect, event notices.</p>
      </article>
      <article class="card reveal">
        <span class="tag" data-i18n="home.strip.i5">Golf retail</span>
        <h3 style="margin-top:12px" data-i18n="c5.name">Fairway Golf</h3>
        <p data-i18n="services.ind.i5">Fitting bookings, pre-owned listings, members.</p>
      </article>
    </div>

    <p style="margin-top:32px">
      <a class="link-arrow" href="cases.html">
        <span data-i18n="home.cases.all">View all case studies</span>
        {ARROW}
      </a>
    </p>
  </div>
</section>

<section class="cta-band">
  <div class="wrap">
    <div class="cta-band__inner">
      <div>
        <h2 data-i18n="cta.title">Want to see what your site would look like?</h2>
        <p data-i18n="cta.body">Tell us what the business does and we'll come back with a specific quote within one business day. No contract, no follow-up calls.</p>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <a class="btn btn--accent btn--lg" href="contact.html" data-i18n="cta.primary">Get my free quote</a>
        <a class="btn btn--ghost btn--lg" href="pricing.html" data-i18n="nav.pricing">Pricing</a>
      </div>
    </div>
  </div>
</section>
"""

page(
    "services.html",
    "How it works — AI-drafted websites, four steps | Aussie Builder",
    "Questionnaire, AI draft, your review, launch. What's included on every package, and what's explicitly out of scope.",
    services_body,
)

# ================================================================ PRICING
def plan(slug, price, featured, features, name, audience):
    badge = '<span class="plan__badge" data-i18n="home.pricing.popular">Most popular</span>' if featured else ""
    items = "\n".join(
        f'            <li>{CHECK}<span data-i18n="{key}">{text}</span></li>'
        for key, text in features
    )
    btn_cls = "btn btn--primary" if featured else "btn btn--ghost"
    return f"""
        <article class="plan{' plan--featured' if featured else ''} reveal">
          {badge}
          <p class="plan__name" data-i18n="p.{slug}.name">{name}</p>
          <p class="plan__for" data-i18n="p.{slug}.for">{audience}</p>
          <div class="plan__price">
            <span class="plan__cur">AUD</span>
            <span class="plan__amt">{price}</span>
            <span class="plan__note" data-i18n="home.pricing.from">from</span>
          </div>
          <ul class="plan__list">
{items}
          </ul>
          <a class="{btn_cls}" href="contact.html" data-i18n="pricing.choose">Choose this one</a>
        </article>"""


plans = plan("starter", "$499", False, [
    ("p.starter.f1", "Up to 5 pages"),
    ("p.starter.f2", "Mobile &amp; desktop responsive"),
    ("p.starter.f3", "Contact form"),
    ("p.starter.f4", "Google Maps &amp; trading hours"),
    ("p.starter.f5", "Up to 10 products"),
    ("p.starter.f6", "1 round of revisions"),
    ("p.starter.f7", "5 business days delivery"),
], "Starter", "Sole traders and single shops") + plan("pro", "$999", True, [
    ("p.pro.f1", "Up to 10 pages"),
    ("p.pro.f2", "3 rounds of revisions"),
    ("p.pro.f4", "Up to 50 products"),
    ("p.pro.f5", "Social media links"),
    ("p.pro.f3", "Basic SEO setup"),
    ("p.pro.f7", "7 business days delivery"),
], "Professional", "Local small business") + plan("custom", "$1,999", False, [
    ("p.custom.f1", "Unlimited pages"),
    ("p.custom.f2", "Dedicated designer"),
    ("p.custom.f3", "Unlimited products &amp; categories"),
    ("p.custom.f4", "Unlimited revisions (in scope)"),
    ("p.custom.f5", "Advanced SEO + local SEO"),
    ("p.custom.f6", "10–14 business days delivery"),
], "Custom", "Multi-product, multi-page shops")

YES = '<span class="yes" data-i18n="m.yes">Included</span>'
NO = '<span class="no" data-i18n="m.no">Not included</span>'


def row(n, label, s, p, c):
    return f"""
          <tr>
            <td data-i18n="m.r{n}">{label}</td>
            <td>{s}</td>
            <td class="is-featured">{p}</td>
            <td>{c}</td>
          </tr>"""


matrix_rows = "".join([
    row(1, "Who it's for",
          '<span data-i18n="m.r1.s">Sole trader / single shop</span>',
          '<span data-i18n="m.r1.p">Local small business</span>',
          '<span data-i18n="m.r1.c">Multi-product, multi-page</span>'),
    row(2, "Pages",
          '<span data-i18n="m.r2.s">Up to 5</span>',
          '<span data-i18n="m.r2.p">Up to 10</span>',
          '<span data-i18n="m.r2.c">Unlimited</span>'),
    row(3, "AI first draft", YES, YES, '<span data-i18n="m.r3.c">Included + dedicated designer</span>'),
    row(4, "Mobile &amp; desktop", YES, YES, YES),
    row(5, "Contact form", YES, YES, YES),
    row(6, "Google Maps", YES, YES, YES),
    row(7, "Product gallery",
          '<span data-i18n="m.r7.s">Up to 10 items</span>',
          '<span data-i18n="m.r7.p">Up to 50 items</span>',
          '<span data-i18n="m.r7.c">Unlimited + categories</span>'),
    row(8, "Social media links", YES, YES, YES),
    row(9, "Revision rounds",
          '<span data-i18n="m.r9.s">1 round</span>',
          '<span data-i18n="m.r9.p">3 rounds</span>',
          '<span data-i18n="m.r9.c">Unlimited (in scope)</span>'),
    row(10, "Basic SEO", NO, YES, '<span data-i18n="m.r10.c">Included + local SEO</span>'),
    row(11, "Delivery",
           '<span data-i18n="m.r11.s">5 business days</span>',
           '<span data-i18n="m.r11.p">7 business days</span>',
           '<span data-i18n="m.r11.c">10–14 business days</span>'),
    row(12, "Starting price (AUD)",
           '<span data-i18n="m.r12.s">$499</span>',
           '<span data-i18n="m.r12.p">$999</span>',
           '<span data-i18n="m.r12.c">$1,999 from</span>'),
])

faq = [
    ("home.faq.q1", "home.faq.a1", "How long does it take?",
     "First draft in 3 business days. Full delivery: 5 business days on Starter, 7 on Professional, 10–14 on Custom. The clock starts the day you send your content."),
    ("home.faq.q2", "home.faq.a2", "Do I need to know how to code?",
     "No. Your job is to explain the business. Layout and code are ours."),
    ("home.faq.q3", "home.faq.a3", "Can I update content myself later?",
     "Yes — you get an admin login at launch. Text, photos and prices are all yours to change."),
    ("home.faq.q4", "home.faq.a4", "What do I need to provide?",
     "Logo (or we make a wordmark), photos, trading hours, address, and a few lines about the business."),
    ("pricing.faq.q5", "pricing.faq.a5", "Can I pay half now?",
     "Yes. 50% deposit on signing, balance on delivery. Invoiced in AUD, bank transfer."),
    ("pricing.faq.q6", "pricing.faq.a6", "Is GST included?",
     "No. Every figure on this page excludes GST. The formal quote breaks the tax out separately."),
    ("pricing.faq.q7", "pricing.faq.a7", "Is domain and hosting extra?",
     "Yes — roughly AUD $40–120 a year depending on what you pick. Buy it yourself if you prefer; we'll wire it up."),
]

faq_html = "".join(
    f"""
        <details{' open' if i == 0 else ''}>
          <summary><span data-i18n="{qk}">{q}</span><span class="plus" aria-hidden="true"></span></summary>
          <div class="faq__body" data-i18n="{ak}">{a}</div>
        </details>"""
    for i, (qk, ak, q, a) in enumerate(faq)
)

pricing_body = f"""
<section class="page-hero">
  <div class="wrap">
    <span class="eyebrow" data-i18n="pricing.hero.eyebrow">Pricing</span>
    <h1 data-i18n="pricing.hero.title">Three packages, prices on the page</h1>
    <p class="lede" data-i18n="pricing.hero.sub">All prices in AUD, excluding GST. These are starting prices — the formal quote comes in writing after we've seen the requirements.</p>
  </div>
</section>


<section class="section section--tight" id="estimator">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><i>01</i><span data-i18n="est.eyebrow">Estimate</span></span>
      <h2 data-i18n="est.title">Rough out a price before you talk to anyone</h2>
      <p class="lede" data-i18n="est.lede">Four questions, no email required. You get a range and the package it lands in — the written quote comes after we see the details.</p>
    </div>

    <div class="estimator">
      <div class="estimator__form">

        <div class="est-q" role="group" aria-labelledby="estq1">
          <span class="est-q__label" id="estq1"><b>01</b><span data-i18n="est.q1">What kind of business?</span></span>
          <div class="est-opts">
            <label class="est-opt"><input type="radio" name="industry" value="restaurant" checked><span data-i18n="home.strip.i1">Restaurant &amp; café</span></label>
            <label class="est-opt"><input type="radio" name="industry" value="salon"><span data-i18n="home.strip.i2">Nail &amp; beauty</span></label>
            <label class="est-opt"><input type="radio" name="industry" value="hardware"><span data-i18n="home.strip.i3">Hardware &amp; trade</span></label>
            <label class="est-opt"><input type="radio" name="industry" value="sports"><span data-i18n="home.strip.i4">Sports store</span></label>
            <label class="est-opt"><input type="radio" name="industry" value="golf"><span data-i18n="home.strip.i5">Golf retail</span></label>
            <label class="est-opt"><input type="radio" name="industry" value="other"><span data-i18n="contact.f.industryOther">Something else</span></label>
          </div>
        </div>

        <div class="est-q" role="group" aria-labelledby="estq2">
          <span class="est-q__label" id="estq2"><b>02</b><span data-i18n="est.q2">Roughly how many pages?</span></span>
          <div class="est-opts">
            <label class="est-opt"><input type="radio" name="pages" value="s" checked><span data-i18n="est.p1">1–5 pages</span></label>
            <label class="est-opt"><input type="radio" name="pages" value="m"><span data-i18n="est.p2">6–10 pages</span></label>
            <label class="est-opt"><input type="radio" name="pages" value="l"><span data-i18n="est.p3">11 or more</span></label>
          </div>
        </div>

        <div class="est-q" role="group" aria-labelledby="estq3">
          <span class="est-q__label" id="estq3"><b>03</b><span data-i18n="est.q3">How many products to show?</span></span>
          <div class="est-opts">
            <label class="est-opt"><input type="radio" name="products" value="none" checked><span data-i18n="est.pr1">No product list</span></label>
            <label class="est-opt"><input type="radio" name="products" value="ten"><span data-i18n="est.pr2">Up to 10</span></label>
            <label class="est-opt"><input type="radio" name="products" value="fifty"><span data-i18n="est.pr3">Up to 50</span></label>
            <label class="est-opt"><input type="radio" name="products" value="all"><span data-i18n="est.pr4">Unlimited</span></label>
          </div>
        </div>

        <div class="est-q" role="group" aria-labelledby="estq4">
          <span class="est-q__label" id="estq4"><b>04</b><span data-i18n="est.q4">Anything else? (pick any)</span></span>
          <div class="est-opts">
            <label class="est-opt"><input type="checkbox" name="extra" value="booking"><span data-i18n="est.e1">Booking widget</span></label>
            <label class="est-opt"><input type="checkbox" name="extra" value="blog"><span data-i18n="est.e2">Blog or news</span></label>
            <label class="est-opt"><input type="checkbox" name="extra" value="multi"><span data-i18n="est.e3">Second language</span></label>
          </div>
        </div>

      </div>

      <div class="est-out" id="estOut" aria-live="polite"></div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><i>02</i><span data-i18n="pricing.plans.eyebrow">Packages</span></span>
      <h2 data-i18n="pricing.plans.title">Three sizes, one build</h2>
      <p class="lede" data-i18n="pricing.plans.lede">Same process every time. What changes is how many pages, how many products, and how many rounds of revisions you get.</p>
    </div>

    <div class="plan-grid">{plans}
    </div>
    <p style="margin-top:24px;font-size:.82rem;color:var(--muted)" data-i18n="pricing.note">Excludes GST. Domain and hosting are billed annually (roughly AUD $40–120/yr), or bring your own.</p>
  </div>
</section>

<section class="section section--soft">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><i>03</i><span data-i18n="pricing.matrix.eyebrow">Line by line</span></span>
      <h2 data-i18n="pricing.matrix.title">What actually differs between the three</h2>
      <p class="lede" data-i18n="pricing.matrix.lede">Scroll the table sideways on a phone.</p>
    </div>

    <div class="matrix-wrap reveal">
      <table class="matrix">
        <caption class="sr-only">Feature comparison across the three packages</caption>
        <thead>
          <tr>
            <th scope="col" data-i18n="pricing.matrix.feature">Feature</th>
            <th scope="col" data-i18n="pricing.matrix.starter">Starter</th>
            <th scope="col" class="is-featured" data-i18n="pricing.matrix.pro">Professional</th>
            <th scope="col" data-i18n="pricing.matrix.custom">Custom</th>
          </tr>
        </thead>
        <tbody>{matrix_rows}
        </tbody>
      </table>
    </div>

    <p style="margin-top:20px;font-size:.82rem;color:var(--muted);max-width:70ch" data-i18n="pricing.matrix.note">Starting prices shown at launch. Domain, hosting and ongoing maintenance are quoted separately.</p>
  </div>
</section>

<section class="section" id="faq">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow"><i>04</i><span data-i18n="home.faq.eyebrow">FAQ</span></span>
      <h2 data-i18n="pricing.faq.title">About price and process</h2>
    </div>

    <div class="faq reveal">{faq_html}
    </div>

    <p style="margin-top:32px;display:flex;flex-wrap:wrap;gap:12px;align-items:center">
      <a class="btn btn--primary" href="contact.html" data-i18n="cta.primary">Get my free quote</a>
      <button class="btn btn--quiet" type="button" data-open-chat data-i18n="home.faq.ask">Still unsure? Ask the AI assistant</button>
    </p>
  </div>
</section>
"""

page(
    "pricing.html",
    "Pricing — AUD $499, $999 and $1,999 from | Aussie Builder",
    "Three transparent website packages for Australian small business. Full feature comparison, what's included, and what costs extra.",
    pricing_body,
)

# ================================================================ CONTACT
contact_body = f"""
<section class="page-hero">
  <div class="wrap">
    <span class="eyebrow" data-i18n="contact.hero.eyebrow">Contact</span>
    <h1 data-i18n="contact.hero.title">Tell us about the business and we'll price it</h1>
    <p class="lede" data-i18n="contact.hero.sub">Fill this in and someone replies within one business day. If you'd rather just ask a few questions first, the assistant in the corner is always on.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="contact-grid">

      <div>
        <div class="form-card">
          <h2 style="font-size:1.25rem;margin-bottom:6px" data-i18n="contact.form.title">Project enquiry</h2>
          <p style="font-size:.82rem;color:var(--muted);margin-bottom:26px" data-i18n="contact.form.legend">Fields marked * are required.</p>

          <form id="contactForm" novalidate data-endpoint="">
            <div class="field">
              <label for="f-business"><span data-i18n="contact.f.business">Business name</span> <span class="req" aria-hidden="true">*</span></label>
              <input class="input" id="f-business" name="business" type="text" required autocomplete="organization"
                     data-i18n-ph="contact.f.businessPh" placeholder="e.g. Fern &amp; File Nail Studio">
              <span class="field__error" role="alert"></span>
            </div>

            <div class="field">
              <label for="f-industry"><span data-i18n="contact.f.industry">Industry</span> <span class="req" aria-hidden="true">*</span></label>
              <select class="select" id="f-industry" name="industry" required>
                <option value="" data-i18n="contact.f.industryPh">Please choose</option>
                <option value="restaurant" data-i18n="home.strip.i1">Restaurant &amp; café</option>
                <option value="salon" data-i18n="home.strip.i2">Nail &amp; beauty</option>
                <option value="hardware" data-i18n="home.strip.i3">Hardware &amp; trade</option>
                <option value="sports" data-i18n="home.strip.i4">Sports store</option>
                <option value="golf" data-i18n="home.strip.i5">Golf retail</option>
                <option value="other" data-i18n="contact.f.industryOther">Something else</option>
              </select>
              <span class="field__error" role="alert"></span>
            </div>

            <div class="field--row">
              <div class="field">
                <label for="f-name"><span data-i18n="contact.f.name">Your name</span> <span class="req" aria-hidden="true">*</span></label>
                <input class="input" id="f-name" name="name" type="text" required autocomplete="name"
                       data-i18n-ph="contact.f.namePh" placeholder="What should we call you">
                <span class="field__error" role="alert"></span>
              </div>
              <div class="field">
                <label for="f-email"><span data-i18n="contact.f.email">Email</span> <span class="req" aria-hidden="true">*</span></label>
                <input class="input" id="f-email" name="email" type="email" required autocomplete="email"
                       data-i18n-ph="contact.f.emailPh" placeholder="name@example.com">
                <span class="field__error" role="alert"></span>
              </div>
            </div>

            <div class="field">
              <label for="f-phone" data-i18n="contact.f.phone">Phone</label>
              <input class="input" id="f-phone" name="phone" type="tel" autocomplete="tel"
                     data-i18n-ph="contact.f.phonePh" placeholder="04XX XXX XXX">
              <span class="hint" data-i18n="contact.f.phoneHint">Australian mobile or landline. Optional.</span>
              <span class="field__error" role="alert"></span>
            </div>

            <div class="field">
              <label for="f-site" data-i18n="contact.f.site">Current website, if any</label>
              <input class="input" id="f-site" name="site" type="url" autocomplete="url"
                     data-i18n-ph="contact.f.sitePh" placeholder="https://">
              <span class="field__error" role="alert"></span>
            </div>

            <div class="field">
              <label for="f-brief"><span data-i18n="contact.f.brief">What do you need?</span> <span class="req" aria-hidden="true">*</span></label>
              <textarea class="textarea" id="f-brief" name="brief" required maxlength="500"
                        data-i18n-ph="contact.f.briefPh" placeholder="What the shop does, where it is, what you most want customers to see. Three or four lines is plenty."></textarea>
              <span class="hint" data-i18n="contact.f.briefHint">Up to 500 characters.</span>
              <span class="field__error" role="alert"></span>
            </div>

            <div class="field">
              <span class="hint" style="margin:0 0 9px;font-size:.87rem;font-weight:600;color:var(--ink)" data-i18n="contact.f.plan">Which package are you leaning towards?</span>
              <div class="radio-set" role="radiogroup" aria-label="Preferred package">
                <label><input type="radio" name="plan" value="starter"><span data-i18n="p.starter.name">Starter</span></label>
                <label><input type="radio" name="plan" value="pro"><span data-i18n="p.pro.name">Professional</span></label>
                <label><input type="radio" name="plan" value="custom"><span data-i18n="p.custom.name">Custom</span></label>
                <label><input type="radio" name="plan" value="unsure" checked><span data-i18n="contact.f.planAny">Not sure yet</span></label>
              </div>
            </div>

            <div class="hp" aria-hidden="true">
              <label for="f-hp">Leave this empty</label>
              <input id="f-hp" name="company_website" type="text" tabindex="-1" autocomplete="off">
            </div>

            <button class="btn btn--primary btn--lg btn--block" type="submit" data-i18n="contact.f.submit">Send enquiry</button>

            <p class="form-note" data-i18n-html="contact.f.privacy">By sending this you agree to us handling the details under our <a href="privacy.html">privacy policy</a>. We don't pass them to anyone else and we don't add you to a mailing list.</p>

            <div class="form-status" id="formStatus" role="alert"></div>
          </form>

          <div class="form-success" id="formSuccess" role="status">
            <span class="form-success__mark">{CHECK}</span>
            <h3 data-i18n="contact.ok.title">Got it</h3>
            <p data-i18n-html="contact.ok.body">We'll be in touch within one business day. If it's urgent, call <a href="tel:+61280000000">+61 2 8000 0000</a>.</p>
            <p class="form-demo" id="formDemo" hidden data-i18n="contact.ok.demo">Preview mode — this enquiry was not sent.</p>
            <button class="btn btn--ghost" type="button" id="formAgain" data-i18n="contact.ok.again">Send another enquiry</button>
          </div>
        </div>
      </div>

      <div>
        <div class="aside-card">
          <h3 data-i18n="contact.aside.title">Reach us directly</h3>
          <ul class="aside-list">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>
              <span><strong>hello@aussiebuilder.com.au</strong><span data-i18n="contact.aside.response">Replies within one business day</span></span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"/></svg>
              <span><strong>+61 2 8000 0000</strong><span data-i18n="contact.aside.hours">Mon–Fri, 9:00–17:00 AEST</span></span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>
              <span><strong>Sydney, NSW</strong><span data-i18n="contact.aside.mapBody">Remote delivery Australia-wide. Clients in Sydney, Melbourne, Brisbane, Perth and Adelaide.</span></span>
            </li>
          </ul>
        </div>

        <div class="map-embed" role="img" aria-label="Stylised map showing service coverage across Australia">
          <span class="map-embed__pin" aria-hidden="true"></span>
          <div class="map-embed__card">
            <strong data-i18n="contact.aside.mapTitle">Where we work</strong>
            <span data-i18n="contact.aside.mapBody">Remote delivery Australia-wide. Clients in Sydney, Melbourne, Brisbane, Perth and Adelaide.</span>
          </div>
        </div>

        <div class="aside-card" style="margin-top:16px">
          <h3 data-i18n="contact.aside.chatTitle">Rather not fill in a form?</h3>
          <p style="font-size:.88rem;color:var(--muted);margin-bottom:16px" data-i18n="contact.aside.chatBody">The assistant can answer the usual questions first, and take your details only when you want a quote.</p>
          <button class="btn btn--ghost btn--block" type="button" data-open-chat data-i18n="contact.aside.chatBtn">Open the AI assistant</button>
        </div>
      </div>

    </div>
  </div>
</section>
"""

page(
    "contact.html",
    "Contact — get a website quote for your business | Aussie Builder",
    "Send us your business details and we'll come back with a written quote within one business day. Or ask the assistant first.",
    contact_body,
)

# ================================================================ PRIVACY
privacy_body = """
<section class="page-hero">
  <div class="wrap">
    <span class="eyebrow">Legal</span>
    <h1 data-i18n="privacy.title">Privacy policy</h1>
    <p class="lede" data-i18n="privacy.updated">Last updated 30 October 2026.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="prose">

      <p>This policy explains what Aussie Builder Pty Ltd (ABN 12 345 678 901) collects when you use this website or enquire about a project, why we collect it, and what you can ask us to do with it. It's written to sit alongside the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles.</p>

      <h2>What we collect</h2>
      <p>Only what you type into the forms, plus basic technical data from your visit:</p>
      <ul>
        <li><strong>Enquiry details</strong> — business name, industry, your name, email, phone, current website, project description and the package you're interested in.</li>
        <li><strong>Chat transcripts</strong> — what you type into the assistant, including any contact details you choose to leave there.</li>
        <li><strong>Usage data</strong> — pages viewed, approximate location (city level), device type, referring site. Collected through analytics, in aggregate.</li>
        <li><strong>Cookies</strong> — a language preference cookie, plus analytics cookies if you accept them.</li>
      </ul>

      <h2>Why we collect it</h2>
      <ul>
        <li>To reply to your enquiry and prepare a quote.</li>
        <li>To deliver a project if you engage us.</li>
        <li>To understand which pages are useful, so we can fix the ones that aren't.</li>
        <li>To meet our record-keeping obligations.</li>
      </ul>
      <p>We don't sell your details, and we don't add you to a marketing list because you asked for a quote.</p>

      <h2>Who else sees it</h2>
      <p>We use a small number of service providers to run the business — website hosting, email, form delivery and analytics. They process data on our instructions and are not permitted to use it for their own purposes. If any of them store data outside Australia, we take reasonable steps to ensure the standard of protection is comparable to the APPs.</p>
      <p>We will disclose information if we're legally required to, and not otherwise.</p>

      <h2>How long we keep it</h2>
      <p>Enquiries that don't turn into work are deleted after 24 months. Project records are kept for seven years, which is how long tax and corporate records need to be retained. Chat transcripts are deleted after 12 months.</p>

      <h2>Cookies</h2>
      <p>Strictly necessary cookies keep your language preference and stop forms being submitted twice. Analytics cookies are optional and only set if you accept them. You can clear them at any time in your browser settings; the site keeps working.</p>

      <h2>Your rights</h2>
      <p>You can ask us to:</p>
      <ul>
        <li>tell you what we hold about you;</li>
        <li>correct anything that's wrong;</li>
        <li>delete what we're not required to keep;</li>
        <li>stop using your details for a particular purpose.</li>
      </ul>
      <p>Email <a href="mailto:privacy@aussiebuilder.com.au">privacy@aussiebuilder.com.au</a> and we'll respond within 30 days. If you're unhappy with the response, you can complain to the Office of the Australian Information Commissioner at <a href="https://www.oaic.gov.au" rel="noopener">oaic.gov.au</a>.</p>

      <h2 id="terms">Terms of service</h2>
      <h3>Quotes and pricing</h3>
      <p>Prices on this site are starting prices in Australian dollars, excluding GST. A quote is only binding once it's issued in writing and accepted by both parties. Anything not listed in that quote is out of scope.</p>

      <h3>Payment</h3>
      <p>50% deposit on acceptance, balance on delivery. Invoices are payable within 14 days by bank transfer. Work begins once the deposit clears.</p>

      <h3>What we need from you</h3>
      <p>Content, logos and photos, plus timely feedback. Delivery timelines assume you return content and revision notes within five business days. If a project stalls for more than 60 days waiting on you, we may re-quote.</p>

      <h3>Revisions</h3>
      <p>Each package includes a set number of revision rounds, defined as one consolidated list of changes. Additional rounds are billed hourly.</p>

      <h3>Ownership</h3>
      <p>On final payment, you own the site content and the design as delivered. We retain the right to show the work in our portfolio unless you ask us not to in writing. We keep the underlying templates and tooling.</p>

      <h3>Liability</h3>
      <p>We'll fix defects in what we built. We're not liable for losses caused by third-party services, changes you make after handover, or search rankings — nobody can guarantee those.</p>

      <h3>Governing law</h3>
      <p>These terms are governed by the law of New South Wales, Australia.</p>

      <h2>Contact</h2>
      <p>Questions about this policy: <a href="mailto:privacy@aussiebuilder.com.au">privacy@aussiebuilder.com.au</a>, or +61 2 8000 0000, Monday to Friday 9:00–17:00 AEST.</p>

    </div>
  </div>
</section>
"""

page(
    "privacy.html",
    "Privacy policy and terms | Aussie Builder",
    "What we collect, why, how long we keep it, and the terms that apply to a website project.",
    privacy_body,
)


# ================================================================ 404
notfound_body = """
<section class="page-hero">
  <div class="wrap">
    <span class="eyebrow">404</span>
    <h1>That page isn't here</h1>
    <p class="lede">Either it moved or the link was wrong. The useful bits are all one click away.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="grid-3">
      <article class="card card--hover">
        <h2 style="font-size:1.15rem"><a href="index.html">Home</a></h2>
        <p>What we do and what it costs.</p>
      </article>
      <article class="card card--hover">
        <h2 style="font-size:1.15rem"><a href="cases.html">Case studies</a></h2>
        <p>Five industries, five different builds.</p>
      </article>
      <article class="card card--hover">
        <h2 style="font-size:1.15rem"><a href="contact.html">Get a quote</a></h2>
        <p>Tell us about the business. One business day to reply.</p>
      </article>
    </div>
  </div>
</section>
"""

page("404.html", "Page not found | Aussie Builder",
     "That page doesn't exist. Head back to the homepage, browse case studies, or send us an enquiry.",
     notfound_body)

# ================================================================ CASE PAGES
ARROW_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>'


def case_page(i: int, c: dict) -> None:
    prev_c = CASES[(i - 1) % len(CASES)]
    next_c = CASES[(i + 1) % len(CASES)]
    n = c["n"]

    built = "\n".join(
        f'          <li><strong data-i18n="case.{n}.b{k}t">{bt}</strong>'
        f'<span data-i18n="case.{n}.b{k}d">{bd}</span></li>'
        for k, (bt, bd) in enumerate(c["built"], start=1)
    )
    brief = "\n".join(
        f'        <p data-i18n="case.{n}.brief{k}">{p}</p>'
        for k, p in enumerate(c["brief"], start=1)
    )

    body = f"""
<section class="case-hero">
  <div class="wrap">
    <a class="case-back" href="cases.html">{ARROW_L}<span data-i18n="caseDetail.back">All case studies</span></a>
    <span class="tag" data-i18n="{n}.tag">{c['tag']}</span>
    <h1 data-i18n="{n}.name">{c['name']}</h1>
    <p class="lede" data-i18n="case.{n}.summary">{c['summary']}</p>
    <div class="case-hero__meta">
      <span>{c['city']}</span>
      <span data-i18n="{n}.s1">{c['specs'][0]}</span>
      <span data-i18n="case.{n}.pkg">{c['pkg']}</span>
      <span data-i18n="case.{n}.days">{c['days']}</span>
    </div>
  </div>
</section>

<figure class="case-shot">
  <div class="wrap">
    <img src="assets/img/cases/{c['key']}.webp" width="1440" height="900" fetchpriority="high" decoding="async"
         alt="{c['alt']}">
    <figcaption data-i18n="case.{n}.caption">{c['caption']}</figcaption>
  </div>
</figure>

<section class="section section--tight">
  <div class="wrap">
    <div class="case-cols">
      <div class="case-main">
        <h2 data-i18n="caseDetail.brief">The brief</h2>
{brief}

        <h2 data-i18n="caseDetail.built">What we built</h2>
        <ul class="case-built">
{built}
        </ul>

        <h2 data-i18n="caseDetail.leftOut">What we left out</h2>
        <p data-i18n="{n}.left">{c['left']}</p>
      </div>

      <aside class="case-facts">
        <h3 data-i18n="caseDetail.facts">The build</h3>
        <ul>
          <li><span data-i18n="caseDetail.fIndustry">Industry</span><b data-i18n="{n}.tag">{c['tag']}</b></li>
          <li><span data-i18n="caseDetail.fPackage">Package</span><b data-i18n="case.{n}.pkg">{c['pkg']}</b></li>
          <li><span data-i18n="caseDetail.fPages">Pages</span><b data-i18n="{n}.s1">{c['specs'][0]}</b></li>
          <li><span data-i18n="caseDetail.fTime">Delivered in</span><b data-i18n="case.{n}.days">{c['days']}</b></li>
        </ul>
        <a class="btn btn--primary btn--block" href="contact.html" data-i18n="caseDetail.cta">Get a quote like this</a>
      </aside>
    </div>
  </div>
</section>

<div class="wrap">
  <nav class="case-nav" aria-label="More case studies" data-i18n-aria="caseDetail.more">
    <a class="prev" href="case-{prev_c['key']}.html">
      <small data-i18n="caseDetail.prev">Previous</small>
      <b data-i18n="{prev_c['n']}.name">{prev_c['name']}</b>
    </a>
    <a class="next" href="case-{next_c['key']}.html">
      <small data-i18n="caseDetail.next">Next</small>
      <b data-i18n="{next_c['n']}.name">{next_c['name']}</b>
    </a>
  </nav>
</div>

<section class="cta-band">
  <div class="wrap">
    <div class="cta-band__inner">
      <div>
        <h2 data-i18n="cta.title">Want to see what your site would look like?</h2>
        <p data-i18n="cta.body">Tell us what the business does and we'll come back with a specific quote within one business day. No contract, no follow-up calls.</p>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <a class="btn btn--accent btn--lg" href="contact.html" data-i18n="cta.primary">Get my free quote</a>
        <a class="btn btn--ghost btn--lg" href="cases.html" data-i18n="caseDetail.back">All case studies</a>
      </div>
    </div>
  </div>
</section>
"""
    plain = c["name"].replace("&amp;", "and")
    url = f"{SITE}/case-{c['key']}.html"
    ld = json.dumps({
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": f"{plain} — {c['tag'].replace('&amp;', 'and')} website",
        "description": c["summary"],
        "url": url,
        "image": f"{SITE}/assets/img/cases/{c['key']}.webp",
        "datePublished": "2026-10-30",
        "creator": {"@type": "Organization", "name": "Aussie Builder", "url": SITE},
        "about": c["tag"].replace("&amp;", "and"),
        "locationCreated": {"@type": "Place", "name": c["city"]},
    }, ensure_ascii=False, indent=2)

    page(
        f"case-{c['key']}.html",
        f"{plain} — {c['tag'].replace('&amp;', 'and')} website, {c['city']} | Aussie Builder",
        f"{c['desc']} A {c['specs'][0]} build delivered in {c['days']}.",
        body,
        extra_head=f'<script type="application/ld+json">\n{ld}\n</script>\n',
    )


for _i, _c in enumerate(CASES):
    case_page(_i, _c)

print("done")
