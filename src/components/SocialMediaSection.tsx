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
import { useDeviceProfile } from '../utils/useDeviceProfile'
import { ambientAudio } from '../utils/audioEngine'
import nayakLabsLogoImg from '../../Nayaklabs_Logo.jpeg'
const nayakLabsImg = nayakLabsLogoImg

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
    image: '/social-posts/NLpost1.jpeg',
    caption: 'How AI understands meaning: Words are just text to a computer — embeddings change that. Words in, numbers out, meaning preserved. A deep dive into semantic vector spaces.',
    date: '2d ago',
    postUrl: 'https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw==',
    tag: '#Embeddings',
    likesCount: 2480,
    commentsCount: 64,
    slideCount: '01/09',
    location: 'AI Research Lab',
  },
  {
    id: 'post-2',
    image: '/social-posts/NLpost2.jpeg',
    caption: "Retrieval-Augmented Generation (RAG): When LLMs don't just guess — they actually look things up. Transitioning from static Text AI to grounded, real-time Multimodal intelligence.",
    date: '4d ago',
    postUrl: 'https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw==',
    tag: '#PromptEngineering',
    likesCount: 3190,
    commentsCount: 89,
    slideCount: '01/07',
    location: 'Bengaluru Studio',
  },
  {
    id: 'post-3',
    image: '/social-posts/NLpost3.jpeg',
    caption: 'Why RAG Exists: Why AI needed a better way to find information. Moving from guessing to grounded context across 6 sections in plain English.',
    date: '1w ago',
    postUrl: 'https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw==',
    tag: '#GenerativeAI',
    likesCount: 4120,
    commentsCount: 115,
    slideCount: '01/15',
    location: 'Systems Architecture',
  },
  {
    id: 'post-4',
    image: '/social-posts/NLpost4.jpeg',
    caption: 'How AI measures similarity: Not comparing words — comparing angles. Cosine similarity and the vector mathematics powering modern semantic search engines.',
    date: '2w ago',
    postUrl: 'https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw==',
    tag: '#CosineSimilarity',
    likesCount: 3640,
    commentsCount: 78,
    slideCount: '01/10',
    location: 'Vector Math',
  },
  {
    id: 'post-5',
    image: nayakLabsLogoImg,
    caption: 'Nayak Labs: Pioneering agentic engineering, high-performance distributed systems, and real-time AI architectures from Bengaluru. Welcome to our engineering journal.',
    date: 'Featured',
    postUrl: 'https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw==',
    tag: '#NayakLabs',
    likesCount: 5280,
    commentsCount: 142,
    slideCount: 'Brand',
    location: 'Bengaluru, IN',
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

interface InstagramCardProps {
  item: InstagramPost
  isLiked: boolean
  onToggleLike: (id: string, e: React.MouseEvent) => void
  onCardClick?: () => void
  className?: string
}

function InstagramCard({
  item,
  isLiked,
  onToggleLike,
  onCardClick,
  className = '',
}: InstagramCardProps) {
  const currentLikes = isLiked ? item.likesCount + 1 : item.likesCount

  return (
    <div
      onClick={onCardClick}
      className={`card-tactile rounded-2xl shadow-[0_18px_45px_-12px_rgba(0,0,0,0.55)] border border-[var(--border-base)] bg-[var(--bg-surface)] overflow-hidden group relative flex flex-col transition-all duration-300 hover:border-[var(--border-strong)] ${className}`}
    >
      {/* Glowing subtle corner ambiance */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#fd1d1d]/15 via-[#833ab4]/15 to-transparent rounded-full blur-2xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity" />

      {/* Corner Drafting Marks */}
      <div
        className="pointer-events-none absolute inset-1.5 z-20 opacity-25 group-hover:opacity-70 transition-opacity duration-300"
        aria-hidden="true"
      >
        <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--border-hover)]" />
        <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--border-hover)]" />
        <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--border-hover)]" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--border-hover)]" />
      </div>

      {/* 1. COMPACT INSTAGRAM HEADER */}
      <div className="px-3 py-2 sm:px-3.5 sm:py-2.5 flex items-center justify-between border-b border-[var(--border-base)] bg-[var(--bg-surface)]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Story Gradient Ring */}
          <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shrink-0 flex items-center justify-center shadow-xs">
            <div className="w-full h-full rounded-full bg-[#F4ECE1] p-1 flex items-center justify-center overflow-hidden">
              <img
                src={nayakLabsLogoImg}
                alt="nayaklabs.ai"
                className="w-full h-full object-contain object-center scale-110"
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
          className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-full cursor-pointer"
          aria-label="More options"
          title="Open on Instagram"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. 1:1 SQUARE IMAGE SLOT */}
      <div className="relative w-full aspect-square bg-[#0c0d12] overflow-hidden flex items-center justify-center">
        <img
          src={item.image}
          alt={item.caption}
          className={`w-full h-full ${
            item.image === nayakLabsLogoImg
              ? 'object-contain bg-[#F4ECE1] p-6'
              : 'object-cover bg-white'
          } select-none pointer-events-none transition-transform duration-500 ease-out-expo group-hover:scale-[1.02]`}
          draggable={false}
          loading="lazy"
        />

        {/* Floating Carousel Slide Tag */}
        {item.slideCount && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md font-mono text-[10px] font-semibold text-white/95 border border-white/15 pointer-events-none shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3897f0]" />
            <span>{item.slideCount}</span>
          </div>
        )}

        {/* Hover Action Hint */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 font-mono text-xs text-white font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-[#3897f0]" />
            <span>View on Instagram</span>
          </span>
        </div>
      </div>

      {/* 3. TIGHT INSTAGRAM FOOTER */}
      <div className="p-3 sm:p-3.5 flex flex-col gap-1.5 bg-[var(--bg-surface)]">
        {/* Action Icons Row */}
        <div className="flex items-center justify-between text-[var(--text-primary)]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => onToggleLike(item.id, e)}
              className="hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart
                className={`w-4.5 h-4.5 transition-colors ${
                  isLiked
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
                  navigator.share({ title: 'Nayak Labs Dispatch', url: item.postUrl }).catch(() => {})
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
  )
}

export function SocialMediaSection() {
  const device = useDeviceProfile()
  const isTouchOrMobile = device.isTouch || device.width < 1024

  const [posts, setPosts] = useState<InstagramPost[]>(INSTAGRAM_POSTS)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})

  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragStartX = useRef<number | null>(null)
  const dragDistance = useRef<number>(0)
  const isDragging = useRef<boolean>(false)
  const isProgrammaticScroll = useRef<boolean>(false)

  // Fetch user-uploaded posts from /social-posts/manifest.json
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    fetch('/social-posts/manifest.json', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('No manifest found')
        return res.json()
      })
      .then((data) => {
        if (!isMounted) return
        if (data && Array.isArray(data.posts) && data.posts.length > 0) {
          const mapped: InstagramPost[] = data.posts.map((p: any, idx: number) => ({
            id: p.id || `uploaded-post-${idx}`,
            image:
              p.image === 'logo' ||
              p.image === '/social-posts/Nayaklabs_Logo.jpeg' ||
              p.image === '/Nayaklabs_Logo.jpeg'
                ? nayakLabsLogoImg
                : p.image || nayakLabsLogoImg,
            caption: p.caption || '',
            date: p.date || 'Recent',
            postUrl: p.postUrl || 'https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw==',
            tag: p.tag || '#BuildLog',
            likesCount: p.likesCount || 1200 + Math.floor(Math.random() * 800),
            commentsCount: p.commentsCount || 20 + Math.floor(Math.random() * 50),
            slideCount: p.slideCount || '1/4',
            location: p.location || 'Studio Bengaluru',
          }))
          setPosts(mapped)
        }
      })
      .catch(() => {})

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  const total = posts.length

  const scrollToIndex = (idx: number) => {
    setActiveIndex(idx)
    ambientAudio.playTick()
    if (!trackRef.current) return
    const card = trackRef.current.children[idx] as HTMLElement
    if (card) {
      isProgrammaticScroll.current = true
      const targetLeft = card.offsetLeft - (trackRef.current.clientWidth - card.clientWidth) / 2
      trackRef.current.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
      setTimeout(() => {
        isProgrammaticScroll.current = false
      }, 600)
    }
  }

  const handleTouchScroll = () => {
    if (isProgrammaticScroll.current || !trackRef.current) return
    const scrollLeft = trackRef.current.scrollLeft
    const cards = Array.from(trackRef.current.children) as HTMLElement[]
    if (!cards.length) return
    let closestIdx = 0
    let minDiff = Infinity
    const center = scrollLeft + trackRef.current.clientWidth / 2
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2
      const diff = Math.abs(center - cardCenter)
      if (diff < minDiff) {
        minDiff = diff
        closestIdx = i
      }
    })
    if (closestIdx !== activeIndex) {
      setActiveIndex(closestIdx)
    }
  }

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev + 1) % total
      if (trackRef.current) {
        const card = trackRef.current.children[next] as HTMLElement
        if (card) {
          isProgrammaticScroll.current = true
          const targetLeft = card.offsetLeft - (trackRef.current.clientWidth - card.clientWidth) / 2
          trackRef.current.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
          setTimeout(() => {
            isProgrammaticScroll.current = false
          }, 600)
        }
      }
      return next
    })
  }, [total])

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev - 1 + total) % total
      if (trackRef.current) {
        const card = trackRef.current.children[next] as HTMLElement
        if (card) {
          isProgrammaticScroll.current = true
          const targetLeft = card.offsetLeft - (trackRef.current.clientWidth - card.clientWidth) / 2
          trackRef.current.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
          setTimeout(() => {
            isProgrammaticScroll.current = false
          }, 600)
        }
      }
      return next
    })
  }, [total])

  // Autoplay every 2 seconds (active for all device tiers, paused on active drag/interaction)
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(nextSlide, 2000)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide])

  // Horizontal trackpad two-finger scroll listener with gesture smoothing (desktop)
  useEffect(() => {
    if (isTouchOrMobile) return
    const el = stageRef.current
    if (!el) return

    let accumulatedDelta = 0
    let lastTriggerTime = 0

    const onWheelHandler = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 8) {
        e.preventDefault()
        accumulatedDelta += e.deltaX
        const now = performance.now()

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
  }, [isTouchOrMobile, nextSlide, prevSlide])

  // Drag and swipe gesture handling (desktop fallback)
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
      if (isTouchOrMobile) {
        scrollToIndex(idx)
      } else {
        setActiveIndex(idx)
      }
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
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-10 w-full touch-pan-y">
        {/* Eyebrow & Headline */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-4 gap-2">
          <ScrollReveal delay={0}>
            <SectionEyebrow label="Engineering Dispatch" />
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.08}>
          {/* Official Brand Profile Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 sm:p-5 rounded-2xl border border-[var(--border-base)] bg-[var(--bg-surface)]/80 backdrop-blur-md relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-72 h-full bg-gradient-to-l from-violet-500/10 via-[#fd1d1d]/5 to-transparent pointer-events-none blur-xl" />

            <div className="flex items-center gap-3.5 z-10">
              <div className="relative shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#F4ECE1] p-1 flex items-center justify-center overflow-hidden">
                    <img
                      src={nayakLabsLogoImg}
                      alt="Nayak Labs"
                      className="w-full h-full object-contain object-center scale-110"
                    />
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[var(--bg-surface)]" title="Active Dispatches" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
                    nayaklabs.ai
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#3897f0] fill-[#3897f0] text-white" />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30 font-semibold hidden sm:inline-block">
                    Official Dispatches
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">
                  Engineering logs, systems architecture, and AI research from Bengaluru.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 z-10 self-start md:self-auto">
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)]/60 font-mono text-xs text-[var(--text-secondary)]">
                <div>
                  <span className="font-bold text-[var(--text-primary)]">4+</span>{' '}
                  <span className="text-[var(--text-muted)]">Slides</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
                <div>
                  <span className="font-bold text-[var(--text-primary)]">Weekly</span>{' '}
                  <span className="text-[var(--text-muted)]">Dispatches</span>
                </div>
              </div>

              <a
                href="https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-semibold bg-gradient-to-r from-[#833ab4] via-[#dc2743] to-[#f09433] hover:opacity-95 text-white shadow-[0_4px_16px_rgba(220,39,67,0.35)] transition-all transform active:scale-95 group cursor-pointer"
              >
                <InstagramLogoSvg className="w-3.5 h-3.5 text-white" />
                <span>Follow @nayaklabs.ai</span>
                <ExternalLink className="w-3 h-3 text-white/80 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="max-w-xl">
              <h2
                id="social-headline"
                className="text-section-h font-display font-bold text-[var(--text-primary)] tracking-tight leading-[1.1] mb-2"
              >
                Behind the Build.
              </h2>
              <p className="font-body text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Technical slide carousels on embeddings, retrieval-augmented generation, and vector mathematics directly from our builders.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* DUAL-MODE CAROUSEL: TOUCH NATIVE SNAP FOR MOBILE/TABLET, 3D STAGE FOR DESKTOP */}
        <ScrollReveal delay={0.12} variant="blur-focus">
          {isTouchOrMobile ? (
            <div className="w-full relative select-none">
              {/* Touch-Friendly Horizontal CSS Scroll-Snap Track */}
              <div
                ref={trackRef}
                onScroll={handleTouchScroll}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => {
                  setTimeout(() => setIsPaused(false), 1500)
                }}
                className="flex items-stretch overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-4 px-1 py-4 touch-pan-x"
              >
                {posts.map((item, idx) => (
                  <div
                    key={item.id}
                    className="snap-center shrink-0 w-[84vw] sm:w-[320px] max-w-[340px] flex flex-col cursor-pointer"
                  >
                    <InstagramCard
                      item={item}
                      isLiked={!!likedPosts[item.id]}
                      onToggleLike={toggleLike}
                      onCardClick={() => handleCardClick(idx, item.postUrl)}
                      className="w-full h-full"
                    />
                  </div>
                ))}
              </div>

              {/* Touch Carousel Pagination Controls */}
              <div className="flex items-center justify-between px-2 mt-3 pt-3 border-t border-[var(--border-base)] font-mono text-xs text-[var(--text-muted)]">
                <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                  {String(activeIndex + 1).padStart(2, '0')}{' '}
                  <span className="text-[var(--text-muted)] font-normal">/ {String(total).padStart(2, '0')}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  {posts.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        i === activeIndex
                          ? 'w-6 bg-[var(--accent-primary)] shadow-xs'
                          : 'w-1.5 bg-[var(--border-base)] hover:bg-[var(--border-hover)]'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="w-8 h-8 rounded-full border border-[var(--border-base)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] flex items-center justify-center text-[var(--text-primary)] transition-transform active:scale-90 cursor-pointer"
                    aria-label="Previous post"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="w-8 h-8 rounded-full border border-[var(--border-base)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] flex items-center justify-center text-[var(--text-primary)] transition-transform active:scale-90 cursor-pointer"
                    aria-label="Next post"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              ref={stageRef}
              className="relative min-h-[440px] sm:min-h-[480px] md:min-h-[510px] w-full flex items-center justify-center py-4 select-none perspective-1200 cursor-grab active:cursor-grabbing touch-pan-y"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
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

                return (
                  <div
                    key={item.id}
                    onClick={() => handleCardClick(idx, item.postUrl)}
                    className={`absolute w-full max-w-[290px] sm:max-w-[330px] md:max-w-[360px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${
                      isCenter ? 'pointer-events-auto' : 'pointer-events-auto hover:opacity-95'
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
                    <InstagramCard
                      item={item}
                      isLiked={!!likedPosts[item.id]}
                      onToggleLike={toggleLike}
                      onCardClick={() => handleCardClick(idx, item.postUrl)}
                    />
                  </div>
                )
              })}
            </div>
          )}

          {/* DESKTOP CONTROLS BAR */}
          {!isTouchOrMobile && (
            <div className="flex flex-col items-center justify-center gap-3.5 mt-6 pt-5 border-t border-[var(--border-base)]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-inset)] border border-[var(--border-base)] hover:border-violet-400/50 text-[var(--text-primary)] hover:text-white transition-all duration-300 shadow-sm active:scale-90 cursor-pointer"
                  aria-label="Previous post"
                  title="Previous post"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/20 backdrop-blur-md font-mono text-xs text-[var(--text-secondary)] shadow-inner">
                  <span className="text-white font-bold font-mono">{String(activeIndex + 1).padStart(2, '0')}</span>
                  <span className="text-violet-400/70 mx-1">/</span>
                  <span className="text-white/60">{String(total).padStart(2, '0')}</span>
                </div>

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

              <div className="flex items-center gap-1.5">
                {posts.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-400 cursor-pointer ${
                      i === activeIndex
                        ? 'w-7 bg-gradient-to-r from-violet-500 to-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                        : 'w-2 bg-[var(--border-strong)] hover:bg-violet-400/50'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <p className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider opacity-60">
                Swipe with two fingers or click cards to browse
              </p>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}

export default SocialMediaSection
