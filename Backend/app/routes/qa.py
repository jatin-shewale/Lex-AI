"""
app/routes/qa.py — Retrieval-Augmented Q&A over a contract.

Uses FAISS vector search to retrieve top-k relevant chunks,
then feeds them as context to the LLM for grounded answering.
"""

from fastapi import APIRouter, HTTPException

from app.models.schema import QAResponse, QueryRequest
from app.services.llm_service import get_llm
from app.services.vectorstore import load_vectorstore, vectorstore_exists
from langchain_core.messages import HumanMessage

router = APIRouter()

_SYSTEM = """You are a legal contract expert. Answer questions using ONLY the
contract excerpts provided. If the answer is not in the excerpts, say so
clearly. Be precise and cite clause numbers when visible."""

_PROMPT_TEMPLATE = """Use the following contract excerpts to answer the question.

CONTRACT EXCERPTS:
{context}

QUESTION: {question}

Answer concisely and accurately. If unsure, state your uncertainty."""


@router.post("/", response_model=QAResponse, summary="Ask a question about a contract")
def ask_question(req: QueryRequest):
    """
    RAG-powered Q&A over a previously analysed contract.

    - **question**: natural-language question
    - **contract_id**: stem of the uploaded filename (returned by /analyze)

    Requires `/analyze` to have been called first for this contract.
    """
    cid = req.contract_id or "store"   # default for single-contract setups

    if not vectorstore_exists(cid):
        raise HTTPException(
            status_code=404,
            detail=f"No analysed contract '{cid}'. Run /analyze first.",
        )

    # ── Retrieve relevant chunks ───────────────────────────────────────────────
    try:
        vs = load_vectorstore(cid)
        from config.settings import get_settings
        k = get_settings().retrieval_k
        docs = vs.similarity_search(req.question, k=k)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Retrieval failed: {exc}") from exc

    context = "\n\n---\n\n".join(d.page_content for d in docs)
    sources = [d.page_content[:120] + "…" for d in docs]

    # ── LLM answer ────────────────────────────────────────────────────────────
    try:
        llm = get_llm()
        prompt = _PROMPT_TEMPLATE.format(context=context, question=req.question)
        response = llm.invoke(
            [HumanMessage(content=prompt)],
            system=_SYSTEM,
        )
        answer = response.content.strip()
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM Q&A failed: {exc}") from exc

    return QAResponse(
        question=req.question,
        answer=answer,
        sources=sources,
    )