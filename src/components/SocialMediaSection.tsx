import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ScrollReveal } from './ScrollReveal'
import { SectionEyebrow } from './SectionEyebrow'
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react'
import nayakLabsImg from '../assets/NayakLabs.png'
const nayakLabsLogoImg = nayakLabsImg

export interface InstagramPost {
  id: string
  image: string
  caption: string
  date: string
  postUrl: string
  tag?: string
  likesCount: number
  commentsCount: number
  slideCount?: string
  location?: string
}

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'post-1',
    image: nayakLabsLogoImg,
    caption: 'Shipped v2.0 of Event Mesh 3D — interactive event topology with global latency clustering and live hub filtering.',
    date: '2d ago',
    postUrl: 'https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw==',
    tag: '#BuildLog',
    likesCount: 1420,
    commentsCount: 38,
    slideCount: '1/4',
    location: 'Studio Bengaluru',
  },
  {
    id: 'post-2',
    image: nayakLabsImg,
    caption: 'Why we rewrote DI Notes visualizer in clean Canvas instead of heavy WebGL: reducing bundle sizes and improving low-end mobile performance.',
    date: '4d ago',
    postUrl: 'https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw==',
    tag: '#Architecture',
    likesCount: 2380,
    commentsCount: 54,
    slideCount: '1/6',
    location: 'Engineering',
  },
  {
    id: 'post-3',
    image: nayakLabsLogoImg,
    caption: 'Applications are open for our upcoming engineering cohort. Small groups, live code reviews, and building real production software.',
    date: '1w ago',
    postUrl: 'https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw==',
    tag: '#Training',
    likesCount: 3120,
    commentsCount: 82,
    slideCount: '1/5',
    location: 'Academy',
  },
  {
    id: 'post-4',
    image: nayakLabsImg,
    caption: 'Event Mesh crossed 500+ active developer summits, systems workshops, and hackathons listed across tech hubs.',
    date: '2w ago',
    postUrl: 'https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw==',
    tag: '#Community',
    likesCount: 1890,
    commentsCount: 41,
    slideCount: '1/3',
    location: 'Event Mesh',
  },
  {
    id: 'post-5',
    image: nayakLabsImg,
    caption: 'How we built an internal ops automation tool for a growing brand in 6 weeks — from scoping to production deployment.',
    date: '3w ago',
    postUrl: 'https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw==',
    tag: '#CaseStudy',
    likesCount: 4500,
    commentsCount: 112,
    slideCount: '1/8',
    location: 'Services',
  },
]


function InstagramLogoSvg({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export function SocialMediaSection() {
  const [posts, setPosts] = useState<InstagramPost[]>(() =>
    [...INSTAGRAM_POSTS].sort(() => Math.random() - 0.5)
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})

  const stageRef = useRef<HTMLDivElement>(null)
  const dragStartX = useRef<number | null>(null)
  const dragDistance = useRef<number>(0)
  const isDragging = useRef<boolean>(false)

  // Fetch user-uploaded posts from /social-posts/manifest.json
  useEffect(() => {
    fetch('/social-posts/manifest.json')
      .then((res) => {
        if (!res.ok) throw new Error('No manifest found')
        return res.json()
      })
      .then((data) => {
        if (data && Array.isArray(data.posts) && data.posts.length > 0) {
          const mapped: InstagramPost[] = data.posts.map((p: any, idx: number) => ({
            id: p.id || `uploaded-post-${idx}`,
            image: p.image || nayakLabsLogoImg,
            caption: p.caption || '',
            date: p.date || 'Recent',
            postUrl: p.postUrl || 'https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw==',
            tag: p.tag || '#BuildLog',
            likesCount: p.likesCount || 1200 + Math.floor(Math.random() * 800),
            commentsCount: p.commentsCount || 20 + Math.floor(Math.random() * 50),
            slideCount: p.slideCount || '1/4',
            location: p.location || 'Studio Bengaluru',
          }))
          // Randomize / shuffle carousel posts
          setPosts([...mapped].sort(() => Math.random() - 0.5))
        }
      })
      .catch(() => {
        // Keep fallback shuffled posts
      })
  }, [])

  const total = posts.length

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total)
  }, [total])

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // Autoplay with hover pause
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(nextSlide, 4800)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide])

  // Horizontal trackpad two-finger scroll listener with gesture smoothing
  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    let accumulatedDelta = 0
    let lastTriggerTime = 0

    const onWheelHandler = (e: WheelEvent) => {
      // Check if horizontal scrolling is dominant (trackpad 2-finger horizontal swipe or shift+wheel)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 8) {
        e.preventDefault()
        accumulatedDelta += e.deltaX
        const now = performance.now()

        // Debounced threshold trigger for smooth single-step advancement
        if (now - lastTriggerTime > 300 && Math.abs(accumulatedDelta) > 28) {
          if (accumulatedDelta > 0) {
            nextSlide()
          } else {
            prevSlide()
          }
          accumulatedDelta = 0
          lastTriggerTime = now
        }
      } else {
        accumulatedDelta = 0
      }
    }

    el.addEventListener('wheel', onWheelHandler, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheelHandler)
    }
  }, [nextSlide, prevSlide])

  // Drag and swipe gesture handling
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    dragStartX.current = clientX
    dragDistance.current = 0
    isDragging.current = true
    setIsPaused(true)
  }

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) return
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    dragDistance.current = clientX - dragStartX.current
  }

  const handleTouchEnd = () => {
    if (!isDragging.current) return
    isDragging.current = false
    setIsPaused(false)
    if (dragDistance.current > 40) {
      prevSlide()
    } else if (dragDistance.current < -40) {
      nextSlide()
    }
    dragStartX.current = null
    dragDistance.current = 0
  }

  const handleCardClick = (idx: number, postUrl: string) => {
    if (Math.abs(dragDistance.current) > 10) return
    if (idx === activeIndex) {
      window.open(postUrl, '_blank', 'noopener,noreferrer')
    } else {
      setActiveIndex(idx)
    }
  }

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section
      id="social"
      className="py-10 md:py-14 flex flex-col justify-center relative before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[var(--border-base)] before:to-transparent scroll-mt-16 overflow-hidden touch-pan-y"
      aria-labelledby="social-headline"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-10 w-full touch-pan-y">
        {/* Eyebrow & Headline */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-4 gap-2">
          <ScrollReveal delay={0}>
            <SectionEyebrow label="Engineering Dispatch" />
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.08}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="max-w-xl">
              <h2
                id="social-headline"
                className="text-section-h font-display font-bold text-[var(--text-primary)] tracking-tight leading-[1.1] mb-2"
              >
                Behind the Build.
              </h2>
              <p className="font-body text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Engineering logs, technical writeups, and platform releases directly from our builders in Bengaluru.
              </p>
            </div>


            {/* Direct Profile CTA Button */}
            <a
              href="https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-semibold bg-gradient-to-r from-[#833ab4]/15 via-[#fd1d1d]/15 to-[#fcb045]/15 hover:from-[#833ab4]/25 hover:via-[#fd1d1d]/25 hover:to-[#fcb045]/25 border border-[var(--border-base)] text-[var(--text-primary)] transition-all shrink-0 self-start sm:self-end shadow-2xs group"
            >
              <InstagramLogoSvg className="w-3.5 h-3.5 text-[#E1306C]" />
              <span>@nayaklabs.ai</span>
              <ExternalLink className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
            </a>
          </div>
        </ScrollReveal>

        {/* Skiper49 Inverted Perspective 3D Carousel Stage - Two Finger Scrollable */}
        <ScrollReveal delay={0.12} variant="blur-focus">
          <div
            ref={stageRef}
            className="relative min-h-[440px] sm:min-h-[480px] md:min-h-[510px] w-full flex items-center justify-center py-4 select-none perspective-1200 cursor-grab active:cursor-grabbing touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
          >
            {posts.map((item, idx) => {
              let diff = idx - activeIndex
              if (diff > total / 2) diff -= total
              if (diff < -total / 2) diff += total

              const isCenter = diff === 0
              const isRight1 = diff === 1
              const isLeft1 = diff === -1
              const isRight2 = diff === 2
              const isLeft2 = diff === -2

              let translateX = '0%'
              let translateZ = 0
              let rotateY = 0
              let scale = 1
              let opacity = 1
              let blur = '0px'
              let zIndex = 40

              if (isCenter) {
                translateX = '0%'
                translateZ = 0
                rotateY = 0
                scale = 1
                opacity = 1
                blur = '0px'
                zIndex = 40
              } else if (isRight1) {
                translateX = '64%'
                translateZ = -80
                rotateY = -20
                scale = 0.88
                opacity = 0.78
                blur = '1.5px'
                zIndex = 30
              } else if (isLeft1) {
                translateX = '-64%'
                translateZ = -80
                rotateY = 20
                scale = 0.88
                opacity = 0.78
                blur = '1.5px'
                zIndex = 30
              } else if (isRight2) {
                translateX = '114%'
                translateZ = -150
                rotateY = -32
                scale = 0.76
                opacity = 0.4
                blur = '4px'
                zIndex = 20
              } else if (isLeft2) {
                translateX = '-114%'
                translateZ = -150
                rotateY = 32
                scale = 0.76
                opacity = 0.4
                blur = '4px'
                zIndex = 20
              } else {
                translateX = diff > 0 ? '150%' : '-150%'
                translateZ = -220
                rotateY = diff > 0 ? -42 : 42
                scale = 0.65
                opacity = 0
                blur = '6px'
                zIndex = 10
              }

              const isLiked = !!likedPosts[item.id]
              const currentLikes = isLiked ? item.likesCount + 1 : item.likesCount

              return (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(idx, item.postUrl)}
                  className={`absolute w-full max-w-[290px] sm:max-w-[330px] md:max-w-[360px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${isCenter ? 'pointer-events-auto' : 'pointer-events-auto hover:opacity-95'
                    }`}
                  style={{
                    transform: `translateX(${translateX}) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    transformStyle: 'preserve-3d',
                    opacity,
                    filter: `blur(${blur})`,
                    zIndex,
                    willChange: 'transform, opacity, filter',
                  }}
                >
                  {/* SLIM AUTHENTIC INSTAGRAM POST CARD */}
                  <div className="card-tactile rounded-2xl shadow-[0_18px_45px_-12px_rgba(0,0,0,0.55)] border border-[var(--border-base)] bg-[var(--bg-surface)] overflow-hidden group relative flex flex-col transition-all duration-300 hover:border-[var(--border-strong)]">

                    {/* Glowing subtle corner ambiance */}
                    <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#fd1d1d]/15 via-[#833ab4]/15 to-transparent rounded-full blur-2xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity" />

                    {/* Corner Drafting Marks */}
                    <div className="pointer-events-none absolute inset-1.5 z-20 opacity-25 group-hover:opacity-70 transition-opacity duration-300" aria-hidden="true">
                      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--border-hover)]" />
                      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--border-hover)]" />
                      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--border-hover)]" />
                      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--border-hover)]" />
                    </div>

                    {/* 1. COMPACT INSTAGRAM HEADER */}
                    <div className="px-3 py-2 sm:px-3.5 sm:py-2.5 flex items-center justify-between border-b border-[var(--border-base)] bg-[var(--bg-surface)]/90 backdrop-blur-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Story Gradient Ring */}
                        <div className="w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shrink-0 flex items-center justify-center">
                          <div className="w-full h-full rounded-full bg-[var(--bg-surface)] p-[1px] flex items-center justify-center overflow-hidden">
                            <img
                              src={nayakLabsLogoImg}
                              alt="nayaklabs.ai"
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                        </div>

                        {/* Username & Subtitle */}
                        <div className="flex flex-col min-w-0 leading-tight">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs font-bold text-[var(--text-primary)] truncate">
                              nayaklabs.ai
                            </span>
                            <CheckCircle2 className="w-3 h-3 text-[#3897f0] fill-[#3897f0] text-white shrink-0" />
                          </div>
                          <span className="font-mono text-[9px] text-[var(--text-muted)] truncate">
                            {item.location || 'Original audio'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(item.postUrl, '_blank', 'noopener,noreferrer')
                        }}
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-full"
                        aria-label="More options"
                        title="Open on Instagram"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* 2. 1:1 SQUARE IMAGE SLOT */}
                    <div className="relative w-full aspect-square bg-[#050508] overflow-hidden flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.caption}
                        className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 ease-out-expo group-hover:scale-[1.02]"
                        draggable={false}
                      />

                      {/* Floating Carousel Slide Tag */}
                      {item.slideCount && (
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md font-mono text-[10px] font-semibold text-white/90 border border-white/10 pointer-events-none">
                          {item.slideCount}
                        </div>
                      )}
                    </div>

                    {/* 3. TIGHT INSTAGRAM FOOTER */}
                    <div className="p-3 sm:p-3.5 flex flex-col gap-1.5 bg-[var(--bg-surface)]">
                      {/* Action Icons Row */}
                      <div className="flex items-center justify-between text-[var(--text-primary)]">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => toggleLike(item.id, e)}
                            className="hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                            aria-label={isLiked ? 'Unlike' : 'Like'}
                          >
                            <Heart
                              className={`w-4.5 h-4.5 transition-colors ${isLiked
                                  ? 'text-[#FF3040] fill-[#FF3040]'
                                  : 'text-[var(--text-primary)] hover:text-[#FF3040]'
                                }`}
                              strokeWidth={2}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(item.postUrl, '_blank', 'noopener,noreferrer')
                            }}
                            className="hover:text-[var(--accent-primary)] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                            aria-label="Comment"
                          >
                            <MessageCircle className="w-4.5 h-4.5" strokeWidth={2} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (navigator.share) {
                                navigator.share({ title: 'Nayak Labs Dispatch', url: item.postUrl })
                              } else {
                                window.open(item.postUrl, '_blank')
                              }
                            }}
                            className="hover:text-[var(--accent-primary)] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                            aria-label="Share"
                          >
                            <Send className="w-4.5 h-4.5 -rotate-12 translate-y-[-1px]" strokeWidth={2} />
                          </button>
                        </div>

                        {/* Bookmark Icon */}
                        <button
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-[var(--accent-primary)] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                          aria-label="Save"
                        >
                          <Bookmark className="w-4.5 h-4.5" strokeWidth={2} />
                        </button>
                      </div>

                      {/* Likes Counter */}
                      <div className="font-mono text-[11px] font-bold text-[var(--text-primary)] tracking-tight">
                        {currentLikes.toLocaleString()} likes
                      </div>

                      {/* Concise Caption */}
                      <p className="text-[12px] sm:text-[12.5px] text-[var(--text-secondary)] leading-snug font-body line-clamp-2">
                        <span className="font-mono font-bold text-[var(--text-primary)] mr-1">
                          nayaklabs.ai
                        </span>
                        {item.caption}{' '}
                        {item.tag && (
                          <span className="text-[#3897f0] font-mono hover:underline">
                            {item.tag}
                          </span>
                        )}
                      </p>

                      {/* Micro bottom bar: Date & Click Prompt */}
                      <div className="pt-1 flex items-center justify-between font-mono text-[9.5px] text-[var(--text-muted)] border-t border-[var(--border-base)]">
                        <span className="uppercase tracking-wider">{item.date}</span>
                        <span className="text-[var(--accent-primary)] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Open Post →
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>

          {/* SLEEK CENTERED PURPLE-WHITE CONTROLS BAR */}
          <div className="flex flex-col items-center justify-center gap-3.5 mt-6 pt-5 border-t border-[var(--border-base)]">
            {/* Centered Navigation Cluster */}
            <div className="flex items-center gap-3">
              {/* Previous Button */}
              <button
                type="button"
                onClick={prevSlide}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-inset)] border border-[var(--border-base)] hover:border-violet-400/50 text-[var(--text-primary)] hover:text-white transition-all duration-300 shadow-sm active:scale-90 cursor-pointer"
                aria-label="Previous post"
                title="Previous post"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Counter Badge */}
              <div className="px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/20 backdrop-blur-md font-mono text-xs text-[var(--text-secondary)] shadow-inner">
                <span className="text-white font-bold font-mono">0{activeIndex + 1}</span>
                <span className="text-violet-400/70 mx-1">/</span>
                <span className="text-white/60">0{total}</span>
              </div>

              {/* Sleek Purple & White "Next Post" Button */}
              <button
                type="button"
                onClick={nextSlide}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-semibold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 border border-violet-400/40 shadow-[0_4px_18px_rgba(124,58,237,0.4)] hover:shadow-[0_6px_24px_rgba(124,58,237,0.6)] active:scale-95 transition-all duration-300 cursor-pointer"
                aria-label="Next post"
                title="Next post"
              >
                <span>Next Post</span>
                <ChevronRight className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Centered Stepper Dot Indicators */}
            <div className="flex items-center gap-1.5">
              {posts.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-400 cursor-pointer ${i === activeIndex
                      ? 'w-7 bg-gradient-to-r from-violet-500 to-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                      : 'w-2 bg-[var(--border-strong)] hover:bg-violet-400/50'
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Subtle gesture hint for desktop trackpads */}
            <p className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider opacity-60">
              Swipe with two fingers or click cards to browse
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default SocialMediaSection
