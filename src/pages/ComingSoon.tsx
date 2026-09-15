import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { GrainOverlay } from '../components/GrainOverlay'
import { GlobalCanvasBackground } from '../components/ui/GlobalCanvasBackground'

/**
 * Placeholder page for product links with locked v3.0 tokens.
 */
export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-6 text-center text-[var(--text-primary)] relative transition-colors duration-300">
      <GrainOverlay />
      <GlobalCanvasBackground />
      <Navbar />

      <div className="flex flex-col items-center gap-8 max-w-lg mx-auto pt-16">
        <div className="glass-pill">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
          <span>Product Sandbox · Restricted Access</span>
        </div>

        {/* Solid Single-Color Heading (Strict Zero Gradients) */}
        <h1 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-[var(--text-primary)]">
          Runtime deploying to production.
        </h1>

        <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed">
          This system is undergoing latency validation and cluster stress-testing. Verified access keys unlock shortly.
        </p>

        <div className="w-24 h-px bg-[var(--border-base)]" />

        <Link
          to="/"
          className="btn-primary py-2.5 px-5 text-xs font-mono font-semibold"
        >
          ← Return to Studio
        </Link>
      </div>
    </div>
  )
}
