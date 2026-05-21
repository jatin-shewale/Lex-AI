"""
app/models/schema.py — Request / Response Pydantic models.
"""

from typing import Any
from pydantic import BaseModel, Field


# ─── Requests ─────────────────────────────────────────────────────────────────

class QueryRequest(BaseModel):
    question: str = Field(..., min_length=3, example="What are the termination conditions?")
    contract_id: str | None = Field(None, example="contract_abc123")


class TextRequest(BaseModel):
    text: str = Field(..., min_length=10)


class AnalyzeRequest(BaseModel):
    path: str = Field(..., example="data/contracts/sample.pdf")


# ─── Responses ────────────────────────────────────────────────────────────────

class UploadResponse(BaseModel):
    message: str
    filename: str
    path: str
    size_bytes: int


class ClauseResult(BaseModel):
    termination: str | None = None
    liability: str | None = None
    confidentiality: str | None = None
    payment_terms: str | None = None
    indemnity: str | None = None
    governing_law: str | None = None
    dispute_resolution: str | None = None


class RiskResult(BaseModel):
    risk_level: str            # LOW / MEDIUM / HIGH / CRITICAL
    score: float               # 0.0 – 1.0
    issues: list[str]
    recommendations: list[str]


class AnalyzeResponse(BaseModel):
    contract_id: str
    pages: int
    word_count: int
    clauses: Any               # ClauseResult or raw JSON from LLM
    risk: Any                  # RiskResult or raw JSON from LLM
    processing_time_seconds: float


class QAResponse(BaseModel):
    question: str
    answer: str
    sources: list[str]


class ContractSummary(BaseModel):
    id: str
    filename: str
    uploaded_at: str
    size_bytes: int
    analyzed: bool
    vectorstore_ready: bool
    path: str


class ContractsResponse(BaseModel):
    total: int
    analyzed: int
    contracts: list[ContractSummary]


class NERResponse(BaseModel):
    dates: list[str]
    monetary_values: list[str]
    parties: list[str]
    locations: list[str]
    durations: list[str]
    percentages: list[str]


class HealthResponse(BaseModel):
    status: str
    version: str
    llm_ready: bool
    vectorstore_ready: bool