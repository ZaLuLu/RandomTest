import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../../../utils/themeContext'
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react'

interface MobileNavbarProps {
  onScrollTo?: (id: string) => void
}

const MOBILE_NAV_LINKS = [
  { label: 'Home', num: '00', id: 'home', pagePath: '/' },
  { label: 'Products', num: '01', id: 'products', pagePath: '/products' },
  { label: 'Services', num: '02', id: 'services', pagePath: '/services' },
  { label: 'Academics', num: '03', id: 'academics', pagePath: '/academics' },
  { label: 'Workflow', num: '04', id: 'why-us', pagePath: '/#why-us' },
  { label: 'Direct Contact', num: '05', id: 'contact', pagePath: '/#contact' },
]

export function MobileNavbar({ onScrollTo }: MobileNavbarProps) {
  const { themeMode, toggleThemeMode } = useTheme()
  const isDark = themeMode === 'dark'
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  const handleLinkClick = (link: typeof MOBILE_NAV_LINKS[0]) => {
    setMenuOpen(false)
    if (link.id === 'home') {
      if (isHome) {
        if (onScrollTo) onScrollTo('home')
        else window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate('/')
      }
      return
    }
    if (isHome) {
      if (link.pagePath.startsWith('/#')) {
        if (onScrollTo) {
          onScrollTo(link.id)
        } else {
          const el = document.getElementById(link.id)
          el?.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        navigate(link.pagePath)
      }
    } else {
      if (link.pagePath.startsWith('/#')) {
        navigate('/', { state: { scrollTo: link.id } })
      } else {
        navigate(link.pagePath)
      }
    }
  }

  const handleBrandClick = () => {
    setMenuOpen(false)
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  return (
    <>
      {/* ── ULTRA-SLIM DYNAMIC CAPSULE NAVBAR ── */}
      <header className="fixed top-2.5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          className="pointer-events-auto w-full max-w-[360px] h-9 px-3 rounded-full bg-[var(--bg-surface-elevated)]/90 backdrop-blur-xl border border-[var(--border-base)] shadow-[0_4px_20px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-between transition-all duration-300"
          aria-label="Mobile navigation"
        >
          {/* Brand Logo with Glowing Jewel Dot */}
          <Link
            to="/"
            onClick={handleBrandClick}
            className="flex items-center gap-1.5 group cursor-pointer text-left select-none pl-0.5"
            aria-label="Nayak Labs home"
          >
            <span className="font-display font-black text-[var(--text-primary)] text-[13.5px] tracking-tight transition-opacity duration-200 group-hover:opacity-85">
              Nayak Labs
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] inline-block shadow-[0_0_8px_var(--accent-primary)]" />
          </Link>

          {/* Compact Right Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggleThemeMode()}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full transition-colors cursor-pointer active:scale-90"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme mode"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-[var(--text-primary)] rounded-full hover:bg-[var(--text-primary)]/5 active:scale-90 transition-transform cursor-pointer"
              aria-label="Toggle mobile menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer-menu"
            >
              {menuOpen ? <X className="w-3.5 h-3.5 text-[var(--accent-primary)]" /> : <Menu className="w-3.5 h-3.5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Fullscreen Mobile Drawer Menu */}
      {menuOpen && (
        <div
          id="mobile-drawer-menu"
          className="fixed inset-0 z-40 bg-[var(--bg-base)]/98 backdrop-blur-2xl flex flex-col justify-between pt-16 pb-8 px-5 overflow-y-auto animate-in fade-in duration-200"
          aria-modal="true"
          role="dialog"
          aria-label="Mobile Navigation Menu"
        >
          <div className="space-y-2.5 pt-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-primary)] font-bold mb-2">
              Navigation Index
            </div>

            {MOBILE_NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link)}
                className="w-full p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-base)] flex items-center justify-between text-left active:scale-98 transition-transform shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[var(--accent-primary)] font-bold">
                    {link.num}
                  </span>
                  <span className="font-display font-bold text-sm text-[var(--text-primary)]">
                    {link.label}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[var(--border-base)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
            <span>NayakLabs Studio</span>
            <span className="text-[var(--accent-primary)] font-semibold">0 Middlemen</span>
          </div>
        </div>
      )}
    </>
  )
}
