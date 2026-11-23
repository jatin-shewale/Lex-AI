import logging
from functools import lru_cache
from config.settings import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


@lru_cache(maxsize=1)
def get_llm():
    """
    Return a cached Groq API client.
    """
    if not settings.groq_api_key:
        raise EnvironmentError(
            "GROQ_API_KEY is not set. Add it to your .env file."
        )

    try:
        from groq import Groq

        client = Groq(
            api_key=settings.groq_api_key,
        )
        logger.info("Groq client ready for model: %s", settings.model_name)
        return client
    except Exception as exc:
        logger.error("Failed to initialise LLM: %s", exc)
        raise


def chat_completion(system_prompt: str, user_prompt: str) -> str:
    response = get_llm().chat.completions.create(
        model=settings.model_name,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=settings.llm_temperature,
        max_tokens=settings.llm_max_tokens,
    )
    content = response.choices[0].message.content
    if content is None:
        raise RuntimeError("Groq returned an empty response.")
    return content


def llm_is_ready() -> bool:
    try:
        get_llm()
        return True
    except Exception:
        return False