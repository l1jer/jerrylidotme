import { chapters, emailParts, links } from '../content'
import { smoothstep } from './glsl'
import type { FrameState, Theme, ThemeId } from './types'

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
const pad = (n: number) => String(n).padStart(2, '0')

// Worlds offered in the switcher. With a single world the switcher is hidden.
const WORLDS: [ThemeId, string][] = [['voyage', 'Voyage']]

/** DOM overlay: chapter text, chapter bar, world switcher and live readouts. All driven by scroll position. */
export function createHud(theme: Theme, onJump: (chapter: number) => void) {
  const root = document.documentElement
  root.style.setProperty('--accent', theme.accent)
  root.style.setProperty('--accent-2', theme.accent2)
  root.style.setProperty('--bg', `#${theme.background.toString(16).padStart(6, '0')}`)

  const chapterEl = $('chapter')
  const hint = $('hint')
  const telemetry = $('telemetry')
  const track = $('track')

  $('worlds').hidden = WORLDS.length < 2
  $('worlds').innerHTML = WORLDS.map(
    ([id, label]) => `<a href="?world=${id}" ${id === theme.id ? 'aria-current="true"' : ''}>${label}</a>`
  ).join('')

  track.innerHTML = chapters.map((c, i) => `<button type="button" data-i="${i}"><span>${pad(i)}</span>${c.label}</button>`).join('')
  const ticks = [...track.querySelectorAll('button')]
  track.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button')
    if (b) onJump(Number(b.dataset.i))
  })
  $('mark').addEventListener('click', (e) => {
    e.preventDefault()
    onJump(0)
  })

  let shown = -1
  function show(i: number) {
    shown = i
    const c = chapters[i]
    const last = i === chapters.length - 1
    $('ch-num').textContent = `${theme.unit} ${pad(i)}`
    $('ch-kicker').textContent = c.kicker
    $('ch-title').textContent = last ? theme.finale : c.title
    $('ch-line').textContent = c.line
    $('ch-stats').innerHTML = (c.stats ?? []).map(([v, l]) => `<div><dt>${v}</dt><dd>${l}</dd></div>`).join('')
    $('ch-tags').innerHTML = (c.tags ?? []).map((t) => `<li>${t}</li>`).join('')
    const actions = $('ch-actions')
    actions.innerHTML = ''
    if (last) {
      const email = emailParts.join('@')
      const mail = Object.assign(document.createElement('a'), { className: 'btn primary', href: `mailto:${email}`, textContent: `${email} →` })
      const gh = Object.assign(document.createElement('a'), { className: 'btn', href: links.github, target: '_blank', rel: 'noopener', textContent: 'GitHub ↗' })
      const home = Object.assign(document.createElement('a'), { className: 'btn', href: links.portfolio, textContent: 'Standard portfolio ↗' })
      actions.append(mail, gh, home)
    }
    ticks.forEach((t, k) => (k === i ? t.setAttribute('aria-current', 'true') : t.removeAttribute('aria-current')))
  }

  let frame = 0
  return {
    update(s: FrameState, force = false) {
      const i = Math.max(0, Math.min(chapters.length - 1, Math.round(s.f)))
      const d = Math.abs(s.f - i)
      // Text is fully visible while lingering at a chapter and fades out between chapters.
      const visible = 1 - smoothstep(0.16, 0.38, d)
      // Swap the text while it is invisible; if the position jumped (reduced motion, capture), swap at once.
      if (shown === -1 || (i !== shown && (visible < 0.05 || Math.abs(s.f - shown) > 0.62))) show(i)
      const on = i === shown ? visible : 0
      chapterEl.style.opacity = on.toFixed(3)
      chapterEl.style.transform = `translate3d(0, ${((1 - on) * 26 * Math.sign(s.f - shown || 1) * -1).toFixed(1)}px, 0)`
      chapterEl.style.pointerEvents = on > 0.6 ? 'auto' : 'none'
      chapterEl.toggleAttribute('inert', on < 0.6)
      hint.style.opacity = (1 - smoothstep(0.03, 0.2, s.f)).toFixed(3)

      ticks.forEach((t, k) => {
        // The last chapter has no segment after it, so its bar fills as you arrive.
        const fill = k === ticks.length - 1 ? smoothstep(k - 0.5, k, s.f) : Math.min(1, Math.max(0, s.f - k))
        t.style.setProperty('--fill', fill.toFixed(3))
      })

      if (force || frame++ % 5 === 0) {
        telemetry.innerHTML = theme.telemetry(s).map(([l, v]) => `<span>${l}<b>${v}</b></span>`).join('')
      }
    },
  }
}
