"""
app/routes/analyze.py — Full contract analysis pipeline.

Pipeline:
  1. Extract text from PDF (multi-strategy)
  2. Chunk text (clause-aware)
  3. Build + save FAISS vector store
  4. Extract clauses via LLM
  5. Analyse risk via LLM
  6. Return structured response
"""

import time
import uuid
from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.models.schema import AnalyzeRequest, AnalyzeResponse
from app.services.chunker import chunk_text
from app.services.clause_extractor import extract_clauses
from app.services.embeddings import get_embeddings
from app.services.parser import extract_text
from app.services.risk_model import analyze_risk
from app.services.vectorstore import build_and_save

router = APIRouter()


@router.post("/", response_model=AnalyzeResponse, summary="Analyse a contract PDF")
def analyze_contract(req: AnalyzeRequest):
    """
    Full pipeline analysis of an uploaded contract.

    - **path**: file path returned by `/upload`

    Returns extracted clauses, risk report, and metadata.
    Processing a 500-page contract takes ~2 minutes.
    """
    if not Path(req.path).exists():
        raise HTTPException(
            status_code=404,
            detail=f"File not found: {req.path}. Upload it first via /upload.",
        )

    t0 = time.perf_counter()

    # ── Step 1: Parse PDF ─────────────────────────────────────────────────────
    try:
        text, page_count = extract_text(req.path)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"PDF parsing failed: {exc}") from exc

    word_count = len(text.split())

    # ── Step 2: Chunk ─────────────────────────────────────────────────────────
    chunks = chunk_text(text)

    # ── Step 3: Vector store ──────────────────────────────────────────────────
    contract_id = Path(req.path).stem  # use filename as ID
    try:
        embeddings = get_embeddings()
        build_and_save(chunks, embeddings, contract_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Vector store build failed: {exc}") from exc

    # ── Step 4 & 5: LLM tasks ────────────────────────────────────────────────
    try:
        clauses = extract_clauses(text)
        risk = analyze_risk(text)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM analysis failed: {exc}") from exc

    elapsed = round(time.perf_counter() - t0, 2)

    return AnalyzeResponse(
        contract_id=contract_id,
        pages=page_count,
        word_count=word_count,
        clauses=clauses,
        risk=risk,
        processing_time_seconds=elapsed,
    )