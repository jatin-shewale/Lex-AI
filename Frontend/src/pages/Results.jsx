import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, FileText, Tag, AlertTriangle, CheckCircle,
  ChevronDown, ChevronUp, MessageSquare, BarChart3,
  Clock, FileSearch, ArrowRight, Download, Share2, Printer
} from 'lucide-react'
import { useContractStore } from '../hooks/useContractStore.js'

// ── Risk Level Badge ────────────────────────────────────────────────────────
function RiskBadge({ level }) {
  const cfg = {
    LOW:      { cls: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle,    label: 'Low Risk' },
    MEDIUM:   { cls: 'bg-amber-50 text-amber-700 border-amber-100',    icon: AlertTriangle,  label: 'Medium Risk' },
    HIGH:     { cls: 'bg-orange-50 text-orange-700 border-orange-100',  icon: AlertTriangle,  label: 'High Risk' },
    CRITICAL: { cls: 'bg-rose-50 text-rose-700 border-rose-100',      icon: AlertTriangle,  label: 'Critical Risk' },
  }
  const { cls, icon: Icon, label } = cfg[level?.toUpperCase()] || cfg.MEDIUM
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider ${cls} shadow-sm`}>
      <Icon size={14} />
      {label}
    </span>
  )
}

// ── Clause Card ─────────────────────────────────────────────────────────────
function ClauseCard({ title, content, i }) {
  const [open, setOpen] = useState(false)
  if (!content) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + i * 0.05 }}
      className={`card border transition-all duration-300 overflow-hidden ${
        open ? 'ring-2 ring-primary-500/10 border-primary-200' : 'hover:border-slate-300'
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors bg-white hover:bg-slate-50/50"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            open ? 'bg-primary-600 text-white shadow-premium' : 'bg-slate-100 text-slate-500'
          }`}>
            <Tag size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 capitalize tracking-tight">
              {title.replace(/_/g, ' ')}
            </h3>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Legal Section · Extracted via AI
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          className="text-slate-400"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/30">
              <div className="relative mt-4">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary-200 rounded-full" />
                <p className="pl-6 text-slate-600 text-sm leading-relaxed font-body whitespace-pre-wrap italic">
                  "{typeof content === 'string' ? content : JSON.stringify(content, null, 2)}"
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button className="text-[10px] font-bold text-slate-400 uppercase hover:text-primary-600 transition-colors">Copy Section</button>
                <div className="w-px h-3 bg-slate-200" />
                <button className="text-[10px] font-bold text-slate-400 uppercase hover:text-primary-600 transition-colors">Add to Report</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Main Results ────────────────────────────────────────────────────────────
export default function Results() {
  const navigate = useNavigate()
  const { analysisResult, contractId, reset } = useContractStore()

  // Demo data when no real result
  const result = analysisResult || {
    contract_id: 'demo_contract_NDA_2024',
    pages: 47,
    word_count: 18432,
    processing_time_seconds: 112.4,
    risk: {
      risk_level: 'HIGH',
      score: 0.71,
      issues: [
        'Unlimited liability clause detected in Section 8.2',
        'Auto-renewal without notice period — potential lock-in',
        'IP ownership ambiguity: work-for-hire language is unclear',
        'Governing law is Delaware but party is UK-based',
      ],
      recommendations: [
        'Negotiate a liability cap at 12 months of fees paid',
        'Add 30-day written notice requirement before auto-renewal',
        'Clarify IP ownership in Section 12 with specific assignments',
        'Add governing law rider appropriate to both jurisdictions',
      ],
    },
    clauses: {
      termination: 'Either party may terminate this Agreement upon 30 days written notice. Termination for cause is immediate upon written notification of material breach...',
      liability: 'IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES...',
      confidentiality: 'Each party agrees to maintain strict confidentiality of the other party\'s Confidential Information for a period of 5 years from disclosure...',
      payment_terms: 'Invoices are due net-30. Late payments accrue interest at 1.5% per month. Annual auto-renewal at prevailing rates unless cancelled in writing...',
      indemnity: 'Customer shall indemnify, defend and hold harmless Provider from any claims arising from Customer\'s use of the Service...',
      governing_law: 'This Agreement shall be governed by the laws of the State of Delaware, without regard to conflict of law provisions...',
      dispute_resolution: 'Any dispute shall first be subject to good-faith negotiation. Unresolved disputes shall be submitted to binding arbitration under AAA rules...',
    },
  }

  const risk = result.risk || {}
  const clauses = result.clauses || {}

  return (
    <div className="pt-28 pb-20 bg-slate-50/50 min-h-screen">
      <div className="section-container">

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Link to="/dashboard" className="text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest">Dashboard</Link>
              <ArrowRight size={10} className="text-slate-300" />
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Analysis Results</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 font-display">Contract Report</h1>
            <div className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-tighter">ID: {result.contract_id}</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <button className="p-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <Download size={20} />
            </button>
            <button className="p-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <Printer size={20} />
            </button>
            <button onClick={() => { reset(); navigate('/analyze') }} className="btn-primary shadow-premium flex items-center gap-2">
              <FileText size={18} />
              New Analysis
            </button>
          </motion.div>
        </div>

        {/* Meta Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { icon: FileText, label: 'Total Pages', value: result.pages, color: 'text-primary-600', bg: 'bg-primary-50' },
            { icon: FileSearch, label: 'Word Count', value: result.word_count?.toLocaleString(), color: 'text-secondary-600', bg: 'bg-secondary-50' },
            { icon: Clock, label: 'AI Latency', value: `${result.processing_time_seconds}s`, color: 'text-amber-600', bg: 'bg-amber-50' },
            { icon: BarChart3, label: 'Clauses Extracted', value: Object.values(clauses).filter(Boolean).length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 flex flex-col items-center text-center group hover:bg-slate-50/50"
            >
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <stat.icon size={24} />
              </div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Risk Intelligence (5/12) */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 bg-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-extrabold text-slate-900 font-display flex items-center gap-3">
                    <Shield size={24} className="text-primary-600" />
                    Risk Assessment
                  </h2>
                  <RiskBadge level={risk.risk_level} />
                </div>

                <div className="mb-10">
                  <div className="flex items-end justify-between mb-3">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Aggregate Risk Score</div>
                    <div className="text-4xl font-black text-slate-900">{Math.round(risk.score * 100)}<span className="text-xl text-slate-300">/100</span></div>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${risk.score * 100}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        risk.score > 0.7 ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 
                        risk.score > 0.4 ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 
                        'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Issues */}
                  <div>
                    <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <AlertTriangle size={14} /> Key Vulnerabilities
                    </h3>
                    <div className="space-y-3">
                      {risk.issues?.map((issue, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex gap-3 p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-sm font-medium text-rose-900/80 leading-relaxed"
                        >
                          <span className="text-rose-400 font-mono text-xs mt-0.5">{i+1}.</span>
                          {issue}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <CheckCircle size={14} /> Remediation Steps
                    </h3>
                    <div className="space-y-3">
                      {risk.recommendations?.map((rec, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                          className="flex gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-sm font-medium text-emerald-900/80 leading-relaxed"
                        >
                          <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Clause Intelligence (7/12) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-slate-900 font-display flex items-center gap-3">
                <FileSearch size={24} className="text-primary-600" />
                Extracted Intelligence
              </h2>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Activity size={12} /> LLaMA 3.1 LoRA
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(clauses).map(([key, val], i) => (
                <ClauseCard key={key} title={key} content={val} i={i} />
              ))}
              {Object.values(clauses).every(v => !v) && (
                <div className="card p-12 text-center text-slate-400 font-medium italic">
                  No distinct clauses were automatically extracted from this document.
                </div>
              )}
            </div>

            {/* Q&A CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="card p-8 bg-slate-900 text-white relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 text-primary-500 opacity-20 group-hover:scale-110 transition-transform duration-500">
                <MessageSquare size={120} />
              </div>
              <div className="relative z-10 max-w-lg">
                <h3 className="text-2xl font-extrabold mb-3 font-display">Deep Analysis Chat</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  Have specific questions about this contract? Our RAG-powered chatbot can search 
                  the entire document and provide answers with source citations.
                </p>
                <Link to="/qa" className="btn-primary inline-flex items-center gap-2 px-8 py-3 shadow-xl">
                  Start Chat Session
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
