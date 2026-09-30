# NEXAI

![Cinematic hero](https://capsule-render.vercel.app/api?type=rect&color=0:070707,100:191919&height=230&text=NEXAI&fontColor=F3F3EE&fontSize=52&fontAlignY=38&desc=AI%20%2F%20PRODUCT%20EXPERIMENT&descColor=999991&descSize=12&descAlignY=66&animation=twinkling)

> **A product workspace exploring the gap between AI intent and an actionable interface.**

## THE PREMISE

NexAI is an experimental AI product surface built around a simple interaction loop: understand intent, keep the context visible, and turn the model's output into something a person can actually use.

## THE EXPERIENCE

**Prompt in. Context around it. Output that can become a workflow.**

The project combines a visual frontend with an isolated server boundary so model-backed features can evolve without exposing private credentials in the browser.

## THE SYSTEM

The runnable application lives under `nexai-web/`. The frontend is a Vite/React experience, with the `server/` folder providing the backend boundary used by the product.

## THE STACK

React 19 · TypeScript/JavaScript · Vite · Tailwind CSS · Framer Motion · Tesseract.js · Playwright

## RUN

```bash
cd nexai-web
npm install
npm run dev
```

For a production build:

```bash
cd nexai-web
npm run build
```

For the server:

```bash
cd nexai-web
npm run server
```

For end-to-end checks:

```bash
cd nexai-web
npm run test:e2e
```

## ENGINEERING NOTES

- Package and lockfile merge conflicts were resolved.
- Generated Playwright reports are excluded from version control.
- Environment configuration stays in `.env.example`; secrets should never be committed.
- The repository separates frontend and server responsibilities instead of embedding provider credentials in client code.

## PROJECT STATE

**AI product prototype / active engineering workspace**

This README documents the actual repository structure and keeps future AI capabilities separate from what is currently implemented.

---

<p align="center"><strong>K. KISHOR KUMAR</strong><br><sub>ENGINEERING / PRODUCT / SYSTEMS</sub></p>