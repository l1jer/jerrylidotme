/**
 * Ambient sound made entirely with Web Audio (no audio files): a slow pad of detuned
 * oscillators, plus a soft whoosh when the chapter changes. Off until the visitor turns it on.
 */
export function createAudio(root: number) {
  let ctx: AudioContext | null = null
  let master: GainNode | null = null
  let filter: BiquadFilterNode | null = null
  let on = false

  function start() {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0
    filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 520
    filter.Q.value = 0.7
    filter.connect(master).connect(ctx.destination)
    // Root, fifth and octave, each slightly detuned and slowly breathing.
    ;[1, 1.498, 2, 2.996].forEach((ratio, i) => {
      const osc = ctx!.createOscillator()
      osc.type = i % 2 ? 'sine' : 'triangle'
      osc.frequency.value = root * ratio * (1 + (i - 1.5) * 0.002)
      const gain = ctx!.createGain()
      gain.gain.value = 0.11 / (i + 1)
      const lfo = ctx!.createOscillator()
      lfo.frequency.value = 0.05 + i * 0.031
      const depth = ctx!.createGain()
      depth.gain.value = 0.05 / (i + 1)
      lfo.connect(depth).connect(gain.gain)
      osc.connect(gain).connect(filter!)
      osc.start()
      lfo.start()
    })
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
      master!.gain.linearRampToValueAtTime(on ? 0.5 : 0, ctx!.currentTime + 0.8)
      return on
    },
    /** Opens the filter while travelling, so movement is audible. */
    motion(speed: number) {
      if (!ctx || !filter || !on) return
      filter.frequency.setTargetAtTime(520 + Math.min(1, Math.abs(speed)) * 1800, ctx.currentTime, 0.25)
    },
    whoosh() {
      if (!ctx || !master || !on) return
      const len = ctx.sampleRate * 0.9
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.sin((i / len) * Math.PI) ** 2
      const src = ctx.createBufferSource()
      src.buffer = buffer
      const band = ctx.createBiquadFilter()
      band.type = 'bandpass'
      band.frequency.setValueAtTime(300, ctx.currentTime)
      band.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.8)
      const gain = ctx.createGain()
      gain.gain.value = 0.16
      src.connect(band).connect(gain).connect(master)
      src.start()
    },
  }
}
