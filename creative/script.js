/* Mobile menu */
const toggle = document.querySelector('.menu-toggle')
const nav = document.getElementById('site-navigation')
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true'
  toggle.setAttribute('aria-expanded', String(open))
  nav.classList.toggle('site-nav--open', open)
})

/* Innovation dropdown */
const dropdown = document.querySelector('.nav-dropdown')
const trigger = dropdown.querySelector('.nav-dropdown__trigger')
const setDropdown = (open) => {
  dropdown.classList.toggle('nav-dropdown--open', open)
  trigger.setAttribute('aria-expanded', String(open))
}
trigger.addEventListener('click', () => setDropdown(!dropdown.classList.contains('nav-dropdown--open')))
dropdown.addEventListener('mouseleave', () => setDropdown(false))
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setDropdown(false) })
document.addEventListener('click', (e) => { if (!dropdown.contains(e.target)) setDropdown(false) })

/* Buy buttons: no destination yet */
document.querySelectorAll('a[href="#buy-coming-soon"]').forEach((a) =>
  a.addEventListener('click', (e) => e.preventDefault()),
)

/* Space flight: Josh follows the scroll */
const flight = document.querySelector('.space-flight')
if (flight) {
  let frame = 0
  const updateFlight = () => {
    frame = 0
    const bounds = flight.getBoundingClientRect()
    const distance = Math.max(flight.offsetHeight - window.innerHeight, 1)
    const progress = Math.min(1, Math.max(0, -bounds.top / distance))
    const stops = window.innerWidth <= 600
      ? [{ progress: 0, x: 0, y: 0 }, { progress: 0.25, x: 0, y: 8 }, { progress: 0.5, x: -45, y: 18 }, { progress: 0.75, x: 0, y: 10 }, { progress: 1, x: -8, y: 30 }]
      : [{ progress: 0, x: 0, y: 0 }, { progress: 0.25, x: -2, y: 10 }, { progress: 0.5, x: -48, y: 20 }, { progress: 0.75, x: -3, y: 12 }, { progress: 1, x: -19, y: 38 }]
    const i = Math.min(stops.length - 2, Math.floor(progress * (stops.length - 1)))
    const start = stops[i], end = stops[i + 1]
    const local = (progress - start.progress) / (end.progress - start.progress)
    const eased = local * local * (3 - 2 * local)
    const x = start.x + (end.x - start.x) * eased
    const y = start.y + (end.y - start.y) * eased
    const landingFade = Math.min(1, Math.max(0, -bounds.bottom / (window.innerHeight * 0.35)))
    flight.style.setProperty('--flight-progress', progress.toFixed(4))
    flight.style.setProperty('--flight-y', `${y}vh`)
    flight.style.setProperty('--flight-x', `${x}vw`)
    flight.style.setProperty('--flight-scale', `${1 - progress * 0.25}`)
    flight.style.setProperty('--flight-rotate', `${Math.sin(progress * Math.PI * 6) * 7 - (1 - progress) * 6}deg`)
    flight.style.setProperty('--flight-opacity', `${1 - landingFade}`)
  }
  const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(updateFlight) }
  updateFlight()
  addEventListener('scroll', requestUpdate, { passive: true })
  addEventListener('resize', requestUpdate)
}

/* Josh lands at the "not alone" message */
const divider = document.querySelector('.reentry-message')
const josh = document.querySelector('[data-selected-josh-weave]')
if (divider && josh && flight) {
  const props = ['animation', 'position', 'top', 'right', 'left', 'width', 'height', 'transform', 'z-index']
  const updateStop = () => {
    const shouldStop = divider.getBoundingClientRect().top <= innerHeight * 0.5
    const stopped = josh.dataset.stoppedAtDivider === 'true'
    if (shouldStop && !stopped) {
      const j = josh.getBoundingClientRect(), f = flight.getBoundingClientRect()
      josh.dataset.stoppedAtDivider = 'true'
      Object.assign(josh.style, {
        animation: 'none', position: 'absolute',
        top: `${j.top - f.top + Math.min(90, innerHeight * 0.1)}px`,
        right: 'auto', left: `${j.left - f.left}px`,
        width: `${j.width}px`, height: `${j.height}px`, transform: 'none', zIndex: '0',
      })
    } else if (!shouldStop && stopped) {
      delete josh.dataset.stoppedAtDivider
      props.forEach((p) => josh.style.removeProperty(p))
    }
  }
  addEventListener('scroll', updateStop, { passive: true })
  addEventListener('resize', updateStop)
  requestAnimationFrame(updateStop)
}

/* ===== Book reader, impact tabs ===== */
const DATA = {"books": [{"id": "courage", "number": "01", "title": "JOSHWAY and the Courage to Rise", "description": "A story about facing big feelings, asking for help, and discovering that courage can begin with one honest choice.", "tone": "coral", "cover": "/joshway-courage-to-rise-cover.png", "comingSoon": false}, {"id": "resilience", "number": "02", "title": "The Power of Resilience", "description": "A heartfelt adventure that empowers children to face challenges, believe in themselves, and uplift others along the way.", "tone": "blue", "cover": "/joshway-power-of-resilience-cover.png", "comingSoon": false}, {"id": "belonging", "number": "03", "title": "", "description": "The next story in the JOSHWAY Book Project is currently being developed.", "tone": "violet", "comingSoon": true}, {"id": "voice", "number": "04", "title": "", "description": "Another new story is planned for the growing JOSHWAY Book Project series.", "tone": "gold", "comingSoon": true}], "testimonials": [{"id": "children", "tab": "Children", "label": "CHILD PERSPECTIVE · PLACEHOLDER", "quote": "The story helped me understand that being brave can mean telling someone when I need help.", "note": "A future quote from a young reader can be added here."}, {"id": "families", "tab": "Families", "label": "FAMILY PERSPECTIVE · PLACEHOLDER", "quote": "We kept talking after the last page. It gave our family an easy, honest way to discuss feelings together.", "note": "A future quote from a parent or caregiver can be added here."}, {"id": "teachers", "tab": "Teachers", "label": "TEACHER PERSPECTIVE · PLACEHOLDER", "quote": "The reading opened the door for students to listen to one another, reflect, and share with more confidence.", "note": "A future quote from an educator can be added here."}]}
const ROOT = document.body.dataset.root || '../'
const ASSET = (f) => ROOT + 'assets/' + String(f).replace(/^\//, '')
const ARROW = '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 5l5 5-5 5"/></svg>'

const library = document.getElementById('library')
if (library) {
  const mount = document.getElementById('reader-mount')
  const prompt = library.querySelector('.floating-book-stage__prompt')
  const buttons = [...library.querySelectorAll('[data-book]')]
  const courageImages = [
    { src: 'courage-preview-feelings.webp', alt: 'An open Courage to Rise spread where Josh helps Cacie name feeling sad, confused, and lonely' },
    { src: 'courage-preview-safe-circle.webp', alt: 'An open Courage to Rise spread where Cacie shares the truth and identifies a safe circle of trusted adults' },
    { src: 'courage-preview-try-again.webp', alt: 'An open Courage to Rise football spread where Cacie tries again and helps teammates get back up' },
  ]
  const SHOP = 'https://joshway.org/shop/'
  let book = DATA.books[0], page = 0, open = false

  const view = () => {
    const img = book.id === 'courage' && page < 3 ? courageImages[page] : null
    const soon = book.id === 'resilience' && page < 3
    return { img, soon }
  }
  const spread = () => {
    const { img, soon } = view()
    const p = page
    let h = `<div class="open-preview-book__spread${img ? ' has-story-image' : ''}${soon ? ' has-coming-soon' : ''}">`
    if (img) h += `<img class="open-preview-book__story-image" src="${ASSET(img.src)}" alt="${img.alt}" style="inset:0;width:100%;height:100%;object-fit:fill;object-position:center">`
    if (soon) h += `<div class="resilience-coming-soon"><div class="resilience-coming-soon__character"><img src="${ASSET('resilience-joshway-character.webp')}" alt="Joshway in his blue superhero outfit from The Power of Resilience"></div><div class="resilience-coming-soon__thought"><span>PREVIEW PAGE ${p + 1}</span><strong>Coming soon</strong></div></div>`
    h += '<div class="preview-page preview-page--left">'
    if (p < 3) {
      if (!soon) h += `<span class="preview-page__bookmark">${img ? 'FROM THE BOOK' : `PREVIEW ${p + 1} OF 3`}</span>${img ? '' : `<small>${p * 2 + 1}</small>`}`
    } else {
      h += `<span class="preview-page__bookmark">KEEP READING</span><div class="preview-page__purchase-mark"><img src="${ASSET(book.cover)}" alt="${book.title} cover"></div>`
    }
    if (book.id === 'courage' && p === 0) h += `<img src="${ASSET('courage-preview-left-football.webp')}" alt="Cacie standing with his mom and stepdad outside a row home" style="position:absolute;inset:0;width:100%;height:100%;z-index:2;display:block;object-fit:cover;object-position:center">`
    if (p > 0) h += '<button class="preview-page__turn preview-page__turn--back" type="button" aria-label="Turn to the previous spread" data-turn="-1"><span aria-hidden="true">←</span></button>'
    h += '</div><div class="preview-page preview-page--right">'
    if (p < 3) {
      if (!img && !soon) h += `<div class="preview-page__blank" aria-label="Blank preview page"></div><small>${p * 2 + 2}</small>`
    } else {
      h += `<div class="preview-page__purchase"><span>THE STORY CONTINUES</span><h3>Ready to read the whole adventure?</h3><p>Bring ${book.title} home and support JOSHWAY’s work with young people.</p><a href="${SHOP}">Buy this book ${ARROW}</a></div>`
    }
    if (book.id === 'courage' && p === 0) h += `<img src="${ASSET('courage-preview-right-homes.webp')}" alt="Cacie balancing on a skateboard while riding down a curved ramp" style="position:absolute;inset:0;width:100%;height:100%;z-index:2;display:block;object-fit:cover;object-position:center top">`
    if (p < 3) h += `<button class="preview-page__turn preview-page__turn--next" type="button" aria-label="${p === 2 ? 'Turn to the purchase page' : 'Turn to the next blank spread'}" data-turn="1"><span aria-hidden="true">→</span></button>`
    return h + '</div></div>'
  }
  const controls = () => {
    const { img, soon } = view()
    return `<button type="button" ${page === 0 ? 'disabled' : ''} data-turn="-1"><span aria-hidden="true">←</span> Previous</button>
      <span>${page < 3 ? `${img || soon ? 'Preview' : 'Blank'} spread ${page + 1} of 3` : 'Full story'}</span>
      ${page < 3 ? `<button type="button" data-turn="1">${page === 2 ? 'Continue' : 'Next page'} <span aria-hidden="true">→</span></button>` : `<a href="${SHOP}">Visit the shop <span aria-hidden="true">→</span></a>`}`
  }
  const renderPage = () => {
    mount.querySelector('.open-preview-book').innerHTML = spread()
    mount.querySelector('.preview-reader__controls').innerHTML = controls()
  }
  const sync = () => {
    library.classList.toggle('is-reading', open)
    prompt.style.display = open ? 'none' : ''
    buttons.forEach((b) => {
      const on = open && b.dataset.book === book.id
      b.classList.toggle('is-selected', on)
      b.setAttribute('aria-pressed', String(on))
    })
  }
  const openBook = (id) => {
    book = DATA.books.find((b) => b.id === id) || DATA.books[0]
    page = 0; open = true; sync()
    mount.innerHTML = `<div class="preview-reader preview-reader--${book.tone}">
      <div class="preview-reader__topline"><div><span>NOW PREVIEWING</span><strong>${book.title}</strong></div>
        <button type="button" aria-label="Close book preview" data-close>Close <span aria-hidden="true">×</span></button></div>
      <div class="open-preview-book" aria-live="polite"></div><div class="preview-reader__controls"></div></div>`
    renderPage()
  }
  buttons.forEach((b) => b.addEventListener('click', () => openBook(b.dataset.book)))
  mount.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) { open = false; mount.innerHTML = ''; sync(); return }
    const turn = e.target.closest('[data-turn]')
    if (turn) { page = Math.min(3, Math.max(0, page + Number(turn.dataset.turn))); renderPage() }
  })
}

const impact = document.querySelector('.impact-page')
if (impact) {
  const T = DATA.testimonials
  let idx = 0
  const render = () => {
    const t = T[idx]
    impact.className = `impact-page impact-page--${t.id}`
    impact.querySelectorAll('[data-i], [data-id]').forEach((b) => {
      const on = b.dataset.i !== undefined ? Number(b.dataset.i) === idx : b.dataset.id === t.id
      b.classList.toggle('is-active', on)
      b.setAttribute('aria-pressed', String(on))
    })
    const q = document.createElement('div')
    q.className = 'impact-testimonial__quote'
    q.setAttribute('aria-live', 'polite')
    q.innerHTML = `<span class="impact-testimonial__mark">“</span><blockquote>${t.quote}</blockquote>
      <div class="impact-testimonial__attribution"><strong>${t.label}</strong><small>${t.note}</small></div>
      <div class="impact-testimonial__progress" aria-hidden="true">${T.map((x, i) => `<span class="${i === idx ? 'is-active' : ''}"></span>`).join('')}</div>`
    impact.querySelector('.impact-testimonial__quote').replaceWith(q)
  }
  impact.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i], [data-id]')
    if (!b) return
    idx = b.dataset.i !== undefined ? Number(b.dataset.i) : T.findIndex((t) => t.id === b.dataset.id)
    render()
  })
  const stage = impact.querySelector('.impact-page__image')
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect()
    stage.style.setProperty('--impact-x', `${((e.clientX - r.left) / r.width - 0.5) * 1.2}rem`)
    stage.style.setProperty('--impact-y', `${((e.clientY - r.top) / r.height - 0.5) * 1.2}rem`)
  })
  stage.addEventListener('pointerleave', () => { stage.style.setProperty('--impact-x', '0rem'); stage.style.setProperty('--impact-y', '0rem') })
  render()
}

/* ===== Request a reading dialog ===== */
;(() => {
  // Paste your Formspree / Netlify / own endpoint here to receive requests by email.
  // e.g. 'https://formspree.io/f/xxxxxxx'. While empty, requests are NOT sent anywhere.
  const FORM_ENDPOINT = ''

  /* Inject the dialog markup if the page doesn't already have it */
  if (!document.getElementById('reading-dialog')) {
    document.body.insertAdjacentHTML('beforeend', `<dialog class="reading-dialog" id="reading-dialog" aria-labelledby="reading-title">
<div class="reading-dialog__panel">
  <button class="reading-dialog__close" type="button" data-close aria-label="Close">&times;</button>
  <form class="reading-form" novalidate>
    <div class="eyebrow">REQUEST A READING</div>
    <h2 id="reading-title">Bring the JoshWay team to your room.</h2>
    <p class="reading-form__intro">Tell us a little about your event and we’ll follow up to find a date.</p>
    <div class="field-grid">
      <div class="field"><label for="rr-name">Your name</label><input id="rr-name" name="name" type="text" autocomplete="name" required><span class="field__error"></span></div>
      <div class="field"><label for="rr-email">Email</label><input id="rr-email" name="email" type="email" autocomplete="email" required><span class="field__error"></span></div>
      <div class="field field--wide"><label for="rr-org">School or organization</label><input id="rr-org" name="organization" type="text" autocomplete="organization" required><span class="field__error"></span></div>
      <div class="field"><label for="rr-type">Event type</label><select id="rr-type" name="type" required><option value="">Choose one</option><option>Classroom</option><option>Library</option><option>Community event</option><option>Other</option></select><span class="field__error"></span></div>
      <div class="field"><label for="rr-date">Preferred date</label><input id="rr-date" name="date" type="date" required><span class="field__error"></span></div>
      <div class="field"><label for="rr-size">Number of children</label><input id="rr-size" name="size" type="number" min="1" inputmode="numeric" required><span class="field__error"></span></div>
      <div class="field field--wide"><label for="rr-msg">Anything else we should know? (optional)</label><textarea id="rr-msg" name="message"></textarea><span class="field__error"></span></div>
      <div class="field--hp" aria-hidden="true"><label>Leave this empty <input name="website" tabindex="-1" autocomplete="off"></label></div>
    </div>
    <button class="button button--dark" type="submit">Send request <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 5l5 5-5 5"/></svg></button>
    <p class="reading-form__status" role="status" aria-live="polite"></p>
  </form>
  <div class="reading-success" hidden>
    <svg class="reading-success__check" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>
    <h2 tabindex="-1">Thank you, <span class="reading-success__name"></span>.</h2>
    <p>We’ve got your request and will be in touch soon to talk about a date.</p>
    <button class="button button--dark" type="button" data-close>Close</button>
  </div>
</div>
</dialog>`)
  }

  /* Request a reading dialog */
  const dlg = document.getElementById('reading-dialog')
  const form = dlg.querySelector('form')
  const done = dlg.querySelector('.reading-success')
  const status = dlg.querySelector('.reading-form__status')
  const submit = form.querySelector('button[type="submit"]')
  const submitHTML = submit.innerHTML
  const dateInput = form.querySelector('[name="date"]')
  const messages = {
    name: 'Please tell us your name.', email: 'Please enter a valid email address.',
    organization: 'Please add your school or organization.', type: 'Please choose an event type.',
    date: 'Please pick a preferred date.', size: 'Please enter how many children.',
  }
  let opener = null

  const clearErrors = () => form.querySelectorAll('.field').forEach((f) => {
    f.querySelector('.field__error').textContent = ''
    f.querySelector('[name]').removeAttribute('aria-invalid')
  })
  const validate = () => {
    let first = null
    form.querySelectorAll('[required]').forEach((f) => {
      const bad = !f.checkValidity()
      f.setAttribute('aria-invalid', String(bad))
      f.closest('.field').querySelector('.field__error').textContent = bad ? messages[f.name] : ''
      if (bad && !first) first = f
    })
    first?.focus()
    return !first
  }

  document.querySelectorAll('a[href="#reading"]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault()
    opener = a
    form.reset(); clearErrors(); status.textContent = ''
    form.hidden = false; done.hidden = true
    dateInput.min = new Date().toISOString().slice(0, 10)
    dlg.showModal()
  }))
  dlg.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dlg.close()))
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close() })
  dlg.addEventListener('close', () => opener?.focus())
  form.addEventListener('input', (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true' && e.target.checkValidity()) {
      e.target.setAttribute('aria-invalid', 'false')
      e.target.closest('.field').querySelector('.field__error').textContent = ''
    }
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (form.querySelector('[name="website"]').value) return // honeypot
    if (!validate()) return
    const data = Object.fromEntries(new FormData(form))
    delete data.website
    submit.disabled = true; submit.textContent = 'Sending…'; status.textContent = ''
    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error(res.status)
      } else {
        console.warn('FORM_ENDPOINT is empty, so this request was not sent anywhere:', data)
      }
      done.querySelector('.reading-success__name').textContent = data.name.split(' ')[0]
      form.hidden = true; done.hidden = false
      done.querySelector('h2').focus()
    } catch {
      status.textContent = 'Something went wrong. Please try again in a moment.'
    } finally {
      submit.disabled = false; submit.innerHTML = submitHTML
    }
  })
})()
