import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, MessageSquare, User, Bot, FileText, Sparkles, ChevronLeft, ArrowRight, CornerDownRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { askQuestion } from '../utils/api.js'
import { useContractStore } from '../hooks/useContractStore.js'

const SAMPLE_QUESTIONS = [
  'What are the termination conditions?',
  'Is there any unlimited liability clause?',
  'What are the payment terms?',
  'Who owns the IP?',
]

function Message({ msg, i }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border ${
        isUser ? 'bg-primary-600 border-primary-500 text-white' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>

      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-3xl px-6 py-4 text-sm font-medium leading-relaxed shadow-premium ${
          isUser 
            ? 'bg-primary-600 text-white rounded-tr-none' 
            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
        }`}>
          {msg.content}
        </div>

        {/* Sources with animation */}
        {!isUser && msg.sources?.length > 0 && (
          <div className="mt-2 space-y-2 w-full">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              <CornerDownRight size={12} /> Source Attribution
            </div>
            {msg.sources.slice(0, 2).map((src, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] text-slate-500 italic leading-relaxed"
              >
                "{src}"
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter px-1 mt-1">
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  )
}

export default function QA() {
  const { contractId } = useContractStore()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: contractId
        ? `Hello! I've fully indexed "${contractId}". You can ask me specific questions about clauses, obligations, or risks within this document.`
        : 'Welcome! No contract is currently loaded. I can answer general questions, but for specific analysis, please upload a contract first.',
      timestamp: Date.now(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text) {
    const question = text || input.trim()
    if (!question || loading) return
    setInput('')

    const userMsg = { role: 'user', content: question, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await askQuestion(question, contractId || 'demo')
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.answer,
          sources: res.sources,
          timestamp: Date.now(),
        },
      ])
    } catch (err) {
      const errMsg = err?.response?.data?.detail || 'System is currently busy. Please ensure the backend server is active.'
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `⚠️ ${errMsg}`, timestamp: Date.now() },
      ])
      toast.error('Connection Failed')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="pt-28 pb-10 min-h-screen flex flex-col bg-slate-50/30">
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 sm:px-6">

        {/* Chat Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Link to="/results" className="text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest flex items-center gap-1">
                <ChevronLeft size={14} /> Back to Analysis
              </Link>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 font-display flex items-center gap-3">
              <Sparkles size={32} className="text-primary-600" />
              Contract <span className="text-primary-600">Q&A</span>
            </h1>
          </motion.div>

          {contractId && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                <FileText size={16} />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Active Document</div>
                <div className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{contractId}</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-[2.5rem] shadow-premium overflow-hidden flex flex-col">
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 no-scrollbar">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => <Message key={i} msg={msg} i={i} />)}
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center shadow-sm">
                      <Bot size={20} />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-3xl rounded-tl-none px-6 py-4 flex items-center gap-3 shadow-premium">
                      <Loader2 size={16} className="text-primary-500 animate-spin" />
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Analyzing Document...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input & Suggestions */}
            <div className="p-6 sm:p-10 bg-white border-t border-slate-100">
              
              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 mb-6">
                {SAMPLE_QUESTIONS.map((q) => (
                  <motion.button
                    key={q}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                    className="text-[11px] font-bold uppercase tracking-wider bg-slate-50 border border-slate-200 text-slate-500
                               hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 rounded-xl px-4 py-2
                               transition-all disabled:opacity-50 shadow-sm"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>

              {/* Text Input */}
              <div className="relative flex items-center gap-4">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask a question about the contract obligations..."
                    disabled={loading}
                    className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-6 py-5 text-sm font-medium
                               focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500
                               transition-all resize-none shadow-inner-white pr-16"
                    style={{ height: 'auto' }}
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <kbd className="hidden sm:inline-flex items-center gap-1 h-5 select-none rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400">
                      <span>↵</span>
                    </kbd>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all shadow-premium ${
                    input.trim() && !loading
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-6 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
          End-to-End Encrypted Session · LLaMA 3.1 70B
        </div>
      </div>
    </div>
  )
}
