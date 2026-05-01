"""
app/routes/upload.py — Contract PDF upload endpoint.
"""

import os
import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.schema import UploadResponse
from config.settings import get_settings

router = APIRouter()
settings = get_settings()

ALLOWED_TYPES = {"application/pdf", "application/x-pdf"}
MAX_SIZE_MB = 100


@router.post("/", response_model=UploadResponse, summary="Upload a contract PDF")
async def upload_contract(file: UploadFile = File(...)):
    """
    Upload a PDF contract.

    - Validates MIME type (must be PDF)
    - Validates file size (max 100 MB)
    - Saves to `data/contracts/` with a unique filename
    - Returns the file path for use with /analyze
    """
    # ── Validate type ─────────────────────────────────────────────────────────
    if file.content_type not in ALLOWED_TYPES and not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Only PDF files are accepted.")

    # ── Read and size-check ───────────────────────────────────────────────────
    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > MAX_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb:.1f} MB). Max is {MAX_SIZE_MB} MB.",
        )

    # ── Save ──────────────────────────────────────────────────────────────────
    os.makedirs(settings.upload_dir, exist_ok=True)
    stem = Path(file.filename).stem
    unique_name = f"{stem}_{uuid.uuid4().hex[:8]}.pdf"
    save_path = Path(settings.upload_dir) / unique_name

    with open(save_path, "wb") as f:
        f.write(content)

    return UploadResponse(
        message="File uploaded successfully.",
        filename=unique_name,
        path=str(save_path),
        size_bytes=len(content),
    )