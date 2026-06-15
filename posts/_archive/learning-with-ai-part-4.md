---
title: Learning with AI (Part IV) - Skills and CLAUDE.md
date: 2026-06-22
description: Where you put an instruction matters as much as the instruction itself; scope should decide the home
---

> "Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations."
>
> — Melvin Conway ([How Do Committees Invent?](https://www.melconway.com/Home/Committees_Paper.html))

Conway was writing about software teams, but the deeper claim is about structure: a system ends up shaped like the thing that produced it, whether you intend that or not. I've come to read it as a design rule rather than a warning. If you want a system to behave, give it a shape that matches the job. The corollary, which took me a while to learn, is that *where* you put an instruction matters as much as the instruction itself.

I learned this the hard way through skills. A skill, in the tools I use, is a reusable bundle of instructions Claude can load when a task calls for it. The promise is obvious: teach it once, reuse it everywhere. So I built a few. And then I spent more time fighting them than they ever saved me. First they lived in one place and got found inconsistently. Then they got moved, and half of them stopped being discovered. Then they moved again, and the tool I most wanted them in couldn't see them at all. The instructions were fine. The plumbing that was supposed to surface them at the right moment kept failing, and a skill that doesn't get found is worse than no skill, because you've stopped thinking about the problem on the assumption that it's handled.

The thing that finally made it click was a tiny, boring task. I wanted Claude to take a task I mention in passing — "remind me to email the accountant" — check whether it's already in my todo app, and add it if it isn't. My first instinct was the one everyone's first instinct now is: make a skill. But a skill is a portable thing, and portability is exactly what I didn't need. This behavior only ever touches one app and one database. It is the opposite of cross-cutting. Reaching for the most portable mechanism to solve the least portable problem is how you end up depending on discovery you don't need.

The better home was sitting right there. Every one of my repos has a CLAUDE.md — a plain file of project-specific instructions that loads automatically whenever I'm working in that repo. I know it loads, because Claude routinely tells me things about a project that it could only have read from that file. It's tied to the repo, not to an index that has to find it. So the todo behavior went into the todo app's CLAUDE.md, and it has worked every time since, because there's no discovery step left to fail. The instruction is local to the thing it governs, and it lives in the one place guaranteed to be read when that thing is in play.

That's the principle, and it generalizes past my particular tools: scope decides the home. A behavior that touches exactly one project belongs in that project's local instructions, where loading is guaranteed because it's bound to the project itself. The portable mechanism — the skill — earns its keep only when a behavior genuinely spans several projects and there's nowhere local that sees all of them. That case is real, and it's the hard case, because it's precisely where you're forced to rely on the discovery that's least reliable. (My grubby workaround when reliability matters more than tidiness: copy the instruction into each project's local file. Less elegant, never lost.)

What I'd been doing was choosing the mechanism by how clever it felt rather than by the shape of the problem. Skills feel sophisticated; a line in a config file feels like nothing. But Conway's point cuts the other way — the system you get is the one your structure produces, so you should choose structure deliberately. A one-app problem wants a one-app home. The lesson AI keeps teaching me isn't really about AI. It's that the tool is rarely the bottleneck. The judgment about where a thing belongs is the work, and it's the part worth getting right before you build anything at all.
