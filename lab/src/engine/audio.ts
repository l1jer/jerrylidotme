/**
 * Music made entirely with Web Audio: no audio files, so nothing to license or download.
 * A slow four-chord loop (pad, arpeggio with echo, bass, soft kick and hat), plus a whoosh
 * when the chapter changes. Off until the visitor turns it on.
 *
 * To use a recorded track instead, set MUSIC_URL to a file in lab/public that you hold the
 * rights to; the synth is then skipped.
 */
export const MUSIC_URL: string | null = null

const BPM = 84
const BEAT = 60 / BPM
const BAR = BEAT * 4
// Am9 - Fmaj7 - Cmaj7 - G6, as MIDI notes.
const CHORDS = [
  [57, 60, 64, 71],
  [53, 57, 60, 64],
  [48, 52, 55, 59],
  [55, 59, 62, 64],
]
const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12)

type Ctx = BaseAudioContext

function noise(ctx: Ctx, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

/** The shared effects: an echo for the arpeggio and a gentle compressor on everything. */
export function createBus(ctx: Ctx, destination: AudioNode) {
  const out = ctx.createDynamicsCompressor()
  out.threshold.value = -18
  out.ratio.value = 3
  out.connect(destination)
  const echo = ctx.createDelay(1)
  echo.delayTime.value = BEAT * 0.75
  const feedback = ctx.createGain()
  feedback.gain.value = 0.42
  const damp = ctx.createBiquadFilter()
  damp.type = 'lowpass'
  damp.frequency.value = 2200
  echo.connect(damp).connect(feedback).connect(echo)
  damp.connect(out)
  return { out, echo, hat: noise(ctx, 0.1) }
}

/** Schedules one bar of music starting at time `t`. `transpose` is in semitones. */
export function scheduleBar(ctx: Ctx, bus: ReturnType<typeof createBus>, t: number, bar: number, transpose: number) {
  const chord = CHORDS[bar % CHORDS.length].map((n) => n + transpose)

  // Pad: two detuned saws per note through a slowly opening filter.
  const padFilter = ctx.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.setValueAtTime(500, t)
  padFilter.frequency.linearRampToValueAtTime(1300, t + BAR * 0.5)
  padFilter.frequency.linearRampToValueAtTime(600, t + BAR)
  const pad = ctx.createGain()
  pad.gain.setValueAtTime(0, t)
  pad.gain.linearRampToValueAtTime(0.05, t + 0.9)
  pad.gain.setValueAtTime(0.05, t + BAR - 0.4)
  pad.gain.linearRampToValueAtTime(0, t + BAR + 0.9)
  padFilter.connect(pad).connect(bus.out)
  for (const note of chord) {
    for (const detune of [-7, 7]) {
      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = hz(note)
      osc.detune.value = detune
      osc.connect(padFilter)
      osc.start(t)
      osc.stop(t + BAR + 1)
    }
  }

  // Arpeggio: eighth notes up and down the chord, an octave higher, into the echo.
  const order = [0, 1, 2, 3, 2, 1, 2, 3]
  order.forEach((k, step) => {
    const at = t + step * BEAT * 0.5
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = hz(chord[k] + 12)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, at)
    g.gain.linearRampToValueAtTime(step % 2 ? 0.05 : 0.075, at + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0008, at + 0.42)
    osc.connect(g)
    g.connect(bus.out)
    g.connect(bus.echo)
    osc.start(at)
    osc.stop(at + 0.5)
  })

  // Bass: the chord's root two octaves down, on beats one and three.
  for (const beat of [0, 2.5]) {
    const at = t + beat * BEAT
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = hz(chord[0] - 24)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, at)
    g.gain.linearRampToValueAtTime(0.22, at + 0.03)
    g.gain.exponentialRampToValueAtTime(0.001, at + BEAT * 1.6)
    osc.connect(g).connect(bus.out)
    osc.start(at)
    osc.stop(at + BEAT * 1.7)
  }

  // Kick: a sine that drops in pitch.
  for (const beat of [0, 2]) {
    const at = t + beat * BEAT
    const osc = ctx.createOscillator()
    osc.frequency.setValueAtTime(130, at)
    osc.frequency.exponentialRampToValueAtTime(42, at + 0.14)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.32, at)
    g.gain.exponentialRampToValueAtTime(0.001, at + 0.3)
    osc.connect(g).connect(bus.out)
    osc.start(at)
    osc.stop(at + 0.32)
  }

  // Hat: a tick of filtered noise on the off-beats.
  for (let beat = 0.5; beat < 4; beat += 1) {
    const at = t + beat * BEAT
    const src = ctx.createBufferSource()
    src.buffer = bus.hat
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 7500
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.035, at)
    g.gain.exponentialRampToValueAtTime(0.001, at + 0.06)
    src.connect(hp).connect(g).connect(bus.out)
    src.start(at)
  }
}

/** Renders `bars` bars to a buffer without playing them (used to export a preview). */
export async function renderPreview(bars: number, transpose: number) {
  const rate = 44100
  const ctx = new OfflineAudioContext(2, Math.ceil(rate * (bars * BAR + 2)), rate)
  const master = ctx.createGain()
  master.gain.value = 0.9
  master.connect(ctx.destination)
  const bus = createBus(ctx, master)
  for (let b = 0; b < bars; b++) scheduleBar(ctx, bus, 0.05 + b * BAR, b, transpose)
  return ctx.startRendering()
}

export function createAudio(root: number) {
  // The theme's root note, as semitones away from A (110 Hz).
  const transpose = Math.round(12 * Math.log2(root / 110))
  let ctx: AudioContext | null = null
  let master: GainNode | null = null
  let tilt: BiquadFilterNode | null = null
  let bus: ReturnType<typeof createBus> | null = null
  let element: HTMLAudioElement | null = null
  let on = false
  let nextBar = 0
  let barIndex = 0
  let origin = 0
  let timer = 0

  function start() {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0
    // Opens up while travelling, so movement is audible.
    tilt = ctx.createBiquadFilter()
    tilt.type = 'lowpass'
    tilt.frequency.value = 2600
    tilt.connect(master).connect(ctx.destination)
    if (MUSIC_URL) {
      element = new Audio(MUSIC_URL)
      element.loop = true
      ctx.createMediaElementSource(element).connect(tilt)
    } else {
      bus = createBus(ctx, tilt)
      origin = nextBar = ctx.currentTime + 0.1
    }
  }

  // Keeps about two bars scheduled ahead of the playhead.
  function pump() {
    if (!ctx || !bus || !on) return
    while (nextBar < ctx.currentTime + BAR * 2) {
      scheduleBar(ctx, bus, nextBar, barIndex++, transpose)
      nextBar += BAR
    }
  }

  return {
    get on() {
      return on
    },
    async toggle() {
      if (!ctx) start()
      on = !on
      await ctx!.resume()
      master!.gain.cancelScheduledValues(ctx!.currentTime)
      master!.gain.linearRampToValueAtTime(on ? 0.8 : 0, ctx!.currentTime + (on ? 1.2 : 0.5))
      if (element) on ? void element.play() : element.pause()
      clearInterval(timer)
      if (on && bus) {
        // After a pause, pick the loop up from now instead of rushing through missed bars.
        if (nextBar < ctx!.currentTime) nextBar = ctx!.currentTime + 0.1
        pump()
        timer = window.setInterval(pump, 500)
      }
      return on
    },
    motion(speed: number) {
      if (!ctx || !tilt || !on) return
      tilt.frequency.setTargetAtTime(2600 + Math.min(1, Math.abs(speed)) * 7000, ctx.currentTime, 0.3)
    },
    /** 0..1, peaking on beats one and three, for visuals that move with the music. */
    pulse() {
      if (!ctx || !on || !bus) return 0
      const phase = (((ctx.currentTime - origin) / (BEAT * 2)) % 1 + 1) % 1
      return Math.exp(-phase * 5)
    },
    whoosh() {
      if (!ctx || !master || !on) return
      const src = ctx.createBufferSource()
      src.buffer = noise(ctx, 0.9)
      const band = ctx.createBiquadFilter()
      band.type = 'bandpass'
      band.frequency.setValueAtTime(300, ctx.currentTime)
      band.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.8)
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.35)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.9)
      src.connect(band).connect(gain).connect(master)
      src.start()
    },
  }
}
