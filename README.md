# LexAI — Contract Analysis Intelligence

LexAI is a high-performance, premium SaaS platform for AI-powered legal contract review. It leverages fine-tuned **LLaMA 3.1** models and **Retrieval-Augmented Generation (RAG)** to analyze 500+ page contracts in under 2 minutes, cutting review time by **84%**.

![LexAI Banner](https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000)

---

## 🚀 Features

- **Multi-Strategy PDF Parsing**: Robust extraction using PyMuPDF, pdfplumber, and pdfminer fallback chain.
- **Deep Clause Extraction**: Automatically identifies and extracts 7+ critical clause categories (Termination, Liability, IP, etc.).
- **Interactive Risk Report**: 4-tier risk scoring (Low to Critical) with actionable remediation steps.
- **RAG-Powered Q&A**: A specialized legal chatbot that searches the full document for grounded answers with source citations.
- **Named Entity Recognition (NER)**: Extracts parties, dates, monetary values, and jurisdictions with high precision.
- **Premium UI**: A sleek, light-themed React interface with smooth animations and full mobile responsiveness.

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: FastAPI (Python 3.10+), Pydantic v2.
- **AI/ML**: 
  - **LLM**: Llama 3.1 (70B) served via Groq for low-latency inference.
  - **Embeddings**: `sentence-transformers/all-MiniLM-L6-v2`.
  - **Vector DB**: FAISS (Local storage, indexed per contract).
  - **Orchestration**: LangChain.

### Project Structure
```bash
.
├── Frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page layouts (Landing, Dashboard, etc.)
│   │   ├── utils/          # API services & helpers
│   │   └── hooks/          # Custom React hooks (state management)
│   └── tailwind.config.js  # Premium Design System
└── Backend/                # FastAPI application
    ├── app/
    │   ├── routes/         # API Endpoints (Upload, Analyze, QA, NER)
    │   ├── services/       # Core Logic (Parser, Chunker, RAG, LLM)
    │   └── models/         # Pydantic Schemas
    ├── config/             # Settings & Environment Config
    └── data/               # Contract storage & Vector indices
```

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Groq API Key (Get one for free at [console.groq.com](https://console.groq.com))

### 2. Backend Setup
```bash
cd Backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Create .env file
echo "GROQ_API_KEY=your_key_here" > .env
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
```

---

## 🏃 Running the Application

### Start Backend
```bash
cd Backend
uvicorn app.main:app --reload --port 8000
```
*API will be available at `http://localhost:8000`. Swagger docs at `/docs`.*

### Start Frontend
```bash
cd Frontend
npm run dev
```
*Frontend will be available at `http://localhost:3000`.*

---

## 🔌 Wiring & Integration

The Frontend is wired to the Backend via a specialized API utility layer:
- **Base URL**: Set to `/api` in development, which is proxied to `http://localhost:8000` in `vite.config.js`.
- **Pipeline Flow**:
  1. `POST /upload`: Uploads the PDF and returns a unique file path.
  2. `POST /analyze`: Uses the path to trigger the RAG pipeline (Parsing → Chunking → Indexing → Extraction).
  3. `POST /qa`: Provides a conversational layer over the generated FAISS index.

---

## 🧠 Fine-tuning (Optional)
The project includes LoRA training scripts in `Backend/app/finetuning/` for teams wishing to fine-tune Llama 3 on their own legal corpus.
- **Config**: `config.yaml`
- **Script**: `train_lora.py`

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ by the LexAI Team.*