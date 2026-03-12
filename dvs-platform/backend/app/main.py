from __future__ import annotations

import shutil
from pathlib import Path
from typing import Annotated

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .models import DocumentType, UploadResponse, VerificationRunResponse
from .pipeline import run_pipeline
from .settings import settings


app = FastAPI(title="DVS Platform API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _ensure_upload_dir() -> Path:
    p = settings.upload_path()
    p.mkdir(parents=True, exist_ok=True)
    return p


def _validate_upload(*, file: UploadFile) -> None:
    # Basic hard limits (can be extended per doc type)
    allowed_ext = {".pdf", ".jpg", ".jpeg", ".png"}
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in allowed_ext:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {suffix}")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/uploads/{document_type}", response_model=UploadResponse)
def upload_document(
    document_type: DocumentType,
    file: Annotated[UploadFile, File(...)],
) -> UploadResponse:
    _validate_upload(file=file)

    upload_dir = _ensure_upload_dir()
    filename = file.filename or f"{document_type.value}.bin"
    stored_path = upload_dir / f"{document_type.value}__{filename}"

    size = 0
    with stored_path.open("wb") as f:
        shutil.copyfileobj(file.file, f)
        size = stored_path.stat().st_size

    # TODO: stage-1 prechecks (size <= 5MB, dpi checks, etc.)
    return UploadResponse(
        document_type=document_type,
        filename=filename,
        stored_path=str(stored_path),
        size_bytes=size,
    )


@app.post("/api/verification/run", response_model=VerificationRunResponse)
def run_verification() -> VerificationRunResponse:
    upload_dir = _ensure_upload_dir()
    return run_pipeline(upload_dir=upload_dir)


