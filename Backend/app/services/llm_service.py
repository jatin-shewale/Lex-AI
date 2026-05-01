"""
app/services/llm_service.py — LLM client wrapper (Groq / OpenAI-compatible).

Uses Groq's llama3-70b-8192 by default.
Swap model_name in .env to use any Groq model, or point base_url to
a local vLLM / Ollama endpoint for the fine-tuned LLaMA.
"""

import logging
from functools import lru_cache
from config.settings import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


@lru_cache(maxsize=1)
def get_llm():
    """
    Return a cached LangChain ChatOpenAI instance pointing at Groq.
    """
    if not settings.groq_api_key:
        raise EnvironmentError(
            "GROQ_API_KEY is not set. Add it to your .env file."
        )

    try:
        from langchain_openai import ChatOpenAI

        llm = ChatOpenAI(
            model=settings.model_name,
            api_key=settings.groq_api_key,
            base_url="https://api.groq.com/openai/v1",
            temperature=settings.llm_temperature,
            max_tokens=settings.llm_max_tokens,
        )
        logger.info("LLM ready: %s via Groq ✓", settings.model_name)
        return llm
    except Exception as exc:
        logger.error("Failed to initialise LLM: %s", exc)
        raise


def llm_is_ready() -> bool:
    try:
        get_llm()
        return True
    except Exception:
        return False