"""
app/routes/ner.py — Named Entity Recognition endpoint.
"""

from fastapi import APIRouter

from app.models.schema import NERResponse, TextRequest
from app.services.ner_model import run_ner

router = APIRouter()


@router.post("/", response_model=NERResponse, summary="Extract named entities from contract text")
def extract_entities(req: TextRequest):
    """
    Run NER on raw contract text.

    Extracts:
    - **dates** — contract dates, effective dates, deadlines
    - **monetary_values** — payment amounts, fees, penalties
    - **parties** — company and person names
    - **locations** — jurisdictions, registered addresses
    - **durations** — notice periods, terms, grace periods
    - **percentages** — interest rates, revenue shares
    """
    result = run_ner(req.text)
    return NERResponse(
        dates=result.dates,
        monetary_values=result.monetary_values,
        parties=result.parties,
        locations=result.locations,
        durations=result.durations,
        percentages=result.percentages,
    )