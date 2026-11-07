# Generates the four page types from shared templates. Run: python3 build.py
import os
A='<svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 5l5 5-5 5"/></svg>'
authors=[
 dict(slug='melody-bradford',name='Melody Bradford',role='Author',img='melody-bradford.webp',
  short='An Emmy Award-winning producer and host, Melody brings a heart-centered belief in storytelling as a source of healing, courage, and hope.',
  full=['Melody Bradford is an Emmy Award-winning producer, sales executive, and host of Trailblazers on WDIY, an NPR-affiliated station. The podcast amplifies stories of courage, leadership, and hope.',
  'Her professional journey spans broadcasting, sales, and publishing, including work with Rodale Publishing in support of New York Times bestselling franchises such as The South Beach Diet, The Abs Diet, and the Men’s Health and Women’s Health brands.',
  'Guided by a deep belief in the power of storytelling to heal and empower, Melody brings a heart-centered perspective to this work—advocating for children navigating change, adversity, and transition while helping illuminate paths toward resilience and possibility.'],site=None),
 dict(slug='glenn-c-breslauer',name='Glenn C. Breslauer',role='Author',img='glenn-c-breslauer.webp',
  short='Glenn creates stories that help children understand their feelings, build courage, and recognize that asking for help is a sign of strength.',
  full=['Glenn C. Breslauer believes every child has a superpower waiting to be discovered. Through the JOSHWAY series, he creates stories that help kids understand their feelings, build courage, and learn that asking for help is a sign of strength.',
  'Glenn has spent his career turning big ideas into meaningful experiences. From inventing award-winning products to training teams at Apple, his work has always focused on helping people grow with confidence and purpose. As a founding partner at Wealthscope Financial and Big Mike Financial, he also helps families find financial clarity during important life transitions. Glenn brings this same heart and vision to his role as an Advisory Board member at JOSHWAY.',
  'He is the author of JOSHWAY and the Power of Resilience, There Are No Life Lessons, and The Perception of Control, and the co-author of JOSHWAY and the Courage to Rise. Glenn is married to his wife, Lucia, and is a proud dad to Siena, Peyton, Macy, and Avery, who remind him that becoming kind, thoughtful, and helpful starts at home.'],
  site=('https://www.par5consulting.com','par5consulting.com')),
 dict(slug='maggie-isamoyer',name='Maggie Isamoyer',role='Illustrator',img='maggie-isamoyer.webp',
  short='A Lehigh Valley children’s book illustrator, Maggie fills her work with whimsy and adventure to expand young readers’ imaginations.',
  full=['Maggie Isamoyer is a children’s book illustrator native to the Lehigh Valley. She loves bringing whimsy and adventure to her illustrations in the hopes of expanding readers’ imaginations.',
  'She knows how special and powerful a book can be and works to bring her own experience with reading to others around the world. When she is not illustrating books, Maggie loves to hike, travel, read fantasy books, and spend time with her family.',
  'Maggie’s other works include JOSHWAY and the Power of Resilience and Can You Read: Bryce Canyon National Park?'],
  site=('https://www.maggiemooillustration.com','maggiemooillustration.com')),
]
def page(path,title,body,cur,footer=True):
    d=path.count('/'); b='../'*d
    L=lambda p:b+p+'index.html'
    def item(key,href,name,small):
        return f'<a class="{"is-current" if cur==key else ""}" href="{L(href)}"><span>{name}</span><small>{"Current page" if cur==key and key!="home" else small}</small></a>'
    nav=''.join(f'<a href="#{n.lower()}">{n}</a>' for n in ['About','Programs','Opportunities'])
    nav2=''.join(f'<a href="#{n.lower()}">{n}</a>' for n in ['Arcade','Shop'])
    header=f'''<header class="site-header">
  <a class="brand" href="{L('')}" aria-label="JOSHWAY home"><img src="{b}assets/joshway-logo.png" alt="JOSHWAY"></a>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation"><span></span><span></span><span></span><span class="sr-only">Toggle menu</span></button>
  <nav id="site-navigation" class="site-nav" aria-label="Main navigation">
    {nav}
    <div class="nav-dropdown">
      <button class="nav-dropdown__trigger is-active" type="button" aria-expanded="false" aria-haspopup="true">Innovation <svg aria-hidden="true" viewBox="0 0 12 8"><path d="m1 1 5 5 5-5"/></svg></button>
      <div class="nav-dropdown__menu">
        {item('home','','Welcome','Meet the book project')}
        {item('series','about-the-book-series/','About the Book Series','Story and purpose')}
        {item('impact','community-impact/','Community Impact','Voices and outcomes')}
      </div>
    </div>
    {nav2}
    <a class="nav-donate" href="https://joshway.org/donate/">Donate</a>
  </nav>
</header>'''
    foot=f'''<footer class="footer">
  <a class="brand brand--footer" href="#top"><img src="{b}assets/joshway-logo.png" alt="JOSHWAY"></a>
  <div class="footer__meta"><p>913 Northampton Street · Easton, PA 18042</p><p>Innovation page concept · Content placeholders</p></div>
  <div class="footer__links"><a href="#contact">Contact</a><a href="#privacy">Privacy</a><a href="https://joshway.org/" target="_blank" rel="noreferrer">joshway.org</a></div>
</footer>''' if footer else ''
    html=f'''<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<script src="{b}guard.js"></script>
<link rel="icon" href="{b}assets/favicon.png?v=2">
<link rel="stylesheet" href="{b}styles.css">
<script src="{b}script.js" defer></script>
</head>
<body data-base="{b}">
<div class="site-shell">
{header}
{body(b,L)}
{foot}
</div>
</body>
</html>'''
    os.makedirs(os.path.dirname(path) or '.',exist_ok=True); open(path,'w').write(html)

def landing(b,L):
    return f'''<main id="top">
<section class="hero">
  <div class="hero__accent" aria-hidden="true"></div>
  <div class="hero__content">
    <div class="eyebrow hero-innovation-label">JOSHWAY INNOVATION</div>
    <h1>Courage creates<br>a way forward.</h1>
    <p class="hero__intro">A dedicated space for the story, purpose, and community impact behind Courage to Rise.</p>
    <a class="button button--dark hero-project-button" href="{L('about-the-book-series/')}">Explore the book project {A}</a>
  </div>
  <div class="hero__book"><div class="book-showcase" aria-label="The JOSHWAY book series">
    <a class="book-scene book-scene--courage" href="{L('about-the-book-series/')}#book-series-books" aria-label="Explore JOSHWAY and the Courage to Rise"><div class="book"><img class="book__cover" src="{b}assets/joshway-courage-to-rise-cover.png" alt="JOSHWAY and the Courage to Rise book cover"></div></a>
    <a class="book-scene book-scene--resilience" href="{L('about-the-book-series/')}#book-series-books" aria-label="Explore JOSHWAY and the Power of Resilience"><div class="book"><img class="book__cover" src="{b}assets/joshway-power-of-resilience-cover.png" alt="JOSHWAY and the Power of Resilience book cover"></div></a>
  </div></div>
</section>
<section class="intro section" id="about">
  <div class="intro__heading"><h2>A story with purpose.</h2>
    <div class="book-series-image-slot"><img src="{b}assets/joshway-book-project.png" alt="A JOSHWAY mentor helping a child create artwork at a table"></div></div>
  <div class="intro__copy">
    <h3 class="about-book-heading">JOSHWAY &amp; the Courage to Rise</h3>
    <div class="book-description">
      <p class="about-book-paragraph"><em class="about-book-title-inline">JOSHWAY and the Courage to Rise</em> follows one boy who discovers that true strength isn’t about being tough. It’s about facing big feelings and having the courage to ask for help. Brave choices, big heart, and a message every child needs to hear: you can be the hero of your own story.</p>
      <p class="about-book-paragraph"><strong class="about-book-impact-line">Buy a book, change a life.</strong> Every $15.99 paperback supports JOSHWAY®, the Easton, PA nonprofit helping young people build life skills and confidently find a pathway forward.</p>
    </div>
    <div class="intro__actions"><a class="button button--outline about-book-button" href="#buy-coming-soon">Buy the book {A}</a></div>
  </div>
</section>
<section class="pathways section" id="support">
  <div class="section-label">WAYS TO PARTICIPATE</div>
  <div class="section-heading section-heading--wide"><h2>Choose your next step.</h2><p>Clear pathways for families, schools, and community partners to engage with the project.</p></div>
  <div class="pathway-grid">
    <article class="pathway-card pathway-card--cyan"><div><p class="pathway-card__eyebrow">For Families</p><h3>Bring the story home.</h3><p class="pathway-card__description">Read Josh’s story together and start honest conversations about courage, resilience, and getting back up. It’s a book your family will come back to.</p></div>
      <a href="#buy-coming-soon">Buy a copy {A}</a></article>
    <article class="pathway-card pathway-card--paper"><div><p class="pathway-card__eyebrow">For Schools &amp; Organizations</p><h3>Request a reading.</h3><p class="pathway-card__description">Bring the JoshWay team to your classroom, library, or community event for a live reading that gets kids talking about courage and resilience.</p></div>
      <div class="pathway-actions"><a class="pathway-action pathway-action--primary" href="#reading">Request a reading {A}</a>
        <div class="pathway-action-coming-soon"><span class="pathway-action pathway-action--disabled" aria-disabled="true">Book the mascot</span><small>Coming soon</small></div></div></article>
    <article class="pathway-card pathway-card--dark"><div><p class="pathway-card__eyebrow">For Supporters</p><h3>Put courage in every classroom.</h3><p class="pathway-card__description">Your donation puts books and readings in schools and communities that need them most, so more kids hear a story about rising through hard times.</p></div>
      <a href="https://joshway.org/donate/">Donate to the cause {A}</a></article>
  </div>
</section>
<section class="closing"><div><div class="eyebrow">MAKE AN IMPACT</div><h2>Help a young person find their way forward.</h2></div>
  <a class="button button--light" href="https://joshway.org/donate/">Support the project {A}</a></section>
</main>'''

def series(b,L):
    cards=''.join(f'''<article class="author-card"><div class="author-card__portrait author-card__portrait--{a['slug']}"><img src="{b}assets/{a['img']}" alt="{a['name']}, {a['role']}"></div>
<div><p>{a['role']}</p><h3>{a['name']}</h3><span>{a['short']}</span><a class="author-card__link" href="{b}authors/{a['slug']}/index.html" target="_blank" rel="noreferrer">View full bio {A}</a></div></article>''' for a in authors)
    icons=[('<path d="M16 27S4.5 20.2 4.5 11.5A6.5 6.5 0 0 1 16 7.3a6.5 6.5 0 0 1 11.5 4.2C27.5 20.2 16 27 16 27Z"/>','Name big feelings','Give children approachable language for emotions that can otherwise feel too large or confusing to explain.'),
     ('<path d="M5 7.5h22v15H14l-6 4v-4H5v-15Z"/><path d="M10 13h12M10 17h8"/>','Make asking easier','Show that reaching out is not weakness—it is a thoughtful, courageous step toward support and connection.'),
     ('<path d="M6 26c4-9 6-14 11-17 3-2 6-3 9-3"/><path d="m21 3 5 3-3 5M7 22l4 4-5 2"/>','Open a pathway','Help young readers see that their next brave choice can become the beginning of a new way forward.')]
    purpose=''.join(f'<article class="series-purpose__card"><div class="series-purpose__icon"><svg aria-hidden="true" viewBox="0 0 32 32">{p}</svg></div><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></article>' for i,(p,t,d) in enumerate(icons))
    return f'''<main class="series-page" id="top">
<section class="series-section series-library" id="book-series-books">
  <div class="series-section__heading"><div class="section-label">THE BOOKS</div><h2>A growing shelf of stories for growing minds.</h2><p>Select a spine to pull a book from the shelf and learn more.</p></div>
  <div class="bookshelf">
    <div class="bookshelf__case" aria-label="Interactive book series shelf"><div class="bookshelf__books" id="shelf"></div><div class="bookshelf__board" aria-hidden="true"></div></div>
    <article class="book-detail" id="book-detail"></article>
  </div>
</section>
<section class="series-section series-purpose">
  <div class="series-section__heading"><div class="section-label">WHY THE BOOKS EXIST</div><h2>Every child deserves language for what they carry.</h2><p>The JOSHWAY Book Project turns meaningful life skills into stories families and educators can share together—one page, question, and brave conversation at a time.</p></div>
  <div class="series-purpose__grid">{purpose}</div>
</section>
<section class="series-section series-authors">
  <div class="series-section__heading"><div class="section-label">MEET THE AUTHORS</div><h2>Made by people who believe in young voices.</h2></div>
  <div class="series-authors__grid">{cards}</div>
</section>
<section class="series-cta"><div><div class="series-kicker">BRING THE STORIES HOME</div><h2>Help the next brave conversation begin.</h2><p>Get the books for your family, classroom, or community—or support the project so more young people can see themselves in the story.</p></div>
  <div class="series-cta__actions"><a class="button button--dark" href="#book-series-books">Explore the books {A}</a><a href="{L('community-impact/')}">See community impact {A}</a></div></section>
</main>'''

def impact(b,L):
    return f'''<main class="impact-page" id="top">
<div class="impact-page__image"><img src="{b}assets/joshway-community-reading.png" alt="An educator reading a picture book with a group of children">
  <div class="impact-page__image-label"><span>BOOK READINGS</span><strong>Stories shared in community</strong></div></div>
<section class="impact-page__content">
  <div><div class="series-kicker">COMMUNITY IMPACT</div><h1>A story can stay with a child long after the reading ends.</h1>
  <p>Shared readings create a welcoming place for children, families, and teachers to talk about courage, feelings, and the strength of asking for help.</p></div>
  <div class="impact-testimonial" id="testimonials"></div>
</section>
</main>'''

def bio(a):
    def body(b,L):
        site=f'<a href="{a["site"][0]}" target="_blank" rel="noreferrer">Visit {a["site"][1]} {A}</a>' if a['site'] else ''
        return f'''<main class="bio-page" id="top">
<section class="bio-page__hero"><div class="bio-page__portrait bio-page__portrait--{a['slug']}"><img src="{b}assets/{a['img']}" alt="{a['name']}, {a['role']}"></div>
  <div><div class="series-kicker">{a['role']}</div><h1>{a['name']}</h1><p>{a['short']}</p></div></section>
<section class="bio-page__content"><div class="bio-page__sidebar"><a class="bio-page__back" href="{L('about-the-book-series/')}">{A} Back to About the Book Series</a><div class="section-label">FULL BIOGRAPHY</div></div>
  <div class="bio-page__body">{''.join(f'<p>{p}</p>' for p in a['full'])}{site}</div></section>
</main>'''
    return body

page('index.html','JOSHWAY Innovation',landing,'home')
page('about-the-book-series/index.html','About the Book Series | JOSHWAY',series,'series')
page('community-impact/index.html','Community Impact | JOSHWAY',impact,'impact',footer=False)
for a in authors: page(f"authors/{a['slug']}/index.html",f"{a['name']} | JOSHWAY",bio(a),'series')
print('built')
