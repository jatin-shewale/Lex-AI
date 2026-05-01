import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, Loader2, CheckCircle, AlertTriangle, ArrowRight, Zap, ShieldCheck, Search, Brain } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadContract, analyzeContract } from '../utils/api.js'
import { useContractStore } from '../hooks/useContractStore.js'

const PIPELINE_STEPS = [
  { label: 'PDF Upload', sub: 'Multi-strategy ingestion' },
  { label: 'Text Extraction', sub: 'Scanned doc OCR fallback' },
  { label: 'Semantic Chunking', sub: 'Legal-aware segmentation' },
  { label: 'Vector Indexing', sub: 'FAISS database sync' },
  { label: 'Clause Detection', sub: 'LLaMA 3.1 Reasoning' },
  { label: 'Risk Scoring', sub: 'Compliance audit' },
  { label: 'Finalizing Report', sub: 'Structuring JSON' },
]

export default function Analyze() {
  const navigate = useNavigate()
  const { setAnalysisResult, setContractId, setFilePath } = useContractStore()

  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | uploading | analyzing | done | error
  const [progress, setProgress] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  const onDrop = useCallback((accepted) => {
    if (accepted.length) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024,
    onDropRejected: () => toast.error('Only PDF files up to 100MB are accepted.'),
  })

  async function handleAnalyze() {
    if (!file) return

    setStatus('uploading')
    setProgress(5)
    setStepIdx(0)
    setErrorMsg('')

    let stepTimer = null

    try {
      // Simulate pipeline step progression
      let currentStep = 0
      stepTimer = setInterval(() => {
        currentStep = Math.min(currentStep + 1, PIPELINE_STEPS.length - 1)
        setStepIdx(currentStep)
        setProgress(Math.round((currentStep / PIPELINE_STEPS.length) * 85) + 10)
      }, 2500)

      // Upload
      const uploaded = await uploadContract(file, (pct) => setProgress(5 + pct * 0.1))
      setFilePath(uploaded.path)
      setStatus('analyzing')

      // Analyze
      const result = await analyzeContract(uploaded.path)
      clearInterval(stepTimer)
      setProgress(100)
      setStepIdx(PIPELINE_STEPS.length - 1)

      setAnalysisResult(result)
      setContractId(result.contract_id)
      setStatus('done')
      toast.success('Analysis complete!')

      setTimeout(() => navigate('/results'), 600)
    } catch (err) {
      clearInterval(stepTimer)
      const msg = err?.response?.data?.detail || err.message || 'Analysis failed.'
      setErrorMsg(msg)
      setStatus('error')
      toast.error(msg)
    }
  }

  const reset = () => { setFile(null); setStatus('idle'); setProgress(0); setErrorMsg('') }
  const isRunning = status === 'uploading' || status === 'analyzing'

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="section-container max-w-4xl">

        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-4 py-1.5 mb-6">
            <ShieldCheck size={14} className="text-primary-600" />
            <span className="text-[10px] font-bold text-primary-700 uppercase tracking-widest">Enterprise-Grade Security</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 font-display">
            Analyze your <span className="text-primary-600">Contract</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Upload your legal document to start the AI analysis pipeline. 
            We'll extract clauses, identify risks, and prepare a detailed report.
          </p>
        </motion.div>

        {/* Upload Area */}
        <AnimatePresence mode="wait">
          {!isRunning && status !== 'done' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              {...getRootProps()}
              className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer p-12 text-center
                ${isDragActive
                  ? 'border-primary-500 bg-primary-50 shadow-premium'
                  : file
                    ? 'border-primary-300 bg-primary-50/30'
                    : 'border-slate-200 hover:border-primary-400 bg-white hover:bg-slate-50 shadow-sm'
                }`}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center">
                <motion.div 
                  animate={isDragActive ? { y: [0, -10, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                    file ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {file ? <FileText size={36} /> : <Upload size={36} />}
                </motion.div>

                {file ? (
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-slate-900">{file.name}</div>
                    <div className="text-sm font-medium text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB · Ready to analyze</div>
                    <button
                      onClick={(e) => { e.stopPropagation(); reset() }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors mt-4 bg-rose-50 px-3 py-1.5 rounded-lg"
                    >
                      <X size={14} /> Remove File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-slate-900">
                      {isDragActive ? 'Drop it here!' : 'Drop your contract here'}
                    </div>
                    <p className="text-slate-500">or click to browse your files</p>
                    <div className="flex items-center gap-4 justify-center mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span>PDF up to 100MB</span>
                      <div className="w-1 h-1 rounded-full bg-slate-200" />
                      <span>Private & Secure</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : isRunning ? (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900">Analyzing Contract</div>
                    <div className="text-sm text-slate-400 font-medium">This typically takes 60-90 seconds</div>
                  </div>
                </div>
                <div className="text-2xl font-black text-primary-600 font-mono">{progress}%</div>
              </div>

              <div className="progress-bg mb-12">
                <motion.div 
                  className="progress-fill" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PIPELINE_STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 border ${
                      i < stepIdx 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                        : i === stepIdx 
                          ? 'bg-primary-50 border-primary-100 text-primary-700 shadow-sm ring-2 ring-primary-500/10' 
                          : 'bg-white border-slate-100 text-slate-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                      i < stepIdx ? 'bg-emerald-200 text-emerald-800' : i === stepIdx ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {i < stepIdx ? <CheckCircle size={16} /> : i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{step.label}</div>
                      <div className={`text-[10px] font-medium uppercase tracking-wider ${i === stepIdx ? 'text-primary-500' : 'opacity-60'}`}>
                        {step.sub}
                      </div>
                    </div>
                    {i === stepIdx && <Loader2 size={14} className="ml-auto animate-spin" />}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Error State */}
        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-3xl bg-rose-50 border border-rose-100 flex items-start gap-4 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-rose-900">Analysis Failed</div>
              <p className="text-rose-700/70 text-sm mt-1">{errorMsg}</p>
              <button onClick={reset} className="mt-4 px-5 py-2 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-all shadow-sm">
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        {!isRunning && status !== 'done' && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={!file}
            className={`w-full mt-10 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-premium ${
              file
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <Zap size={22} className={file ? 'text-primary-300' : ''} />
            Start AI Analysis
            <ArrowRight size={20} />
          </motion.button>
        )}

        {/* Value Props */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { title: '84% Faster', desc: 'Reduce legal review time significantly.', icon: Zap },
            { title: 'Fine-tuned AI', desc: 'Models specialized in legal linguistics.', icon: Brain },
            { title: 'Safe & Private', desc: 'Your data is encrypted and never sold.', icon: ShieldCheck },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mx-auto mb-4 text-primary-600 group-hover:scale-110 transition-transform">
                <item.icon size={20} />
              </div>
              <div className="font-bold text-slate-900 text-sm mb-1">{item.title}</div>
              <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
