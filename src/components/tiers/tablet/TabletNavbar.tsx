import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sun, Moon, ArrowRight } from 'lucide-react'
import { useTheme } from '../../../utils/themeContext'
import { ambientAudio } from '../../../utils/audioEngine'

interface TabletNavbarProps {
  onScrollTo?: (id: string) => void
}

export function TabletNavbar({ onScrollTo }: TabletNavbarProps) {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavClick = (sectionId: string, route?: string) => {
    ambientAudio.playTick()
    if (sectionId === 'home') {
      if (location.pathname === '/') {
        if (onScrollTo) onScrollTo('home')
        else window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate('/')
      }
      return
    }
    if (route && location.pathname !== route) {
      navigate(route)
      return
    }
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } })
    } else if (onScrollTo) {
      onScrollTo(sectionId)
    } else {
      const el = document.getElementById(sectionId)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-3 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Tablet Navigation"
        className="pointer-events-auto h-12 max-w-[720px] w-full px-4 rounded-full bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-base)] shadow-lg shadow-black/10 flex items-center justify-between transition-all duration-300 select-none"
      >
        {/* Brand Jewel */}
        <Link
          to="/"
          onClick={() => ambientAudio.playTick()}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <span className="font-display font-black text-sm text-[var(--text-primary)] tracking-tight">
            Nayak Labs
          </span>
          <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)] animate-pulse" />
        </Link>

        {/* Center Navigation Links */}
        <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-[var(--text-secondary)]">
          <button
            type="button"
            onClick={() => handleNavClick('home', '/')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              location.pathname === '/' ? 'text-[var(--text-primary)] font-bold bg-[var(--bg-surface)]' : 'hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('products', '/products')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              location.pathname === '/products' ? 'text-[var(--text-primary)] font-bold bg-[var(--bg-surface)]' : 'hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
            }`}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('services', '/services')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              location.pathname === '/services' ? 'text-[var(--text-primary)] font-bold bg-[var(--bg-surface)]' : 'hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
            }`}
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('academics', '/academics')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              location.pathname === '/academics' ? 'text-[var(--text-primary)] font-bold bg-[var(--bg-surface)]' : 'hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
            }`}
          >
            Academics
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('why-us')}
            className="px-2.5 py-1 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
          >
            Workflow
          </button>
        </div>

        {/* Right Actions: Theme Toggle + 3D Connect Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              ambientAudio.playTick()
              toggleTheme()
            }}
            className="p-1.5 rounded-full border border-[var(--border-base)] text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className="py-1.5 px-3.5 rounded-full font-mono text-[11px] font-bold text-white bg-gradient-to-b from-indigo-500 to-indigo-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_8px_rgba(79,70,229,0.35)] active:translate-y-0.5 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Connect</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </nav>
    </header>
  )
}
