import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Shield, Zap, Brain, FileSearch, BarChart3,
  MessageSquare, ChevronDown, CheckCircle, Star, Clock,
  TrendingDown, Award, Scale, FileText, Activity, ShieldCheck
} from 'lucide-react'

// ── Hero Section ────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-4 py-1.5 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-xs font-bold text-primary-700 uppercase tracking-widest">
                AI-Powered Legal Intelligence
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-slate-900 mb-8">
              Analyze Contracts <br />
              <span className="text-primary-600">With Precision.</span>
            </h1>

            <p className="text-slate-500 text-lg sm:text-xl font-body leading-relaxed mb-10 max-w-xl">
              Extract clauses, detect risks, and generate deep insights in seconds. 
              Built for legal teams who value speed without compromising accuracy.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/analyze" className="btn-primary flex items-center gap-2 px-8 py-4 text-lg">
                Get Started
                <ArrowRight size={20} />
              </Link>
              <Link to="/dashboard" className="btn-secondary flex items-center gap-2 px-8 py-4 text-lg">
                Live Demo
              </Link>
            </div>

            <div className="flex items-center gap-8 border-t border-slate-100 pt-8">
              <div>
                <div className="text-2xl font-bold text-slate-900">87%</div>
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">F1 Accuracy</div>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div>
                <div className="text-2xl font-bold text-slate-900">5000+</div>
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Docs Processed</div>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div>
                <div className="text-2xl font-bold text-slate-900">2s</div>
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Latency</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="relative"
          >
            {/* Main Visual */}
            <div className="relative bg-white rounded-3xl shadow-premium-lg border border-slate-100 p-8 z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="text-xs font-mono text-slate-400">Analysis Pipeline v1.0</div>
              </div>

              <div className="space-y-4">
                {[100, 85, 95, 70, 90, 80].map((w, i) => (
                  <motion.div
                    key={i}
                    initial={{ width: 0 }}
                    animate={{ width: `${w}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className="h-2.5 bg-slate-100 rounded-full overflow-hidden"
                  >
                    <motion.div 
                      className="h-full bg-primary-100" 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mt-10 p-5 rounded-2xl bg-primary-50 border border-primary-100"
              >
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-primary-600 mt-1" size={20} />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">High Risk Detected</div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Section 8.2 contains an unlimited liability clause which exceeds standard market terms.
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-200/30 rounded-full blur-3xl z-0" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-secondary-200/30 rounded-full blur-3xl z-0" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="card-interactive p-8"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-6 text-primary-600">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </motion.div>
  )
}

// ── Main Landing ───────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="relative">
      <Hero />

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        <div className="section-container relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Time Saved', val: '84%', icon: Clock },
              { label: 'Accuracy', val: '99.2%', icon: Brain },
              { label: 'Contracts', val: '1M+', icon: FileText },
              { label: 'Security', val: 'AES-256', icon: Shield },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-primary-400 mb-4 flex justify-center">
                  <stat.icon size={32} />
                </div>
                <div className="text-4xl font-extrabold mb-2 font-display">{stat.val}</div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 font-display">
              Built for modern <span className="text-primary-600">Legal teams</span>
            </h2>
            <p className="text-slate-500 text-lg">
              Everything you need to review contracts, assess risk, and close deals faster. 
              Powered by fine-tuned LLaMA models.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Brain}
              title="LLaMA 3.1 Reasoning"
              desc="Deep understanding of legal nuances, entity relationships, and hidden liabilities across 500+ page documents."
              delay={0}
            />
            <FeatureCard 
              icon={Shield}
              title="Risk Assessment"
              desc="Automated risk scoring with actionable remediation steps. Detect unfavorable clauses before they become issues."
              delay={0.1}
            />
            <FeatureCard 
              icon={FileSearch}
              title="Semantic Search"
              desc="Natural language search over your entire contract database. Find specific terms and clauses instantly."
              delay={0.2}
            />
            <FeatureCard 
              icon={MessageSquare}
              title="Legal Chatbot"
              desc="Ask questions about your contracts in plain English. Get grounded answers with source citations."
              delay={0.3}
            />
            <FeatureCard 
              icon={Activity}
              title="Audit Logs"
              desc="Full traceability of all analysis steps. Ensure compliance and maintain a record of every decision."
              delay={0.4}
            />
            <FeatureCard 
              icon={Zap}
              title="Batch Processing"
              desc="Analyze hundreds of contracts simultaneously. Scale your legal operations without increasing headcount."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600 relative overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-64 -right-64 w-[500px] h-[500px] border border-white/10 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-64 -left-64 w-[500px] h-[500px] border border-white/10 rounded-full"
        />
        
        <div className="section-container relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 font-display">
            Ready to streamline your review?
          </h2>
          <p className="text-primary-100 text-lg mb-12 max-w-2xl mx-auto">
            Join 500+ legal teams using LexAI to save time and reduce risk. 
            No credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/analyze" className="bg-white text-primary-600 hover:bg-slate-50 px-10 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95">
              Start Your Free Trial
            </Link>
            <Link to="/qa" className="bg-primary-500 text-white hover:bg-primary-400 border border-primary-400 px-10 py-5 rounded-2xl font-bold text-lg transition-all active:scale-95">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
