import React, { useEffect, useCallback, useRef, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { ThemeProvider } from './utils/themeContext'
import { GrainOverlay } from './components/GrainOverlay'
import { GlobalCanvasBackground } from './components/ui/GlobalCanvasBackground'
import { SEOHead } from './components/seo/SEOHead'
import {
  TierNavbarDispatcher,
  TierHeroDispatcher,
  TierPillarStackDispatcher,
  TierMarqueeDispatcher,
  TierAboutDispatcher,
  TierWhyChooseUsDispatcher,
  TierContactDispatcher,
} from './components/tiers/TierDispatcher'
import { SocialMediaSection } from './components/SocialMediaSection'
import { Footer } from './components/Footer'
import { IntroSequence } from './components/intro/IntroSequence'
import { SectionRailTracker } from './components/ui/SectionRailTracker'
import { TargetCursor } from './components/ui/react-bits'

import { useDeviceProfile } from './utils/useDeviceProfile'
import { ambientAudio } from './utils/audioEngine'

import ProductsPage from './pages/ProductsPage'
import ServicesPage from './pages/ServicesPage'
import AcademicsPage from './pages/AcademicsPage'
import ComingSoon from './pages/ComingSoon'

gsap.registerPlugin(ScrollTrigger)

// Route title & scroll restoration
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()

    const titles: Record<string, string> = {
      '/': 'Nayak Labs — Software Studio, Platforms & Engineering',
      '/products': 'Nayak Labs — Products & Platforms — Making complex things feel simple',
      '/services': 'Nayak Labs — Software Engineering Services',
      '/academics': 'Nayak Labs — Technical Training & Mentorship',
      '/coming-soon': 'Nayak Labs — Releasing Soon',
    }
    document.title = titles[pathname] || 'Nayak Labs — Software Studio, Platforms & Engineering'
  }, [pathname])
  return null
}


function MainLayout() {
  const device = useDeviceProfile()
  const lenisRef = useRef<Lenis | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Prevent automatic browser scroll restoration on refresh and strip rogue why-us hash
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    if (window.location.hash === '#why-us') {
      window.history.replaceState(null, document.title, window.location.pathname)
    }
  }, [])

  const isDesktopIntroTarget =
    (device.isLaptop || device.isTV || device.isUltrawide) &&
    !device.isMobile &&
    !device.isTablet &&
    device.width >= 1024 &&
    !device.isTouch

  const [introFinished, setIntroFinished] = useState(() => {
    if (typeof window === 'undefined') return true
    const w = window.innerWidth
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
    if (w < 1024 || isTouch) return true

    try {
      return sessionStorage.getItem('nayak_intro_seen_v2') === 'true'
    } catch {
      return false
    }
  })
  const [forceReplay, setForceReplay] = useState(false)
  const [heroAwake, setHeroAwake] = useState(() => {
    if (typeof window === 'undefined') return true
    const w = window.innerWidth
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
    return w < 1024 || isTouch
  })

  const [railIgnited, setRailIgnited] = useState(() => {
    if (typeof window === 'undefined') return true
    const w = window.innerWidth
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
    if (w < 1024 || isTouch) return true
    try {
      return sessionStorage.getItem('nayak_intro_seen_v2') === 'true'
    } catch {
      return false
    }
  })

  // Ensure mobile and tablet immediately wake hero and mark intro as finished
  useEffect(() => {
    if (!isDesktopIntroTarget && !introFinished) {
      setIntroFinished(true)
      setHeroAwake(true)
      setIsIntroHandoff(false)
      setRailIgnited(true)
    }
  }, [isDesktopIntroTarget, introFinished])

  // Initialize Lenis smooth scroll ONLY on non-touch (desktop/laptop/TV) devices with 60Hz display lag smoothing
  useEffect(() => {
    if (device.isTouch) return

    // Turn off lagSmoothing so GSAP ticker doesn't introduce jumpy compensation on 60Hz/120Hz displays
    gsap.ticker.lagSmoothing(0)

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      syncTouch: false,
      autoRaf: false,
    })

    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateTicker)

    return () => {
      gsap.ticker.remove(updateTicker)
      lenis.destroy()
    }
  }, [device.isTouch])

  // Lock body scroll only while intro sequence is in progress on desktop
  useEffect(() => {
    if (isDesktopIntroTarget && !introFinished) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      if (lenisRef.current) {
        lenisRef.current.resize()
      }
      const timer = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 50)
      return () => clearTimeout(timer)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isDesktopIntroTarget, introFinished])

  const scrollTo = useCallback((id: string) => {
    if (id === 'home' || id === 'hero') {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { duration: 1.1 })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    const target = document.getElementById(id)
    if (!target) return

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -64, duration: 1.1 })
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // Handle incoming scroll request from subpage navigation
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null
    if (state?.scrollTo && introFinished) {
      const targetId = state.scrollTo
      // Clear navigation state immediately so subsequent refreshes don't auto-jump
      navigate(location.pathname, { replace: true, state: {} })
      ambientAudio.setSoundSuppressed(true)
      const timer = setTimeout(() => {
        scrollTo(targetId)
        setTimeout(() => {
          ambientAudio.setSoundSuppressed(false)
        }, 1100)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [location.state, location.pathname, introFinished, scrollTo, navigate])

  const [isIntroHandoff, setIsIntroHandoff] = useState(false)

  const handleHandoffStart = useCallback(() => {
    setIsIntroHandoff(true)
    setHeroAwake(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [])

  const handleWordmarkDocked = useCallback(() => {
    setRailIgnited(true)
  }, [])

  const handleIntroComplete = useCallback(() => {
    setIntroFinished(true)
    setForceReplay(false)
    setHeroAwake(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [])

  const handleReplayIntro = useCallback(() => {
    if (!isDesktopIntroTarget) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    setIsIntroHandoff(false)
    setIntroFinished(false)
    setHeroAwake(false)
    setRailIgnited(false)
    setForceReplay(true)
  }, [isDesktopIntroTarget])

  return (
    <div className="relative min-h-screen bg-transparent text-[var(--text-primary)] transition-colors duration-300">
      <GrainOverlay />
      <GlobalCanvasBackground />

      {/* Intro sequence strictly for Laptop & TV screens */}
      {isDesktopIntroTarget && !introFinished && (
        <IntroSequence
          forceReplay={forceReplay}
          onHandoffStart={handleHandoffStart}
          onComplete={handleIntroComplete}
        />
      )}

      {/* Main layout is rendered in natural flow */}
      <div className="relative w-full">
        <TierNavbarDispatcher onScrollTo={scrollTo} onReplayIntro={isDesktopIntroTarget ? handleReplayIntro : undefined} />
        <SectionRailTracker onScrollTo={scrollTo} ignited={railIgnited} isIntroTarget={isDesktopIntroTarget} />

        <main id="home">
          {/* Act 1: Hero Section */}
          <TierHeroDispatcher
            visible={heroAwake || introFinished || !isDesktopIntroTarget}
            isIntroHandoff={isIntroHandoff}
            onScrollToDivision={scrollTo}
            onWordmarkDocked={handleWordmarkDocked}
          />

          {/* Act 2: Dedicated Division Sections (P, S, A) */}
          <TierPillarStackDispatcher />

          {/* Ribbon Marquee #1 */}
          <TierMarqueeDispatcher
            text="FASTAPI BACKENDS • NEXT.JS FRONTENDS • DEVELOPER TOOLS • CLEAN ARCHITECTURE • 100% CODE OWNERSHIP • "
          />

          {/* Act 3: Studio Manifesto & Telemetry */}
          <TierAboutDispatcher />

          {/* Act 4: Milestones & Delivery Blueprint */}
          <TierWhyChooseUsDispatcher />

          {/* Act 5: Community & Dispatch (Desktop/Tablet Only) */}
          {!device.isMobile && <SocialMediaSection />}

          {/* Ribbon Marquee #2 (Desktop/Tablet Only) */}
          {!device.isMobile && (
            <TierMarqueeDispatcher
              text="PRODUCTION CODEBASES • REST & WEBSOCKET APIS • POSTGRESQL & REDIS • ZERO CLOUD LOCK-IN • DIRECT ACCESS • "
              direction="right"
            />
          )}

          {/* Act 6: Direct Founders Contact */}
          <TierContactDispatcher />
        </main>

        <Footer onScrollTo={scrollTo} onReplayIntro={handleReplayIntro} />
      </div>
    </div>
  )
}

function GlobalCursor() {
  const device = useDeviceProfile()
  if (device.isTouch) return null
  return <TargetCursor />
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SEOHead />
        <ScrollToTop />
        <GlobalCursor />
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
