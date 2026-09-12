import React, { useState } from 'react'
import { Mail, ArrowUpRight, Copy, Check } from 'lucide-react'

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

export function MobileContact() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText('nayaklabs.ai@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="w-full px-5 py-12 border-t border-[var(--border-base)] scroll-mt-16 select-none">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] font-bold uppercase tracking-wider">
          Founders Direct · Nawaz Nayak
        </span>
      </div>

      <h2 className="font-display font-black text-2xl text-[var(--text-primary)] leading-tight mb-2">
        Let’s Build Together
      </h2>
      <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
        Reach out directly to Nawaz Nayak and our principal systems pod. Guaranteed response within 4 hours.
      </p>

      {/* Direct Contact Cards List */}
      <div className="space-y-3 mb-6">
        {/* Email Card */}
        <a
          href="mailto:nayaklabs.ai@gmail.com"
          className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-base)] hover:border-[var(--border-hover)] flex flex-col justify-between active:scale-98 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/15">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-[var(--text-primary)]">
                  nayaklabs.ai@gmail.com
                </div>
                <div className="font-mono text-[9px] text-[var(--accent-primary)] font-medium">Direct Founder Inbox</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {copied && (
                <span className="text-[9px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Copied!
                </span>
              )}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--text-secondary)] active:scale-90 transition-transform cursor-pointer"
                title="Copy email"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[var(--border-base)] flex items-center justify-between font-mono text-xs text-[var(--accent-primary)] font-semibold">
            <span>Compose email</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </a>

        {/* Instagram Card */}
        <a
          href="https://instagram.com/nayaklabs.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-base)] hover:border-[var(--border-hover)] flex flex-col justify-between active:scale-98 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                <InstagramIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-[var(--text-primary)]">
                  nayaklabs.ai
                </div>
                <div className="font-mono text-[9px] text-fuchsia-400 font-medium">Studio Build Logs</div>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[var(--border-base)] flex items-center justify-between font-mono text-xs text-fuchsia-400 font-semibold">
            <span>Follow nayaklabs.ai</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </a>

        {/* LinkedIn Card */}
        <a
          href="https://www.linkedin.com/company/nayaklabs/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-base)] hover:border-[var(--border-hover)] flex flex-col justify-between active:scale-98 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20">
                <LinkedInIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-[var(--text-primary)]">
                  Nayak Labs
                </div>
                <div className="font-mono text-[9px] text-[#0A66C2] font-medium">Company Updates</div>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[var(--border-base)] flex items-center justify-between font-mono text-xs text-[#0A66C2] font-semibold">
            <span>Connect on LinkedIn</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </a>
      </div>
    </section>
  )
}
