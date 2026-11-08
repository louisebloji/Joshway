// Only show the site when it is served over http(s), not opened as a file.
if (location.protocol === 'file:') {
  window.stop()
  document.documentElement.innerHTML = `
    <head><meta charset="UTF-8"><title>Start the server</title></head>
    <body style="font-family:system-ui,sans-serif;max-width:34rem;margin:15vh auto;padding:0 1.5rem;line-height:1.6;color:#111">
      <h1 style="font-size:1.6rem">This site needs a server</h1>
      <p>It can’t be opened as a file. Start a local server, then open the address it shows.</p>
      <p><strong>Terminal:</strong> <code>python3 -m http.server 8000</code> in this folder, then visit <code>http://localhost:8000</code></p>
      <p><strong>VS Code:</strong> right-click <code>index.html</code> → Open with Live Server</p>
    </body>`
}

/* ===== Creative <-> Professional switch with splash ===== */
;(() => {
  if (location.protocol === 'file:') return
  const SRC = document.currentScript && document.currentScript.src
  if (!SRC) return
  const root = new URL('.', SRC).pathname
  const inCreative = location.pathname.startsWith(root + 'creative/')
  let rel = location.pathname.slice(root.length)
  rel = inCreative ? rel.slice('creative/'.length) : 'creative/' + rel // open the matching page on the other site
  if (rel === '' || rel.endsWith('/')) rel += 'index.html'
  const target = new URL(rel, SRC).href
  const COLOR = inCreative ? '#42c6ee' : '#06082d' // splash takes the destination's mood
  const KEY = 'joshway-switch'
  const EASE = 'cubic-bezier(.65, 0, .35, 1)'
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const clip = (r, x, y) => `circle(${r} at ${x}px ${y}px)`
  const overlay = (color) => {
    const el = document.createElement('div')
    el.dataset.splash = ''
    el.setAttribute('aria-hidden', 'true')
    el.style.cssText = `position:fixed;inset:0;z-index:2147483000;pointer-events:none;background:${color}`
    return el
  }

  /* Arriving: the colour shrinks back to where the button was */
  let stored = null
  try { stored = JSON.parse(sessionStorage.getItem(KEY)); sessionStorage.removeItem(KEY) } catch {}
  if (stored && !reduce) {
    const el = overlay(stored.color)
    el.style.clipPath = clip('150vmax', stored.x, stored.y)
    document.documentElement.append(el)
    addEventListener('load', () => setTimeout(() => {
      el.animate(
        [{ clipPath: clip('150vmax', stored.x, stored.y) }, { clipPath: clip('0px', stored.x, stored.y) }],
        { duration: 750, easing: EASE, fill: 'forwards' },
      ).finished.then(() => el.remove())
    }, 120), { once: true })
    setTimeout(() => el.remove(), 4000)
  }
  addEventListener('pageshow', (e) => { if (e.persisted) document.querySelectorAll('[data-splash]').forEach((el) => el.remove()) })

  /* The button */
  addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style')
    style.textContent = `
      .mode-switch{position:fixed;right:1.25rem;bottom:1.25rem;z-index:50;display:inline-flex;align-items:center;gap:.65rem;
        padding:.9rem 1.3rem;border-radius:999px;font:800 .75rem/1 'Rethink Sans',system-ui,sans-serif;letter-spacing:.08em;
        text-transform:uppercase;text-decoration:none;color:#fff;background:#111;box-shadow:0 10px 30px rgba(0,0,0,.28);
        transition:transform .25s ease,box-shadow .25s ease}
      .mode-switch i{font-style:normal;font-size:1rem;color:#42c6ee;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
      .mode-switch:hover{transform:translateY(-3px);box-shadow:0 16px 36px rgba(0,0,0,.35)}
      .mode-switch:hover i{transform:rotate(180deg) scale(1.3)}
      .mode-switch:focus-visible{outline:3px solid #42c6ee;outline-offset:3px}
      .mode-switch--creative{background:#fff;color:#06082d}
      .mode-switch--creative i{color:#ff6b4a}`
    document.head.append(style)
    const a = document.createElement('a')
    a.className = 'mode-switch' + (inCreative ? ' mode-switch--creative' : '')
    a.href = target
    a.innerHTML = (inCreative ? 'Switch to professional' : 'Switch to creative') + ' <i aria-hidden="true">✦</i>'
    document.body.append(a)

    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return
      e.preventDefault()
      const r = a.getBoundingClientRect()
      const x = r.left + r.width / 2, y = r.top + r.height / 2
      try { sessionStorage.setItem(KEY, JSON.stringify({ x, y, color: COLOR })) } catch {}
      if (reduce) { location.href = target; return }
      const el = overlay(COLOR)
      el.style.clipPath = clip('0px', x, y)
      document.documentElement.append(el)
      el.animate(
        [{ clipPath: clip('0px', x, y) }, { clipPath: clip('150vmax', x, y) }],
        { duration: 650, easing: EASE, fill: 'forwards' },
      ).finished.then(() => { location.href = target })
    })
  })
})()
