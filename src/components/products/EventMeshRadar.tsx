import React, { useState, useEffect, useRef, useMemo } from 'react'
import createGlobe from 'cobe'
import { Calendar, MapPin, Users, ExternalLink, Play, Pause, RotateCw } from 'lucide-react'
import { useTheme } from '../../utils/themeContext'
import { NumberFlow } from '../ui/NumberFlow'

export interface GlobalEvent {
  id: string
  title: string
  category: 'Hackathon' | 'AI Summit' | 'Conference' | 'Workshop'
  date: string
  city: string
  country: string
  lat: number
  lng: number
  attendees: number
  isPast?: boolean
  description: string
  highlights?: string[]
}

// Global Technology & AI Summits
const GLOBAL_EVENTS: GlobalEvent[] = [
  {
    id: 'e1',
    title: 'SF Autonomous Agent Summit 2026',
    category: 'AI Summit',
    date: 'OCT 18, 2026',
    city: 'San Francisco',
    country: 'USA',
    lat: 37.7749,
    lng: -122.4194,
    attendees: 1400,
    isPast: false,
    description: 'Premier gathering of autonomous agent architects, inference engineers, and foundation model researchers.',
    highlights: ['Multi-Agent Graphs', 'vLLM', 'Hardware Acceleration'],
  },
  {
    id: 'e2',
    title: 'London Distributed Systems Meetup',
    category: 'Conference',
    date: 'NOV 04, 2026',
    city: 'London',
    country: 'UK',
    lat: 51.5074,
    lng: -0.1278,
    attendees: 680,
    isPast: false,
    description: 'Benchmarking sub-10ms Redis event streams and distributed state machine consensus at scale.',
    highlights: ['BullMQ', 'Event Sourcing', 'Kafka Streams'],
  },
  {
    id: 'e3',
    title: 'Tokyo Machine Intelligence Conference',
    category: 'Conference',
    date: 'NOV 20, 2026',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    attendees: 1100,
    isPast: false,
    description: 'International symposium on speculative decoding, robotics teleoperation, and edge neural runtimes.',
    highlights: ['Edge AI', 'Robotics', 'TensorRT-LLM'],
  },
  {
    id: 'e4',
    title: 'Bengaluru AI Builders Hackathon',
    category: 'Hackathon',
    date: 'DEC 05, 2026',
    city: 'Bengaluru',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
    attendees: 850,
    isPast: false,
    description: '48-hour intensive building production agentic workflows, deterministic vector RAG, and autonomous pipelines.',
    highlights: ['LangGraph', 'Qdrant RAG', 'Nayak Studio'],
  },
  {
    id: 'e5',
    title: 'Berlin Open Source Kernel Summit',
    category: 'Conference',
    date: 'DEC 14, 2026',
    city: 'Berlin',
    country: 'Germany',
    lat: 52.5200,
    lng: 13.4050,
    attendees: 720,
    isPast: false,
    description: 'Core developer summit for Linux eBPF telemetry, high-throughput memory buffers, and distributed networking.',
    highlights: ['eBPF', 'Rust in Linux', 'Kernel Telemetry'],
  },
  {
    id: 'e6',
    title: 'Singapore FinTech AI Colloquium',
    category: 'Workshop',
    date: 'JAN 12, 2027',
    city: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    attendees: 950,
    isPast: false,
    description: 'Low-latency financial ML inference, fraud graph networks, and high-frequency risk modeling.',
    highlights: ['Sub-5ms Execution', 'Graph Neural Networks', 'RegTech'],
  },
  {
    id: 'e7',
    title: 'NYC Neural Systems Invitational',
    category: 'AI Summit',
    date: 'FEB 02, 2027',
    city: 'New York',
    country: 'USA',
    lat: 40.7128,
    lng: -74.0060,
    attendees: 1300,
    isPast: false,
    description: 'Architectural defenses of multi-modal generative agents and real-time streaming interfaces.',
    highlights: ['Live Defenses', 'Multi-Modal', 'WebSockets'],
  },
]

export function EventMeshRadar() {
  const { themeMode } = useTheme()
  const isDark = themeMode === 'dark'

  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<GlobalEvent | null>(GLOBAL_EVENTS[0])
  const [isRotating, setIsRotating] = useState(true)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDraggingRef = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const initialLngRad = (GLOBAL_EVENTS[0].lng * Math.PI) / 180
  const initialLatRad = (GLOBAL_EVENTS[0].lat * Math.PI) / 180
  const currentPhi = useRef(-initialLngRad - Math.PI / 2)
  const currentTheta = useRef(Math.max(-0.45, Math.min(0.55, initialLatRad * 0.75)))
  const targetPhi = useRef<number | null>(null)
  const targetTheta = useRef<number | null>(null)

  const filteredEvents = useMemo(() => {
    return GLOBAL_EVENTS.filter((e) => {
      const matchCat = selectedCategory === 'All' || e.category === selectedCategory
      const matchQuery =
        !searchQuery ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.country.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchQuery
    })
  }, [selectedCategory, searchQuery])

  // Handle Event Selection: Smoothly rotate globe to center target city & stop auto-rotation
  const handleSelectEvent = (ev: GlobalEvent) => {
    setSelectedEvent(ev)
    setIsRotating(false) 

    // Calculate target angles to bring this city directly to the front center
    const lngRad = (ev.lng * Math.PI) / 180
    const latRad = (ev.lat * Math.PI) / 180

    targetPhi.current = -lngRad - Math.PI / 2
    targetTheta.current = Math.max(-0.45, Math.min(0.55, latRad * 0.75))
  }

  // Cobe WebGL Interactive Globe
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let width = Math.max(260, canvas.offsetWidth || 480)

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: width * 2,
      height: width * 2,
      phi: currentPhi.current,
      theta: currentTheta.current,
      dark: isDark ? 1 : 0,
      diffuse: 1.25,
      mapSamples: 18000,
      mapBrightness: isDark ? 6.5 : 3.5,
      baseColor: isDark ? [0.08, 0.07, 0.16] : [0.88, 0.90, 0.96],
      markerColor: isDark ? [0.49, 0.23, 0.93] : [0.43, 0.16, 0.85],
      glowColor: isDark ? [0.49, 0.23, 0.93] : [0.43, 0.16, 0.85],
      markers: filteredEvents.map((e) => ({
        location: [e.lat, e.lng],
        size: selectedEvent?.id === e.id ? 0.09 : 0.045,
      })),
    })

    let animId: number
    let isVisible = true

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          isVisible = entries[0].isIntersecting
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(canvas)

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isVisible) return

      // Smooth dampening to target city coordinates when selected with shortest angular path
      if (targetPhi.current !== null && targetTheta.current !== null) {
        let phiDiff = targetPhi.current - currentPhi.current
        phiDiff = ((phiDiff + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI

        const thetaDiff = targetTheta.current - currentTheta.current

        currentPhi.current += phiDiff * 0.08
        currentTheta.current += thetaDiff * 0.08

        if (Math.abs(phiDiff) < 0.001 && Math.abs(thetaDiff) < 0.001) {
          currentPhi.current = targetPhi.current
          currentTheta.current = targetTheta.current
          targetPhi.current = null
          targetTheta.current = null
        }
      } else if (!isDraggingRef.current && isRotating) {
        currentPhi.current += 0.003
      }

      globe.update({
        phi: currentPhi.current,
        theta: currentTheta.current,
      })
    }
    animate()

    let resizeTimer: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (canvas) {
          width = Math.max(260, canvas.offsetWidth || 480)
          globe.update({
            width: width * 2,
            height: width * 2,
          })
        }
      }, 100)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(resizeTimer)
      observer.disconnect()
      globe.destroy()
      window.removeEventListener('resize', handleResize)
    }
  }, [filteredEvents, selectedEvent, isRotating, isDark])

  // Mouse & Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true
    targetPhi.current = null
    targetTheta.current = null
    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - lastMousePos.current.x
    const dy = e.clientY - lastMousePos.current.y
    currentPhi.current += dx * 0.005
    currentTheta.current = Math.max(-0.45, Math.min(0.55, currentTheta.current + dy * 0.003))
    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  return (
    <div className="card-tactile p-4 sm:p-8 relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-[var(--border-base)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] sm:text-xs text-[var(--accent-primary)] font-semibold uppercase tracking-wider">
              Event Mesh 3D · Developer Summits & Tech Meetups
            </span>
          </div>
          <h3 className="font-display text-lg sm:text-2xl font-bold text-[var(--text-primary)]">
            Curated Developer Events & Hackathons
          </h3>
        </div>

        {/* Rotation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating((prev) => !prev)}
            className="btn-ghost px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono text-[var(--text-secondary)] flex items-center gap-1.5 cursor-pointer"
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRotating ? 'Pause Spin' : 'Resume Spin'}</span>
          </button>
          <button
            onClick={() => {
              targetPhi.current = null
              targetTheta.current = null
              currentPhi.current = -initialLngRad - Math.PI / 2
              currentTheta.current = Math.max(-0.45, Math.min(0.55, initialLatRad * 0.75))
              setIsRotating(true)
            }}
            className="btn-ghost p-1.5 rounded-full text-[var(--text-secondary)] cursor-pointer"
            title="Reset Perspective"
            aria-label="Reset globe perspective"
          >
            <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Cobe WebGL Globe + Event Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
        {/* WebGL Globe Area */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative select-none">
          <div
            className="w-full max-w-[260px] sm:max-w-[480px] aspect-square relative cursor-grab active:cursor-grabbing flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full opacity-95 transition-opacity duration-500"
              style={{ width: '100%', height: '100%', maxWidth: '100%', aspectRatio: '1' }}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {['All', 'AI Summit', 'Hackathon', 'Conference', 'Workshop'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 sm:px-3.5 py-1 rounded-full font-mono text-[10px] sm:text-xs cursor-pointer transition-all ${selectedCategory === cat
                    ? 'btn-tactile text-white font-bold py-1 px-2.5 sm:px-3.5 shadow-md'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-base)] shadow-xs'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Event Detail Inspector Sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider flex items-center justify-between">
            <span>Selected Event Details</span>
            <span className="flex items-center gap-1">
              <NumberFlow value={filteredEvents.length} /> Active Nodes
            </span>
          </div>

          {selectedEvent ? (
            <div className="card-inset-well p-5 sm:p-6 rounded-2xl">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 font-semibold">
                  {selectedEvent.category}
                </span>
                <span className="font-mono text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {selectedEvent.date}
                </span>
              </div>

              <h4 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">
                {selectedEvent.title}
              </h4>

              <div className="flex items-center gap-1.5 font-body text-xs text-[var(--text-secondary)] mb-4">
                <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>
                  {selectedEvent.city}, {selectedEvent.country}
                </span>
                <span className="mx-1.5 text-[var(--border-base)]">|</span>
                <Users className="w-3.5 h-3.5" />
                <span>
                  <NumberFlow value={selectedEvent.attendees} />+ Expected
                </span>
              </div>

              <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                {selectedEvent.description}
              </p>

              {selectedEvent.highlights && (
                <div className="mb-5">
                  <div className="font-mono text-[11px] text-[var(--text-muted)] mb-2 uppercase">
                    Key Architecture Tracks
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEvent.highlights.map((h) => (
                      <span
                        key={h}
                        className="px-2 py-0.5 rounded-[6px] font-mono text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-base)] text-[var(--text-secondary)]"
                      >
                        #{h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => alert(`Registration portal for ${selectedEvent.title} in ${selectedEvent.city} opened.`)}
                className="btn-tactile w-full py-3 text-xs font-bold rounded-full flex items-center justify-center gap-2"
              >
                <span>Register for Event Access</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)] border border-dashed border-[var(--border-base)] rounded-xl">
              Select an event from the 3D globe to view details.
            </div>
          )}

          {/* Quick Event Hub List with Click-to-Center & Stop */}
          <div className="max-h-48 overflow-y-auto flex flex-col gap-1.5 pr-1">
            {filteredEvents.map((ev) => (
              <button
                key={ev.id}
                onClick={() => handleSelectEvent(ev)}
                className={`w-full p-2.5 rounded-[10px] text-left text-xs transition-all flex items-center justify-between border cursor-pointer ${selectedEvent?.id === ev.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/15 text-[var(--text-primary)] font-semibold shadow-xs'
                    : 'border-[var(--border-base)] bg-[var(--bg-surface-inset)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)]'
                  }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  <span className="truncate">{ev.title}</span>
                </div>
                <span className="font-mono text-[10px] text-[var(--text-muted)] shrink-0 pl-2">
                  {ev.city}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventMeshRadar
