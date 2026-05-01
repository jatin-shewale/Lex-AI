"""
app/services/ner_model.py — Legal Named Entity Recognition (NER).

Two-tier approach:
  1. spaCy transformer model  (if available) — high accuracy
  2. Regex patterns            — always available, zero dependencies
"""

import re
import logging
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


@dataclass
class NERResult:
    dates: list[str] = field(default_factory=list)
    monetary_values: list[str] = field(default_factory=list)
    parties: list[str] = field(default_factory=list)
    locations: list[str] = field(default_factory=list)
    durations: list[str] = field(default_factory=list)
    percentages: list[str] = field(default_factory=list)


# ── Regex patterns ─────────────────────────────────────────────────────────────
_DATE_RE = re.compile(
    r"\b(?:\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2,4}"
    r"|\d{4}[/\-\.]\d{1,2}[/\-\.]\d{1,2}"
    r"|(?:January|February|March|April|May|June|July|August|September|"
    r"October|November|December)\s+\d{1,2},?\s+\d{4})\b",
    re.IGNORECASE,
)
_MONEY_RE = re.compile(
    r"\b(?:USD|EUR|GBP|INR)?\s*[\$€£₹]?\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?"
    r"\s*(?:million|billion|thousand|M|B|K)?\b",
    re.IGNORECASE,
)
_PERCENT_RE = re.compile(r"\b\d+(?:\.\d+)?\s*%")
_DURATION_RE = re.compile(
    r"\b\d+\s*(?:day|week|month|year|hour|business day)s?\b",
    re.IGNORECASE,
)
_PARTY_RE = re.compile(
    r"(?:\"|\u201c)([A-Z][A-Za-z\s&,\.]+?)(?:\"|\u201d)\s*"
    r"(?:hereinafter|referred to as|means|,\s*the\s*\"|called)",
    re.IGNORECASE,
)
_LOC_RE = re.compile(
    r"\b(?:State of|Province of|Country of|County of)\s+([A-Z][a-zA-Z\s]+)",
    re.IGNORECASE,
)


def run_ner(text: str) -> NERResult:
    """
    Extract named entities from contract text.
    Tries spaCy first, falls back to regex.
    """
    try:
        return _spacy_ner(text)
    except Exception as exc:
        logger.debug("spaCy NER unavailable (%s) — using regex NER", exc)
        return _regex_ner(text)


def _regex_ner(text: str) -> NERResult:
    def unique(matches):
        return list(dict.fromkeys(m.strip() for m in matches if m.strip()))

    return NERResult(
        dates=unique(_DATE_RE.findall(text)),
        monetary_values=unique(
            m.group(0) for m in _MONEY_RE.finditer(text)
            if any(c.isdigit() for c in m.group(0))
        ),
        parties=unique(m.group(1) for m in _PARTY_RE.finditer(text)),
        locations=unique(m.group(1) for m in _LOC_RE.finditer(text)),
        durations=unique(_DURATION_RE.findall(text)),
        percentages=unique(_PERCENT_RE.findall(text)),
    )


def _spacy_ner(text: str) -> NERResult:
    import spacy

    try:
        nlp = spacy.load("en_core_web_trf")
    except OSError:
        nlp = spacy.load("en_core_web_sm")

    doc = nlp(text[:50_000])  # spaCy memory limit

    result = NERResult()
    for ent in doc.ents:
        label = ent.label_
        val = ent.text.strip()
        if label in ("DATE",):
            result.dates.append(val)
        elif label in ("MONEY", "CARDINAL") and "$" in val:
            result.monetary_values.append(val)
        elif label in ("ORG", "PERSON"):
            result.parties.append(val)
        elif label in ("GPE", "LOC"):
            result.locations.append(val)

    # De-duplicate
    result.dates = list(dict.fromkeys(result.dates))
    result.monetary_values = list(dict.fromkeys(result.monetary_values))
    result.parties = list(dict.fromkeys(result.parties))
    result.locations = list(dict.fromkeys(result.locations))

    # Regex still handles durations and percentages (spaCy misses these)
    regex_result = _regex_ner(text)
    result.durations = regex_result.durations
    result.percentages = regex_result.percentages

    return result