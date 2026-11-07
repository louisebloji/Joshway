const base = document.body.dataset.base || ''
const arrow = '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 5l5 5-5 5"/></svg>'

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

/* Buy buttons: no destination yet, keep the animations */
document.querySelectorAll('a[href="#buy-coming-soon"]').forEach((a) =>
  a.addEventListener('click', (e) => e.preventDefault()),
)

/* Bookshelf (About the Book Series) */
const shelf = document.getElementById('shelf')
if (shelf) {
  const books = [
    {
      id: 'courage', number: '01', title: 'JOSHWAY and the Courage to Rise', tone: 'coral', cover: 'joshway-courage-to-rise-cover.png',
      description: 'A story about facing big feelings, asking for help, and discovering that courage can begin with one honest choice.'
    },
    {
      id: 'resilience', number: '02', title: 'The Power of Resilience', tone: 'blue', cover: 'joshway-power-of-resilience-cover.png',
      description: 'A heartfelt adventure that empowers children to face challenges, believe in themselves, and uplift others along the way.'
    },
    {
      id: 'belonging', number: '03', title: '', tone: 'violet', comingSoon: true,
      description: 'The next story in the JOSHWAY Book Project is currently being developed.'
    },
    {
      id: 'voice', number: '04', title: '', tone: 'gold', comingSoon: true,
      description: 'Another new story is planned for the growing JOSHWAY Book Project series.'
    },
  ]
  const detail = document.getElementById('book-detail')
  const name = (b) => (b.comingSoon ? 'Coming soon' : b.title)

  shelf.innerHTML = books.map((b) => `
    <button class="bookshelf__spine bookshelf__spine--${b.tone}" type="button" data-id="${b.id}"
      aria-label="${b.comingSoon ? `Book ${b.number}, coming soon` : b.title}">
      <span>${b.number}</span><strong>${name(b)}</strong>
    </button>`).join('')

  const show = (id) => {
    const b = books.find((x) => x.id === id) || books[0]
    shelf.querySelectorAll('.bookshelf__spine').forEach((s) => {
      const on = s.dataset.id === b.id
      s.classList.toggle('is-active', on)
      s.setAttribute('aria-pressed', String(on))
    })
    detail.className = `book-detail book-detail--${b.tone}`
    detail.innerHTML = `
      <div class="book-detail__cover">${b.cover
        ? `<img src="${base}assets/${b.cover}" alt="${b.title} cover">`
        : `<span>JOSHWAY BOOK PROJECT</span><strong>${name(b)}</strong><small>Cover artwork placeholder</small>`}</div>
      <div class="book-detail__copy">
        <span>BOOK ${b.number}</span><h3>${name(b)}</h3><p>${b.description}</p>
        <small>${b.cover ? 'Available title' : 'Title to be announced'}</small>
        ${b.cover ? `<a class="book-detail__buy" href="#buy-coming-soon">Buy this book ${arrow}</a>` : ''}
      </div>`
    detail.querySelector('.book-detail__buy')?.addEventListener('click', (e) => e.preventDefault())
  }
  shelf.addEventListener('click', (e) => {
    const spine = e.target.closest('.bookshelf__spine')
    if (spine) show(spine.dataset.id)
  })
  show('courage')
}

/* Testimonial tabs (Community Impact) */
const box = document.getElementById('testimonials')
if (box) {
  const items = [
    {
      id: 'children', tab: 'Children', label: 'CHILD PERSPECTIVE · PLACEHOLDER',
      quote: 'The story helped me understand that being brave can mean telling someone when I need help.',
      note: 'A future quote from a young reader can be added here.'
    },
    {
      id: 'families', tab: 'Families', label: 'FAMILY PERSPECTIVE · PLACEHOLDER',
      quote: 'We kept talking after the last page. It gave our family an easy, honest way to discuss feelings together.',
      note: 'A future quote from a parent or caregiver can be added here.'
    },
    {
      id: 'teachers', tab: 'Teachers', label: 'TEACHER PERSPECTIVE · PLACEHOLDER',
      quote: 'The reading opened the door for students to listen to one another, reflect, and share with more confidence.',
      note: 'A future quote from an educator can be added here.'
    },
  ]
  box.innerHTML = `<div class="impact-testimonial__tabs" aria-label="Testimonial perspectives">${items
    .map((t) => `<button type="button" data-id="${t.id}">${t.tab}</button>`).join('')}</div>
    <div class="impact-testimonial__quote" aria-live="polite"></div>`
  const quote = box.querySelector('.impact-testimonial__quote')
  const showT = (id) => {
    const t = items.find((x) => x.id === id) || items[0]
    box.querySelectorAll('.impact-testimonial__tabs button').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.id === t.id)
      b.setAttribute('aria-pressed', String(b.dataset.id === t.id))
    })
    quote.innerHTML = `<span class="impact-testimonial__mark">“</span><blockquote>${t.quote}</blockquote>
      <div><strong>${t.label}</strong><small>${t.note}</small></div>`
  }
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.impact-testimonial__tabs button')
    if (b) showT(b.dataset.id)
  })
  showT('children')
}

/* Add ons */
; (() => {
  // Paste your Formspree / Netlify / own endpoint here to receive requests by email.
  // e.g. 'https://formspree.io/f/xxxxxxx'. While empty, requests are NOT sent anywhere.
  const FORM_ENDPOINT = ''

  /* Inject the dialog markup if the page doesn't already have it */
  if (!document.getElementById('reading-dialog')) {
    document.body.insertAdjacentHTML('beforeend', `
<dialog class="reading-dialog" id="reading-dialog" aria-labelledby="reading-title">
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

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const header = document.querySelector('.site-header')
  const hero = document.querySelector('.hero')

  /* Header shadow/shrink + hero scroll parallax */
  let ticking = false
  const onScroll = () => {
    header.classList.toggle('is-scrolled', scrollY > 8)
    if (hero && !reduce) hero.style.setProperty('--sy', Math.min(scrollY, 700) * 0.06)
    ticking = false
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll) } }, { passive: true })
  onScroll()

  /* Highlight the nav link whose section is on screen */
  const targets = [...document.querySelectorAll('.site-nav > a[href^="#"]')]
    .map((a) => ({ a, el: a.getAttribute('href').length > 1 ? document.querySelector(a.getAttribute('href')) : null }))
    .filter((t) => t.el)
  if (targets.length) {
    const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
      const t = targets.find((x) => x.el === en.target)
      if (en.isIntersecting) { targets.forEach((x) => x.a.classList.remove('is-section-active')); t.a.classList.add('is-section-active') }
      else t.a.classList.remove('is-section-active')
    }), { rootMargin: '-45% 0px -50% 0px' })
    targets.forEach((t) => spy.observe(t.el))
  }

  /* Hero depth: tilt toward the pointer */
  if (hero && !reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect()
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3))
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3))
    })
    hero.addEventListener('pointerleave', () => { hero.style.setProperty('--mx', 0); hero.style.setProperty('--my', 0) })
  }

  /* Scroll reveals */
  if (!reduce) {
    document.documentElement.classList.add('js-reveal')
    const sel = '.intro__heading,.intro__copy,.section-label,.section-heading,.pathway-card,.closing > *,.series-section__heading,.bookshelf,.series-purpose__card,.author-card,.series-cta > *,.footer,.impact-page__image,.impact-page__content > *,.bio-page__hero > *,.bio-page__content > *'
    const els = [...document.querySelectorAll(sel)]
    const count = new Map()
    els.forEach((el) => {
      const n = count.get(el.parentNode) || 0
      count.set(el.parentNode, n + 1)
      el.style.setProperty('--reveal-delay', Math.min(n, 4) * 90 + 'ms')
      el.classList.add('reveal')
    })
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return
      const el = en.target
      el.classList.add('is-visible')
      io.unobserve(el)
      // Hand control back to the element's own hover styles once revealed
      el.addEventListener('transitionend', (ev) => {
        if (ev.target === el && ev.propertyName === 'opacity') {
          el.classList.remove('reveal', 'is-visible')
          el.style.removeProperty('--reveal-delay')
        }
      })
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    els.forEach((el) => io.observe(el))
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