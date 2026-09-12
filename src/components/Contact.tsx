import React, { useState } from 'react'
import { ScrollReveal } from './ScrollReveal'
import { SectionEyebrow } from './SectionEyebrow'
import { Mail, ArrowUpRight, Copy, Check } from 'lucide-react'

function InstagramIcon({ className = 'w-6 h-6' }: { className?: string }) {
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

function LinkedInIcon({ className = 'w-6 h-6' }: { className?: string }) {
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

export function Contact() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText('nayaklabs.ai@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const CHANNELS = [
    {
      id: 'email',
      name: 'Direct Email',
      handle: 'nayaklabs.ai@gmail.com',
      badge: 'Direct response',
      desc: 'Send a note directly to our team. Ideal for new software projects, architecture reviews, and engineering inquiries.',
      actionText: 'Send an email',
      href: 'mailto:nayaklabs.ai@gmail.com?subject=Project%20Inquiry%20%E2%80%94%20Nayak%20Labs',
      icon: Mail,
      accentColor: 'var(--accent-primary)',
      badgeClass: 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/20',
      hasCopy: true,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      handle: 'company/nayaklabs',
      badge: 'Company updates',
      desc: 'Follow our official updates, engineering announcements, partnerships, and executive dispatches.',
      actionText: 'Connect on LinkedIn',
      href: 'https://www.linkedin.com/company/nayaklabs/',
      icon: LinkedInIcon,
      accentColor: '#0A66C2',
      badgeClass: 'text-[#0A66C2] bg-[#0A66C2]/10 border-[#0A66C2]/20',
      hasCopy: false,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      handle: 'nayaklabs.ai',
      badge: 'Build logs',
      desc: 'Follow our updates, project previews, engineering notes, and behind-the-scenes build logs directly from our team.',
      actionText: 'Follow on Instagram',
      href: 'https://www.instagram.com/nayaklabs.ai?stkn=MXd0eGJwcjVvZDB5dw==',
      icon: InstagramIcon,
      accentColor: 'var(--accent-tertiary)',
      badgeClass: 'text-[var(--accent-tertiary)] bg-[var(--accent-tertiary)]/10 border-[var(--accent-tertiary)]/20',
      hasCopy: false,
    },
  ]

  return (
    <section
      id="contact"
      className="py-14 md:py-18 flex flex-col justify-center relative before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[var(--border-base)] before:to-transparent scroll-mt-20"
      aria-labelledby="contact-headline"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-6 gap-3">
          <ScrollReveal delay={0}>
            <SectionEyebrow label="Contact Us" />
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.08}>
          <div className="max-w-3xl mb-8">
            <h2
              id="contact-headline"
              className="text-section-h font-display font-bold text-[var(--text-primary)] tracking-tight leading-[1.1] mb-3"
            >
              Have a project in mind? Let’s talk.
            </h2>
            <p className="font-body text-base text-[var(--text-secondary)] leading-relaxed">
              No sales pitches and no layers of account managers. Reach out directly through any of our channels.
            </p>
          </div>
        </ScrollReveal>


        {/* 3 High-Impact 3D Tactile Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1240px]">
          {CHANNELS.map((ch, idx) => {
            const IconComponent = ch.icon
            return (
              <ScrollReveal key={ch.id} delay={0.1 + idx * 0.05} className="h-full">
                <a
                  href={ch.href}
                  target={ch.id === 'email' ? undefined : '_blank'}
                  rel={ch.id === 'email' ? undefined : 'noopener noreferrer'}
                  className="group relative flex flex-col justify-between h-full p-8 rounded-2xl card-tactile drafting-card select-none border border-[var(--border-base)] transition-all duration-300 hover:shadow-2xl overflow-hidden"
                >
                  <div>
                    {/* Top Row: Icon Medallion & Badge */}
                    <div className="flex items-center justify-between gap-2 mb-6">
                      <div
                        className="p-3.5 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] transition-all duration-300 shadow-md group-hover:scale-105 group-hover:shadow-[0_0_20px_var(--accent-glow)]"
                        style={{ color: ch.accentColor }}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className={`font-body text-xs font-semibold px-3 py-1 rounded-full border shadow-xs ${ch.badgeClass}`}>
                        {ch.badge}
                      </span>
                    </div>

                    {/* Channel Title & Handle */}
                    <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
                      {ch.name}
                    </h3>
                    <div className="font-mono text-xs text-[var(--text-muted)] mb-4 flex items-center gap-2">
                      <span>{ch.handle}</span>
                      {ch.hasCopy && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handleCopyEmail}
                            title="Copy Email Address"
                            className="p-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-inset)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-150 cursor-pointer shadow-xs active:scale-90"
                          >
                            {copied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {copied && (
                            <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 animate-fade-in">
                              Copied!
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-8">
                      {ch.desc}
                    </p>
                  </div>

                  {/* Bottom Action Trigger */}
                  <div className="pt-4 border-t border-[var(--border-base)] flex items-center justify-between font-mono text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                    <span>{ch.actionText}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </a>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
