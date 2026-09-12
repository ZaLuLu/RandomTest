import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Terminal, Globe, GraduationCap, Code2, Cpu, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react'
import { DIVISIONS, SCOPE_BADGES } from '../../../data/divisions'
import { ambientAudio } from '../../../utils/audioEngine'

interface TabletHeroProps {
  onScrollToDivision?: (id: string) => void
}

export function TabletHero({ onScrollToDivision }: TabletHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Lightweight native canvas particle/mesh background for Tablet
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle nodes
    const particleCount = 24
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2 + 1,
    }))

    let isVisible = true
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          isVisible = entries[0].isIntersecting
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(canvas)

    const render = () => {
      if (!isVisible || prefersReducedMotion) {
        if (!prefersReducedMotion) {
          animationFrameId = requestAnimationFrame(render)
        }
        return
      }

      ctx.clearRect(0, 0, width, height)

      // Connect near nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.22
            ctx.beginPath()
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
            ctx.lineWidth = 1
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw and move particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(167, 139, 250, 0.45)'
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const getDivisionIcon = (letter: string) => {
    switch (letter) {
      case 'P':
        return <Terminal className="w-4 h-4 text-violet-400" />
      case 'S':
        return <Globe className="w-4 h-4 text-indigo-400" />
      case 'A':
        return <GraduationCap className="w-4 h-4 text-sky-400" />
      default:
        return <Terminal className="w-4 h-4" />
    }
  }

  const getScopeIcon = (name: string) => {
    switch (name) {
      case 'Code2':
        return <Code2 className="w-4 h-4 text-violet-400" />
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-indigo-400" />
      case 'Layers':
        return <Layers className="w-4 h-4 text-sky-400" />
      case 'Zap':
      case 'Sparkles':
        return <Zap className="w-4 h-4 text-violet-400" />
      default:
        return <Code2 className="w-4 h-4" />
    }
  }

  return (
    <section
      id="hero"
      className="relative w-full flex flex-col justify-start px-6 sm:px-8 pt-20 pb-8 overflow-hidden select-none"
    >
      {/* Native Kinetic Canvas Mesh */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-50 dark:opacity-35 -z-10"
      />

      {/* ── 1. PROMINENT NAYAK LABS BRAND IDENTITY (CENTERED) ── */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center mb-8">
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-md shadow-xs">
            <span className="font-mono text-[10.5px] tracking-widest uppercase text-violet-300 font-bold">
              Nayak Labs · Software Studio
            </span>
          </div>

          <span className="font-mono text-[10px] text-emerald-400 font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Shipping Weekly
          </span>
        </div>

        {/* Big Bold Authoritative Studio Branding */}
        <h1 className="font-display font-black text-[clamp(3.5rem,8.5vw,5.5rem)] leading-[0.98] tracking-tight text-[var(--text-primary)] mb-3 text-center">
          Nayak Labs<span className="text-violet-500 drop-shadow-[0_0_16px_rgba(139,92,246,0.85)]">.</span>
        </h1>

        <p className="font-display font-bold text-lg sm:text-2xl text-[var(--text-primary)] tracking-tight mb-2 text-center">
          We build software tools, web applications, and hands-on technical training.
        </p>

        <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto text-center mb-4">
          Software engineering studio shipping developer platforms, full-stack applications with 100% code ownership, and real-world engineering mentorship.
        </p>

        {/* Quick Identity Breakdown Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px]">
          <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-base)] text-violet-400 font-bold">
            Developer Tools
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-base)] text-indigo-400 font-bold">
            Engineering Services
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-base)] text-sky-400 font-bold">
            Technical Training
          </span>
        </div>
      </div>

      {/* ── 2. THREE PSA PILLAR CARDS (COMPACT & RICH) ── */}
      <div className="w-full grid grid-cols-3 gap-3.5 mb-6">
        {DIVISIONS.map((div) => (
          <Link
            key={div.id}
            to={div.route}
            onClick={() => ambientAudio.playTick()}
            className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-base)] hover:border-[var(--border-hover)] flex flex-col justify-between group active:scale-[0.98] transition-all duration-200 shadow-md shadow-black/5 relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-base)]">
                  {getDivisionIcon(div.letter)}
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-base)] text-violet-400 font-bold">
                  {div.code}
                </span>
              </div>

              <h2 className="font-display font-bold text-base text-[var(--text-primary)] mb-1 group-hover:text-violet-400 transition-colors">
                {div.title}
              </h2>
              <p className="font-body text-[11.5px] text-[var(--text-secondary)] leading-snug mb-3 line-clamp-2">
                {div.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3 font-mono text-[8.5px]">
                {div.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--text-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2.5 border-t border-[var(--border-base)] flex items-center justify-between font-mono text-[11px] text-violet-400 font-bold">
              <span>{div.ctaText}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── 3. FOUR-QUADRANT TELEMETRY MATRIX ── */}
      <div className="w-full grid grid-cols-4 gap-2.5 pt-4 border-t border-[var(--border-base)]">
        {SCOPE_BADGES.map((b) => (
          <div
            key={b.title}
            className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-base)] flex flex-col items-center text-center"
          >
            <div className="mb-1">{getScopeIcon(b.iconName)}</div>
            <div className="font-mono text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
              {b.title}
            </div>
            <div className="font-body text-[9px] text-[var(--text-muted)] mt-0.5">{b.subtitle}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
