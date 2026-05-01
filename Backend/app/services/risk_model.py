"""
app/services/risk_model.py — LLM-powered contract risk analysis.

Returns a structured risk report with:
  • risk_level  : LOW / MEDIUM / HIGH / CRITICAL
  • score       : 0.0 – 1.0
  • issues      : list of identified risk factors
  • recommendations : actionable suggestions for each issue
"""

import json
import logging
import re
from langchain_core.messages import HumanMessage

logger = logging.getLogger(__name__)

_SYSTEM = """You are a senior legal risk analyst specialising in contract review
for technology and autonomous vehicle companies. Identify legal risks with
precision. Return ONLY a valid JSON object, no markdown, no commentary."""

_USER_TEMPLATE = """Analyse the legal risks in this contract and return a JSON
object with EXACTLY these keys:

{{
  "risk_level": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "score": <float 0.0-1.0>,
  "issues": ["<issue 1>", "<issue 2>", ...],
  "recommendations": ["<action 1>", "<action 2>", ...]
}}

Focus on: unlimited liability, one-sided indemnity, IP ownership ambiguity,
auto-renewal traps, missing dispute resolution, vague termination, GDPR/data
privacy gaps, and jurisdiction risks.

CONTRACT TEXT (first 6000 chars):
{text}

Return ONLY raw JSON."""


def analyze_risk(text: str) -> dict:
    """
    Analyse contract risk via LLM.

    Returns structured dict with risk_level, score, issues, recommendations.
    """
    from app.services.llm_service import get_llm

    prompt = _USER_TEMPLATE.format(text=text[:6000])

    try:
        llm = get_llm()
        response = llm.invoke(
            [HumanMessage(content=prompt)],
            system=_SYSTEM,
        )
        raw = response.content.strip()

        # Strip markdown fences
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

        result = json.loads(raw)
        logger.info("Risk analysis succeeded — level: %s", result.get("risk_level"))
        return result

    except Exception as exc:
        logger.warning("LLM risk analysis failed (%s) — using heuristic fallback", exc)
        return _heuristic_fallback(text)


def _heuristic_fallback(text: str) -> dict:
    """Keyword-based risk scoring when LLM is unavailable."""
    high_risk_terms = [
        "unlimited liability", "sole discretion", "irrevocable",
        "perpetual", "exclusive remedy", "as-is", "no warranty",
        "indemnify and hold harmless", "liquidated damages",
    ]
    medium_risk_terms = [
        "auto-renewal", "unilateral", "at any time", "modify",
        "governing law", "arbitration", "confidential",
    ]

    text_lower = text.lower()
    high_hits = [t for t in high_risk_terms if t in text_lower]
    med_hits  = [t for t in medium_risk_terms if t in text_lower]

    score = min(1.0, (len(high_hits) * 0.15 + len(med_hits) * 0.07))

    if score >= 0.6:
        level = "CRITICAL"
    elif score >= 0.4:
        level = "HIGH"
    elif score >= 0.2:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "risk_level": level,
        "score": round(score, 2),
        "issues": [f"Flagged term: '{t}'" for t in high_hits + med_hits],
        "recommendations": [
            "Have a qualified legal counsel review flagged terms.",
            "Negotiate caps on liability.",
            "Clarify IP ownership provisions.",
        ],
    }