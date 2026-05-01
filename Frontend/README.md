# LexAI Frontend

React + Tailwind CSS frontend for the Contract Analysis AI platform.

## Design System

| Token | Value |
|---|---|
| Primary BG | `#020817` (navy-950) |
| Surface | `#060f2a` (navy-900) |
| Accent | `#fbbf24` (amber-400) |
| Display font | Playfair Display (serif) |
| Body font | DM Sans (sans-serif) |
| Mono font | JetBrains Mono |

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with hero, stats, features, CTA |
| `/dashboard` | Overview metrics, risk distribution, recent contracts |
| `/analyze` | Drag-and-drop PDF upload with pipeline progress |
| `/results` | Full analysis display — clauses, risk, metrics |
| `/qa` | Chat-style RAG Q&A over the contract |

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:3000
npm run build      # production bundle
```

The dev server proxies `/api/*` → `http://localhost:8000` (backend).

## Stack

- **React 18** + **React Router v6**
- **Tailwind CSS 3** with custom design tokens
- **react-dropzone** for file upload
- **react-hot-toast** for notifications
- **lucide-react** for icons
- **axios** for API calls
- **Vite** for bundling
