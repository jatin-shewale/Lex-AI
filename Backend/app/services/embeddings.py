"""
app/services/embeddings.py — HuggingFace embedding model wrapper.

Singleton pattern so the model is loaded once per process.
"""

import logging
from functools import lru_cache
from config.settings import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


@lru_cache(maxsize=1)
def get_embeddings():
    """
    Return a cached HuggingFaceEmbeddings instance.

    Uses sentence-transformers/all-MiniLM-L6-v2 by default (384-dim,
    fast, good for semantic similarity on English legal text).
    """
    try:
        from langchain_community.embeddings import HuggingFaceEmbeddings

        logger.info("Loading embedding model: %s", settings.embedding_model)
        emb = HuggingFaceEmbeddings(
            model_name=settings.embedding_model,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )
        logger.info("Embedding model loaded ✓")
        return emb
    except Exception as exc:
        logger.error("Failed to load embedding model: %s", exc)
        raise