import React, { useState } from 'react'
import {
  Users,
  Calendar,
  Award,
  CheckCircle2,
  ChevronRight,
  X,
  Mail,
  ArrowRight,
  Terminal,
} from 'lucide-react'
import { GrainOverlay } from '../components/GrainOverlay'
import { GlobalCanvasBackground } from '../components/ui/GlobalCanvasBackground'
import { Footer } from '../components/Footer'
import { TierNavbarDispatcher } from '../components/tiers/TierDispatcher'
import { CurriculumTerminal, CURRICULUM_DATA } from '../components/academics/CurriculumTerminal'

export default function AcademicsPage() {
  const [activeWeekIdx, setActiveWeekIdx] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (waitlistEmail) {
      setWaitlistSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] relative selection:bg-[var(--accent-primary)] selection:text-white transition-colors duration-300 select-none">
      <GrainOverlay />
      <GlobalCanvasBackground />

      {/* Unified Multi-Tier Navbar */}
      <TierNavbarDispatcher />

      <main className="pt-20 sm:pt-28 pb-24 sm:pb-40 px-4 sm:px-8 md:px-12 max-w-[1240px] mx-auto relative z-10">
        {/* ── HEADER & HERO ── */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-base)] bg-[var(--bg-surface)] mb-3 sm:mb-4">
            <Award className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
            <span className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
              Technical Training & Mentorship
            </span>
          </div>

          <h1 className="font-display font-black text-[clamp(2rem,5.5vw,3.8rem)] leading-[1.08] tracking-tight text-[var(--text-primary)] mb-3 sm:mb-4">
            Learn to build production software<span className="text-[var(--accent-secondary)]">.</span>
          </h1>

          <p className="font-body text-xs sm:text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-6 sm:mb-8">
            Hands-on programs taught by engineers who write and ship production code every day. Live sessions, practical architectures, and comprehensive code reviews.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 font-mono text-xs max-w-lg">
            <div className="card-inset-well p-2.5 sm:p-3.5 text-center">
              <div className="text-[var(--text-muted)] text-[9px] sm:text-[10px] uppercase font-semibold">Programs</div>
              <div className="font-black text-xs sm:text-sm text-[var(--text-primary)] mt-0.5">3 Tracks</div>
            </div>
            <div className="card-inset-well p-2.5 sm:p-3.5 text-center">
              <div className="text-[var(--text-muted)] text-[9px] sm:text-[10px] uppercase font-semibold">Learners</div>
              <div className="font-black text-xs sm:text-sm text-[var(--text-primary)] mt-0.5">12k+ Trained</div>
            </div>
            <div className="card-inset-well p-2.5 sm:p-3.5 text-center">
              <div className="text-[var(--text-muted)] text-[9px] sm:text-[10px] uppercase font-semibold">Mentorship</div>
              <div className="font-black text-xs sm:text-sm text-[var(--text-primary)] mt-0.5">1:1 Reviews</div>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE FELLOWSHIP CODE LAB & TERMINAL (AVAILABLE ON ALL TIERS) ── */}
        <CurriculumTerminal
          activeWeekIndex={activeWeekIdx}
          onSelectWeek={(idx) => setActiveWeekIdx(idx)}
        />

        {/* ── 6-WEEK STREAMLINED CURRICULUM GRID ── */}
        <section className="hidden md:block mb-14">
          <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-[var(--border-base)]">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                Curriculum Blueprint & Code Labs
              </h2>
              <p className="font-body text-xs text-[var(--text-secondary)] mt-0.5">
                Every module produces a working repository with verified architecture deliverables. Inspect the code in the terminal above.
              </p>
            </div>
            <span className="font-mono text-xs text-[var(--accent-secondary)] font-bold shrink-0">
              Enrollment Open
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CURRICULUM_DATA.map((mod, idx) => (
              <div
                key={mod.week}
                onClick={() => setActiveWeekIdx(idx)}
                className={`card-tactile p-5 rounded-2xl border flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                  activeWeekIdx === idx
                    ? 'border-sky-500 bg-sky-500/10 shadow-md ring-1 ring-sky-500/30'
                    : 'bg-[var(--bg-card)] border-[var(--border-base)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                      activeWeekIdx === idx
                        ? 'bg-sky-500 text-white border-sky-400'
                        : 'bg-[var(--bg-surface)] border-[var(--border-base)] text-[var(--accent-secondary)]'
                    }`}>
                      WEEK {mod.week}
                    </span>
                    <Terminal className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  </div>

                  <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-2 leading-snug">
                    {mod.title}
                  </h3>

                  <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                    {mod.focus}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-base)] font-mono text-[11px]">
                  <span className="text-[10px] text-[var(--text-muted)] block uppercase font-semibold mb-0.5">Deliverable</span>
                  <span className="text-[var(--text-primary)] font-medium">{mod.deliverable}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ADMISSIONS CTA ── */}
        <section className="card-tactile p-5 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-6">
          <div>
            <span className="font-mono text-[11px] sm:text-xs font-bold text-[var(--accent-secondary)] uppercase tracking-wider">
              Cohort Admissions
            </span>
            <h2 className="font-display text-lg sm:text-2xl font-bold text-[var(--text-primary)] mt-1 mb-1">
              Ready to learn from engineers who actually ship?
            </h2>
            <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl">
              Practical tracks across FastAPI & Backend Systems, DSA & Systems Design, and Production Full-Stack Craft.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="py-3 px-6 rounded-xl font-mono text-xs font-bold text-white bg-gradient-to-b from-indigo-500 to-indigo-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_14px_rgba(79,70,229,0.35)] active:translate-y-0.5 inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Apply for Summer '26 Cohort →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </main>

      {/* Applications Waitlist Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-base)] shadow-2xl relative">
            <button
              onClick={() => {
                setModalOpen(false)
                setWaitlistSubmitted(false)
              }}
              className="absolute top-5 right-5 p-1.5 rounded-lg border border-[var(--border-base)] text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs font-semibold text-[var(--accent-secondary)] uppercase tracking-wider">
                Cohort 04 Admissions
              </span>
            </div>

            <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2">
              Apply for Upcoming Cohort
            </h3>
            <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-5">
              Enter your email to receive direct application briefing and syllabus materials.
            </p>

            {waitlistSubmitted ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-body flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You are registered! We will email you admissions instructions shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="builder@domain.com"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl text-xs font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-secondary)]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-mono text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md cursor-pointer"
                >
                  Submit Application Request →
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
