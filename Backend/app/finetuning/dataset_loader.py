"""
app/finetuning/dataset_loader.py
Load and preprocess legal contract data for LLaMA LoRA fine-tuning.

Input  : JSONL file with {"text": "<contract clause>"} per line
Output : HuggingFace Dataset with tokenised fields ready for SFTTrainer
"""

import json
import logging
from pathlib import Path

from datasets import Dataset, DatasetDict
from transformers import PreTrainedTokenizer

logger = logging.getLogger(__name__)


# ── Instruction template ──────────────────────────────────────────────────────
INSTRUCTION_TEMPLATE = """### Instruction:
Analyse the following legal contract clause and extract:
1. Clause type
2. Key obligations
3. Risk level (LOW / MEDIUM / HIGH / CRITICAL)
4. Entities (parties, dates, amounts)

### Input:
{clause}

### Response:
{label}"""


def load_jsonl(path: str) -> list[dict]:
    """Load raw JSONL legal dataset."""
    records = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    logger.info("Loaded %d records from %s", len(records), path)
    return records


def format_for_sft(records: list[dict]) -> list[dict]:
    """
    Format raw records into instruction-following format.

    Expects each record to have 'text' and optionally 'label'.
    If no 'label', the model learns to complete the analysis.
    """
    formatted = []
    for rec in records:
        clause = rec.get("text", "").strip()
        label = rec.get("label", "")  # Optional ground-truth label
        if not clause:
            continue
        formatted.append(
            {"text": INSTRUCTION_TEMPLATE.format(clause=clause, label=label)}
        )
    logger.info("Formatted %d training examples", len(formatted))
    return formatted


def tokenise_dataset(
    records: list[dict],
    tokenizer: PreTrainedTokenizer,
    max_length: int = 2048,
    val_split: float = 0.1,
    seed: int = 42,
) -> DatasetDict:
    """
    Tokenise formatted records and split into train/validation.
    """
    dataset = Dataset.from_list(records)

    def tokenise(batch):
        return tokenizer(
            batch["text"],
            truncation=True,
            max_length=max_length,
            padding=False,
        )

    dataset = dataset.map(tokenise, batched=True, remove_columns=["text"])
    dataset = dataset.train_test_split(test_size=val_split, seed=seed)

    logger.info(
        "Dataset splits — train: %d, val: %d",
        len(dataset["train"]),
        len(dataset["test"]),
    )
    return DatasetDict(train=dataset["train"], validation=dataset["test"])


def build_dataset(
    jsonl_path: str,
    tokenizer: PreTrainedTokenizer,
    max_length: int = 2048,
    val_split: float = 0.1,
) -> DatasetDict:
    """Full pipeline: load → format → tokenise → split."""
    if not Path(jsonl_path).exists():
        raise FileNotFoundError(f"Dataset not found: {jsonl_path}")

    records = load_jsonl(jsonl_path)
    formatted = format_for_sft(records)
    return tokenise_dataset(formatted, tokenizer, max_length, val_split)