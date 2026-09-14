// Generative Atmospheric Ambient Audio Synthesizer (Web Audio API)
// Produces a warm, soothing Solfeggio 528Hz harmonic soundscape + Scroll-Speed Haptic Tick

class AmbientAudioEngine {
  private ctx: AudioContext | null = null
  private gainNode: GainNode | null = null
  private oscs: OscillatorNode[] = []
  private isPlaying = false
  private listeners: ((playing: boolean) => void)[] = []
  private lastTickTime = 0
  private distortionCurve: Float32Array | null = null
  private soundSuppressed = false
  private pendingBounceChime = false

  public setSoundSuppressed(suppress: boolean) {
    this.soundSuppressed = suppress
  }

  public isSoundSuppressed(): boolean {
    return this.soundSuppressed
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
  }

  public isAudioActive(): boolean {
    return Boolean(this.ctx && this.ctx.state === 'running')
  }

  public unlock() {
    try {
      this.initContext()
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx
          .resume()
          .then(() => {
            if (this.pendingBounceChime) {
              this.pendingBounceChime = false
              this.playBounceSound(10, 10, true)
            }
          })
          .catch(() => {})
      } else if (this.ctx && this.ctx.state === 'running') {
        if (this.pendingBounceChime) {
          this.pendingBounceChime = false
          this.playBounceSound(10, 10, true)
        }
      }
    } catch (_) {}
  }

  private getDistortionCurve(amount = 20): Float32Array<ArrayBuffer> {
    if (this.distortionCurve) return this.distortionCurve as Float32Array<ArrayBuffer>
    const n_samples = 44100
    const buffer = new ArrayBuffer(n_samples * 4)
    const curve = new Float32Array(buffer)
    const deg = Math.PI / 180
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x))
    }
    this.distortionCurve = curve
    return curve as Float32Array<ArrayBuffer>
  }

  public subscribe(cb: (playing: boolean) => void) {
    this.listeners.push(cb)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb)
    }
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying))
  }

  // 1. Ambient Harmonic Soundscape (Solfeggio 528Hz Transformation Frequency + 432Hz Sub-bass)
  public start() {
    try {
      this.unlock()
      if (!this.ctx) return

      if (this.isPlaying) return

      const now = this.ctx.currentTime

      // Master gain node with smooth exponential fade-in
      const masterGain = this.ctx.createGain()
      masterGain.gain.setValueAtTime(0.0001, now)
      masterGain.gain.exponentialRampToValueAtTime(0.075, now + 2.5)
      masterGain.connect(this.ctx.destination)
      this.gainNode = masterGain

      // Dual-stage warm filter for liquid pad shimmer
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(520, now)
      filter.Q.setValueAtTime(1.4, now)
      filter.connect(masterGain)

      // Solfeggio 528Hz & 432Hz Sacred Harmonic Chord Matrix (Root, Sub, Fifth, Tenth, Shimmer)
      const freqs = [132, 198, 264, 396, 528]
      this.oscs = []

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle'
        osc.frequency.setValueAtTime(freq, now)

        // Micro-chorus detuning for rich organic depth
        osc.detune.setValueAtTime((idx - 2) * 3.5, now)

        const oscGain = this.ctx.createGain()
        oscGain.gain.setValueAtTime(0.25 / (idx * 0.4 + 1), now)

        osc.connect(oscGain)
        oscGain.connect(filter)
        osc.start(now)
        this.oscs.push(osc)
      })

      this.isPlaying = true
      this.notify()
    } catch (e) {
      console.warn('Ambient audio init skipped:', e)
    }
  }

  public stop() {
    if (!this.ctx || !this.isPlaying || !this.gainNode) return

    try {
      const now = this.ctx.currentTime
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now)
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)

      setTimeout(() => {
        this.oscs.forEach((osc) => {
          try {
            osc.stop()
            osc.disconnect()
          } catch (_) {}
        })
        this.oscs = []
        this.isPlaying = false
        this.notify()
      }, 1250)
    } catch (e) {
      this.isPlaying = false
      this.notify()
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.stop()
    } else {
      this.start()
    }
  }

  public getPlayingState() {
    return this.isPlaying
  }

  // 2. Mechanical Haptic Scroll-Speed Tick Synthesizer
  public playScrollTick(velocity = 1) {
    if (this.soundSuppressed) return
    try {
      this.unlock()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      if (now - this.lastTickTime < 0.05) return
      this.lastTickTime = now

      const clampedVelocity = Math.min(5, Math.max(0.5, velocity))
      const baseFreq = 1100 + clampedVelocity * 280

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(baseFreq, now)
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.028)

      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(baseFreq * 1.2, now)
      filter.Q.setValueAtTime(3.0, now)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.12, now + 0.002)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)

      osc.connect(filter)
      filter.connect(gain)
       gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.04)
    } catch (_) {}
  }

  public playTick() {
    this.playScrollTick(1.2)
  }

  // ── 3. TACTILE SIDE GUARD RAIL SECTION TICK ──
  // Simulates a precision milled notched index click when transitioning sections
  public playRailSectionTick(isArrival = false) {
    if (this.soundSuppressed) return
    try {
      this.unlock()
      if (!this.ctx || this.ctx.state === 'suspended') return

      const now = this.ctx.currentTime
      const baseFreq = isArrival ? 1200 : 1600

      // 1. Tactile notch impulse
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = isArrival ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(baseFreq, now)
      osc.frequency.exponentialRampToValueAtTime(isArrival ? 440 : 320, now + 0.02)

      const peakGain = isArrival ? 0.16 : 0.12
      const duration = isArrival ? 0.06 : 0.035
      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.001)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + duration + 0.01)
    } catch (_) {}
  }

  // ── 4. WATER-FILLED GLASS JUG & METALLIC SPOON SYNTHESIZER ──
  // Models the physical acoustics of a metal spoon striking crystal glassware:
  // - High-frequency metallic spoon strike transient (sharp ping)
  // - Dual inharmonic glass ring modes (fundamental + 2.32x lip overtone)
  // - True ascending 9-letter crystalline scale for "NayakLabs" + 528Hz Solfeggio bell for "."
  public playBounceSound(stepIndex = 0, totalSteps = 9, isPeriod = false) {
    if (this.soundSuppressed) return
    try {
      this.unlock()
      if (!this.ctx) return

      if (this.ctx.state === 'suspended') {
        if (isPeriod || stepIndex >= 8) {
          this.pendingBounceChime = true
        }
        return
      }

      const now = this.ctx.currentTime

      if (isPeriod) {
        // ── DEEP WATER JUG CARILLON CHIME (PERIOD FINAL LOCK) ──
        const fundamental = 528 // 528Hz Solfeggio deep liquid glass bell

        // 1. Metal spoon strike click transient
        const spoonOsc = this.ctx.createOscillator()
        const spoonGain = this.ctx.createGain()
        spoonOsc.type = 'triangle'
        spoonOsc.frequency.setValueAtTime(3200, now)
        spoonOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.015)

        spoonGain.gain.setValueAtTime(0.001, now)
        spoonGain.gain.linearRampToValueAtTime(0.35, now + 0.001)
        spoonGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02)

        spoonOsc.connect(spoonGain)
        spoonGain.connect(this.ctx.destination)
        spoonOsc.start(now)
        spoonOsc.stop(now + 0.025)

        // 2. Main liquid glass resonance (Sine fundamental with water micro-pitch drift)
        const glassOsc = this.ctx.createOscillator()
        const glassGain = this.ctx.createGain()
        glassOsc.type = 'sine'
        glassOsc.frequency.setValueAtTime(fundamental + 12, now)
        glassOsc.frequency.exponentialRampToValueAtTime(fundamental, now + 0.04)

        // 3. Inharmonic glass overtone mode (2.32x lip resonance)
        const overtoneOsc = this.ctx.createOscillator()
        const overtoneGain = this.ctx.createGain()
        overtoneOsc.type = 'sine'
        overtoneOsc.frequency.setValueAtTime(fundamental * 2.32, now)

        // Resonant crystal filter
        const glassFilter = this.ctx.createBiquadFilter()
        glassFilter.type = 'bandpass'
        glassFilter.frequency.setValueAtTime(fundamental * 1.1, now)
        glassFilter.Q.setValueAtTime(7.0, now)

        glassGain.gain.setValueAtTime(0.001, now)
        glassGain.gain.linearRampToValueAtTime(0.48, now + 0.002)
        glassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65) // Ethereal glass ring

        overtoneGain.gain.setValueAtTime(0.001, now)
        overtoneGain.gain.linearRampToValueAtTime(0.18, now + 0.002)
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

        glassOsc.connect(glassFilter)
        overtoneOsc.connect(glassFilter)
        glassFilter.connect(glassGain)
        glassGain.connect(this.ctx.destination)

        glassOsc.start(now)
        overtoneOsc.start(now)
        glassOsc.stop(now + 0.7)
        overtoneOsc.stop(now + 0.25)
      } else {
        // ── 9-TONE ASCENDING CRYSTAL GLASS LADDER FOR "N-a-y-a-k-L-a-b-s" ──
        // Clean harmonic musical progression (G5 -> A6) with dedicated pitches for period micro-rebounds
        const GLASS_SCALE = [
          784,  // 0: 'N' (G5)
          880,  // 1: 'a' (A5)
          988,  // 2: 'y' (B5)
          1046, // 3: 'a' (C6)
          1175, // 4: 'k' (D6)
          1318, // 5: 'L' (E6 - Word gap jump)
          1397, // 6: 'a' (F6)
          1568, // 7: 'b' (G6)
          1760, // 8: 's' (A6)
          1976, // 9: Primary period landing (B6)
          2093, // 10: Micro-bounce 1 (C7)
        ]
        const fundamental = GLASS_SCALE[stepIndex % GLASS_SCALE.length] || 880

        // 1. Sharp spoon clink transient (metallic tap)
        const spoonOsc = this.ctx.createOscillator()
        const spoonGain = this.ctx.createGain()
        spoonOsc.type = 'triangle'
        spoonOsc.frequency.setValueAtTime(fundamental * 3.2, now)
        spoonOsc.frequency.exponentialRampToValueAtTime(fundamental * 1.5, now + 0.012)

        spoonGain.gain.setValueAtTime(0.001, now)
        spoonGain.gain.linearRampToValueAtTime(0.32, now + 0.001)
        spoonGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015)

        spoonOsc.connect(spoonGain)
        spoonGain.connect(this.ctx.destination)
        spoonOsc.start(now)
        spoonOsc.stop(now + 0.02)

        // 2. Crystal glass singing tone (fundamental with water micro-settle)
        const glassOsc = this.ctx.createOscillator()
        const glassGain = this.ctx.createGain()
        glassOsc.type = 'sine'
        glassOsc.frequency.setValueAtTime(fundamental + 8, now)
        glassOsc.frequency.exponentialRampToValueAtTime(fundamental, now + 0.025)

        // 3. High glass rim shimmer mode (2.32x inharmonic overtone)
        const overtoneOsc = this.ctx.createOscillator()
        const overtoneGain = this.ctx.createGain()
        overtoneOsc.type = 'sine'
        overtoneOsc.frequency.setValueAtTime(fundamental * 2.32, now)

        const glassFilter = this.ctx.createBiquadFilter()
        glassFilter.type = 'bandpass'
        glassFilter.frequency.setValueAtTime(fundamental, now)
        glassFilter.Q.setValueAtTime(8.5, now)

        // Envelope: Crisp instant tap followed by singing crystal decay (0.24s - 0.32s)
        const decayDuration = 0.24 + (stepIndex / 10) * 0.06
        glassGain.gain.setValueAtTime(0.001, now)
        glassGain.gain.linearRampToValueAtTime(0.42, now + 0.001)
        glassGain.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration)

        overtoneGain.gain.setValueAtTime(0.001, now)
        overtoneGain.gain.linearRampToValueAtTime(0.14, now + 0.001)
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)

        glassOsc.connect(glassFilter)
        overtoneOsc.connect(glassFilter)
        glassFilter.connect(glassGain)
        glassGain.connect(this.ctx.destination)

        glassOsc.start(now)
        overtoneOsc.start(now)
        glassOsc.stop(now + decayDuration + 0.02)
        overtoneOsc.stop(now + 0.14)
      }
    } catch (_) {}
  }

  // ── 5. INTERACTIVE PRODUCT SORTING SYNTHESIZER ──
  // Real-time audio feedback for sorting algorithm visualizers:
  // - playSortStep: Melodic sine ping whose pitch corresponds to the array element value
  // - playSortSwap: Dual tactile impact marking memory exchanges
  // - playSortComplete: 3-note ascending crystalline chord shimmer
  // - playSortReset: Subtle double chirp
  public playSortStep(value: number, maxValue = 100) {
    if (this.soundSuppressed) return
    try {
      this.unlock()
      if (!this.ctx || this.ctx.state === 'suspended') return

      const now = this.ctx.currentTime
      const clampedVal = Math.max(1, Math.min(value, maxValue))
      const freq = 280 + (clampedVal / maxValue) * 920 // 280Hz - 1200Hz

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.18, now + 0.002)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.04)
    } catch (_) {}
  }

  public playSortSwap(val1 = 50, val2 = 50, maxValue = 100) {
    if (this.soundSuppressed) return
    try {
      this.unlock()
      if (!this.ctx || this.ctx.state === 'suspended') return

      const now = this.ctx.currentTime
      const f1 = 380 + (Math.max(1, Math.min(val1, maxValue)) / maxValue) * 600
      const f2 = 380 + (Math.max(1, Math.min(val2, maxValue)) / maxValue) * 600

      // Dual rapid impulses spaced by 12ms
      ;[
        { freq: f1, offset: 0 },
        { freq: f2, offset: 0.014 },
      ].forEach(({ freq, offset }) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq * 1.4, now + offset)
        osc.frequency.exponentialRampToValueAtTime(freq, now + offset + 0.02)

        gain.gain.setValueAtTime(0.001, now + offset)
        gain.gain.linearRampToValueAtTime(0.22, now + offset + 0.001)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.025)

        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now + offset)
        osc.stop(now + offset + 0.03)
      })
    } catch (_) {}
  }

  public playSortComplete() {
    if (this.soundSuppressed) return
    try {
      this.unlock()
      if (!this.ctx || this.ctx.state === 'suspended') return

      const now = this.ctx.currentTime
      // Ascending celebratory triad: [880, 1175, 1760] Hz
      const chord = [880, 1175, 1760]
      chord.forEach((freq, idx) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        const offset = idx * 0.045

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + offset)

        gain.gain.setValueAtTime(0.001, now + offset)
        gain.gain.linearRampToValueAtTime(0.24, now + offset + 0.002)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.28)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(now + offset)
        osc.stop(now + offset + 0.3)
      })
    } catch (_) {}
  }

  public playSortReset() {
    if (this.soundSuppressed) return
    try {
      this.unlock()
      if (!this.ctx || this.ctx.state === 'suspended') return

      const now = this.ctx.currentTime
      ;[
        { freq: 640, offset: 0 },
        { freq: 440, offset: 0.025 },
      ].forEach(({ freq, offset }) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + offset)

        gain.gain.setValueAtTime(0.001, now + offset)
        gain.gain.linearRampToValueAtTime(0.12, now + offset + 0.001)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.035)

        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now + offset)
        osc.stop(now + offset + 0.04)
      })
    } catch (_) {}
  }
}

export const ambientAudio = new AmbientAudioEngine()

// Auto-unlock Web Audio on first user interaction in browser
if (typeof window !== 'undefined') {
  const unlock = () => {
    ambientAudio.unlock()
  }
  window.addEventListener('pointerdown', unlock, { passive: true })
  window.addEventListener('keydown', unlock, { passive: true })
  window.addEventListener('touchstart', unlock, { passive: true })
  window.addEventListener('click', unlock, { passive: true })
  window.addEventListener('wheel', unlock, { passive: true })
  window.addEventListener('pointermove', unlock, { passive: true, once: true })
  window.addEventListener('mousemove', unlock, { passive: true, once: true })
  window.addEventListener('focus', unlock, { passive: true })
}

