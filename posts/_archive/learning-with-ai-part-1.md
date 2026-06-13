---
title: Learning with AI (Part I) - Redundancy is insurance
date: 2026-06-16
description: Building with AI means building in insurance, because a tool that can create anything can break anything just as fast
---

> "Look at the human body. We have two eyes, two lungs, two kidneys, even two brains (with the possible exception of corporate executives) - and each has more capacity than needed in ordinary circumstances. So redundancy *equals* insurance, and the apparent inefficiencies are associated with the costs of maintaining these spare parts and the energy needed to keep them around."
>
> — Nassim Nicholas Taleb ([The Black Swan](https://www.amazon.com/Incerto-Fooled-Randomness-Procrustes-Antifragile/dp/059324365X?tag=gemka0e-20))

Nature doesn't optimize for efficiency. It optimizes for survival. Two kidneys is a worse design if your only goal is to do the least work for the lowest cost. It's a far better design if your goal is to still be alive after something goes wrong. The "waste" is the point: the spare capacity is what you draw on the day the unexpected arrives. Redundancy equals insurance.

This is the right frame for building with AI, and it's why this series starts here. Before any of the posts about what you can build, there's a more basic lesson I had to learn first: how to keep from breaking the things I'd already built. AI is the most powerful leverage I've ever had as a builder, and the same property that makes it powerful makes it dangerous. A tool that can create something you only imagined can break it just as easily.

Like all technology, AI is a double-edged sword. Fire kept us warm and cooked our food, and it also burned down our houses. The more capable the tool, the wider the range of outcomes it can produce, good and bad. When I'm working with AI and moving fast, the cost of a single careless change isn't a typo I notice immediately. It's quietly corrupting the data behind a product, or shipping something that breaks the experience for every user who shows up next. The downside isn't symmetric with the upside, and that asymmetry is exactly what insurance exists for.

So the first thing I built with AI wasn't a feature. It was redundancy. The way I protect myself is to never test a meaningful change on the thing real users depend on. Every change runs a gauntlet first: it gets tested on my own machine, then against a throwaway copy of the database, then on a live copy of the website, and only then does it touch the real thing. Most changes don't need every stage. A purely visual tweak doesn't risk the data, so it can skip the database copy; a change to how records are stored doesn't need the visual staging. The discipline is asking, before every change, two questions: does this alter how data is stored or touch records that already exist, and does this change what a user sees? The answers decide which insurance I need.

The exhibit below is how I think about it. The four stations across the top are the pipeline, and the stage gates decide which insurance each change has to clear before it goes live.

<figure style="margin: 2rem 0;">
<svg viewBox="0 0 960 937" width="100%" height="auto" style="max-width:100%;height:auto;display:block;" xmlns="http://www.w3.org/2000/svg" font-family="Arial, Helvetica, sans-serif" role="img" aria-label="Pipeline exhibit: AI is a double-edged sword. A change moves through Local, Scrimmage, Preseason and Live stations, with stage gates deciding which tests apply.">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1C1A14"/>
    </marker>
  </defs>

  <rect width="960" height="937" fill="#F7F1E3"/>

  <!-- Lede -->
  <text x="48" y="86" font-family="Georgia, serif" font-size="21" font-weight="700" fill="#1C1A14">Like all technology, AI is a double-edged sword; it can build things you only</text>
  <text x="48" y="112" font-family="Georgia, serif" font-size="21" font-weight="700" fill="#1C1A14">imagined and then break them just as easily</text>
  <line x1="48" y1="126" x2="912" y2="126" stroke="#C8102E" stroke-width="0.75"/>

  <!-- Body copy -->
  <text x="48" y="146" font-size="14" fill="#1C1A14" textLength="856" lengthAdjust="spacing">To build and maintain a great digital product, you need to protect yourself against the risk of losing user trust because you</text>
  <text x="48" y="165" font-size="14" fill="#1C1A14">broke something either related to data or to the look and feel of the website.</text>
  <text x="48" y="193" font-size="14" fill="#1C1A14" textLength="856" lengthAdjust="spacing">Therefore, when making any change, and ideally you change one thing at a time, start by asking whether the change alters how</text>
  <text x="48" y="212" font-size="14" fill="#1C1A14">the data is stored or touches records that already exist, and whether it changes what the website looks like to a user.</text>

  <!-- Exhibit 1 -->
  <text x="48" y="248" font-size="14" fill="#1C1A14">Exhibit 1</text>
  <line x1="48" y1="260" x2="912" y2="260" stroke="#D9CBA8" stroke-width="0.75"/>
  <text x="48" y="286" font-size="17" font-weight="700" fill="#1C1A14" textLength="856" lengthAdjust="spacing">When building a system, you need insurance; test changes against a copy of the database and</text>
  <text x="48" y="309" font-size="17" font-weight="700" fill="#1C1A14">a copy of the website</text>
  <circle cx="58" cy="330" r="10" fill="#F7F1E3" stroke="#C8102E" stroke-width="1.5"/>
  <text x="58" y="335" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">&#10003;</text>
  <text x="76" y="335" font-size="14" fill="#1C1A14">Stage gate applies</text>
  <circle cx="216" cy="330" r="10" fill="#F7F1E3" stroke="#D9CBA8" stroke-width="1.5"/>
  <text x="234" y="335" font-size="14" fill="#1C1A14">Skips the stage gate</text>

  <!-- Station headers -->
  <rect x="262" y="352" width="132" height="66" rx="8" fill="#F7F1E3" stroke="#1C1A14" stroke-width="1.25"/>
  <text x="328" y="375" text-anchor="middle" font-size="14" font-weight="700" fill="#1C1A14">Local</text>
  <text x="328" y="394" text-anchor="middle" font-size="14" fill="#6B6354">Test on your</text>
  <text x="328" y="411" text-anchor="middle" font-size="14" fill="#6B6354">own machine</text>

  <line x1="400" y1="385" x2="424" y2="385" stroke="#1C1A14" stroke-width="1.25" marker-end="url(#arrow)"/>

  <rect x="432" y="352" width="132" height="66" rx="8" fill="#C8102E" stroke="#C8102E" stroke-width="1.25"/>
  <text x="498" y="375" text-anchor="middle" font-size="14" font-weight="700" fill="#F7F1E3">Scrimmage</text>
  <text x="498" y="394" text-anchor="middle" font-size="14" fill="#ECD9C4">Test on a copy</text>
  <text x="498" y="411" text-anchor="middle" font-size="14" fill="#ECD9C4">of the database</text>

  <line x1="570" y1="385" x2="594" y2="385" stroke="#1C1A14" stroke-width="1.25" marker-end="url(#arrow)"/>

  <rect x="602" y="352" width="132" height="66" rx="8" fill="#C8102E" stroke="#C8102E" stroke-width="1.25"/>
  <text x="668" y="375" text-anchor="middle" font-size="14" font-weight="700" fill="#F7F1E3">Preseason</text>
  <text x="668" y="394" text-anchor="middle" font-size="14" fill="#ECD9C4">Test on a live</text>
  <text x="668" y="411" text-anchor="middle" font-size="14" fill="#ECD9C4">copy of the website</text>

  <line x1="740" y1="385" x2="764" y2="385" stroke="#1C1A14" stroke-width="1.25" marker-end="url(#arrow)"/>

  <rect x="772" y="352" width="132" height="66" rx="8" fill="#1C1A14" stroke="#1C1A14" stroke-width="1.25"/>
  <text x="838" y="375" text-anchor="middle" font-size="14" font-weight="700" fill="#F7F1E3">Live</text>
  <text x="838" y="394" text-anchor="middle" font-size="14" fill="#D9CBA8">Learn from and</text>
  <text x="838" y="411" text-anchor="middle" font-size="14" fill="#D9CBA8">with your users</text>

  <!-- Examples sub-heading -->
  <text x="48" y="432" font-size="14" fill="#1C1A14">Examples</text>
  <line x1="48" y1="437" x2="113" y2="437" stroke="#1C1A14" stroke-width="1"/>

  <!-- Row 1: favorites button -->
  <text x="48" y="470" font-size="14" fill="#1C1A14">Add a favorites button</text>
  <circle cx="328" cy="465" r="10" fill="#F7F1E3" stroke="#C8102E" stroke-width="1.5"/>
  <text x="328" y="470" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">&#10003;</text>
  <circle cx="498" cy="465" r="10" fill="#F7F1E3" stroke="#C8102E" stroke-width="1.5"/>
  <text x="498" y="470" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">&#10003;</text>
  <circle cx="668" cy="465" r="10" fill="#F7F1E3" stroke="#C8102E" stroke-width="1.5"/>
  <text x="668" y="470" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">&#10003;</text>
  <circle cx="838" cy="465" r="10" fill="#F7F1E3" stroke="#C8102E" stroke-width="1.5"/>
  <text x="838" y="470" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">&#10003;</text>
  <line x1="48" y1="488" x2="904" y2="488" stroke="#D9CBA8" stroke-width="0.75"/>

  <!-- Row 2: combine lists -->
  <text x="48" y="510" font-size="14" fill="#1C1A14">Combine two customer lists</text>
  <text x="48" y="529" font-size="14" fill="#1C1A14">into one</text>
  <circle cx="328" cy="514" r="10" fill="#F7F1E3" stroke="#C8102E" stroke-width="1.5"/>
  <text x="328" y="519" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">&#10003;</text>
  <circle cx="498" cy="514" r="10" fill="#F7F1E3" stroke="#C8102E" stroke-width="1.5"/>
  <text x="498" y="519" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">&#10003;</text>
  <circle cx="668" cy="514" r="10" fill="#F7F1E3" stroke="#D9CBA8" stroke-width="1.5"/>
  <circle cx="838" cy="514" r="10" fill="#F7F1E3" stroke="#C8102E" stroke-width="1.5"/>
  <text x="838" y="519" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">&#10003;</text>
  <line x1="48" y1="541" x2="904" y2="541" stroke="#D9CBA8" stroke-width="0.75"/>

  <!-- Row 3: homepage box size -->
  <text x="48" y="563" font-size="14" fill="#1C1A14">Change the size of a box on</text>
  <text x="48" y="582" font-size="14" fill="#1C1A14">the homepage</text>
  <circle cx="328" cy="567" r="10" fill="#F7F1E3" stroke="#C8102E" stroke-width="1.5"/>
  <text x="328" y="572" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">&#10003;</text>
  <circle cx="498" cy="567" r="10" fill="#F7F1E3" stroke="#D9CBA8" stroke-width="1.5"/>
  <circle cx="668" cy="567" r="10" fill="#F7F1E3" stroke="#C8102E" stroke-width="1.5"/>
  <text x="668" y="572" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">&#10003;</text>
  <circle cx="838" cy="567" r="10" fill="#F7F1E3" stroke="#C8102E" stroke-width="1.5"/>
  <text x="838" y="572" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">&#10003;</text>
  <line x1="48" y1="594" x2="904" y2="594" stroke="#D9CBA8" stroke-width="0.75"/>

  <!-- Row 4: page load faster -->
  <text x="48" y="616" font-size="14" fill="#1C1A14">Make the page load faster by</text>
  <text x="48" y="635" font-size="14" fill="#1C1A14">delaying when images load</text>
  <circle cx="328" cy="620" r="10" fill="#F7F1E3" stroke="#C8102E" stroke-width="1.5"/>
  <text x="328" y="625" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">&#10003;</text>
  <circle cx="498" cy="620" r="10" fill="#F7F1E3" stroke="#D9CBA8" stroke-width="1.5"/>
  <circle cx="668" cy="620" r="10" fill="#F7F1E3" stroke="#D9CBA8" stroke-width="1.5"/>
  <circle cx="838" cy="620" r="10" fill="#F7F1E3" stroke="#C8102E" stroke-width="1.5"/>
  <text x="838" y="625" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">&#10003;</text>

  <!-- Exhibit 2 -->
  <text x="48" y="675" font-size="14" fill="#1C1A14">Exhibit 2</text>
  <line x1="48" y1="687" x2="912" y2="687" stroke="#D9CBA8" stroke-width="0.75"/>
  <text x="48" y="713" font-size="17" font-weight="700" fill="#1C1A14">The database copy is generated from a daily backup so it's timely and accurate</text>

  <rect x="145" y="745" width="110" height="52" rx="8" fill="#F7F1E3" stroke="#1C1A14" stroke-width="1.25"/>
  <text x="200" y="776" text-anchor="middle" font-size="14" font-weight="700" fill="#1C1A14">Live database</text>

  <line x1="261" y1="771" x2="429" y2="771" stroke="#1C1A14" stroke-width="1.25" marker-end="url(#arrow)"/>
  <text x="345" y="749" text-anchor="middle" font-size="14" fill="#6B6354">Copied in full</text>
  <text x="345" y="765" text-anchor="middle" font-size="14" fill="#6B6354">every night</text>

  <rect x="435" y="745" width="90" height="52" rx="8" fill="#F7F1E3" stroke="#1C1A14" stroke-width="1.25"/>
  <text x="480" y="776" text-anchor="middle" font-size="14" font-weight="700" fill="#1C1A14">Backups</text>

  <line x1="531" y1="771" x2="679" y2="771" stroke="#1C1A14" stroke-width="1.25" marker-end="url(#arrow)"/>
  <text x="605" y="761" text-anchor="middle" font-size="14" fill="#6B6354">Restore to Scrimmage</text>

  <rect x="685" y="745" width="150" height="52" rx="8" fill="#F7F1E3" stroke="#C8102E" stroke-width="1.5" stroke-dasharray="5,4"/>
  <text x="760" y="767" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">Scrimmage database</text>
  <text x="760" y="785" text-anchor="middle" font-size="14" fill="#6B6354">(Throwaway copy)</text>

  <path d="M 760 797 V 865 H 200 V 803" fill="none" stroke="#1C1A14" stroke-width="1.25" marker-end="url(#arrow)"/>
  <text x="480" y="839" text-anchor="middle" font-size="14" fill="#6B6354">Once it's confirmed the change worked on the copy of the database,</text>
  <text x="480" y="857" text-anchor="middle" font-size="14" fill="#6B6354">the change is made to the live database</text>

  <!-- Footer -->
  <line x1="48" y1="893" x2="912" y2="893" stroke="#C8102E" stroke-width="0.75"/>
  <text x="48" y="913" font-size="14" fill="#6B6354">Created by Jeremy Cowcher (jeremycowcher.com)</text>
</svg>
</figure>

The names are borrowed from sport on purpose. Scrimmage is a practice game with nothing on the line, so you can try the risky thing and throw the result away. Preseason is a real game in a real stadium, but the result doesn't count, so you find out whether the change holds up in the wild before it matters. Only then is it live, where you finally learn from and with the people you built it for. The copy of the database is rebuilt from a fresh backup every night, so when I rehearse a change against it, I'm rehearsing against something that looks almost exactly like reality.

There's a discipline that pairs with this, which is to change one thing at a time. James Dyson built 5,127 prototypes of his vacuum, changing a single variable between each one, so that when something improved he knew exactly what caused it. The same logic applies to building with AI, and it's actually more important now, not less. When the tool lets you make ten changes in the time it used to take to make one, the temptation is to batch them. But if you ship ten changes at once and something breaks, you've lost the ability to know which one did it. The speed AI gives you is only worth having if you can still attribute cause and effect, and that means slowing down enough to isolate each change.

None of this is glamorous. Building insurance never is, which is exactly why it's the easiest thing to skip when a tool makes the building part feel effortless. But the body keeps a second kidney for a reason, and the cost of carrying it is trivial against the cost of needing it and not having it. That's the foundation everything else in this series sits on. With the insurance in place, the rest of these posts can be about the fun part: what you can actually build when the safety net is already there.
