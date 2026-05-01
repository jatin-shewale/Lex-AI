import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 300_000,  // 5 min for large contracts
})

// ── Upload ─────────────────────────────────────────────────────────────────
export async function uploadContract(file, onProgress) {
  const form = new FormData()
  form.append('file', file)
  const res = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100))
    },
  })
  return res.data
}

// ── Analyze ────────────────────────────────────────────────────────────────
export async function analyzeContract(path) {
  const res = await api.post('/analyze', { path })
  return res.data
}

// ── Q&A ────────────────────────────────────────────────────────────────────
export async function askQuestion(question, contractId) {
  const res = await api.post('/qa', { question, contract_id: contractId })
  return res.data
}

// ── NER ────────────────────────────────────────────────────────────────────
export async function extractEntities(text) {
  const res = await api.post('/ner', { text })
  return res.data
}

// ── Health ─────────────────────────────────────────────────────────────────
export async function checkHealth() {
  const res = await api.get('/health')
  return res.data
}

export default api
