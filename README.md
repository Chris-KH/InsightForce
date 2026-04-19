# InsightForce Frontend

InsightForce is the React dashboard for a creator-focused agentic AI workflow. It connects with the InsightForge backend ([NamQuanProject/InsightForge](https://github.com/NamQuanProject/InsightForge)) to help creators move from profile context, to trend discovery, to content generation, to publishing.

## Features

- **Profile**: creator identity, audience persona, content direction, preferred formats, hashtags, and platform settings.
- **Dashboard**: strategy approval, agent activity, trend momentum, and keyword trend scores.
- **Automation**: run an orchestration prompt, inspect trend results, select a keyword, review generated multi-image content, and continue to publishing.
- **Publishing**: preview and approve posts through the AI Autopilot chat flow.
- **Trends**: search saved trend history and generate post scripts from previous trend items.
- **Audience**: demo view for views, reactions, comments, followers, platform mix, and positive comments.
- **Finance**: demo view for revenue numbers by platform.

## Tech Stack

- React 19, Vite 8, TypeScript
- React Router 7
- Redux Toolkit and TanStack Query
- Tailwind CSS 4 with local UI components
- Chart.js, Motion, Three.js / React Three Fiber

## Quick Start

```bash
npm install
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

## Environment

Create `.env.local` when running with the local backend:

```env
VITE_BACKEND_PROXY_TARGET=http://127.0.0.1:8000
```

Optional values used by the app:

```env
VITE_API_BASE_URL=
VITE_AUTOPILOT_POST_ENDPOINT=http://127.0.0.1:8000/api/v1/post/post
VITE_INSIGHTFORGE_DEFAULT_USER_ID=eb892952-0f26-45e1-860b-1dc7d572c553
VITE_DEFAULT_ORCHESTRATION_SAVE_FILES=false
VITE_ENABLE_API_POLLING=false
```

Leave `VITE_API_BASE_URL` empty to use the Vite proxy. Set it to the backend URL only if you want the browser to call the backend directly.

## Scripts

```bash
npm run dev          # start local Vite server
npm run type-check   # run TypeScript checks
npm run lint         # run ESLint
npm run build        # create production build
npm run preview      # preview production build
```

## Main Routes

```text
/                 Landing page
/login            Login
/register         Registration
/app/dashboard    Dashboard
/app/profile      Creator profile
/app/strategy     Trends
/app/automation   Automation and publishing
/app/audience     Audience demo snapshot
/app/finance      Finance demo snapshot
```