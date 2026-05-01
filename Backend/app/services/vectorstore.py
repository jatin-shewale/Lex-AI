"""
app/services/vectorstore.py — FAISS vector store management.

Stores one FAISS index per contract (keyed by contract_id).
Supports save, load, search, and deletion.
"""

import logging
import os
import pickle
from pathlib import Path

from config.settings import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def _store_path(contract_id: str) -> Path:
    return Path(settings.vector_dir) / f"{contract_id}.faiss"


def build_and_save(chunks: list[str], embeddings, contract_id: str):
    """
    Build a FAISS index from text chunks and persist it.
    """
    from langchain_community.vectorstores import FAISS

    os.makedirs(settings.vector_dir, exist_ok=True)
    vs = FAISS.from_texts(chunks, embeddings, metadatas=[{"chunk": i} for i in range(len(chunks))])

    path = _store_path(contract_id)
    with open(path, "wb") as f:
        pickle.dump(vs, f)

    logger.info("Saved vector store for '%s' → %s (%d chunks)", contract_id, path, len(chunks))
    return vs


def load_vectorstore(contract_id: str):
    """
    Load a persisted FAISS index.  Raises FileNotFoundError if missing.
    """
    path = _store_path(contract_id)
    if not path.exists():
        raise FileNotFoundError(
            f"No vector store for contract '{contract_id}'. "
            "Please call /analyze first."
        )
    with open(path, "rb") as f:
        vs = pickle.load(f)
    logger.info("Loaded vector store for '%s'", contract_id)
    return vs


def vectorstore_exists(contract_id: str) -> bool:
    return _store_path(contract_id).exists()


def delete_vectorstore(contract_id: str) -> bool:
    path = _store_path(contract_id)
    if path.exists():
        path.unlink()
        return True
    return False