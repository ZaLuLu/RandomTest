import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../utils/themeContext'
import { ArrowUp, Sun, Moon } from 'lucide-react'

interface FooterProps {
  onScrollTo?: (id: string) => void
  onReplayIntro?: () => void
}

export function Footer({ onScrollTo, onReplayIntro }: FooterProps) {
  const { themeMode, toggleThemeMode } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const handleScroll = (id: string) => {
    if (location.pathname === '/') {
      if (onScrollTo) {
        onScrollTo(id)
      } else {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
  }

  return (
    <footer
      className="relative z-10 bg-[var(--bg-base)] border-t border-[var(--border-base)] transition-colors duration-300"
      aria-label="Site footer"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-10 py-16">
        {/* Top footer row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-12 border-b border-[var(--border-base)] font-body text-xs">
          <div>
            <p className="font-bold text-[var(--text-primary)] mb-3">
              What We Do
            </p>
            <ul className="flex flex-col gap-2.5 text-[var(--text-secondary)] font-body text-xs">
              <li>
                <Link to="/products" className="hover:text-[var(--text-primary)] transition-colors">
                  Products & Platforms
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[var(--text-primary)] transition-colors">
                  Software Development
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-[var(--text-primary)] transition-colors">
                  Engineering Programs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-[var(--text-primary)] mb-3">
              Products
            </p>
            <ul className="flex flex-col gap-2.5 text-[var(--text-secondary)] font-body text-xs">
              <li>
                <Link to="/products" className="hover:text-[var(--text-primary)] transition-colors">
                  DI Notes Visualizer
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[var(--text-primary)] transition-colors">
                  Event Mesh
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-[var(--text-primary)] mb-3">
              Studio
            </p>
            <ul className="flex flex-col gap-2.5 text-[var(--text-secondary)] font-body text-xs">
              <li>
                <button
                  onClick={() => handleScroll('about')}
                  className="hover:text-[var(--text-primary)] transition-colors text-left cursor-pointer"
                >
                  Our Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('why-us')}
                  className="hover:text-[var(--text-primary)] transition-colors text-left cursor-pointer"
                >
                  How We Build
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('contact')}
                  className="hover:text-[var(--text-primary)] transition-colors text-left cursor-pointer"
                >
                  Get in Touch
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-[var(--text-primary)] mb-3">
              Direct Contact
            </p>
            <ul className="flex flex-col gap-2.5 text-[var(--text-secondary)] font-body text-xs">
              <li>
                <a
                  href="mailto:nayaklabs.ai@gmail.com"
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  nayaklabs.ai@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/nayaklabs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  LinkedIn (company/nayaklabs) ↗
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  Instagram (@nayaklabs.ai) ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-8 font-body text-xs text-[var(--text-muted)]">
          {/* Copyright */}
          <div className="flex items-center gap-2">
            <p className="text-xs text-[var(--text-secondary)]">
              © 2026 Nayak Labs · Bengaluru, India
            </p>
          </div>

          {/* Actions: Replay Intro, Theme & Back to top */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-base)] hover:border-[var(--accent-primary)] text-[var(--accent-primary)] transition-all cursor-pointer shadow-xs font-medium"
                title="Replay intro sequence"
              >
                <span>Replay Intro ↺</span>
              </button>
            )}

            <button
              onClick={() => toggleThemeMode()}
              className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-base)] hover:border-[var(--border-hover)] text-[var(--text-primary)] transition-all cursor-pointer shadow-xs font-medium"
            >
              {themeMode === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-base)] hover:border-[var(--border-hover)] text-[var(--text-primary)] transition-all cursor-pointer shadow-xs font-medium"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

