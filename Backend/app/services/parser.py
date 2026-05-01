"""
app/services/parser.py — Robust multi-strategy PDF text extraction.

Strategy waterfall:
  1. PyMuPDF (fitz)  — fast, handles most text-layer PDFs
  2. pdfplumber      — better for complex tables / multi-column layouts
  3. pdfminer.six    — last resort for tricky encodings
"""

import logging
from pathlib import Path

logger = logging.getLogger(__name__)


def extract_text(pdf_path: str) -> tuple[str, int]:
    """
    Extract all text from a PDF.

    Returns
    -------
    (full_text, page_count)
    """
    path = Path(pdf_path)
    if not path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    # ── Strategy 1: PyMuPDF ───────────────────────────────────────────────────
    try:
        import fitz  # PyMuPDF

        doc = fitz.open(str(path))
        pages = [page.get_text("text") for page in doc]
        text = "\n\n".join(pages)
        page_count = len(pages)
        doc.close()

        if len(text.strip()) > 200:
            logger.info("Extracted %d chars from %d pages via PyMuPDF", len(text), page_count)
            return text, page_count

        logger.warning("PyMuPDF returned sparse text — trying pdfplumber")
    except Exception as exc:
        logger.warning("PyMuPDF failed: %s", exc)

    # ── Strategy 2: pdfplumber ────────────────────────────────────────────────
    try:
        import pdfplumber

        pages_text = []
        with pdfplumber.open(str(path)) as pdf:
            page_count = len(pdf.pages)
            for page in pdf.pages:
                pages_text.append(page.extract_text() or "")
        text = "\n\n".join(pages_text)

        if len(text.strip()) > 200:
            logger.info("Extracted %d chars via pdfplumber", len(text))
            return text, page_count
    except Exception as exc:
        logger.warning("pdfplumber failed: %s", exc)

    # ── Strategy 3: pdfminer ─────────────────────────────────────────────────
    try:
        from pdfminer.high_level import extract_text as pdfminer_extract
        from pdfminer.high_level import extract_pages

        text = pdfminer_extract(str(path))
        page_count = sum(1 for _ in extract_pages(str(path)))
        logger.info("Extracted %d chars via pdfminer", len(text))
        return text, page_count
    except Exception as exc:
        logger.error("All PDF extraction strategies failed: %s", exc)
        raise RuntimeError(f"Could not extract text from {pdf_path}") from exc