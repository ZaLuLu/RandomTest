import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Terminal, Globe, Cpu, GraduationCap, CheckCircle2, BookOpen, Layers } from 'lucide-react'
import { DiNotesPreview, EventMeshPreview, FellowshipCodeLabPreview } from '../../products/ProductPreviews'
import { ambientAudio } from '../../../utils/audioEngine'

export function TabletPillarStack() {
  return (
    <div className="w-full px-6 sm:px-8 py-8 flex flex-col gap-10 border-t border-[var(--border-base)] select-none">
      {/* ── PILLAR 01: PRODUCTS (P) ── */}
      <section id="products" className="scroll-mt-16">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10.5px] px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold">
            01 · Products & Platforms
          </span>
          <span className="font-mono text-[11px] text-[var(--text-muted)]">Live Software</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-[var(--text-primary)] leading-tight mb-2">
                Products made for the way you work.
              </h2>
              <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                Making complex things feel simple. Interactive tools, visual learning platforms, and curated networks built for real everyday use.
              </p>

              <div className="space-y-1.5 mb-4 font-body text-xs text-[var(--text-primary)]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Step-by-step array inspection with real-time comparison pointers.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Lightweight pub/sub event broker with sub-millisecond dispatch.</span>
                </div>
              </div>
            </div>

            <Link
              to="/products"
              onClick={() => ambientAudio.playTick()}
              className="py-2 px-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-md w-fit"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Right Column: Live Interactive Sorting Visualizer */}
          <div className="lg:col-span-7">
            <DiNotesPreview />
          </div>
        </div>
      </section>

      {/* ── PILLAR 02: SERVICES (S) ── */}
      <section id="services" className="scroll-mt-16">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10.5px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold">
            02 · Engineering Services
          </span>
          <span className="font-mono text-[11px] text-[var(--text-muted)]">Dedicated Teams</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-[var(--text-primary)] leading-tight mb-2">
                Senior engineering teams for your product.
              </h2>
              <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                We partner with founders and product teams to design, code, and ship full-stack web applications, FastAPI backends, and cloud infrastructure.
              </p>

              <div className="space-y-1.5 mb-4 font-body text-xs text-[var(--text-primary)]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>FastAPI and Next.js applications with 100% client code ownership.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>PostgreSQL schemas, Redis caching, and automated test suites.</span>
                </div>
              </div>
            </div>

            <Link
              to="/services"
              onClick={() => ambientAudio.playTick()}
              className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-md w-fit"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Right Column: Live Interactive EventMesh Radar */}
          <div className="lg:col-span-7">
            <EventMeshPreview />
          </div>
        </div>
      </section>

      {/* ── PILLAR 03: ACADEMICS (A) ── */}
      <section id="academics" className="scroll-mt-16">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10.5px] px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold">
            03 · Technical Training
          </span>
          <span className="font-mono text-[11px] text-[var(--text-muted)]">Hands-On Mentorship</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-[var(--text-primary)] leading-tight mb-2">
                Learn by building real software, not watching videos.
              </h2>
              <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                Hands-on training in real-world systems architecture, backend engineering, and production codebases taught live by practicing builders.
              </p>

              <div className="space-y-1.5 mb-4 font-body text-xs text-[var(--text-primary)]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Live cohorts in FastAPI & Backends, DSA, and Full-Stack Craft.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Working capstone repositories deployed directly to production.</span>
                </div>
              </div>
            </div>

            <Link
              to="/academics"
              onClick={() => ambientAudio.playTick()}
              className="py-2 px-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-mono text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-md w-fit"
            >
              <span>Explore Training</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Right Column: Live Interactive Fellowship Code Lab Preview */}
          <div className="lg:col-span-7">
            <FellowshipCodeLabPreview />
          </div>
        </div>
      </section>
    </div>
  )
}
