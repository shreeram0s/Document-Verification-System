# DVS Backend (FastAPI)

## Setup (Windows PowerShell)

```powershell
cd dvs-platform/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run

```powershell
uvicorn app.main:app --reload --port 8000
```

Open:
- API: `http://localhost:8000/health`
- Swagger docs: `http://localhost:8000/docs`

## Config

This repo cannot store dotfiles in this workspace, so config uses `env` / `env.example`.

- Copy `env.example` → `env`
- Edit values if needed


