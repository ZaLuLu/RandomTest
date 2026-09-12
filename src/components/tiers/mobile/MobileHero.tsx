import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Terminal, Globe, GraduationCap, Code2, Cpu, Zap, Layers } from 'lucide-react'
import { SCOPE_BADGES } from '../../../data/divisions'

interface MobileHeroProps {
  onScrollToDivision?: (id: string) => void
}

export function MobileHero({ onScrollToDivision }: MobileHeroProps) {
  const getScopeIcon = (name: string) => {
    switch (name) {
      case 'Code2':
        return <Code2 className="w-4 h-4 text-[var(--accent-primary)]" />
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-[var(--accent-secondary)]" />
      case 'Layers':
        return <Layers className="w-4 h-4 text-[var(--accent-primary)]" />
      case 'Zap':
      case 'Sparkles':
        return <Zap className="w-4 h-4 text-[var(--accent-secondary)]" />
      default:
        return <Code2 className="w-4 h-4" />
    }
  }

  return (
    <section
      id="hero"
      className="relative w-full flex flex-col justify-start px-4 pt-16 pb-8 overflow-x-hidden select-none"
    >
      {/* ── STUDIO BRANDING & KICKER BADGE (CENTERED & PROMINENT) ── */}
      <div className="w-full flex flex-col items-center text-center mx-auto mb-7">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[var(--border-base)] bg-[var(--bg-surface)] backdrop-blur-md mb-3.5 shadow-xs">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--text-secondary)] font-semibold">
            Nayak Labs · Software Studio
          </span>
        </div>

        {/* ── MONUMENTAL WORDMARK ── */}
        <h1 className="font-display font-black text-[clamp(3.1rem,12.5vw,4.5rem)] leading-[0.96] tracking-tight text-[var(--text-primary)] mb-3 text-center">
          Nayak Labs<span className="text-[var(--accent-primary)] drop-shadow-[0_0_12px_var(--accent-primary)]">.</span>
        </h1>

        {/* ── EDITORIAL SUBTITLE ── */}
        <p className="font-body text-[13.5px] text-[var(--text-secondary)] leading-relaxed max-w-[340px] text-center mx-auto mb-2">
          We build software tools, web applications, and hands-on technical training.
        </p>

        {/* ── STATUS BADGE ── */}
        <span className="font-mono text-[9.5px] text-emerald-500 dark:text-emerald-400 font-bold inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mt-1">
          Shipping Weekly
        </span>
      </div>

      {/* ── 3 DIVISION CARDS WITH 3D GLOSSY BUTTONS ── */}
      <div className="w-full flex flex-col gap-3.5 mb-7">
        <div className="flex items-center justify-between px-1 mb-0.5">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--accent-primary)] font-bold">
            What We Do
          </span>
          <span className="font-mono text-[9.5px] text-[var(--text-muted)]">
            Tap to explore
          </span>
        </div>

        {/* 1. Products */}
        <Link
          to="/products"
          className="card-tactile group relative overflow-hidden rounded-2xl p-5 bg-[var(--bg-card)] border border-[var(--border-base)] hover:border-[var(--border-hover)] flex flex-col justify-between active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-[var(--accent-primary)]/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8 group-hover:bg-[var(--accent-primary)]/20 transition-all duration-500" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/15">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-mono text-[9.5px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--accent-primary)] font-bold">
                Tools
              </span>
            </div>

            <h2 className="font-display font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-1">
              Developer Tools
            </h2>
            <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Lightweight event brokers, documentation studios, and utilities built for developers.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between">
            <span className="font-mono text-[10px] text-[var(--text-muted)] font-medium">Event Mesh · DI Notes</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold text-white bg-gradient-to-b from-violet-500 to-violet-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_3px_10px_rgba(124,58,237,0.35)] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_5px_14px_rgba(124,58,237,0.5)] group-active:translate-y-0.5 transition-all">
              <span>Explore</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>

        {/* 2. Services */}
        <Link
          to="/services"
          className="card-tactile group relative overflow-hidden rounded-2xl p-5 bg-[var(--bg-card)] border border-[var(--border-base)] hover:border-[var(--border-hover)] flex flex-col justify-between active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-[var(--accent-secondary)]/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8 group-hover:bg-[var(--accent-secondary)]/20 transition-all duration-500" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] border border-[var(--accent-secondary)]/15">
                <Globe className="w-4 h-4" />
              </div>
              <span className="font-mono text-[9.5px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--accent-secondary)] font-bold">
                Services
              </span>
            </div>

            <h2 className="font-display font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-secondary)] transition-colors mb-1">
              Engineering Services
            </h2>
            <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Dedicated engineering teams building modern web applications, FastAPI backends, and cloud infrastructure.
            </p>
          </div>

          <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between">
            <span className="font-mono text-[10px] text-[var(--text-muted)] font-medium">Web · FastAPI · Cloud</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold text-white bg-gradient-to-b from-indigo-500 to-indigo-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_3px_10px_rgba(79,70,229,0.35)] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_5px_14px_rgba(79,70,229,0.5)] group-active:translate-y-0.5 transition-all">
              <span>View Specs</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>

        {/* 3. Academics */}
        <Link
          to="/academics"
          className="card-tactile group relative overflow-hidden rounded-2xl p-5 bg-[var(--bg-card)] border border-[var(--border-base)] hover:border-[var(--border-hover)] flex flex-col justify-between active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-[var(--accent-tertiary)]/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8 group-hover:bg-[var(--accent-tertiary)]/20 transition-all duration-500" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-[var(--accent-tertiary)]/10 text-[var(--accent-tertiary)] border border-[var(--accent-tertiary)]/15">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-mono text-[9.5px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--accent-tertiary)] font-bold">
                Training
              </span>
            </div>

            <h2 className="font-display font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-tertiary)] transition-colors mb-1">
              Technical Training
            </h2>
            <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Hands-on training in real-world systems architecture, backend engineering, and production codebases.
            </p>
          </div>

          <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between">
            <span className="font-mono text-[10px] text-[var(--text-muted)] font-medium">Live Mentorship · Projects</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold text-white bg-gradient-to-b from-sky-500 to-sky-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_3px_10px_rgba(14,165,233,0.35)] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_5px_14px_rgba(14,165,233,0.5)] group-active:translate-y-0.5 transition-all">
              <span>View Tracks</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* ── 4 COMPACT SCOPE BADGES (2x2 GRID) ── */}
      <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border-base)]">
        {SCOPE_BADGES.map((b) => (
          <div
            key={b.title}
            className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-base)] flex flex-col items-center text-center shadow-xs"
          >
            <div className="mb-1">{getScopeIcon(b.iconName)}</div>
            <div className="font-mono text-[9.5px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
              {b.title}
            </div>
            <div className="font-body text-[8px] text-[var(--text-muted)] mt-0.5">{b.subtitle}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
