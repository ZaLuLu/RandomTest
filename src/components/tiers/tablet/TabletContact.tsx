import React, { useState } from 'react'
import { Mail, ArrowUpRight, Copy, Check } from 'lucide-react'
import { ambientAudio } from '../../../utils/audioEngine'

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function LinkedInIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export function TabletContact() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    ambientAudio.playTick()
    navigator.clipboard.writeText('nayaklabs.ai@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="w-full px-6 sm:px-8 pt-10 pb-24 sm:pb-32 border-t border-[var(--border-base)] scroll-mt-16 touch-pan-y select-none">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10.5px] px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold">
          Founders Direct · Bilateral Communication
        </span>
        <span className="font-mono text-[11px] text-[var(--text-muted)]">4h Guaranteed Response SLA</span>
      </div>

      <div className="max-w-2xl mb-6">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-[var(--text-primary)] leading-tight mb-1.5">
          Start a conversation directly with our founder & architects.
        </h2>
        <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          No SDRs or account managers. Direct technical communication with Nawaz Nayak and our principal engineering pod.
        </p>
      </div>

      {/* 3-Column Contact Channels (Email, Instagram, LinkedIn) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Email */}
        <a
          href="mailto:nayaklabs.ai@gmail.com"
          onClick={() => ambientAudio.playTick()}
          className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-base)] hover:border-[var(--border-hover)] flex flex-col justify-between active:scale-[0.98] transition-all shadow-md shadow-black/5 group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <Mail className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:scale-90 transition-transform cursor-pointer"
                title="Copy email address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="font-mono text-[9.5px] text-violet-400 font-bold uppercase tracking-wider mb-0.5">
              Direct Founder Inbox
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)] mb-1">
              nayaklabs.ai@gmail.com
            </h3>
            <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Best for custom architecture reviews, project specifications, and bilateral NDA requests.
            </p>
          </div>

          <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between font-mono text-xs text-violet-400 font-bold group-hover:underline">
            <span>Compose Email</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </a>

        {/* 2. Instagram */}
        <a
          href="https://instagram.com/nayaklabs.ai"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => ambientAudio.playTick()}
          className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-base)] hover:border-[var(--border-hover)] flex flex-col justify-between active:scale-[0.98] transition-all shadow-md shadow-black/5 group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
                <InstagramIcon className="w-4 h-4" />
              </div>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-400 font-bold border border-fuchsia-500/20">
                Studio Dispatches
              </span>
            </div>

            <div className="font-mono text-[9.5px] text-fuchsia-400 font-bold uppercase tracking-wider mb-0.5">
              Visual Build Logs
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)] mb-1">
              nayaklabs.ai
            </h3>
            <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Behind-the-scenes engineering logs, product teasers, and fellowship cohort highlights.
            </p>
          </div>

          <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between font-mono text-xs text-fuchsia-400 font-bold group-hover:underline">
            <span>Follow nayaklabs.ai</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </a>

        {/* 3. LinkedIn */}
        <a
          href="https://www.linkedin.com/company/nayaklabs/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => ambientAudio.playTick()}
          className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-base)] hover:border-[var(--border-hover)] flex flex-col justify-between active:scale-[0.98] transition-all shadow-md shadow-black/5 group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2]">
                <LinkedInIcon className="w-4 h-4" />
              </div>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] font-bold border border-[#0A66C2]/20">
                Company Updates
              </span>
            </div>

            <div className="font-mono text-[9.5px] text-[#0A66C2] font-bold uppercase tracking-wider mb-0.5">
              Official Page
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)] mb-1">
              Nayak Labs
            </h3>
            <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Follow our official updates, engineering announcements, and software platform releases.
            </p>
          </div>

          <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between font-mono text-xs text-[#0A66C2] font-bold group-hover:underline">
            <span>Connect on LinkedIn</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </a>
      </div>
    </section>
  )
}
