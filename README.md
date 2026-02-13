# Todo List App

Full-stack Todo List app with CRUD, drag & drop reordering, and dark mode.

## Stack

**Backend**: NestJS • Swagger • Class Validator • Jest

**Frontend**: React 19 • Vite • TypeScript • TanStack Query • TailwindCSS • @dnd-kit

## Features

- Complete CRUD for Todo Lists and Items
- Drag & drop reordering
- Inline editing
- Dark/Light theme toggle
- Responsive design
- Optimistic UI updates (no wait for backend)

## Development

**Prompts used**: [`./docs/prompts.md`](./docs/prompts.md)

## Backend Changes

> Note: Backend was modified to add reordering support (not part of original scope)

## Installation

```bash
pnpm install
pnpm dev
```

**API Docs**: http://localhost:4000/api/docs

## Deployment

Demo: [todo-app.onrender.com](https://todo-app.onrender.com)

### Deploy on Render (Free)

1. Push repo to GitHub
2. Go to [render.com](https://render.com)
3. Connect GitHub repo
4. Create **2 Web Services**:
   - `backend/` → Node.js
   - `frontend/` → Node.js
5. Update `VITE_API_URL` in frontend with backend URL

Config files included: `backend/render.yaml` + `frontend/render.yaml`

## Structure

```
├── backend/          # NestJS API
└── frontend/         # React Vite
```

## Contact

- Martín Fernández (mfernandez@crunchloop.io)

## About Crunchloop

![crunchloop](https://s3.amazonaws.com/crunchloop.io/logo-blue.png)

We strongly believe in giving back :rocket:. Let's work together [`Get in touch`](https://crunchloop.io/#contact).
