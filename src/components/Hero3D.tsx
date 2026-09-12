import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowRight, Terminal, Globe, GraduationCap, Code2, Cpu, Zap, Layers, MessageSquare } from 'lucide-react'
import { BorderBeam } from './ui/BorderBeam'
import { CrowdCanvas } from './ui/skiper-ui/skiper39'
import { useDeviceProfile } from '../utils/useDeviceProfile'
import { ambientAudio } from '../utils/audioEngine'

gsap.registerPlugin(ScrollTrigger)

// Module-scoped session flag: remains true across client-side React Router navigation, resets only on full page reload
let hasBouncedInSession = false

interface Hero3DProps {
  visible?: boolean
  isIntroHandoff?: boolean
  onScrollToDivision?: (id: string) => void
  onWordmarkDocked?: () => void
}

const ACCENT_CYCLE = [
  { color: '#7C3AED', name: 'Violet-600' },
  { color: '#4338CA', name: 'Indigo-700' },
  { color: '#A5A0B8', name: 'Platinum' },
]

export function Hero3D({
  visible = true,
  isIntroHandoff = false,
  onScrollToDivision,
  onWordmarkDocked,
}: Hero3DProps) {
  const device = useDeviceProfile()
  const location = useLocation()
  const hasIncomingScroll = !!(location.state as { scrollTo?: string } | null)?.scrollTo
  const containerRef = useRef<HTMLDivElement>(null)
  const wordmarkStageRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLHeadingElement>(null)
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const flyingBallRef = useRef<HTMLDivElement>(null)
  const kickerRef = useRef<HTMLDivElement>(null)
  const sublineRef = useRef<HTMLParagraphElement>(null)
  const periodRef = useRef<HTMLSpanElement>(null)
  const scrollPromptRef = useRef<HTMLDivElement>(null)
  const crowdRef = useRef<HTMLDivElement>(null)
  const revealedContentRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const hasRevealedRef = useRef(hasBouncedInSession || hasIncomingScroll)

  const [accentIndex, setAccentIndex] = useState(0)
  const [mobileActiveCard, setMobileActiveCard] = useState(0)
  const activeAccent = ACCENT_CYCLE[accentIndex]

  // Pure desktop pinned layout flag
  const isPinnedDesktop =
    (device.isLaptop || device.isTV || device.isUltrawide) &&
    !device.isMobile &&
    !device.isTablet &&
    !device.isTouch &&
    device.width >= 1024

  // Typographic Full Stop period interactive trigger to cycle accent color
  const handlePeriodClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setAccentIndex((prev) => (prev + 1) % ACCENT_CYCLE.length)

    const dot = e.currentTarget
    gsap.fromTo(
      dot,
      { scale: 1.4 },
      { scale: 1, duration: 0.35, ease: 'back.out(2.5)' }
    )
  }, [])

  // 3D Tilt interaction with smooth momentum damping for desktop/laptop
  const handleCardMouseMove = (e: React.MouseEvent<HTMLAnchorElement>, idx: number) => {
    if (device.isTouch) return
    const card = cardRefs.current[idx]
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isReduced) {
      const normX = (x / rect.width - 0.5) * 14
      const normY = (y / rect.height - 0.5) * -14
      card.style.transition = 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)'
      card.style.transform = `perspective(1100px) rotateX(${normY.toFixed(2)}deg) rotateY(${normX.toFixed(2)}deg) translateZ(16px) translateY(-6px)`
    }
  }

  const handleCardMouseLeave = (idx: number) => {
    if (device.isTouch) return
    const card = cardRefs.current[idx]
    if (!card) return
    card.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
    card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)'
  }

  // Mobile Snap Deck Scroll Listener for pagination dots
  const handleMobileCardsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const cardWidth = el.offsetWidth * 0.85
    const scrollLeft = el.scrollLeft
    const active = Math.round(scrollLeft / cardWidth)
    setMobileActiveCard(Math.min(Math.max(active, 0), 2))
  }

  const handleScrollToCards = () => {
    const target = document.getElementById('mobile-divisions-section')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    } else if (onScrollToDivision) {
      onScrollToDivision('products')
    }
  }

  // Reset reveal state ONLY when hero is explicitly hidden
  useEffect(() => {
    if (!visible) {
      hasRevealedRef.current = false
    }
  }, [visible])

  // Desktop Pinned Animation & Entrance Timeline
  useEffect(() => {
    if (!visible) return
    const container = containerRef.current
    const wordmarkStage = wordmarkStageRef.current
    const wordmark = wordmarkRef.current
    const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[]
    const flyingBall = flyingBallRef.current
    const kicker = kickerRef.current
    const subline = sublineRef.current
    const periodEl = periodRef.current
    const scrollPrompt = scrollPromptRef.current
    const crowdEl = crowdRef.current
    const revealedContent = revealedContentRef.current
    const cards = cardRefs.current.filter(Boolean)

    if (!container) return

    // If on mobile or tablet, ensure elements render immediately in natural flow
    if (!isPinnedDesktop) {
      if (letters.length) gsap.set(letters, { opacity: 1, scale: 1, y: 0, filter: 'none' })
      if (periodEl) gsap.set(periodEl, { opacity: 1, scale: 1 })
      if (kicker) gsap.set(kicker, { opacity: 1, y: 0 })
      if (subline) gsap.set(subline, { opacity: 1, y: 0 })
      if (scrollPrompt) gsap.set(scrollPrompt, { opacity: 1, y: 0 })
      if (crowdEl) gsap.set(crowdEl, { opacity: 1 })
      if (revealedContent) gsap.set(revealedContent, { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' })
      return
    }

    if (!wordmark || !revealedContent || !periodEl) return

    // ── DESKTOP & LAPTOP CHOREOGRAPHY & PINNED SCRUB TIMELINE ──
    let entranceTimer: ReturnType<typeof setTimeout> | null = null
    const mm = gsap.matchMedia()

    mm.add(
      {
        isReduced: '(prefers-reduced-motion: reduce)',
        isStandard: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const { isReduced } = context.conditions as { isReduced: boolean }

        if (isReduced) {
          gsap.set(letters, { opacity: 1, scale: 1, y: 0, filter: 'none' })
          gsap.set([periodEl, kicker, subline, crowdEl], { opacity: 1, scale: 1 })
          if (wordmarkStage) gsap.set(wordmarkStage, { opacity: 0, pointerEvents: 'none' })
          if (revealedContent) gsap.set(revealedContent, { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' })
          if (flyingBall) gsap.set(flyingBall, { opacity: 0 })
          return
        }

        // ── CHOREOGRAPHED PROPER FLUID BOUNCING BALL ENTRANCE ──
        if (hasBouncedInSession || hasIncomingScroll || hasRevealedRef.current) {
          hasRevealedRef.current = true
          gsap.set(letters, { opacity: 1, scale: 1, y: 0, filter: 'none' })
          gsap.set([periodEl, kicker, subline, scrollPrompt, crowdEl], { opacity: 1, scale: 1, y: 0 })
          if (wordmarkStage) gsap.set(wordmarkStage, { opacity: 0, pointerEvents: 'none' })
          if (revealedContent) gsap.set(revealedContent, { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' })
          if (flyingBall) gsap.set(flyingBall, { opacity: 0 })
          onWordmarkDocked?.()
          return
        }

        if (!hasRevealedRef.current) {
          gsap.set(letters, { opacity: 0, scale: 1, y: 10, filter: 'none' })
          gsap.set(periodEl, { opacity: 0, scale: 0 })
          gsap.set([kicker, subline, scrollPrompt, crowdEl], { opacity: 0, y: 14 })
          gsap.set(revealedContent, { opacity: 0, scale: 0.94, y: 30, pointerEvents: 'none' })
          if (flyingBall) gsap.set(flyingBall, { opacity: 0, scale: 0 })

          if (!isIntroHandoff && !visible) {
            return
          }

          const startBounceChoreography = () => {
            if (!letters.length || !periodEl || !flyingBall || !wordmark) {
              gsap.set(letters, { opacity: 1, scale: 1, y: 0, filter: 'none' })
              gsap.set([periodEl, kicker, subline, scrollPrompt, crowdEl], { opacity: 1, y: 0 })
              return
            }

            // Temporarily reset letters & period to true natural scale to measure exact layout
            gsap.set([...letters, periodEl], { scale: 1, y: 0, filter: 'none', clearProps: 'transform' })

            const wordmarkRect = wordmark.getBoundingClientRect()
            if (wordmarkRect.width === 0) {
              requestAnimationFrame(startBounceChoreography)
              return
            }

            const letterTargets = letters.map((l) => {
              const r = l.getBoundingClientRect()
              return {
                x: r.left - wordmarkRect.left + r.width / 2,
                y: r.top - wordmarkRect.top + r.height * 0.12,
              }
            })

            const periodRect = periodEl.getBoundingClientRect()
            const finalPeriodPos = {
              x: periodRect.left - wordmarkRect.left + periodRect.width / 2,
              y: periodRect.bottom - wordmarkRect.top - periodRect.height * 0.22,
            }

            // Re-apply hidden entrance states without blur
            gsap.set(letters, { opacity: 0, y: 12, filter: 'none' })
            gsap.set(periodEl, { opacity: 0, scale: 0 })

            const dropStartX = letterTargets[0]?.x || 30
            const dropStartY = -120

            const entranceTl = gsap.timeline({
              delay: 0.1, // Subtle natural lag after shutter opens
              onComplete: () => {
                hasRevealedRef.current = true
                hasBouncedInSession = true
              },
            })

            // 0. Position luminous purple flying ball at top aperture
            gsap.set(flyingBall, {
              xPercent: -50,
              yPercent: -50,
              x: dropStartX,
              y: dropStartY,
              opacity: 1,
              scale: 1,
            })

            // 1. Fluid Gravitational Plunge to Letter 0 ('N')
            const plungeDuration = 0.28
            entranceTl.to(
              flyingBall,
              {
                x: letterTargets[0].x,
                y: letterTargets[0].y,
                duration: plungeDuration,
                ease: 'power2.in',
              },
              0
            )

            // Impact Letter 0 ('N') at t = plungeDuration
            const impact0Time = plungeDuration
            entranceTl.call(
              () => {
                ambientAudio.playBounceSound(0, 9, false)
                // Clean letter reveal without blur distortion
                gsap.fromTo(
                  letters[0],
                  { opacity: 0, y: 10, filter: 'none' },
                  {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    filter: 'none',
                    duration: 0.24,
                    ease: 'power2.out',
                  }
                )
              },
              undefined,
              impact0Time
            )

            let currentTime = impact0Time + 0.02

            // 2. Parabolic Bounces Across Letters 1..8 ('a-y-a-k-L-a-b-s')
            for (let i = 1; i < letterTargets.length; i++) {
              const prev = letterTargets[i - 1]
              const target = letterTargets[i]

              const isWordGap = i === 5
              const jumpDuration = isWordGap ? 0.20 : 0.14
              const arcHeight = isWordGap ? 32 : 20
              const arcPeakY = Math.min(prev.y, target.y) - arcHeight

              const hopStart = currentTime
              const halfDuration = jumpDuration * 0.5

              // Horizontal linear momentum
              entranceTl.to(
                flyingBall,
                {
                  x: target.x,
                  duration: jumpDuration,
                  ease: 'none',
                },
                hopStart
              )

              // Parabolic Vertical Ascent
              entranceTl.to(
                flyingBall,
                {
                  y: arcPeakY,
                  duration: halfDuration,
                  ease: 'sine.out',
                },
                hopStart
              )

              // Parabolic Gravitational Descent
              entranceTl.to(
                flyingBall,
                {
                  y: target.y,
                  duration: halfDuration,
                  ease: 'power2.in',
                },
                hopStart + halfDuration
              )

              // Impact at target letter
              const impactTime = hopStart + jumpDuration
              const targetLetter = letters[i]
              const letterIndex = i

              entranceTl.call(
                () => {
                  ambientAudio.playBounceSound(letterIndex, 9, false)
                  // Clean letter reveal without blur distortion
                  gsap.fromTo(
                    targetLetter,
                    { opacity: 0, y: 8, filter: 'none' },
                    {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      filter: 'none',
                      duration: 0.22,
                      ease: 'power2.out',
                    }
                  )
                },
                undefined,
                impactTime
              )

              currentTime = impactTime + 0.02
            }

            // 3. Bigger Jump after 's' (Letter 8) to the Full Stop Coordinate
            const lastLetter = letterTargets[letterTargets.length - 1]
            const bigJumpDuration = 0.26
            const bigJumpPeakY = lastLetter.y - 44 // Higher parabolic arc
            const bigJumpStart = currentTime
            const bigJumpHalf = bigJumpDuration * 0.48

            entranceTl.to(
              flyingBall,
              {
                x: finalPeriodPos.x,
                duration: bigJumpDuration,
                ease: 'power1.inOut',
              },
              bigJumpStart
            )

            entranceTl.to(
              flyingBall,
              {
                y: bigJumpPeakY,
                duration: bigJumpHalf,
                ease: 'sine.out',
              },
              bigJumpStart
            )

            entranceTl.to(
              flyingBall,
              {
                y: finalPeriodPos.y,
                duration: bigJumpDuration - bigJumpHalf,
                ease: 'power2.in',
              },
              bigJumpStart + bigJumpHalf
            )

            // Primary Impact at the Full Stop coordinate
            const impact1Time = bigJumpStart + bigJumpDuration
            entranceTl.call(
              () => {
                ambientAudio.playBounceSound(8, 10, false)
              },
              undefined,
              impact1Time
            )

            // 4. Two Micro-Bounces in Place at the Full Stop Location
            // Bounce 1: Rebound to ~14px height
            const bounce1Duration = 0.14
            const bounce1PeakY = finalPeriodPos.y - 14
            const bounce1Start = impact1Time + 0.015
            const bounce1Half = bounce1Duration * 0.5

            entranceTl.to(
              flyingBall,
              {
                y: bounce1PeakY,
                duration: bounce1Half,
                ease: 'sine.out',
              },
              bounce1Start
            )

            entranceTl.to(
              flyingBall,
              {
                y: finalPeriodPos.y,
                duration: bounce1Half,
                ease: 'power2.in',
              },
              bounce1Start + bounce1Half
            )

            const impact2Time = bounce1Start + bounce1Duration
            entranceTl.call(
              () => {
                ambientAudio.playBounceSound(9, 10, false)
              },
              undefined,
              impact2Time
            )

            // Bounce 2: Smaller micro-rebound to ~6px height then final settle
            const bounce2Duration = 0.10
            const bounce2PeakY = finalPeriodPos.y - 6
            const bounce2Start = impact2Time + 0.015
            const bounce2Half = bounce2Duration * 0.5

            entranceTl.to(
              flyingBall,
              {
                y: bounce2PeakY,
                duration: bounce2Half,
                ease: 'sine.out',
              },
              bounce2Start
            )

            entranceTl.to(
              flyingBall,
              {
                y: finalPeriodPos.y,
                duration: bounce2Half,
                ease: 'power2.in',
              },
              bounce2Start + bounce2Half
            )

            const finalDockTime = bounce2Start + bounce2Duration

            // 5. Final Settle: Ball stops and locks cleanly into the glowing fullstop (.)
            entranceTl.to(
              flyingBall,
              {
                opacity: 0,
                duration: 0.05,
                ease: 'power1.out',
              },
              finalDockTime
            )

            entranceTl.call(
              () => {
                ambientAudio.playBounceSound(10, 10, true)
                gsap.fromTo(
                  periodEl,
                  { opacity: 0, scale: 0.6 },
                  { opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(2.5)' }
                )
                onWordmarkDocked?.()
              },
              undefined,
              finalDockTime
            )

            // 6. Silky Cascade for Kicker, Subline, ScrollPrompt, and Crowd Horizon
            entranceTl.to(
              [kicker, subline],
              {
                opacity: 1,
                y: 0,
                duration: 0.55,
                stagger: 0.08,
                ease: 'power3.out',
              },
              finalDockTime + 0.05
            )

            entranceTl.to(
              [scrollPrompt, crowdEl],
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                ease: 'power3.out',
              },
              finalDockTime + 0.16
            )
          }

          entranceTimer = setTimeout(startBounceChoreography, 40)
        } else {
          gsap.set(letters, { opacity: 1, scale: 1, y: 0, filter: 'none' })
          gsap.set([periodEl, kicker, subline, scrollPrompt, crowdEl], { opacity: 1, y: 0 })
          gsap.set(revealedContent, { opacity: 0, scale: 0.94, y: 30, pointerEvents: 'none' })
          if (flyingBall) gsap.set(flyingBall, { opacity: 0 })
        }

        // ── MASTER PINNED SCROLLTRIGGER SCRUB TIMELINE (DESKTOP / LAPTOP) ──
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '+=80%',
            scrub: 0.4,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        masterTl
          .to(
            scrollPrompt,
            {
              opacity: 0,
              y: -24,
              duration: 0.15,
              ease: 'power2.out',
            },
            0
          )
          .to(
            kicker,
            {
              opacity: 0,
              y: -20,
              duration: 0.2,
              ease: 'power2.out',
            },
            0.02
          )
          .to(
            [wordmark, subline],
            {
              scale: 1.5,
              opacity: 0,
              y: -44,
              duration: 0.52,
              ease: 'power2.inOut',
            },
            0.04
          )
          .fromTo(
            revealedContent,
            {
              opacity: 0,
              y: 36,
              scale: 0.94,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.52,
              ease: 'power3.out',
              onStart: () => {
                revealedContent.style.pointerEvents = 'auto'
              },
              onReverseComplete: () => {
                revealedContent.style.pointerEvents = 'none'
              },
            },
            0.22
          )

        // 3D Spatial Fan-out on the 3 Cards
        if (cards.length === 3) {
          masterTl
            .fromTo(
              cards[0],
              { xPercent: 20, rotateY: 10, rotateZ: -2.5, scale: 0.93 },
              {
                xPercent: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                duration: 0.48,
                ease: 'power3.out',
              },
              0.26
            )
            .fromTo(
              cards[1],
              { scale: 0.94, y: 20 },
              {
                scale: 1,
                y: 0,
                duration: 0.48,
                ease: 'power3.out',
              },
              0.28
            )
            .fromTo(
              cards[2],
              { xPercent: -20, rotateY: -10, rotateZ: 2.5, scale: 0.93 },
              {
                xPercent: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                duration: 0.48,
                ease: 'power3.out',
              },
              0.30
            )
        }

        return () => {
          if (entranceTimer) clearTimeout(entranceTimer)
        }
      },
      container
    )

    return () => mm.revert()
  }, [visible, isPinnedDesktop, isIntroHandoff])

  // Container width class depending on device profile
  const containerWidthClass = device.isTV
    ? 'max-w-[1720px] w-[94vw] px-8'
    : 'max-w-[1240px] px-5 sm:px-6 md:px-10'

  // =========================================================================
  // VIEW EXPERIENCE 1: MOBILE PHONE (<768px) — HIGH-VELOCITY 0-CLUTTER TERMINAL
  // =========================================================================
  if (device.isMobile) {
    return (
      <section
        ref={containerRef}
        id="hero"
        className="relative w-full pt-28 pb-16 flex flex-col items-center bg-transparent text-[var(--text-primary)] select-none transition-colors duration-300 overflow-hidden"
      >
        {/* Floor Horizon Avatars */}
        <div
          ref={crowdRef}
          className="absolute inset-x-0 bottom-0 h-[120px] pointer-events-none z-[5] overflow-hidden flex items-end justify-center opacity-25 dark:opacity-20 transition-opacity duration-500"
          style={{
            maskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
          }}
        >
          <CrowdCanvas src="/images/peeps/all-peeps.png" count={10} />
        </div>

        <div className="relative z-10 w-full mx-auto px-5 flex flex-col items-center text-center">
          {/* 1. Studio Kicker Badge */}
          <div
            ref={kickerRef}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-base)] bg-[var(--bg-surface)]/80 backdrop-blur-md mb-4 shadow-xs"
          >
            <span className="font-body text-xs text-[var(--text-secondary)] font-medium">
              Software Studio · Bengaluru
            </span>
          </div>

          {/* 2. Monumental Wordmark */}
          <div className="relative inline-flex items-baseline justify-center max-w-full mb-3">
            <h1
              ref={wordmarkRef}
              className="font-display font-black tracking-[-0.035em] select-none inline-flex items-baseline justify-center leading-none text-center drop-shadow-sm text-[clamp(2.4rem,10.2vw,3.6rem)] whitespace-nowrap"
            >
              <span className="inline-flex items-baseline">
                {['N', 'a', 'y', 'a', 'k'].map((char, i) => (
                  <span
                    key={`nayak-${i}`}
                    ref={(el) => {
                      letterRefs.current[i] = el
                    }}
                    className="hero-letter inline-block text-[var(--text-primary)] dark:drop-shadow-[0_2px_16px_rgba(124,58,237,0.25)]"
                  >
                    {char}
                  </span>
                ))}
              </span>

              <span className="inline-block w-[0.24em]">&nbsp;</span>

              <span className="inline-flex items-baseline">
                {['L', 'a', 'b', 's'].map((char, i) => (
                  <span
                    key={`labs-${i}`}
                    ref={(el) => {
                      letterRefs.current[5 + i] = el
                    }}
                    className="hero-letter inline-block text-[var(--text-primary)] dark:drop-shadow-[0_2px_16px_rgba(124,58,237,0.25)]"
                  >
                    {char}
                  </span>
                ))}
              </span>

              <span
                ref={periodRef}
                onClick={handlePeriodClick}
                className="text-[var(--accent-primary)] cursor-pointer select-none pointer-events-auto transition-transform hover:scale-110 active:scale-95 inline-block ml-[0.04em] drop-shadow-[0_0_12px_currentColor]"
                style={{ color: activeAccent.color }}
                title={`Active Accent: ${activeAccent.name} · Tap to cycle`}
                aria-label={`Cycle accent color. Current: ${activeAccent.name}`}
              >
                .
              </span>
            </h1>
          </div>

          {/* 3. Subline Tagline */}
          <p
            ref={sublineRef}
            className="font-body text-xs text-[var(--text-secondary)] mb-6 max-w-sm mx-auto opacity-90 px-2"
          >
            We build software people actually use.
          </p>

          {/* 4. Dual Action Fast Buttons */}
          <div className="flex items-center justify-center gap-3 w-full max-w-xs mx-auto mb-14">
            <button
              onClick={handleScrollToCards}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--accent-primary)] text-white font-body font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <span>Explore Work</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <a
              href="https://wa.me/?text=Hello%20Nayak%20Labs%20Team"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-body font-medium text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Message Us</span>
            </a>
          </div>

          {/* 5. Mobile Division Deck Section */}
          <div id="mobile-divisions-section" className="w-full max-w-sm mx-auto flex flex-col items-center text-center scroll-mt-28 pt-8">
            <h2 className="font-display font-bold text-xl tracking-tight mb-2 text-[var(--text-primary)] px-2">
              Three things we do really well.
            </h2>
            <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-6 px-2">
              Enterprise software platforms, specialized engineering pods, and technical academies.
            </p>

            {/* Mobile Snap Swipe Deck */}
            <div
              ref={cardsContainerRef}
              onScroll={handleMobileCardsScroll}
              className="mobile-snap-deck flex overflow-x-auto gap-3.5 pb-2 no-scrollbar -mx-4 px-4 w-[calc(100%+2rem)] mb-3 text-left"
            >
              {/* Card 01: Products */}
              <Link
                to="/products"
                className="card-tactile drafting-card p-5 flex flex-col justify-between group cursor-pointer relative overflow-hidden w-[85vw] max-w-[320px] min-h-[200px]"
              >
                <BorderBeam size={180} duration={12} colorFrom="var(--accent-primary)" colorTo="var(--accent-secondary)" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="p-2 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <span className="font-body text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--accent-primary)] font-medium">
                      Products
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-1">
                    Products & Platforms
                  </h3>
                  <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                    Interactive tools, visual learning platforms, and curated networks built for everyday use.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-[var(--border-base)] flex items-center justify-between font-body text-xs text-[var(--accent-primary)] font-semibold">
                  <span>Explore products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              {/* Card 02: Services */}
              <Link
                to="/services"
                className="card-tactile drafting-card p-5 flex flex-col justify-between group cursor-pointer relative overflow-hidden w-[85vw] max-w-[320px] min-h-[200px]"
              >
                <BorderBeam size={180} duration={12} delay={4} colorFrom="var(--accent-secondary)" colorTo="var(--accent-primary)" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="p-2 rounded-lg bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="font-body text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--accent-secondary)] font-medium">
                      Services
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-1">
                    Engineering Services
                  </h3>
                  <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                    Dedicated engineering teams building modern web applications, FastAPI backends, and cloud infrastructure.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-[var(--border-base)] flex items-center justify-between font-body text-xs text-[var(--accent-secondary)] font-semibold">
                  <span>View services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              {/* Card 03: Academics */}
              <Link
                to="/academics"
                className="card-tactile drafting-card p-5 flex flex-col justify-between group cursor-pointer relative overflow-hidden w-[85vw] max-w-[320px] min-h-[200px]"
              >
                <BorderBeam size={180} duration={12} delay={8} colorFrom="var(--accent-tertiary)" colorTo="var(--accent-secondary)" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="p-2 rounded-lg bg-[var(--accent-tertiary)]/10 text-[var(--accent-tertiary)]">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <span className="font-body text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--accent-tertiary)] font-medium">
                      Training
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-1">
                    Technical Training
                  </h3>
                  <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                    Hands-on training in real-world systems architecture, backend engineering, and production codebases.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-[var(--border-base)] flex items-center justify-between font-body text-xs text-[var(--accent-tertiary)] font-semibold">
                  <span>Explore cohorts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>

            {/* Mobile Snap Indicator Dots */}
            <div className="flex items-center justify-center gap-1.5 mb-6" aria-hidden="true">
              {[0, 1, 2].map((idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${mobileActiveCard === idx
                      ? 'w-6 bg-[var(--accent-primary)]'
                      : 'w-1.5 bg-[var(--border-hover)]'
                    }`}
                />
              ))}
            </div>

            {/* 4 Scope Badges */}
            <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border-base)]">
              <div className="p-2.5 rounded-xl glass-panel text-center flex flex-col items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-[var(--accent-primary)] mb-0.5" />
                <div className="font-body text-xs font-semibold text-[var(--text-primary)]">
                  Senior Pods
                </div>
                <div className="font-body text-[10px] text-[var(--text-muted)]">Direct Founder Access</div>
              </div>
              <div className="p-2.5 rounded-xl glass-panel text-center flex flex-col items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-[var(--accent-secondary)] mb-0.5" />
                <div className="font-body text-xs font-semibold text-[var(--text-primary)]">
                  Practical AI
                </div>
                <div className="font-body text-[10px] text-[var(--text-muted)]">Built for Production</div>
              </div>
              <div className="p-2.5 rounded-xl glass-panel text-center flex flex-col items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-[var(--accent-tertiary)] mb-0.5" />
                <div className="font-body text-xs font-semibold text-[var(--text-primary)]">
                  Direct Mentorship
                </div>
                <div className="font-body text-[10px] text-[var(--text-muted)]">Learn from Builders</div>
              </div>
              <div className="p-2.5 rounded-xl glass-panel text-center flex flex-col items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-[var(--accent-primary)] mb-0.5" />
                <div className="font-body text-xs font-semibold text-[var(--text-primary)]">
                  Working Code
                </div>
                <div className="font-body text-[10px] text-[var(--text-muted)]">Shipped Weekly</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }


  // =========================================================================
  // VIEW EXPERIENCE 2: iPAD / TABLET (SWISS EDITORIAL LOOKBOOK & DOSSIER)
  // =========================================================================
  if (device.isTablet || !isPinnedDesktop) {
    return (
      <section
        ref={containerRef}
        id="hero"
        className="relative w-full pt-32 pb-20 flex flex-col items-center bg-transparent text-[var(--text-primary)] select-none transition-colors duration-300 overflow-hidden"
      >
        {/* Crowd floor line */}
        <div
          ref={crowdRef}
          className="absolute inset-x-0 bottom-0 h-[160px] pointer-events-none z-[5] overflow-hidden flex items-end justify-center opacity-30 dark:opacity-25 transition-opacity duration-500"
          style={{
            maskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
          }}
        >
          <CrowdCanvas src="/images/peeps/all-peeps.png" count={16} />
        </div>

        <div className={`relative z-10 w-full mx-auto flex flex-col items-center text-center ${containerWidthClass}`}>
          {/* Studio Top Kicker Badge */}
          <div
            ref={kickerRef}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-base)] bg-[var(--bg-surface)]/80 backdrop-blur-md mb-6 shadow-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--text-secondary)] font-medium">
              Digital Architecture & Research Studio
            </span>
          </div>

          {/* Monumental Wordmark */}
          <div className="relative inline-flex items-baseline justify-center max-w-full mb-4">
            <h1
              ref={wordmarkRef}
              className="font-display font-black tracking-[-0.035em] select-none inline-flex items-baseline justify-center leading-none text-center drop-shadow-sm text-[clamp(3.2rem,8.0vw,5.2rem)] whitespace-nowrap"
            >
              <span className="inline-flex items-baseline">
                {['N', 'a', 'y', 'a', 'k'].map((char, i) => (
                  <span
                    key={`nayak-${i}`}
                    ref={(el) => {
                      letterRefs.current[i] = el
                    }}
                    className="hero-letter inline-block text-[var(--text-primary)] dark:drop-shadow-[0_2px_16px_rgba(124,58,237,0.25)]"
                  >
                    {char}
                  </span>
                ))}
              </span>

              <span className="inline-block w-[0.24em]">&nbsp;</span>

              <span className="inline-flex items-baseline">
                {['L', 'a', 'b', 's'].map((char, i) => (
                  <span
                    key={`labs-${i}`}
                    ref={(el) => {
                      letterRefs.current[5 + i] = el
                    }}
                    className="hero-letter inline-block text-[var(--text-primary)] dark:drop-shadow-[0_2px_16px_rgba(124,58,237,0.25)]"
                  >
                    {char}
                  </span>
                ))}
              </span>

              <span
                ref={periodRef}
                onClick={handlePeriodClick}
                className="text-[var(--accent-primary)] cursor-pointer select-none pointer-events-auto transition-transform hover:scale-110 active:scale-95 inline-block ml-[0.04em] drop-shadow-[0_0_12px_currentColor]"
                style={{ color: activeAccent.color }}
                title={`Active Accent: ${activeAccent.name} · Tap to cycle`}
                aria-label={`Cycle accent color. Current: ${activeAccent.name}`}
              >
                .
              </span>
            </h1>
          </div>

          {/* Subline Tagline */}
          <p
            ref={sublineRef}
            className="font-body text-base text-[var(--text-secondary)] mb-12 max-w-xl mx-auto opacity-90 px-4"
          >
            We build software people actually use.
          </p>

          {/* Division Showcase Section */}
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center mb-8">
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight mb-3 text-[var(--text-primary)] px-2">
              Three things we do really well.
            </h2>
            <p className="font-body text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed px-4">
              Engineered from first principles with senior architects and dedicated focus.
            </p>
          </div>

          {/* 3 Division Cards (3-Column Grid) */}
          <div
            ref={cardsContainerRef}
            className="grid grid-cols-3 gap-4 lg:gap-6 w-full mb-8 text-left"
          >
            {/* Products */}
            <Link
              to="/products"
              className="card-tactile drafting-card p-6 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <BorderBeam size={180} duration={12} colorFrom="var(--accent-primary)" colorTo="var(--accent-secondary)" />
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <span className="font-body text-xs px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--accent-primary)] font-medium">
                    Products
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
                  Products & Platforms
                </h3>
                <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Interactive tools, visual learning platforms, and curated networks built for everyday use.
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between font-body text-xs text-[var(--accent-primary)] font-semibold group-hover:underline">
                <span>Explore products</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            {/* Services */}
            <Link
              to="/services"
              className="card-tactile drafting-card p-6 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <BorderBeam size={180} duration={12} delay={4} colorFrom="var(--accent-secondary)" colorTo="var(--accent-primary)" />
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="font-body text-xs px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--accent-secondary)] font-medium">
                    Services
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-secondary)] transition-colors">
                  Engineering Services
                </h3>
                <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Dedicated engineering teams building modern web applications, FastAPI backends, and cloud infrastructure.
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between font-body text-xs text-[var(--accent-secondary)] font-semibold group-hover:underline">
                <span>View services</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            {/* Academics */}
            <Link
              to="/academics"
              className="card-tactile drafting-card p-6 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <BorderBeam size={180} duration={12} delay={8} colorFrom="var(--accent-tertiary)" colorTo="var(--accent-secondary)" />
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-[var(--accent-tertiary)]/10 text-[var(--accent-tertiary)]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="font-body text-xs px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--accent-tertiary)] font-medium">
                    Training
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-tertiary)] transition-colors">
                  Technical Training
                </h3>
                <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Hands-on training in real-world systems architecture, backend engineering, and production codebases.
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between font-body text-xs text-[var(--accent-tertiary)] font-semibold group-hover:underline">
                <span>Explore training</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>

          {/* 4 Scope Badges */}
          <div className="w-full grid grid-cols-4 gap-3 pt-4 border-t border-[var(--border-base)]">
            <div className="p-3 rounded-2xl glass-panel text-center flex flex-col items-center justify-center">
              <Code2 className="w-4 h-4 text-[var(--accent-primary)] mb-1" />
              <div className="font-body text-xs font-semibold text-[var(--text-primary)]">
                Senior Pods
              </div>
              <div className="font-body text-[10px] text-[var(--text-muted)]">Direct Founder Access</div>
            </div>
            <div className="p-3 rounded-2xl glass-panel text-center flex flex-col items-center justify-center">
              <Cpu className="w-4 h-4 text-[var(--accent-secondary)] mb-1" />
              <div className="font-body text-xs font-semibold text-[var(--text-primary)]">
                Practical AI
              </div>
              <div className="font-body text-[10px] text-[var(--text-muted)]">Built for Production</div>
            </div>
            <div className="p-3 rounded-2xl glass-panel text-center flex flex-col items-center justify-center">
              <Layers className="w-4 h-4 text-[var(--accent-tertiary)] mb-1" />
              <div className="font-body text-xs font-semibold text-[var(--text-primary)]">
                Direct Mentorship
              </div>
              <div className="font-body text-[10px] text-[var(--text-muted)]">Learn from Builders</div>
            </div>
            <div className="p-3 rounded-2xl glass-panel text-center flex flex-col items-center justify-center">
              <Zap className="w-4 h-4 text-[var(--accent-primary)] mb-1" />
              <div className="font-body text-xs font-semibold text-[var(--text-primary)]">
                Working Code
              </div>
              <div className="font-body text-[10px] text-[var(--text-muted)]">Shipped Weekly</div>
            </div>
          </div>
        </div>
      </section>

    )
  }

  // =========================================================================
  // VIEW EXPERIENCE 3: LAPTOP & TV/4K (INTERACTIVE 3D WORKBENCH WITH PINNED SCRUB)
  // =========================================================================
  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full min-h-screen h-screen flex flex-col items-center justify-center bg-transparent text-[var(--text-primary)] select-none transition-colors duration-300 overflow-hidden"
    >
      {/* Crowd floor layer */}
      <div
        ref={crowdRef}
        className={`absolute inset-x-0 bottom-0 h-[200px] md:h-[240px] pointer-events-none z-[5] overflow-hidden flex items-end justify-center opacity-30 dark:opacity-25 transition-opacity duration-500 ${
          isPinnedDesktop && !hasRevealedRef.current ? 'opacity-0' : ''
        }`}
        style={{
          maskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
        }}
      >
        <CrowdCanvas src="/images/peeps/all-peeps.png" count={18} />
      </div>

      {/* ── STAGE 1: MONUMENTAL WORDMARK & EXPLORATION INVITATION ── */}
      <div
        ref={wordmarkStageRef}
        className={`relative z-10 w-full mx-auto flex flex-col items-center justify-center text-center ${containerWidthClass}`}
      >
        {/* Studio Top Kicker Badge */}
        <div
          ref={kickerRef}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-base)] bg-[var(--bg-surface)]/80 backdrop-blur-md mb-6 shadow-xs pointer-events-auto ${
            isPinnedDesktop && !hasRevealedRef.current ? 'opacity-0' : ''
          }`}
        >
          <span className="font-body text-xs text-[var(--text-secondary)] font-medium">
            Software Studio · Bengaluru
          </span>
        </div>

        {/* Monumental Wordmark */}
        <div className="relative inline-flex items-baseline justify-center max-w-full mb-4">
          <h1
            ref={wordmarkRef}
            className={`font-display font-black tracking-[-0.035em] select-none inline-flex items-baseline justify-center leading-none text-center drop-shadow-sm relative ${device.isTV ? 'text-hero-tv' : 'text-[clamp(3.5rem,8.8vw,7.8rem)]'
              }`}
          >
            {/* Luminous Flying Ball with Solid Purple Body */}
            <div
              ref={flyingBallRef}
              className="absolute w-4 h-4 rounded-full pointer-events-none z-30 opacity-0"
              style={{
                backgroundColor: '#8B5CF6',
                boxShadow: '0 0 14px #8B5CF6, 0 0 28px rgba(124, 58, 237, 0.75)',
                top: 0,
                left: 0,
                willChange: 'transform, opacity',
              }}
            />

            <span className="inline-flex items-baseline">
              {['N', 'a', 'y', 'a', 'k'].map((char, i) => (
                <span
                  key={`nayak-${i}`}
                  ref={(el) => {
                    letterRefs.current[i] = el
                  }}
                  className={`hero-letter inline-block will-change-transform text-[var(--text-primary)] dark:drop-shadow-[0_2px_16px_rgba(124,58,237,0.25)] ${isPinnedDesktop && !hasRevealedRef.current ? 'opacity-0' : ''
                    }`}
                >
                  {char}
                </span>
              ))}
            </span>

            <span className="inline-block w-[0.24em]">&nbsp;</span>

            <span className="inline-flex items-baseline">
              {['L', 'a', 'b', 's'].map((char, i) => (
                <span
                  key={`labs-${i}`}
                  ref={(el) => {
                    letterRefs.current[5 + i] = el
                  }}
                  className={`hero-letter inline-block will-change-transform text-[var(--text-primary)] dark:drop-shadow-[0_2px_16px_rgba(124,58,237,0.25)] ${isPinnedDesktop && !hasRevealedRef.current ? 'opacity-0' : ''
                    }`}
                >
                  {char}
                </span>
              ))}
            </span>

            <span
              ref={periodRef}
              onClick={handlePeriodClick}
              className={`text-[var(--accent-primary)] cursor-pointer select-none pointer-events-auto transition-all duration-300 hover:scale-125 active:scale-95 inline-block ml-[0.04em] will-change-transform ${
                isPinnedDesktop && !hasRevealedRef.current ? 'opacity-0' : ''
              }`}
              style={{
                color: activeAccent.color,
                textShadow: `0 0 14px ${activeAccent.color}, 0 0 28px ${activeAccent.color}`,
              }}
              title={`Active Accent: ${activeAccent.name} · Click to cycle`}
              aria-label={`Cycle accent color. Current: ${activeAccent.name}`}
            >
              .
            </span>
          </h1>
        </div>

        <p
          ref={sublineRef}
          className={`font-body text-base text-[var(--text-secondary)] mb-10 max-w-xl mx-auto opacity-90 px-4 ${
            isPinnedDesktop && !hasRevealedRef.current ? 'opacity-0' : ''
          }`}
        >
          We build software people actually use.
        </p>

        {/* Scroll Prompt Indicator */}
        <div
          ref={scrollPromptRef}
          onClick={() => {
            window.scrollTo({ top: window.innerHeight * 1.1, behavior: 'smooth' })
          }}
          className={`inline-flex flex-col items-center gap-2 cursor-pointer pointer-events-auto opacity-80 hover:opacity-100 transition-opacity ${
            isPinnedDesktop && !hasRevealedRef.current ? 'opacity-0' : ''
          }`}
        >
          <span className="font-body text-xs text-[var(--text-muted)] font-medium">
            Scroll to explore
          </span>
          <div className="w-5 h-8 rounded-full border border-[var(--border-base)] flex items-start justify-center p-1">
            <span className="w-1 h-2 rounded-full bg-[var(--accent-primary)] animate-bounce" />
          </div>
        </div>
      </div>

      {/* ── STAGE 2: REVEALED 3D FAN-OUT CARDS WORKBENCH (PINNED OVERLAY) ── */}
      <div
        ref={revealedContentRef}
        className={`absolute z-20 w-full mx-auto flex flex-col items-center justify-center pointer-events-none opacity-0 will-change-transform ${containerWidthClass}`}
      >
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="font-display font-bold text-2xl lg:text-3xl text-[var(--text-primary)] tracking-tight">
            Three things we do really well
          </h2>
          <p className="font-body text-xs text-[var(--text-secondary)] mt-1">
            Enterprise software platforms, specialized engineering pods, and technical academies.
          </p>
        </div>

        {/* 3 Interactive Cards with 3D Mouse Tilt & BorderBeams */}
        <div
          ref={cardsContainerRef}
          className="w-full grid grid-cols-3 gap-5 lg:gap-6 mb-6"
        >
          {/* Products */}
          <Link
            ref={(el) => {
              cardRefs.current[0] = el
            }}
            to="/products"
            onMouseMove={(e) => handleCardMouseMove(e, 0)}
            onMouseLeave={() => handleCardMouseLeave(0)}
            className="card-tactile drafting-card p-5 lg:p-6 flex flex-col justify-between group cursor-pointer will-change-transform relative overflow-hidden"
          >
            <BorderBeam size={180} duration={12} delay={0} colorFrom="var(--accent-primary)" colorTo="var(--accent-secondary)" />
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="p-2.5 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="font-body text-xs px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--accent-primary)] font-medium">
                  Products
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
                Products & Platforms
              </h3>
              <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                Interactive tools, visual learning platforms, and curated networks built for everyday use.
              </p>
              <div className="flex flex-wrap gap-1.5 font-body text-[11px] text-[var(--text-muted)] mb-3">
                <span className="px-2 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-base)]">
                  Event Mesh
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-base)]">
                  DI Notes
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between font-body text-xs text-[var(--accent-primary)] font-semibold group-hover:underline">
              <span>Explore products</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Services */}
          <Link
            ref={(el) => {
              cardRefs.current[1] = el
            }}
            to="/services"
            onMouseMove={(e) => handleCardMouseMove(e, 1)}
            onMouseLeave={() => handleCardMouseLeave(1)}
            className="card-tactile drafting-card p-5 lg:p-6 flex flex-col justify-between group cursor-pointer will-change-transform relative overflow-hidden"
          >
            <BorderBeam size={180} duration={12} delay={4} colorFrom="var(--accent-secondary)" colorTo="var(--accent-primary)" />
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="p-2.5 rounded-xl bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="font-body text-xs px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--accent-secondary)] font-medium">
                  Services
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-secondary)] transition-colors">
                Engineering Services
              </h3>
              <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                Dedicated engineering teams building modern web applications, FastAPI backends, and cloud infrastructure.
              </p>
              <div className="flex flex-wrap gap-1.5 font-body text-[11px] text-[var(--text-muted)] mb-3">
                <span className="px-2 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-base)]">
                  Web Applications
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-base)]">
                  Cloud Infrastructure
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between font-body text-xs text-[var(--accent-secondary)] font-semibold group-hover:underline">
              <span>View services</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Academics */}
          <Link
            ref={(el) => {
              cardRefs.current[2] = el
            }}
            to="/academics"
            onMouseMove={(e) => handleCardMouseMove(e, 2)}
            onMouseLeave={() => handleCardMouseLeave(2)}
            className="card-tactile drafting-card p-5 lg:p-6 flex flex-col justify-between group cursor-pointer will-change-transform relative overflow-hidden"
          >
            <BorderBeam size={180} duration={12} delay={8} colorFrom="var(--accent-tertiary)" colorTo="var(--accent-secondary)" />
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="p-2.5 rounded-xl bg-[var(--accent-tertiary)]/10 text-[var(--accent-tertiary)]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-body text-xs px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--accent-tertiary)] font-medium">
                  Training
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-tertiary)] transition-colors">
                Technical Training
              </h3>
              <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                Hands-on training in real-world systems architecture, backend engineering, and production codebases.
              </p>
              <div className="flex flex-wrap gap-1.5 font-body text-[11px] text-[var(--text-muted)] mb-3">
                <span className="px-2 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-base)]">
                  Live Mentorship
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-base)]">
                  Production Codebases
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between font-body text-xs text-[var(--accent-tertiary)] font-semibold group-hover:underline">
              <span>Explore training</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Scope Badges */}
        <div className="w-full grid grid-cols-4 gap-3.5 pt-3 border-t border-[var(--border-base)]">
          <div className="p-2.5 lg:p-3 rounded-2xl glass-panel specular-border text-center flex flex-col items-center justify-center">
            <Code2 className="w-4 h-4 text-[var(--accent-primary)] mb-1" />
            <div className="font-body text-xs font-semibold text-[var(--text-primary)]">
              Senior Pods
            </div>
            <div className="font-body text-[10px] text-[var(--text-muted)]">Direct Founder Access</div>
          </div>
          <div className="p-2.5 lg:p-3 rounded-2xl glass-panel specular-border text-center flex flex-col items-center justify-center">
            <Cpu className="w-4 h-4 text-[var(--accent-secondary)] mb-1" />
            <div className="font-body text-xs font-semibold text-[var(--text-primary)]">
              Practical AI
            </div>
            <div className="font-body text-[10px] text-[var(--text-muted)]">Built for Production</div>
          </div>
          <div className="p-2.5 lg:p-3 rounded-2xl glass-panel specular-border text-center flex flex-col items-center justify-center">
            <Layers className="w-4 h-4 text-[var(--accent-tertiary)] mb-1" />
            <div className="font-body text-xs font-semibold text-[var(--text-primary)]">
              Direct Mentorship
            </div>
            <div className="font-body text-[10px] text-[var(--text-muted)]">Learn from Builders</div>
          </div>
          <div className="p-2.5 lg:p-3 rounded-2xl glass-panel specular-border text-center flex flex-col items-center justify-center">
            <Zap className="w-4 h-4 text-[var(--accent-primary)] mb-1" />
            <div className="font-body text-xs font-semibold text-[var(--text-primary)]">
              Working Code
            </div>
            <div className="font-body text-[10px] text-[var(--text-muted)]">Shipped Weekly</div>
          </div>
        </div>
      </div>

    </section>
  )
}

