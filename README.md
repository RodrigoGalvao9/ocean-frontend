# Ocean Frontend

Ocean is a polished maritime knowledge chat interface for the
`ocean-agent-api` backend.

## Stack

- React and TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide icons
- React Markdown with GitHub-flavored Markdown

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to the deployed or local Ocean Agent API:

```env
VITE_API_URL=http://localhost:8000
```

`VITE_` values are public in the browser. Never add API keys or secrets to
this project.

## Production build

```bash
npm run build
npm run preview
```

The deployable output is the `dist` directory.

## Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-ocean-agent-api.example`

The included `public/_redirects` file provides the SPA fallback for direct
chat routes.

## Backend API

The frontend uses the verified Ocean Agent API contract:

- `POST /api/v1/chat`
- `GET /api/v1/conversations`
- `GET /api/v1/conversations/{conversation_id}`
- `DELETE /api/v1/conversations/{conversation_id}`

Chat requests send `{ "message": "...", "conversation_id": "..." }`.
The response provides `conversation_id`, `response`, `request_id`, and
`duration_ms`, plus `sources`. Subsequent messages reuse `conversation_id`.
Sources are also restored from the stored assistant message metadata when
opening an existing conversation.

## CORS

The current backend code does not install FastAPI `CORSMiddleware`. Its API
must allow the frontend origins before browser requests work:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-ocean-pages-domain.pages.dev",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)
```

Add the exact Cloudflare Pages custom-domain origin as well. This frontend
repository does not modify or bypass the backend.

## Implemented conversation capabilities

The app supports sending messages, immediate user-message rendering,
Markdown assistant responses, loading and error states, reset/new chat,
conversation listing, conversation retrieval, and deletion. The backend
repository is in-memory, so list and retrieval availability is tied to that
API process's lifetime; it does not require a fake local chat implementation.
