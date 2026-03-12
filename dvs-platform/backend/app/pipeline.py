from __future__ import annotations

import uuid
from pathlib import Path

from .models import StageResult, StageStatus, VerificationRunResponse


def run_pipeline(*, upload_dir: Path) -> VerificationRunResponse:
    """
    Pipeline stub.
    For now, it assumes uploads exist in upload_dir and returns deterministic demo results.

    Next iterations:
    - Stage 1: format/size/clarity checks
    - Stage 2: OCR & extraction
    - Stage 3: academic semantic + percentage accuracy gate
    - Stage 4: structural authenticity
    - Stage 5-8: remaining stages
    """
    run_id = f"DVS-{uuid.uuid4().hex[:10].upper()}"

    stages: list[StageResult] = [
        StageResult(
            stage=1,
            name="Document Check",
            status=StageStatus.pass_,
            summary="All documents passed validation.",
        ),
        StageResult(
            stage=2,
            name="Read & Extract",
            status=StageStatus.pass_,
            summary="Extraction complete with confidence scoring.",
        ),
        StageResult(
            stage=3,
            name="Academic Semantic",
            status=StageStatus.pass_,
            summary="Percentage calculation verified — OK to continue.",
            details={
                "total": 487,
                "max": 500,
                "extracted_percentage": "97.4%",
                "computed_percentage": "97.4%",
                "match": True,
            },
        ),
        StageResult(
            stage=4,
            name="Structural Authenticity",
            status=StageStatus.warn,
            summary="1 warning — Transfer certificate seal partially unclear.",
        ),
        StageResult(
            stage=5,
            name="Cross-Document Consistency",
            status=StageStatus.pass_,
            summary="All cross-document checks passed.",
        ),
        StageResult(
            stage=6,
            name="Eligibility Enforcement",
            status=StageStatus.pass_,
            summary="Applicant meets all eligibility criteria.",
        ),
        StageResult(
            stage=7,
            name="Risk & Decision",
            status=StageStatus.pass_,
            summary="VALID — APPROVED (demo).",
        ),
        StageResult(
            stage=8,
            name="Explanation & Guidance",
            status=StageStatus.pass_,
            summary="Human-readable explanation generated (demo).",
        ),
    ]

    return VerificationRunResponse(run_id=run_id, stages=stages)


