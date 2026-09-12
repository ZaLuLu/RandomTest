import React from 'react'
import { ScrollReveal } from './ScrollReveal'
import { SectionEyebrow } from './SectionEyebrow'
import { ArrowRight, Terminal, ShieldCheck, Layers, GitBranch, Server, Cpu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BorderBeam } from './ui/BorderBeam'

const STACK_BADGES = [
  { name: 'TypeScript', category: 'Language' },
  { name: 'Next.js & React', category: 'Frontend' },
  { name: 'FastAPI & Python', category: 'Backend' },
  { name: 'PostgreSQL & Redis', category: 'Data' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Cloudflare / AWS', category: 'Infra' },
]

export function About() {
  return (
    <section
      id="about"
      className="py-14 md:py-20 flex flex-col justify-center px-6 md:px-10 max-w-[1240px] mx-auto relative before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[var(--border-base)] before:to-transparent transition-colors duration-300"
      aria-labelledby="about-headline"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-6 gap-3">
        <ScrollReveal delay={0}>
          <SectionEyebrow label="Engineering Philosophy" />
        </ScrollReveal>
      </div>

      <div className="w-full mb-12">
        <ScrollReveal delay={0.05}>
          <div className="max-w-3xl mb-8">
            <h2
              id="about-headline"
              className="text-section-h md:text-4xl font-display font-bold text-[var(--text-primary)] tracking-tight leading-[1.18] mb-4"
            >
              Engineering teams that design, build, and ship production software alongside founders.
            </h2>
            <p className="font-body text-base md:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
              No middle layers or abstract presentations. We write clean code, design reliable database schemas, and deploy full-stack applications directly to your cloud accounts.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Core Ethos Pillars - Generous card sizing matching other main sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <ScrollReveal delay={0.16}>
            <div className="p-6 sm:p-8 rounded-2xl card-tactile drafting-card flex flex-col justify-between h-full min-h-[240px] sm:min-h-[270px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl relative overflow-hidden group">
              <div>
                <div className="p-3 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] w-fit mb-5 ring-1 ring-[var(--accent-primary)]/20 group-hover:scale-105 transition-transform">
                  <Terminal className="w-5 h-5" />
                </div>
                <div className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-2.5">
                  Working Code First
                </div>
                <div className="font-body text-sm text-[var(--text-secondary)] leading-relaxed">
                  Interactive staging builds deployed from week one so you can test real workflows, gather user feedback, and iterate quickly.
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-base)]/60 flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                <span>01 / WORKFLOW</span>
                <span className="text-[var(--accent-primary)] font-semibold">Continuous Delivery</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.20}>
            <div className="p-6 sm:p-8 rounded-2xl card-tactile drafting-card flex flex-col justify-between h-full min-h-[240px] sm:min-h-[270px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl relative overflow-hidden group">
              <div>
                <div className="p-3 rounded-xl bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] w-fit mb-5 ring-1 ring-[var(--accent-secondary)]/20 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-2.5">
                  100% IP & Code Ownership
                </div>
                <div className="font-body text-sm text-[var(--text-secondary)] leading-relaxed">
                  Full control of repositories, databases, environment secrets, and documentation. Everything resides in your cloud.
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-base)]/60 flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                <span>02 / OWNERSHIP</span>
                <span className="text-[var(--accent-secondary)] font-semibold">Full Transparency</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.24}>
            <div className="p-6 sm:p-8 rounded-2xl card-tactile drafting-card flex flex-col justify-between h-full min-h-[240px] sm:min-h-[270px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl relative overflow-hidden group">
              <div>
                <div className="p-3 rounded-xl bg-[var(--accent-tertiary)]/10 text-[var(--accent-tertiary)] w-fit mb-5 ring-1 ring-[var(--accent-tertiary)]/20 group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-2.5">
                  Direct Builder Access
                </div>
                <div className="font-body text-sm text-[var(--text-secondary)] leading-relaxed">
                  Direct communication with the engineers architecting and maintaining your codebase via shared Slack or Discord channels.
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-base)]/60 flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                <span>03 / ACCESS</span>
                <span className="text-[var(--accent-tertiary)] font-semibold">Zero Middlemen</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Production Stack & Capabilities Banner */}
      <ScrollReveal delay={0.28}>
        <div className="card-tactile drafting-card p-6 sm:p-8 relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-colors duration-300">
          <BorderBeam size={260} duration={14} colorFrom="var(--accent-primary)" colorTo="var(--accent-secondary)" />

          <div className="max-w-2xl relative z-10">
            <div className="flex items-center gap-2 mb-2 font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
              <Server className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Production Core Stack</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {STACK_BADGES.map((badge, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-base)] flex items-center gap-2 text-xs font-mono text-[var(--text-primary)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10 w-full lg:w-auto">
            <Link
              to="/services"
              className="btn-tactile py-2.5 px-5 text-xs font-body font-semibold inline-flex items-center justify-center gap-2"
            >
              <span>Explore services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}

export default About
