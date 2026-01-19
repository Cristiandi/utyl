# Utyl Agent Guide

Quick notes for working on this repo as an automated or human agent.

## Project Summary
- Astro site with React + Tailwind.
- Goal: small developer utilities (compare lists, format JSON, etc.).
- UI lives in Astro pages and React components; core logic goes in `src/lib`.

## Tech Stack
- Astro 5
- React
- Tailwind CSS

## Commands
- `npm install`
- `npm run dev`
- `npm run build`

## Structure
- `src/pages/` routes (Astro).
- `src/components/` UI components (React).
- `src/components/tools/` tool UIs.
- `src/lib/tools/` reusable tool logic.
- `src/styles/global.css` global Tailwind setup.

## Current Routes
- `/` landing page (`src/pages/index.astro`)
- `/tools/compare-lists` (`src/pages/tools/compare-lists.astro`)

## Conventions
- Keep tool logic pure and reusable in `src/lib/tools`.
- Keep UI concerns inside React components.
- Prefer linking tool cards to their routes.
- Tailwind for styling; no inline styles.

## Notes
- Tailwind is pinned to v3 for Astro integration compatibility.
