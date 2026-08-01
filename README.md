# MAP Score Worksheet Studio

A browser-based worksheet planner for turning MAP Growth reading data into
targeted printable practice. It runs as a normal web app and does not require
platform sign-in, platform-hosted URLs, or AI APIs.

## What it Does

- Paste or reference a MAP student profile link.
- Choose a student, target skill, topic, question format, and output mode.
- Generate a worksheet-style plan in the browser.
- Keep entered student details local to the page.

## Requirements

- Node.js `>=22.13.0`
- pnpm or npm

## Local Development

```bash
pnpm install
pnpm run dev
```

Open the local URL printed by the development server.

## Production Build

```bash
pnpm run build
```

The production output is written to `dist/`.

## Deploy on Your Own Host

This project can be deployed to any host that supports a Cloudflare
Workers-compatible Next/Vite build.

Recommended options:

- Cloudflare Workers: use `wrangler` with your Cloudflare account.
- Vercel or Netlify: deploy from a Git repository after switching to that
  provider's standard Next.js adapter.
- A school or district server: serve the built app through a compatible Node or
  Workers runtime.

The currently included `vinext` setup is provider-portable, but the final live
URL depends on which hosting account or domain you want to use.
