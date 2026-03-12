# DVS Platform (Production Project)

This folder contains the **real implementation** of the Document Verification System platform (frontend + backend).

- Prototype UI (POC) remains in the repo root as `DVS Pocf  webpage.html`
- Production code lives under `dvs-platform/`

## Folder structure

- `dvs-platform/backend/` — FastAPI service (upload + verification pipeline API)
- `dvs-platform/frontend/` — React (Vite) web app

## Quick start (dev)

### Backend

```powershell
cd dvs-platform/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`  
API docs: `http://localhost:8000/docs`

### Frontend

```powershell
cd dvs-platform/frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Environment

Copy and edit:
- `dvs-platform/backend/env.example` → `dvs-platform/backend/env` (or create `.env` locally)
- `dvs-platform/frontend/env.example` → `dvs-platform/frontend/env` (or create `.env` locally)


