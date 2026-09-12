import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ambientAudio } from '../../utils/audioEngine'
import { useDeviceProfile } from '../../utils/useDeviceProfile'

interface RailSection {
  id: string
  label: string
  num: string
}

const RAIL_SECTIONS: RailSection[] = [
  { id: 'home', label: 'Overview', num: '01' },
  { id: 'products', label: 'Products', num: '02' },
  { id: 'services', label: 'Services', num: '03' },
  { id: 'academics', label: 'Academics', num: '04' },
  { id: 'about', label: 'Manifesto', num: '05' },
  { id: 'why-us', label: 'Roadmap', num: '06' },
  { id: 'social', label: 'Dispatches', num: '07' },
  { id: 'contact', label: 'Contact', num: '08' },
]

const ITEM_SPACING = 32 // Exact pixel distance between dots

interface SectionRailTrackerProps {
  onScrollTo?: (id: string) => void
  ignited?: boolean
  isIntroTarget?: boolean
}

/**
 * Pure Minimalist Section Rail Tracker:
 * - Direct connected dots with continuous spine line (NO enclosing pill/capsule background).
 * - Precise mathematical track bounds (dot 0 to dot N-1).
 * - Real-time scroll synchronization and smooth active line fill.
 * - Fluid, highly visible energy transfer from the wordmark fullstop directly to Dot 01.
 */
export function SectionRailTracker({
  onScrollTo,
  ignited = true,
  isIntroTarget = false,
}: SectionRailTrackerProps) {
  const device = useDeviceProfile()
  const location = useLocation()
  const [activeSection, setActiveSection] = useState('home')
  const lastScrollY = useRef(0)
  const lastScrollTime = useRef(Date.now())
  const prevActiveRef = useRef('home')

  const spineRef = useRef<HTMLDivElement>(null)
  const activeLineRef = useRef<HTMLDivElement>(null)
  const dotWrapperRefs = useRef<(HTMLDivElement | null)[]>([])

  const isHome = location.pathname === '/'

  // Ensure rail is visible without any flying photon transfer
  useEffect(() => {
    if (!isHome || device.isMobile || device.isTablet) return
    const spine = spineRef.current
    const dotWrappers = dotWrapperRefs.current.filter(Boolean)

    if (spine) gsap.set(spine, { opacity: 1, scaleY: 1 })
    if (dotWrappers.length) gsap.set(dotWrappers, { opacity: 1, scale: 1 })
  }, [isHome, device.isMobile, device.isTablet])

  useEffect(() => {
    if (!isHome) return

    const handleScroll = () => {
      const now = Date.now()
      const dt = Math.max(1, now - lastScrollTime.current)
      const dy = Math.abs(window.scrollY - lastScrollY.current)
      const velocity = (dy / dt) * 1.8

      lastScrollY.current = window.scrollY
      lastScrollTime.current = now

      const scrollPos = window.scrollY + window.innerHeight * 0.35
      let currentActive = 'home'

      for (let i = RAIL_SECTIONS.length - 1; i >= 0; i--) {
        const item = RAIL_SECTIONS[i]
        const el = document.getElementById(item.id)
        if (el && scrollPos >= el.offsetTop) {
          currentActive = item.id
          break
        }
      }

      if (currentActive !== prevActiveRef.current) {
        prevActiveRef.current = currentActive
        setActiveSection(currentActive)
        if (velocity <= 3.5 && !ambientAudio.isSoundSuppressed()) {
          ambientAudio.playScrollTick(velocity)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  if (!isHome || device.isMobile) return null

  const handleDotClick = (id: string) => {
    ambientAudio.playScrollTick(2.5)
    if (onScrollTo) {
      onScrollTo(id)
    } else {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const el = document.getElementById(id)
        el?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const activeIndex = Math.max(0, RAIL_SECTIONS.findIndex((s) => s.id === activeSection))
  const totalTrackHeight = (RAIL_SECTIONS.length - 1) * ITEM_SPACING

  return (
    <nav
      className="fixed right-6 xl:right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center select-none pointer-events-auto"
      aria-label="Section Navigation Tracker"
    >
        {/* Pure Connected Dots & Line Container (No enclosing background pill) */}
        <div
          className="relative flex flex-col items-center"
          style={{ height: `${totalTrackHeight}px`, width: '24px' }}
        >
          {/* Background Hairline Spine (Connects exactly from center of top dot to center of bottom dot) */}
          <div
            ref={spineRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[1.5px] bg-black/15 dark:bg-white/15 pointer-events-none rounded-full will-change-transform"
            style={{ height: `${totalTrackHeight}px` }}
          />

          {/* Active Progress Line (Fills down smoothly to the active section dot) */}
          <div
            ref={activeLineRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] pointer-events-none transition-all duration-300 ease-out rounded-full"
            style={{
              height: `${activeIndex * ITEM_SPACING}px`,
              background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary))',
              boxShadow: '0 0 10px var(--accent-primary)',
            }}
          />

          {/* 8 Connected Waypoint Nodes */}
          {RAIL_SECTIONS.map((section, idx) => {
            const isActive = activeSection === section.id
            const isPassed = idx <= activeIndex

            return (
              <div
                key={section.id}
                ref={(el) => {
                  dotWrapperRefs.current[idx] = el
                }}
                className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center group will-change-transform"
                style={{
                  top: `${idx * ITEM_SPACING}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Clickable Hit Target Button (Enlarged 28px for effortless clicking) */}
                <button
                  onClick={() => handleDotClick(section.id)}
                  className="w-7 h-7 flex items-center justify-center cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                  aria-label={`Jump to section ${section.num}: ${section.label}`}
                >
                  {/* Waypoint Dot */}
                  <span
                    className={`rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-3 h-3 bg-white border-2 border-[var(--accent-primary)] shadow-[0_0_12px_var(--accent-primary),0_0_20px_var(--accent-primary)] scale-110'
                        : isPassed
                        ? 'w-2 h-2 bg-[var(--accent-primary)] group-hover:scale-125 shadow-[0_0_6px_var(--accent-primary)]'
                        : 'w-1.5 h-1.5 bg-black/25 dark:bg-white/20 group-hover:bg-black/60 dark:group-hover:bg-white/70 group-hover:scale-125'
                    }`}
                  />
                </button>

                {/* Minimalist Swiss Hover Tooltip */}
                <div className="absolute right-8 px-2.5 py-1 rounded-lg font-mono text-[11px] whitespace-nowrap pointer-events-none transition-all duration-200 shadow-lg border opacity-0 group-hover:opacity-100 translate-x-1.5 group-hover:translate-x-0 bg-[var(--bg-surface-elevated)]/95 backdrop-blur-md text-[var(--text-primary)] border-[var(--border-base)] flex items-center gap-1.5 z-30">
                  <span className="font-bold text-[10px] text-[var(--accent-primary)]">
                    {section.num}
                  </span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="font-body font-semibold">{section.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </nav>
  )
}

export default SectionRailTracker
