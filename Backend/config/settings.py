from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    upload_dir: str = "data/contracts"
    vector_dir: str = "data/vectorstore"
    processed_dir: str = "data/processed"


    groq_api_key: str = ""
    model_name: str = "openai/gpt-oss-120b"  # Groq model string
    llm_temperature: float = 0.2
    llm_max_tokens: int = 2048

    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"

    finetuned_model_path: str = ""   

    chunk_size: int = 800
    chunk_overlap: int = 100

    retrieval_k: int = 5

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()