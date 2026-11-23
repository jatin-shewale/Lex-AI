
import json
import logging
import re

logger = logging.getLogger(__name__)

CLAUSE_TYPES = [
    "termination",
    "liability",
    "confidentiality",
    "payment_terms",
    "indemnity",
    "governing_law",
    "dispute_resolution",
]

_SYSTEM = """You are a senior legal analyst specialising in contract review.
Extract the requested clauses from the provided contract text and return ONLY
a valid JSON object with no additional commentary or markdown fences.
If a clause is absent, set its value to null."""

_USER_TEMPLATE = """Extract these clauses from the contract below and return
a JSON object with these exact keys:
{keys}

CONTRACT TEXT (first 6000 chars):
{text}

Return ONLY raw JSON."""


def extract_clauses(text: str) -> dict:
    """
    Extract key legal clauses from contract text.

    Returns a dict with keys from CLAUSE_TYPES.
    """
    from app.services.llm_service import chat_completion

    prompt = _USER_TEMPLATE.format(
        keys=", ".join(CLAUSE_TYPES),
        text=text[:6000],
    )

    try:
        raw = chat_completion(_SYSTEM, prompt).strip()

        # Strip markdown fences if present
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

        clauses = json.loads(raw)
        logger.info("Clause extraction succeeded via LLM")
        return clauses

    except Exception as exc:
        logger.warning("LLM clause extraction failed (%s) — using regex fallback", exc)
        return _regex_fallback(text)


def _regex_fallback(text: str) -> dict:
    """Heuristic regex extraction when LLM is unavailable."""
    result = {k: None for k in CLAUSE_TYPES}

    patterns = {
        "termination": r"(?:termination|terminate)[\s\S]{0,500}",
        "liability":   r"(?:liability|liable)[\s\S]{0,500}",
        "confidentiality": r"(?:confidential|non-disclosure|NDA)[\s\S]{0,500}",
        "payment_terms": r"(?:payment|invoice|fee)[\s\S]{0,500}",
        "indemnity":   r"(?:indemnif|indemnity)[\s\S]{0,500}",
        "governing_law": r"(?:governing law|jurisdiction)[\s\S]{0,300}",
        "dispute_resolution": r"(?:arbitration|mediation|dispute)[\s\S]{0,400}",
    }

    for key, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            result[key] = match.group(0)[:500].strip()

    return result