from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class DocumentType(str, Enum):
    marksheet = "marksheet"
    id_proof = "id"
    transfer_certificate = "tc"


class UploadResponse(BaseModel):
    document_type: DocumentType
    filename: str
    stored_path: str
    size_bytes: int
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)


class StageStatus(str, Enum):
    pending = "PENDING"
    running = "RUNNING"
    pass_ = "PASS"
    warn = "WARN"
    fail = "FAIL"


class StageResult(BaseModel):
    stage: int
    name: str
    status: StageStatus
    summary: str
    details: dict[str, Any] = Field(default_factory=dict)


class VerificationRunResponse(BaseModel):
    run_id: str
    started_at: datetime = Field(default_factory=datetime.utcnow)
    stages: list[StageResult]


