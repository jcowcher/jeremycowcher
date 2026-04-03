---
title: Building my workflow
date: 2026-04-03
description: How I got to my current workflow for building and deploying with Claude Code
---

How I got to my current workflow:

As I started building faster, I noticed my Vercel usage was getting high. Vercel is what I use to host my sites — it takes my code and turns it into a live website. The main reason was that every time I pushed code with Claude Code, Vercel would rebuild everything. Now I work on a separate draft branch, test locally, and only deploy when I choose to.

My current workflow:

1. My code has two branches: dev is my working draft and main is the final, live version.
2. I used Claude Code to set this up so all my day-to-day work happens on dev by default. I write and edit code in VS Code, which is my IDE (basically a text editor built for coding).
3. I keep three reference files in each project. CLAUDE.md is the technical spec — Claude Code reads it automatically every time it starts so it knows how the project is built. CONTEXT.md is the product brief — what the project is, who it's for, how it works. NOTES.md is my troubleshooting journal — non-obvious decisions, workarounds, things that bit me. Claude Code created all three and updates them when I ask.
4. When I start a session, I open VS Code and point it at the project folder (e.g. File → Open Folder → Desktop → ideakache). Claude Code runs inside VS Code — that's where I make changes.
5. Separately, I open Mac Terminal, /exit out of Claude Code if it's started automatically, navigate to the project folder using cd (e.g. cd ~/Desktop/ideakache), and run npm run dev. This launches a local version of my site that only runs on my laptop. I can see it in my browser at localhost:3000, and it updates in real time as I work.
6. Claude Code saves my conversation history within each project, so keeping my VS Code window open means Claude remembers what we've been working on. If I close and reopen it, though, it starts fresh — it only knows what's in the code files and CLAUDE.md.
7. When I tell Claude Code to make changes, it writes the new code. I check how things look at localhost:3000, and when I'm happy I tell it to commit and push. I ask Claude Code to write a descriptive commit message — not just 'update styles' but something like 'add custom sign-in form for 1Password compatibility.' This makes my git history actually useful if I ever need to look back. Commit records a snapshot of my changes on my laptop. Push sends it to GitHub. I always do both together.
8. GitHub keeps everything — a full history of every change. Those pushes are what show up as green squares on my profile. Because I'm on dev, though, my live website doesn't change. If something goes wrong, I can always roll it back.
9. The key difference: pushing to dev is free — it just stores my code on GitHub. Pushing to main triggers a Vercel rebuild, and that's what costs money.
10. Before going live, I do a final check at localhost:3000 to make sure everything works together — individual changes can look fine on their own but sometimes interact in unexpected ways.
11. When it's time to go live, I tell Claude Code merge dev to main and push. That moves my draft into the final version.
12. Vercel is watching main. As soon as it sees an update, it rebuilds my site and the changes go live. I've set up Vercel to notify me if a build fails, so I'm not deploying and hoping.
