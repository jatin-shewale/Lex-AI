"""
config/settings.py — Centralised configuration via pydantic-settings.
All values come from environment variables or a .env file.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── Directories ───────────────────────────────────────────────────────────
    upload_dir: str = "data/contracts"
    vector_dir: str = "data/vectorstore"
    processed_dir: str = "data/processed"

    # ── LLM (Groq) ───────────────────────────────────────────────────────────
    groq_api_key: str = ""
    model_name: str = "llama3-70b-8192"          # Groq model string
    llm_temperature: float = 0.2
    llm_max_tokens: int = 2048

    # ── Embeddings ────────────────────────────────────────────────────────────
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"

    # ── Fine-tuned model (local, optional) ───────────────────────────────────
    finetuned_model_path: str = ""   # e.g. "./models/llama-lora-legal"

    # ── Chunking ──────────────────────────────────────────────────────────────
    chunk_size: int = 800
    chunk_overlap: int = 100

    # ── QA retrieval ─────────────────────────────────────────────────────────
    retrieval_k: int = 5

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()