/**
 * Heartbeat Audio — Web Audio API Sound Engine
 *
 * All sound synthesized live. No audio files. No samples. No libraries.
 * When rings expand, tones play. When gaps appear, silence.
 * Milestones sound like something earned.
 */

import type { RingConfig } from './heartbeatTypes'

// ─── Constants ──────────────────────────────────────────────

// Frequency constants (Hz)
const FREQ_A3 = 220
const FREQ_E4 = 329.63
const FREQ_G3 = 196
const FREQ_D4 = 293.66
const FREQ_C4 = 261.63
const FREQ_E4_MILESTONE = 329.63
const FREQ_G4 = 392
const FREQ_CS4 = 277.18  // C#4 / Db4
const FREQ_A1_DRONE = 55
const FREQ_A1_DRONE_END = 48

// ─── HeartbeatAudio Class ───────────────────────────────────

export class HeartbeatAudio {
  private context: AudioContext | null = null
  private masterGain: GainNode | null = null
  private isInitialized = false
  private activeNodes: AudioNode[] = []

  // ─── Initialization ───────────────────────────────────────

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    this.context = new AudioContext()
    this.masterGain = this.context.createGain()
    this.masterGain.gain.value = 0.15  // Overall quiet — ambient, not music
    this.masterGain.connect(this.context.destination)
    this.isInitialized = true
  }

  // ─── Check-in Tone ────────────────────────────────────────
  // Soft water drop. Felt more than heard.

  playCheckin(timeOffsetMs: number, intensity: number): void {
    if (!this.context || !this.masterGain) return

    const ctx = this.context
    const master = this.masterGain
    const time = ctx.currentTime + timeOffsetMs / 1000

    const frequency = FREQ_A3 + intensity * 110  // 220–330Hz
    const gain = 0.04 + intensity * 0.04

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.value = frequency

    gainNode.gain.setValueAtTime(0, time)
    gainNode.gain.linearRampToValueAtTime(gain, time + 0.02)       // attack: 20ms
    gainNode.gain.setValueAtTime(gain, time + 0.1)                  // sustain: 80ms
    gainNode.gain.linearRampToValueAtTime(0, time + 0.45)           // release: 350ms

    osc.connect(gainNode)
    gainNode.connect(master)

    osc.start(time)
    osc.stop(time + 0.5)

    this.activeNodes.push(gainNode)
  }

  // ─── Decision Tone ────────────────────────────────────────
  // Two-key piano chord in another room. Serious. Considered.

  playDecision(timeOffsetMs: number, intensity: number): void {
    if (!this.context || !this.masterGain) return

    const ctx = this.context
    const master = this.masterGain
    const time = ctx.currentTime + timeOffsetMs / 1000

    const gainPerTone = 0.05 + intensity * 0.035
    const frequencies = [FREQ_G3, FREQ_D4]  // Perfect fifth

    // Create reverb for decisions
    const reverb = this.generateRoomReverb(ctx, 0.4)
    const reverbGain = ctx.createGain()
    reverbGain.gain.value = 0.3

    for (const freq of frequencies) {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.value = freq

      gainNode.gain.setValueAtTime(0, time)
      gainNode.gain.linearRampToValueAtTime(gainPerTone, time + 0.03)  // attack: 30ms
      gainNode.gain.setValueAtTime(gainPerTone, time + 0.18)            // sustain: 150ms
      gainNode.gain.linearRampToValueAtTime(0, time + 0.98)             // release: 800ms

      osc.connect(gainNode)
      gainNode.connect(master)      // dry signal
      gainNode.connect(reverb)      // wet signal
      reverb.connect(reverbGain)
      reverbGain.connect(master)

      osc.start(time)
      osc.stop(time + 1.0)

      this.activeNodes.push(gainNode)
    }

    this.activeNodes.push(reverbGain)
  }

  // ─── Milestone Arpeggio ───────────────────────────────────
  // The most identifiable sound in KeGo. C major triad ascending.
  // The third note shimmers slightly.

  playMilestone(timeOffsetMs: number): void {
    if (!this.context || !this.masterGain) return

    const ctx = this.context
    const master = this.masterGain
    const baseTime = ctx.currentTime + timeOffsetMs / 1000

    const notes = [
      { freq: FREQ_C4, delayMs: 0 },
      { freq: FREQ_E4_MILESTONE, delayMs: 80 },
      { freq: FREQ_G4, delayMs: 160 },
    ]

    for (const note of notes) {
      const time = baseTime + note.delayMs / 1000

      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = 'triangle'  // Warmer than sine, softer than square
      osc.frequency.value = note.freq

      gainNode.gain.setValueAtTime(0, time)
      gainNode.gain.linearRampToValueAtTime(0.06, time + 0.04)    // attack: 40ms
      gainNode.gain.setValueAtTime(0.06, time + 0.24)              // sustain: 200ms
      gainNode.gain.linearRampToValueAtTime(0, time + 1.44)        // release: 1200ms

      osc.connect(gainNode)
      gainNode.connect(master)

      // Vibrato on the third note only (G4)
      if (note.freq === FREQ_G4) {
        const lfo = ctx.createOscillator()
        const lfoGain = ctx.createGain()
        lfo.frequency.value = 5   // 5Hz LFO
        lfoGain.gain.value = 3    // 3Hz pitch variation
        lfo.connect(lfoGain)
        lfoGain.connect(osc.frequency)
        lfo.start(time)
        lfo.stop(time + 1.5)

        this.activeNodes.push(lfoGain)
      }

      osc.start(time)
      osc.stop(time + 1.5)

      this.activeNodes.push(gainNode)
    }
  }

  // ─── Blocker Tone ─────────────────────────────────────────
  // Something that didn't quite land. Slightly dissonant.

  playBlocker(timeOffsetMs: number, intensity: number): void {
    if (!this.context || !this.masterGain) return

    const ctx = this.context
    const master = this.masterGain
    const time = ctx.currentTime + timeOffsetMs / 1000

    const gain = 0.035 + intensity * 0.025

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.value = FREQ_CS4
    osc.detune.value = +8  // Barely perceptible sharpness

    gainNode.gain.setValueAtTime(0, time)
    gainNode.gain.linearRampToValueAtTime(gain, time + 0.05)      // attack: 50ms
    gainNode.gain.setValueAtTime(gain, time + 0.17)                // sustain: 120ms
    gainNode.gain.linearRampToValueAtTime(0, time + 0.77)         // release: 600ms

    osc.connect(gainNode)
    gainNode.connect(master)

    osc.start(time)
    osc.stop(time + 0.8)

    this.activeNodes.push(gainNode)
  }

  // ─── Gap Drone ────────────────────────────────────────────
  // Below the threshold of conscious hearing for most people.
  // Communicates: not nothing. Just dormant.

  playGapTone(startTimeMs: number, durationMs: number, isAbandonment: boolean): void {
    if (!this.context || !this.masterGain) return

    // Short gaps are complete silence
    if (durationMs < 2000) return

    const ctx = this.context
    const master = this.masterGain
    const time = ctx.currentTime + startTimeMs / 1000
    const durationSec = durationMs / 1000

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.value = FREQ_A1_DRONE

    // For abandonment: pitch drops from 55Hz to 48Hz
    if (isAbandonment) {
      osc.frequency.setValueAtTime(FREQ_A1_DRONE, time)
      osc.frequency.linearRampToValueAtTime(FREQ_A1_DRONE_END, time + durationSec)
    }

    // Gain envelope: rises to midpoint, falls back
    const midTime = time + durationSec / 2
    gainNode.gain.setValueAtTime(0.01, time)
    gainNode.gain.linearRampToValueAtTime(0.025, midTime)
    gainNode.gain.linearRampToValueAtTime(0.01, time + durationSec)

    osc.connect(gainNode)
    gainNode.connect(master)

    osc.start(time)
    osc.stop(time + durationSec + 0.1)

    this.activeNodes.push(gainNode)
  }

  // ─── Commit Tone ──────────────────────────────────────────
  // Even quieter than check-in. Background rhythm.

  playCommit(timeOffsetMs: number, intensity: number): void {
    if (!this.context || !this.masterGain) return

    const ctx = this.context
    const master = this.masterGain
    const time = ctx.currentTime + timeOffsetMs / 1000

    const gain = 0.02 + intensity * 0.015

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.value = FREQ_A3 + intensity * 55

    gainNode.gain.setValueAtTime(0, time)
    gainNode.gain.linearRampToValueAtTime(gain, time + 0.02)
    gainNode.gain.linearRampToValueAtTime(0, time + 0.3)

    osc.connect(gainNode)
    gainNode.connect(master)

    osc.start(time)
    osc.stop(time + 0.35)

    this.activeNodes.push(gainNode)
  }

  // ─── Schedule Full Sequence ───────────────────────────────

  scheduleFullSequence(rings: RingConfig[], startTime: number): void {
    if (!this.context || !this.masterGain) return

    for (const ring of rings) {
      const audioTime = (ring.startTimeMs / 1000)

      switch (ring.event.type) {
        case 'checkin':
          this.playCheckin(audioTime, ring.event.intensity)
          break
        case 'decision':
          this.playDecision(audioTime, ring.event.intensity)
          break
        case 'milestone':
          this.playMilestone(audioTime)
          break
        case 'blocker':
          this.playBlocker(audioTime, ring.event.intensity)
          break
        case 'commit':
          this.playCommit(audioTime, ring.event.intensity)
          break
        case 'gap':
          this.playGapTone(audioTime, ring.gapDurationMs ?? 0, false)
          break
        case 'abandonment':
          this.playGapTone(audioTime, ring.gapDurationMs ?? 0, true)
          break
      }
    }
  }

  // ─── Room Reverb (Programmatic Impulse Response) ──────────

  generateRoomReverb(context: AudioContext, duration: number = 0.4): ConvolverNode {
    const sampleRate = context.sampleRate
    const length = Math.round(sampleRate * duration)
    const impulse = context.createBuffer(2, length, sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2)
      }
    }

    const convolver = context.createConvolver()
    convolver.buffer = impulse
    return convolver
  }

  // ─── Stop Everything ───────────────────────────────────────

  stop(): void {
    if (this.masterGain && this.context) {
      this.masterGain.gain.setTargetAtTime(0, this.context.currentTime, 0.1)
    }
    // Disconnect all active nodes after fade
    setTimeout(() => {
      for (const node of this.activeNodes) {
        try {
          if ('disconnect' in node) {
            (node as AudioNode).disconnect()
          }
        } catch {
          // Already disconnected — fine
        }
      }
      this.activeNodes = []
    }, 200)
  }

  // ─── Suspend / Resume ─────────────────────────────────────

  suspend(): void {
    this.context?.suspend()
  }

  resume(): void {
    this.context?.resume()
  }

  // ─── Cleanup ───────────────────────────────────────────────

  dispose(): void {
    this.stop()
    if (this.context && this.context.state !== 'closed') {
      this.context.close()
    }
    this.context = null
    this.masterGain = null
    this.isInitialized = false
  }
}