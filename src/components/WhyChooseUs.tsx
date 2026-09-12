import React, { useState } from 'react'
import { ScrollReveal } from './ScrollReveal'
import { SectionEyebrow } from './SectionEyebrow'
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, GitCommit, FileCode, Clock } from 'lucide-react'
import { BorderBeam } from './ui/BorderBeam'

interface MilestoneStep {
  id: string
  num: string
  title: string
  timeline: string
  badge: string
  desc: string
  deliverables: string[]
  icon: React.ElementType
}

const STEPS: MilestoneStep[] = [
  {
    id: 'discovery',
    num: '01',
    title: 'Architecture & Scoping',
    timeline: 'Step 1',
    badge: 'Planning',
    desc: 'We map out your data models, core workflows, and third-party integrations. We establish exact milestones, API contracts, and an agreed delivery timeline.',
    deliverables: ['System Architecture & Schema Specs', 'Milestone & Delivery Schedule', 'Mutual IP & Non-Disclosure Agreement'],
    icon: FileCode,
  },
  {
    id: 'prototype',
    num: '02',
    title: 'Interactive Staging Demo',
    timeline: 'Step 2',
    badge: 'UX & Review',
    desc: 'We deploy an early working build to a private staging environment. You click through real screens, verify core interactions, and give feedback before full backend wiring.',
    deliverables: ['Live Staging URL', 'Interactive User Flow Review', 'Design System & UI Components'],
    icon: Zap,
  },
  {
    id: 'build',
    num: '03',
    title: 'Production Build & Automated Tests',
    timeline: 'Step 3',
    badge: 'Engineering',
    desc: 'We build the full application in FastAPI, Next.js, and TypeScript. We hook up authentication, database schemas, background workers, and automated test suites.',
    deliverables: ['Full-Stack Production App', 'End-to-End & Integration Tests', 'Async Demos & Direct Chat Updates'],
    icon: GitCommit,
  },
  {
    id: 'transfer',
    num: '04',
    title: 'Repository Handover & Cloud Setup',
    timeline: 'Step 4',
    badge: 'Ownership',
    desc: 'We hand over git repository ownership, cloud accounts, and environment secrets directly to your team. You own every line of code and every infrastructure asset.',
    deliverables: ['Full Git Repository Ownership', 'Production Cloud Infrastructure Setup', 'Architecture Docs & Runbooks'],
    icon: ShieldCheck,
  },
  {
    id: 'warranty',
    num: '05',
    title: 'Launch Support & Monitoring',
    timeline: 'Step 5',
    badge: 'Support',
    desc: 'We stand by what we ship. We monitor performance, triage any unexpected bugs, and help your team get fully comfortable with the codebase.',
    deliverables: ['30-Day Post-Launch Support', 'Error Tracking & Health Monitoring', 'Handover Walkthrough Session'],
    icon: Clock,
  },
]

export function WhyChooseUs() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const activeStep = STEPS[activeStepIndex]
  const IconComponent = activeStep.icon

  return (
    <section
      id="why-us"
      className="py-14 md:py-18 flex flex-col justify-center relative before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[var(--border-base)] before:to-transparent scroll-mt-20"
      aria-labelledby="why-headline"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-6 gap-3">
          <ScrollReveal delay={0}>
            <SectionEyebrow label="How We Build" />
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.08}>
          <div className="max-w-3xl mb-8">
            <h2
              id="why-headline"
              className="text-section-h font-display font-bold text-[var(--text-primary)] tracking-tight leading-[1.1] mb-3"
            >
              From idea to production in five clear steps.
            </h2>
            <p className="font-body text-base text-[var(--text-secondary)] leading-relaxed">
              Every deliverable is tested and reviewed before moving to the next phase. Click below to explore our delivery process.
            </p>
          </div>
        </ScrollReveal>


        {/* Linear Stepper Navigation Bar (3D Tactile Switches) */}
        <ScrollReveal delay={0.12}>
          <div className="relative p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-violet-500/[0.08] via-indigo-500/[0.05] to-fuchsia-500/[0.08] dark:from-violet-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 backdrop-blur-xl border border-violet-500/25 dark:border-violet-500/35 shadow-[0_8px_30px_rgba(124,58,237,0.12),inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] mb-8 overflow-hidden">
            {/* Ambient Glow Accents */}
            <div className="absolute -top-10 -left-10 w-36 h-36 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
              {STEPS.map((step, idx) => {
                const isActive = activeStepIndex === idx
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      setActiveStepIndex(idx)
                    }}
                    className={`py-3 px-3 sm:py-3.5 sm:px-3.5 rounded-xl font-mono text-xs transition-all duration-200 flex flex-col items-start gap-1 cursor-pointer text-left ${isActive
                        ? 'bg-[var(--bg-surface-elevated)] border-2 border-[var(--accent-primary)] text-[var(--text-primary)] shadow-[0_4px_20px_rgba(124,58,237,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] translate-y-[-2px]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/40 dark:hover:bg-white/5 border border-transparent hover:border-violet-500/20 hover:-translate-y-0.5'
                      }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${isActive
                          ? 'bg-[var(--accent-primary)] text-white shadow-xs'
                          : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'
                        }`}>
                        {step.num}
                      </span>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-[var(--text-muted)]">
                        {step.timeline.split(' ')[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 w-full mt-0.5">
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)] animate-pulse shrink-0" />
                      )}
                      <span className="font-display font-bold text-xs truncate">
                        {step.title.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Interactive Active Milestone Panel */}
        <ScrollReveal delay={0.16} variant="blur-focus">
          <div className="card-tactile drafting-card p-6 sm:p-10 relative overflow-hidden group">
            <BorderBeam size={280} duration={14} colorFrom="var(--accent-primary)" colorTo="var(--accent-secondary)" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
              {/* Left Column: Stage Detail */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] shadow-sm">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="font-body text-xs px-2.5 py-0.5 rounded-full border border-[var(--border-base)] bg-[var(--bg-surface-elevated)] text-[var(--accent-primary)] font-bold shadow-xs">
                    Stage {activeStep.num} · {activeStep.badge}
                  </span>
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    {activeStep.timeline}
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)] mb-4">
                  {activeStep.title}
                </h3>

                <p className="font-body text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                  {activeStep.desc}
                </p>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-base)]">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i <= activeStepIndex
                          ? 'w-8 bg-[var(--accent-primary)] shadow-[0_0_12px_var(--accent-primary)]'
                          : 'w-2 bg-[var(--border-base)]'
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Verified Deliverables Checklist (3D Glass Inset) */}
              <div className="lg:col-span-5 p-6 rounded-2xl card-inset-well shadow-lg">
                <div className="font-body text-xs text-[var(--text-muted)] font-semibold mb-4 uppercase tracking-wider">
                  Verified Deliverables
                </div>
                <div className="space-y-3.5">
                  {activeStep.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[var(--text-primary)]">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                      <span className="font-body font-medium leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-base)] flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">
                    {activeStepIndex === STEPS.length - 1 ? 'Pipeline complete' : `Next: Stage ${STEPS[activeStepIndex + 1]?.num}`}
                  </span>
                  <button
                    onClick={() => {
                      setActiveStepIndex((prev) => (prev + 1) % STEPS.length)
                    }}
                    className="btn-primary py-1.5 px-4 text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{activeStepIndex === STEPS.length - 1 ? 'Restart' : 'Next stage'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
