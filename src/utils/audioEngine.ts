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

  public unlock() {
    try {
      this.initContext()
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
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

  // 3. HARD BASS 808 Sub-Kick Synthesizer for Hero Ball Impacts
  // Synthesizes a heavy, saturated 808 sub-bass punch on letter bounces and a massive sub boom on period settle
  public playBounceSound(stepIndex = 0, totalSteps = 9, isPeriod = false) {
    if (this.soundSuppressed) return
    try {
      this.unlock()
      if (!this.ctx) return

      const now = this.ctx.currentTime

      if (isPeriod) {
        // ── MASSIVE 808 SUB BOOM (PERIOD LOCK) ──
        // Sub oscillator: deep frequency drop from 135Hz to 32Hz
        const subOsc = this.ctx.createOscillator()
        subOsc.type = 'sine'
        subOsc.frequency.setValueAtTime(140, now)
        subOsc.frequency.exponentialRampToValueAtTime(34, now + 0.26)

        // Punch body oscillator for tactile knock
        const punchOsc = this.ctx.createOscillator()
        punchOsc.type = 'triangle'
        punchOsc.frequency.setValueAtTime(85, now)
        punchOsc.frequency.exponentialRampToValueAtTime(28, now + 0.16)

        // Bass saturation waveshaper for rich harmonics
        const shaper = this.ctx.createWaveShaper()
        shaper.curve = this.getDistortionCurve(25)
        shaper.oversample = '2x'

        // Resonant sub-bass lowpass filter
        const filter = this.ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(260, now)
        filter.frequency.exponentialRampToValueAtTime(75, now + 0.28)
        filter.Q.setValueAtTime(3.5, now)

        // Hard punch gain envelope
        const gain = this.ctx.createGain()
        gain.gain.setValueAtTime(0.001, now)
        gain.gain.linearRampToValueAtTime(0.55, now + 0.003) // Heavy instant attack
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32) // Fat 808 decay

        subOsc.connect(shaper)
        punchOsc.connect(shaper)
        shaper.connect(filter)
        filter.connect(gain)
        gain.connect(this.ctx.destination)

        subOsc.start(now)
        punchOsc.start(now)
        subOsc.stop(now + 0.35)
        punchOsc.stop(now + 0.35)
      } else {
        // ── HARD BASS 808 PUNCH (LETTER IMPACTS) ──
        // Dynamic pitch tuned per letter for progressive cadence
        const progress = Math.min(1, Math.max(0, stepIndex / Math.max(1, totalSteps - 1)))
        const startPitch = 165 + progress * 35 // 165Hz -> 200Hz punch start
        const endPitch = 44 + progress * 8 // 44Hz -> 52Hz deep sub

        const subOsc = this.ctx.createOscillator()
        subOsc.type = 'sine'
        subOsc.frequency.setValueAtTime(startPitch, now)
        subOsc.frequency.exponentialRampToValueAtTime(endPitch, now + 0.075)

        // Hard transient click for punchy impact attack
        const clickOsc = this.ctx.createOscillator()
        clickOsc.type = 'triangle'
        clickOsc.frequency.setValueAtTime(startPitch * 1.8, now)
        clickOsc.frequency.exponentialRampToValueAtTime(60, now + 0.025)

        const shaper = this.ctx.createWaveShaper()
        shaper.curve = this.getDistortionCurve(18)
        shaper.oversample = '2x'

        const filter = this.ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(420, now)
        filter.frequency.exponentialRampToValueAtTime(110, now + 0.09)
        filter.Q.setValueAtTime(2.8, now)

        const gain = this.ctx.createGain()
        gain.gain.setValueAtTime(0.001, now)
        gain.gain.linearRampToValueAtTime(0.45, now + 0.002) // Snappy hard bass hit
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095) // Punchy decay

        subOsc.connect(shaper)
        clickOsc.connect(shaper)
        shaper.connect(filter)
        filter.connect(gain)
        gain.connect(this.ctx.destination)

        subOsc.start(now)
        clickOsc.start(now)
        subOsc.stop(now + 0.11)
        clickOsc.stop(now + 0.11)
      }
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
}

