"""
app/services/chunker.py — Clause-aware text chunking for legal contracts.

Two modes:
  • clause_split  — splits on numbered / lettered clause headings first,
                    then falls back to sentence-boundary sliding window
  • sliding_window — fixed-size overlap chunks (always available)
"""

import re
import logging
from config.settings import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# ── Heading patterns found in legal contracts ──────────────────────────────────
_CLAUSE_PATTERNS = [
    r"\n\s*(?:SECTION|ARTICLE|CLAUSE)\s+\d+",          # SECTION 1, ARTICLE 2
    r"\n\s*\d{1,2}\.\d{0,2}\s+[A-Z]",                 # 1.1 Termination
    r"\n\s*\d{1,2}\.\s+[A-Z]",                         # 1. Definitions
    r"\n\s*[A-Z]{2,}[^a-z\n]{0,60}\n",                # ALL-CAPS headings
]
_SPLIT_RE = re.compile("|".join(_CLAUSE_PATTERNS))


def chunk_text(text: str, mode: str = "clause_split") -> list[str]:
    """
    Split contract text into semantic chunks.

    Parameters
    ----------
    text  : full contract text
    mode  : 'clause_split' | 'sliding_window'

    Returns
    -------
    List of non-empty string chunks
    """
    if mode == "clause_split":
        return _clause_split(text)
    return _sliding_window(text)


# ── Private helpers ────────────────────────────────────────────────────────────

def _clause_split(text: str) -> list[str]:
    """Split on clause headings, then sub-chunk anything still too large."""
    raw_chunks = _SPLIT_RE.split(text)
    final: list[str] = []

    for chunk in raw_chunks:
        chunk = chunk.strip()
        if len(chunk) < 50:
            continue
        if len(chunk) > settings.chunk_size * 2:
            # Sub-chunk oversized clause with sliding window
            final.extend(_sliding_window(chunk))
        else:
            final.append(chunk)

    if not final:
        logger.warning("clause_split produced 0 chunks — falling back to sliding_window")
        return _sliding_window(text)

    logger.info("clause_split produced %d chunks", len(final))
    return final


def _sliding_window(text: str) -> list[str]:
    """Fixed-size sliding window with overlap."""
    size = settings.chunk_size
    overlap = settings.chunk_overlap
    words = text.split()
    chunks: list[str] = []
    start = 0

    while start < len(words):
        end = min(start + size, len(words))
        chunk = " ".join(words[start:end]).strip()
        if len(chunk) > 50:
            chunks.append(chunk)
        start += size - overlap

    logger.info("sliding_window produced %d chunks", len(chunks))
    return chunks