import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3, TrendingUp, Shield, FileText, Clock,
  AlertTriangle, CheckCircle, ArrowRight, Zap,
  Upload, MessageSquare, Activity, ChevronRight, Search, Filter
} from 'lucide-react'

// ── Demo data ──────────────────────────────────────────────────────────────
const RECENT_CONTRACTS = [
  { id: 'nda_techcorp_2024', name: 'TechCorp NDA 2024', pages: 12, risk: 'LOW', score: 0.18, date: '2025-04-29', clauses: 7 },
  { id: 'saas_agreement_acme', name: 'SaaS Agreement - Acme Inc', pages: 47, risk: 'HIGH', score: 0.71, date: '2025-04-28', clauses: 7 },
  { id: 'employment_v3', name: 'Employment Contract v3', pages: 23, risk: 'MEDIUM', score: 0.42, date: '2025-04-26', clauses: 5 },
  { id: 'vendor_agreement', name: 'Vendor Agreement Q2', pages: 89, risk: 'CRITICAL', score: 0.88, date: '2025-04-24', clauses: 6 },
  { id: 'partnership_deed', name: 'Partnership Deed', pages: 34, risk: 'MEDIUM', score: 0.38, date: '2025-04-22', clauses: 7 },
]

const RISK_DIST = [
  { label: 'LOW', count: 8, color: 'bg-emerald-500', pct: 35 },
  { label: 'MEDIUM', count: 9, color: 'bg-amber-500', pct: 39 },
  { label: 'HIGH', count: 4, color: 'bg-orange-500', pct: 17 },
  { label: 'CRITICAL', count: 2, color: 'bg-rose-500', pct: 9 },
]

// ── Components ─────────────────────────────────────────────────────────────
function MetricCard({ icon: Icon, title, value, sub, trend, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary-600 border border-slate-100">
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
            trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            <TrendingUp size={12} className={trend.startsWith('+') ? '' : 'rotate-180'} />
            {trend}
          </div>
        )}
      </div>
      <div className="text-3xl font-extrabold text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-500">{title}</div>
      {sub && <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
        <Clock size={10} /> {sub}
      </div>}
    </motion.div>
  )
}

function RiskChip({ level }) {
  const styles = {
    LOW:      'bg-emerald-50 text-emerald-700 border-emerald-100',
    MEDIUM:   'bg-amber-50 text-amber-700 border-amber-100',
    HIGH:     'bg-orange-50 text-orange-700 border-orange-100',
    CRITICAL: 'bg-rose-50 text-rose-700 border-rose-100',
  }
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${styles[level]}`}>
      {level}
    </span>
  )
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = RECENT_CONTRACTS.filter(c => {
    const matchTab = activeTab === 'all' || c.risk === activeTab
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="pt-28 pb-20">
      <div className="section-container">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Workspace Overview</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 font-display">Dashboard</h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link to="/analyze" className="btn-primary flex items-center gap-2 shadow-premium">
              <Upload size={18} />
              New Analysis
            </Link>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <MetricCard icon={FileText} title="Total Contracts" value="128" sub="Synced with Google Drive" trend="+12%" delay={0} />
          <MetricCard icon={Shield} title="Risk Flagged" value="24" sub="Needs manual review" trend="-5%" delay={0.1} />
          <MetricCard icon={Activity} title="Avg Accuracy" value="99.4%" sub="Model: LLaMA 3.1" delay={0.2} />
          <MetricCard icon={TrendingUp} title="Efficiency" value="84%" sub="Time saved vs manual" trend="+8%" delay={0.3} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Table Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <FileText size={18} className="text-primary-600" />
                  Recent Contracts
                </h2>
                
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200">
                  <div className="flex px-2 text-slate-400">
                    <Search size={16} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search docs..." 
                    className="bg-transparent border-none outline-none text-sm w-full sm:w-40 py-1"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-6 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {['all', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      activeTab === tab 
                        ? 'bg-primary-600 text-white shadow-premium' 
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {tab === 'all' ? 'All Contracts' : tab}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                    <tr>
                      <th className="px-6 py-4 text-left">Document</th>
                      <th className="px-6 py-4 text-left">Risk Status</th>
                      <th className="px-6 py-4 text-left">Clauses</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence mode='popLayout'>
                      {filtered.map((contract, i) => (
                        <motion.tr
                          key={contract.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          layout
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                <FileText size={20} />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900">{contract.name}</div>
                                <div className="text-xs text-slate-400 font-medium">{contract.pages} pages · {contract.date}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <RiskChip level={contract.risk} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-slate-700">{contract.clauses}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link to="/results" className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all">
                              <ChevronRight size={18} />
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="py-20 text-center text-slate-400 font-medium italic">
                    No matching contracts found.
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Distribution Card */}
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 size={18} className="text-primary-600" />
                Risk Distribution
              </h2>
              <div className="space-y-5">
                {RISK_DIST.map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500">{item.label}</span>
                      <span className="text-xs font-bold text-slate-900">{item.pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pct}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Zap size={18} className="text-primary-600" />
                Quick Intelligence
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Q&A Assistant', icon: MessageSquare, color: 'text-secondary-600', bg: 'bg-secondary-50', to: '/qa' },
                  { label: 'Bulk Export', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', to: '/dashboard' },
                  { label: 'Model Insights', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', to: '/dashboard' },
                ].map((item, i) => (
                  <Link 
                    key={i} 
                    to={item.to}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <item.icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                    <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-primary-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
