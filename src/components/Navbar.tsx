import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../utils/themeContext'
import { Sun, Moon, ArrowRight, Menu, X, RotateCcw } from 'lucide-react'

interface NavbarProps {
  onScrollTo?: (id: string) => void
  onReplayIntro?: () => void
}

interface NavLinkItem {
  label: string
  num: string
  id: string
  pagePath: string
  isSubpage?: boolean
}

// Unified Modern Navigation Hierarchy matching Tablet aesthetic
const NAV_LINKS: NavLinkItem[] = [
  { label: 'Home', num: '00', id: 'home', pagePath: '/', isSubpage: false },
  { label: 'Products', num: '01', id: 'products', pagePath: '/products', isSubpage: true },
  { label: 'Services', num: '02', id: 'services', pagePath: '/services', isSubpage: true },
  { label: 'Academics', num: '03', id: 'academics', pagePath: '/academics', isSubpage: true },
  { label: 'Workflow', num: '04', id: 'why-us', pagePath: '/', isSubpage: false },
]

export function Navbar({ onScrollTo, onReplayIntro }: NavbarProps) {
  const { themeMode, toggleThemeMode } = useTheme()
  const isDark = themeMode === 'dark'

  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  const navLinksContainerRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  })

  // Track active page or scroll position on homepage
  useEffect(() => {
    if (location.pathname === '/products') {
      setActiveSection('products')
      return
    }
    if (location.pathname === '/services') {
      setActiveSection('services')
      return
    }
    if (location.pathname === '/academics') {
      setActiveSection('academics')
      return
    }

    if (!isHome) {
      setActiveSection('')
      return
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Section tracking on homepage:
      // Highlighting Home when at the top, and Products, Services, Academics, Workflow as user scrolls
      const scrollPos = window.scrollY + 220
      const checkSections = ['products', 'services', 'academics', 'why-us']
      let currentSection = 'home'

      for (let i = checkSections.length - 1; i >= 0; i--) {
        const id = checkSections[i]
        const el = document.getElementById(id)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY
          if (scrollPos >= top) {
            currentSection = id
            break
          }
        }
      }
      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome, location.pathname])

  // Update sliding pill highlight position
  useLayoutEffect(() => {
    const activeBtn = linkRefs.current[activeSection]
    const container = navLinksContainerRef.current

    if (activeBtn && container) {
      const containerRect = container.getBoundingClientRect()
      const btnRect = activeBtn.getBoundingClientRect()
      setPillStyle({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
        opacity: 1,
      })
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }))
    }
  }, [activeSection, location.pathname])

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      const activeBtn = linkRefs.current[activeSection]
      const container = navLinksContainerRef.current
      if (activeBtn && container) {
        const containerRect = container.getBoundingClientRect()
        const btnRect = activeBtn.getBoundingClientRect()
        setPillStyle({
          left: btnRect.left - containerRect.left,
          width: btnRect.width,
          opacity: 1,
        })
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [activeSection])

  const handleNavClick = (link: NavLinkItem) => {
    setMobileOpen(false)

    // Handle Home button click
    if (link.id === 'home') {
      if (isHome) {
        if (onScrollTo) onScrollTo('home')
        else window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate('/')
      }
      return
    }

    // If clicking a subpage (Products, Services, Academics), route directly to subpage
    if (link.isSubpage) {
      if (location.pathname === link.pagePath) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate(link.pagePath)
      }
      return
    }

    // Otherwise, handle section jumping (e.g. Workflow / Why Us)
    if (isHome) {
      if (onScrollTo) {
        onScrollTo(link.id)
      } else {
        const el = document.getElementById(link.id)
        el?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate('/', { state: { scrollTo: link.id } })
    }
  }

  const handleBrandClick = () => {
    setMobileOpen(false)
    if (isHome) {
      if (onScrollTo) onScrollTo('home')
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  const handleConnectClick = () => {
    setMobileOpen(false)
    if (isHome) {
      if (onScrollTo) onScrollTo('contact')
      else document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: 'contact' } })
    }
  }

  return (
    <>
      <header className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300">
        <nav
          className={`pointer-events-auto max-w-[760px] w-full px-4 sm:px-5 h-12 rounded-full navbar-glass transition-all duration-300 flex items-center justify-between shadow-xl ${scrolled ? 'border-[var(--border-hover)]' : 'border-[var(--border-base)]'
            }`}
          aria-label="Primary navigation"
        >
          {/* Brand Wordmark with Precision Status Pulse */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              onClick={handleBrandClick}
              className="flex items-center gap-2 group cursor-pointer bg-transparent border-none text-left select-none pl-1"
              aria-label="Nayak Labs — home"
            >
              <span className="font-display font-bold text-[var(--text-primary)] text-sm sm:text-base tracking-tight transition-opacity duration-200 group-hover:opacity-85">
                Nayak Labs
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] inline-block shadow-[0_0_8px_var(--accent-primary)]" />
            </Link>
          </div>

          {/* Desktop Nav Links with High-Contrast Frosted Sliding Highlight Indicator */}
          <div
            ref={navLinksContainerRef}
            className="hidden md:flex items-center relative p-0.5 rounded-full text-xs font-medium"
          >
            {/* Smooth Floating Background Highlight Pill */}
            <div
              className={`absolute top-0.5 bottom-0.5 rounded-full transition-all duration-300 ease-out-expo pointer-events-none ${isDark
                  ? 'bg-white/[0.12] border border-white/20 shadow-sm backdrop-blur-md'
                  : 'bg-black/[0.06] border border-black/10 shadow-xs backdrop-blur-md'
                }`}
              style={{
                left: `${pillStyle.left}px`,
                width: `${pillStyle.width}px`,
                opacity: pillStyle.opacity,
              }}
            />

            {NAV_LINKS.map((link) => {
              const active = activeSection === link.id

              return (
                <button
                  key={link.label}
                  ref={(el) => (linkRefs.current[link.id] = el)}
                  onClick={() => handleNavClick(link)}
                  className={`relative z-10 px-3.5 py-1.5 rounded-full transition-colors duration-200 cursor-pointer font-body text-xs select-none ${active
                      ? isDark
                        ? 'text-white font-bold'
                        : 'text-[var(--text-primary)] font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium'
                    }`}
                >
                  {link.label}
                </button>
              )
            })}
          </div>

          {/* Action Area: Theme Switcher + Connect Button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={() => toggleThemeMode()}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 rounded-full transition-colors cursor-pointer"
              title={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme mode"
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 text-[var(--accent-secondary)]" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--accent-primary)]" />
              )}
            </button>

            <button
              onClick={handleConnectClick}
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-xs font-mono font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_8px_rgba(124,58,237,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_4px_14px_rgba(124,58,237,0.5)] hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 cursor-pointer group select-none"
              aria-label="Connect with Nayak Labs"
            >
              <span>Connect</span>
              <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-drawer"
          className="fixed inset-0 z-40 bg-[var(--bg-base)]/95 backdrop-blur-2xl flex flex-col justify-center px-8 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          <div className="flex flex-col gap-4 max-w-xs mx-auto w-full">
            <div className="pb-3 mb-2 border-b border-[var(--border-base)] flex items-center justify-between">
              <span className="font-body text-xs text-[var(--text-muted)]">Navigation Directory</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className={`flex items-center justify-between text-lg font-display py-2 border-b border-[var(--border-base)] cursor-pointer transition-colors ${activeSection === link.id
                    ? 'text-[var(--accent-primary)] font-bold'
                    : 'text-[var(--text-primary)] font-medium'
                  }`}
              >
                <span>{link.label}</span>
                <span className="font-mono text-xs text-[var(--text-muted)]">{link.num}</span>
              </button>
            ))}

            {onReplayIntro && (
              <button
                onClick={() => {
                  setMobileOpen(false)
                  onReplayIntro()
                }}
                className="flex items-center justify-between text-sm font-mono py-2 text-[var(--accent-primary)] border-b border-[var(--border-base)] cursor-pointer"
              >
                <span>Replay Intro Sequence</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleConnectClick}
              className="btn-primary w-full py-2.5 text-xs font-bold rounded-full mt-4 flex items-center justify-center gap-2"
            >
              <span>Initiate contact</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar

