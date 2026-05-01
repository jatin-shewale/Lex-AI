import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Analyze from './pages/Analyze.jsx'
import Results from './pages/Results.jsx'
import QA from './pages/QA.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-primary-100 selection:text-primary-900">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-mesh-gradient opacity-60" />
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"         element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyze"  element={<Analyze />} />
            <Route path="/results"  element={<Results />} />
            <Route path="/qa"       element={<QA />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  )
}
