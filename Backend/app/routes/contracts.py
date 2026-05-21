"""
app/routes/contracts.py — List uploaded and analyzed contract files.
"""

from datetime import datetime
from pathlib import Path
from fastapi import APIRouter

from app.models.schema import ContractSummary, ContractsResponse
from config.settings import get_settings

router = APIRouter()
settings = get_settings()


@router.get("/", response_model=ContractsResponse, summary="List uploaded contracts")
def list_contracts():
    """Return uploaded contracts and whether each one has been analysed."""
    upload_dir = Path(settings.upload_dir)
    vector_dir = Path(settings.vector_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    vector_dir.mkdir(parents=True, exist_ok=True)

    contracts = []
    for path in sorted(upload_dir.glob("*.pdf"), key=lambda p: p.stat().st_mtime, reverse=True):
        contract_id = path.stem
        vector_ready = (vector_dir / f"{contract_id}.faiss").exists()
        stat = path.stat()
        contracts.append(ContractSummary(
            id=contract_id,
            filename=path.name,
            uploaded_at=datetime.fromtimestamp(stat.st_mtime).isoformat(),
            size_bytes=stat.st_size,
            analyzed=vector_ready,
            vectorstore_ready=vector_ready,
            path=str(path),
        ))

    return ContractsResponse(
        total=len(contracts),
        analyzed=sum(1 for c in contracts if c.analyzed),
        contracts=contracts,
    )
