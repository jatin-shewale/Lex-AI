import React from 'react'
import { Link } from 'react-router-dom'
import { Scale, Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary-50/50 rounded-full blur-[120px] -z-0" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-premium">
                <Scale size={20} className="text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-slate-900">
                Lex<span className="text-primary-600">AI</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Next-generation contract analysis powered by fine-tuned LLaMA models. 
              Making legal intelligence accessible to everyone.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <motion.a 
                  key={i} 
                  href="#" 
                  whileHover={{ y: -3 }}
                  className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-200 transition-colors"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Groups */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-[11px] tracking-widest">Platform</h4>
            <ul className="space-y-4">
              {['Dashboard', 'Analysis', 'Q&A Assistant', 'Pricing'].map(link => (
                <li key={link}>
                  <Link to="#" className="text-slate-500 hover:text-primary-600 text-sm font-medium transition-colors flex items-center gap-2 group">
                    {link}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-[11px] tracking-widest">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Documentation', 'Privacy Policy', 'Terms of Service'].map(link => (
                <li key={link}>
                  <Link to="#" className="text-slate-500 hover:text-primary-600 text-sm font-medium transition-colors flex items-center gap-2 group">
                    {link}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-[11px] tracking-widest">Newsletter</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Subscribe for the latest legal tech updates and AI research.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <button className="bg-primary-600 text-white px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors shadow-premium">
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
            © {currentYear} LEXAI INTELLIGENCE SYSTEMS INC.
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={12} className="text-slate-300" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">support@lexai.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
