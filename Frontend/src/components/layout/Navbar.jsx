import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Scale, Menu, X, Zap, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/analyze', label: 'Analyze' },
  { to: '/qa', label: 'Q&A' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-glass'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="section-container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group relative z-50">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-premium transition-colors"
          >
            <Scale size={20} className="text-white" />
          </motion.div>
          <span className="font-display font-bold text-xl tracking-tight flex items-center">
            <span className="text-slate-900">Lex</span>
            <span className="text-primary-600">AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`relative px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                pathname === to
                  ? 'text-primary-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {pathname === to && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/50"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 badge-primary px-3 py-1.5">
            <Zap size={12} className="fill-primary-500 text-primary-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider">LLaMA 3.1</span>
          </div>
          <Link to="/analyze" className="btn-primary flex items-center gap-2 text-sm px-6 py-2.5 shadow-premium">
            Analyze
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="md:hidden p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-600 relative z-50"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 bg-white border-b border-slate-200 shadow-premium-lg pt-24 pb-8 px-4 md:hidden"
          >
            <div className="space-y-2">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center justify-between px-5 py-4 rounded-2xl text-base font-semibold transition-all ${
                    pathname === to
                      ? 'bg-primary-50 text-primary-600 border border-primary-100'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {label}
                  {pathname === to && <ChevronRight size={18} />}
                </Link>
              ))}
              <div className="pt-4">
                <Link to="/analyze" className="btn-primary w-full text-center flex items-center justify-center gap-2 py-4">
                  Get Started
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
