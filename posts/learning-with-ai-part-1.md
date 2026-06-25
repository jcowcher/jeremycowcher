---
title: Learning with AI (Part 1) - Redundancy equals insurance
date: 2026-06-24
description: A tool that can create anything can break it just as fast, so building with AI means building in redundancy: backups, copies, and staging before anything reaches a real user
series: Learning with AI
part: 1
---

> "Look at the human body. We have two eyes, two lungs, two kidneys, even two brains (with the possible exception of corporate executives) - and each has more capacity than needed in ordinary circumstances. So redundancy *equals* insurance, and the apparent inefficiencies are associated with the costs of maintaining these spare parts and the energy needed to keep them around."
>
> — Nassim Nicholas Taleb ([The Black Swan](https://www.amazon.com/Incerto-Fooled-Randomness-Procrustes-Antifragile/dp/059324365X?tag=gemka0e-20))

Like all technology, AI is a double-edged sword; it can build things you only imagined and then break them. If you don't want to break something valuable, you need redundancy.

Coming from a cold start, I've now learned that there are two main ways to break something valuable. The first is that you break something in the data that sits behind your website and the second is that you break how the website looks or is used. The first risk has catastrophic potential (you lose all the data) and the second can make you look sloppy. Both can do damage to the relationship you have with potential users.

We all have experience hitting the save button in Word, Excel or PPT. If you're like me, you never thought too much about what happens after that. I eventually realized that the versions you can roll back to, the copies kept somewhere safe, the file that survives a dead laptop, had been handled for me invisibly the whole time. When you build your own products, you have to put it there for yourself.

After some trial and error, to protect the data, a GitHub Action automatically backs up an encrypted copy of my database to cloud storage every day. If I need to make any changes to the database that could delete or change existing data, I have Claude spin up a throwaway copy from the latest backup. While Supabase has point-in-time recovery that adds another layer of redundancy, it still lives inside Supabase. That means, ideally, you have a copy of the database elsewhere in case anything happens to your Supabase project itself.

When I want to test a change, I use a couple of subdomains. One is for database changes and runs against that throwaway copy; a (not real) example could be dbtesting.jeremycowcher.com. The other is for changes to how the website looks or is used; a (not real) example could be testing.jeremycowcher.com. Both are gated by Vercel, which means you need authorization to access them. It's how I check a change in a real setting before it goes "live".

<figure style="margin: 2rem 0;">
<svg viewBox="40 232 880 426" width="100%" height="auto" style="max-width:100%;height:auto;display:block;" xmlns="http://www.w3.org/2000/svg" font-family="inherit" role="img" aria-label="Exhibit 1: a change moves through Local, DB test, UX / UI test and Live stations, with a table showing which stage gates apply to four example changes.">
  <defs>
    <marker id="ik-arrow-e1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#1C1A14"/></marker>
  </defs>
  <text x="48" y="248" font-size="13" font-weight="600" letter-spacing="0.05em" fill="#9a8f78">EXHIBIT 1</text>
  <line x1="48" y1="260" x2="912" y2="260" stroke="#D9CBA8" stroke-width="0.75"/>
  <text x="48" y="286" font-size="18" font-weight="600" fill="#1C1A14" textLength="856" lengthAdjust="spacing">When building a system, you need insurance; test changes against a copy of the</text>
  <text x="48" y="309" font-size="18" font-weight="600" fill="#1C1A14">database and a copy of the website</text>
  <circle cx="58" cy="330" r="10" fill="none" stroke="#C8102E" stroke-width="1.5"/>
  <text x="58" y="335" text-anchor="middle" font-size="14" font-weight="600" fill="#C8102E">&#10003;</text>
  <text x="76" y="335" font-size="14" fill="#1C1A14">Stage gate applies</text>
  <circle cx="216" cy="330" r="10" fill="none" stroke="#D9CBA8" stroke-width="1.5"/>
  <text x="234" y="335" font-size="14" fill="#1C1A14">Skips the stage gate</text>
  <rect x="262" y="352" width="132" height="66" rx="8" fill="none" stroke="#1C1A14" stroke-width="1.25"/>
  <text x="328" y="375" text-anchor="middle" font-size="14" font-weight="600" fill="#1C1A14">Local</text>
  <text x="328" y="394" text-anchor="middle" font-size="14" fill="#6B6354">Test on your</text>
  <text x="328" y="411" text-anchor="middle" font-size="14" fill="#6B6354">own machine</text>
  <line x1="400" y1="385" x2="424" y2="385" stroke="#1C1A14" stroke-width="1.25" marker-end="url(#ik-arrow-e1)"/>
  <rect x="432" y="352" width="132" height="66" rx="8" fill="#C8102E" stroke="#C8102E" stroke-width="1.25"/>
  <text x="498" y="375" text-anchor="middle" font-size="14" font-weight="600" fill="#F7F1E3">DB test</text>
  <text x="498" y="394" text-anchor="middle" font-size="14" fill="#ECD9C4">Test on a copy</text>
  <text x="498" y="411" text-anchor="middle" font-size="14" fill="#ECD9C4">of the database</text>
  <line x1="570" y1="385" x2="594" y2="385" stroke="#1C1A14" stroke-width="1.25" marker-end="url(#ik-arrow-e1)"/>
  <rect x="602" y="352" width="132" height="66" rx="8" fill="#C8102E" stroke="#C8102E" stroke-width="1.25"/>
  <text x="668" y="375" text-anchor="middle" font-size="14" font-weight="600" fill="#F7F1E3">UX / UI test</text>
  <text x="668" y="394" text-anchor="middle" font-size="14" fill="#ECD9C4">Test on a live</text>
  <text x="668" y="411" text-anchor="middle" font-size="14" fill="#ECD9C4">copy of the website</text>
  <line x1="740" y1="385" x2="764" y2="385" stroke="#1C1A14" stroke-width="1.25" marker-end="url(#ik-arrow-e1)"/>
  <rect x="772" y="352" width="132" height="66" rx="8" fill="#1C1A14" stroke="#1C1A14" stroke-width="1.25"/>
  <text x="838" y="375" text-anchor="middle" font-size="14" font-weight="600" fill="#F7F1E3">Live</text>
  <text x="838" y="394" text-anchor="middle" font-size="14" fill="#D9CBA8">Learn from and</text>
  <text x="838" y="411" text-anchor="middle" font-size="14" fill="#D9CBA8">with your users</text>
  <text x="48" y="432" font-size="14" font-weight="600" fill="#1C1A14">Examples</text>
  <line x1="48" y1="437" x2="113" y2="437" stroke="#1C1A14" stroke-width="1"/>
  <text x="48" y="463" font-size="14" fill="#1C1A14">Split one name field into</text>
  <text x="48" y="482" font-size="14" fill="#1C1A14">first and last name</text>
  <circle cx="328" cy="465" r="10" fill="none" stroke="#C8102E" stroke-width="1.5"/><text x="328" y="470" text-anchor="middle" font-size="14" font-weight="600" fill="#C8102E">&#10003;</text>
  <circle cx="498" cy="465" r="10" fill="none" stroke="#C8102E" stroke-width="1.5"/><text x="498" y="470" text-anchor="middle" font-size="14" font-weight="600" fill="#C8102E">&#10003;</text>
  <circle cx="668" cy="465" r="10" fill="none" stroke="#C8102E" stroke-width="1.5"/><text x="668" y="470" text-anchor="middle" font-size="14" font-weight="600" fill="#C8102E">&#10003;</text>
  <circle cx="838" cy="465" r="10" fill="none" stroke="#C8102E" stroke-width="1.5"/><text x="838" y="470" text-anchor="middle" font-size="14" font-weight="600" fill="#C8102E">&#10003;</text>
  <line x1="48" y1="488" x2="904" y2="488" stroke="#D9CBA8" stroke-width="0.75"/>
  <text x="48" y="510" font-size="14" fill="#1C1A14">Combine two customer lists</text>
  <text x="48" y="529" font-size="14" fill="#1C1A14">into one</text>
  <circle cx="328" cy="514" r="10" fill="none" stroke="#C8102E" stroke-width="1.5"/><text x="328" y="519" text-anchor="middle" font-size="14" font-weight="600" fill="#C8102E">&#10003;</text>
  <circle cx="498" cy="514" r="10" fill="none" stroke="#C8102E" stroke-width="1.5"/><text x="498" y="519" text-anchor="middle" font-size="14" font-weight="600" fill="#C8102E">&#10003;</text>
  <circle cx="668" cy="514" r="10" fill="none" stroke="#D9CBA8" stroke-width="1.5"/>
  <circle cx="838" cy="514" r="10" fill="none" stroke="#C8102E" stroke-width="1.5"/><text x="838" y="519" text-anchor="middle" font-size="14" font-weight="600" fill="#C8102E">&#10003;</text>
  <line x1="48" y1="541" x2="904" y2="541" stroke="#D9CBA8" stroke-width="0.75"/>
  <text x="48" y="563" font-size="14" fill="#1C1A14">Change the size of a box on</text>
  <text x="48" y="582" font-size="14" fill="#1C1A14">the homepage</text>
  <circle cx="328" cy="567" r="10" fill="none" stroke="#C8102E" stroke-width="1.5"/><text x="328" y="572" text-anchor="middle" font-size="14" font-weight="600" fill="#C8102E">&#10003;</text>
  <circle cx="498" cy="567" r="10" fill="none" stroke="#D9CBA8" stroke-width="1.5"/>
  <circle cx="668" cy="567" r="10" fill="none" stroke="#C8102E" stroke-width="1.5"/><text x="668" y="572" text-anchor="middle" font-size="14" font-weight="600" fill="#C8102E">&#10003;</text>
  <circle cx="838" cy="567" r="10" fill="none" stroke="#C8102E" stroke-width="1.5"/><text x="838" y="572" text-anchor="middle" font-size="14" font-weight="600" fill="#C8102E">&#10003;</text>
  <line x1="48" y1="594" x2="904" y2="594" stroke="#D9CBA8" stroke-width="0.75"/>
  <text x="48" y="616" font-size="14" fill="#1C1A14">Update the description shown</text>
  <text x="48" y="635" font-size="14" fill="#1C1A14">in search results</text>
  <circle cx="328" cy="620" r="10" fill="none" stroke="#C8102E" stroke-width="1.5"/><text x="328" y="625" text-anchor="middle" font-size="14" font-weight="600" fill="#C8102E">&#10003;</text>
  <circle cx="498" cy="620" r="10" fill="none" stroke="#D9CBA8" stroke-width="1.5"/>
  <circle cx="668" cy="620" r="10" fill="none" stroke="#D9CBA8" stroke-width="1.5"/>
  <circle cx="838" cy="620" r="10" fill="none" stroke="#C8102E" stroke-width="1.5"/><text x="838" y="625" text-anchor="middle" font-size="14" font-weight="600" fill="#C8102E">&#10003;</text>
</svg>
</figure>

The good news is that I can count the number of times I've had to run this DB test process on one hand. One recent example when I did run it, was changing how I presented co-authors of a book in one of my products.

<figure style="margin: 2rem 0;">
<svg viewBox="40 656 880 220" width="100%" height="auto" style="max-width:100%;height:auto;display:block;" xmlns="http://www.w3.org/2000/svg" font-family="inherit" role="img" aria-label="Exhibit 2: the live database is copied in full every night into backups, restored to a throwaway DB test database, and once a change is confirmed there it is made to the live database.">
  <defs>
    <marker id="ik-arrow-e2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#1C1A14"/></marker>
  </defs>
  <text x="48" y="675" font-size="13" font-weight="600" letter-spacing="0.05em" fill="#9a8f78">EXHIBIT 2</text>
  <line x1="48" y1="687" x2="912" y2="687" stroke="#D9CBA8" stroke-width="0.75"/>
  <text x="48" y="713" font-size="18" font-weight="600" fill="#1C1A14">The database copy is generated from a daily backup so it's timely and accurate</text>
  <rect x="145" y="745" width="110" height="52" rx="8" fill="none" stroke="#1C1A14" stroke-width="1.25"/>
  <text x="200" y="776" text-anchor="middle" font-size="14" font-weight="600" fill="#1C1A14">Live database</text>
  <line x1="261" y1="771" x2="429" y2="771" stroke="#1C1A14" stroke-width="1.25" marker-end="url(#ik-arrow-e2)"/>
  <text x="345" y="749" text-anchor="middle" font-size="14" fill="#6B6354">Copied in full</text>
  <text x="345" y="765" text-anchor="middle" font-size="14" fill="#6B6354">every night</text>
  <rect x="435" y="745" width="90" height="52" rx="8" fill="none" stroke="#1C1A14" stroke-width="1.25"/>
  <text x="480" y="776" text-anchor="middle" font-size="14" font-weight="600" fill="#1C1A14">Backups</text>
  <line x1="531" y1="771" x2="679" y2="771" stroke="#1C1A14" stroke-width="1.25" marker-end="url(#ik-arrow-e2)"/>
  <text x="605" y="761" text-anchor="middle" font-size="14" fill="#6B6354">Restore to DB test</text>
  <rect x="685" y="745" width="150" height="52" rx="8" fill="none" stroke="#C8102E" stroke-width="1.5" stroke-dasharray="5,4"/>
  <text x="760" y="767" text-anchor="middle" font-size="14" font-weight="600" fill="#C8102E">DB test database</text>
  <text x="760" y="785" text-anchor="middle" font-size="14" fill="#6B6354">(Throwaway copy)</text>
  <path d="M 760 797 V 865 H 200 V 803" fill="none" stroke="#1C1A14" stroke-width="1.25" marker-end="url(#ik-arrow-e2)"/>
  <text x="480" y="839" text-anchor="middle" font-size="14" fill="#6B6354">Once it's confirmed the change worked on the copy of the database,</text>
  <text x="480" y="857" text-anchor="middle" font-size="14" fill="#6B6354">the change is made to the live database</text>
</svg>
</figure>

Just as you hope never to rely on the fact you have two kidneys or two eyes, I hope that setting up this system is insurance against a risk that never materializes. While setting it up isn't exciting, once it's in place you can focus your energy where it matters, building something you want to use.
