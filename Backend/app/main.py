"""
Contract Analysis AI — FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from app.routes import upload, analyze, qa, ner, health, contracts

#  App factory ─
app = FastAPI(
    title="Contract Analysis AI",
    description="Fine-tuned LLaMA-powered API for legal contract analysis, "
                "clause extraction, NER, risk scoring, and QA.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

#  CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Lock down in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  Routers 
app.include_router(health.router,    prefix="/health",  tags=["Health"])
app.include_router(upload.router,    prefix="/upload",  tags=["Upload"])
app.include_router(analyze.router,   prefix="/analyze", tags=["Analyze"])
app.include_router(qa.router,        prefix="/qa",      tags=["Q&A"])
app.include_router(ner.router,       prefix="/ner",     tags=["NER"])
app.include_router(contracts.router, prefix="/contracts", tags=["Contracts"])


#  Custom OpenAPI schema ─
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    app.openapi_schema = schema
    return schema


app.openapi = custom_openapi