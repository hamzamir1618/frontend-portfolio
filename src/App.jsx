import React, { useState, useEffect, useRef } from 'react'
import SoftAurora from './components/SoftAurora'
import LogoLoop from './components/LogoLoop'
import { PROFILE, PROJECTS, SKILL_COLUMNS } from './data/projects'

const STACK_ITEMS = [
  { label: 'React 18', voice: 'sans', num: '01' },
  { label: 'TypeScript', voice: 'serif', num: '02' },
  { label: 'GSAP 3 & ScrollTrigger', voice: 'sans', num: '03' },
  { label: 'WebGL & Shaders', voice: 'serif', num: '04' },
  { label: 'Three.js 3D', voice: 'sans', num: '05' },
  { label: 'Figma Prototyping', voice: 'serif', num: '06' },
  { label: 'Design Systems', voice: 'sans', num: '07' },
  { label: 'Server-Driven UI', voice: 'serif', num: '08' },
  { label: 'Adobe Suite', voice: 'sans', num: '09' },
  { label: 'Unity Canvas UI', voice: 'serif', num: '10' },
].map((item) => ({
  title: item.label,
  node: (
    <span className={`kinetic-word ${item.voice}`}>
      {item.label}
      <sup className="kinetic-sup">{item.num}</sup>
    </span>
  ),
}))

function WorkItem({ project, previewMode, isMobile, onSelect }) {
  const frameRef = useRef(null)
  const [scale, setScale] = useState(0.38)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [inView, setInView] = useState(false)

  const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(
    project.url
  )}&screenshot=true&meta=false&embed=screenshot.url`

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    let lastW = 0
    const update = () => {
      const w = el.clientWidth
      if (w > 0 && Math.abs(w - lastW) >= 2) {
        lastW = w
        setScale(w / 1440)
      }
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = frameRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (isMobile) {
          setInView(entry.isIntersecting)
        } else {
          if (entry.isIntersecting) setInView(true)
        }
      },
      {
        rootMargin: isMobile ? '-8% 0px -8% 0px' : '300px 0px',
        threshold: isMobile ? 0.25 : 0.01,
      }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [isMobile])

  const wantIframe = previewMode === 'live' || failed
  const mountIframe = wantIframe && inView

  return (
    <article className="work-item">
      <div
        ref={frameRef}
        className="work-frame"
        onClick={() => onSelect(project)}
        role="button"
        tabIndex={0}
        aria-label={`Open interactive preview of ${project.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect(project)
          }
        }}
      >
        {!loaded && !mountIframe && (
          <div className="work-placeholder">{project.domain}</div>
        )}

        {!failed && (
          <img
            src={screenshotUrl}
            alt={project.title}
            className="work-img"
            loading="lazy"
            decoding="async"
            style={{ opacity: loaded ? 1 : 0 }}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}

        {mountIframe && (
          <div className="work-iframe-wrap">
            <iframe
              src={project.url}
              title={project.title}
              className="work-iframe"
              loading="lazy"
              style={{ transform: `scale(${scale})` }}
              tabIndex={-1}
            />
          </div>
        )}
      </div>

      <div className="work-caption">
        <div className="caption-left">
          <span className="work-index">/{project.index}</span>
          <h3 className="work-title">{project.title}</h3>
          <span className="work-type">{project.type}</span>
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="caption-link"
        >
          Visit ↗
        </a>
      </div>
    </article>
  )
}

export default function App() {
  const [previewMode, setPreviewMode] = useState('live')
  const [activeProject, setActiveProject] = useState(null)
  const [viewport, setViewport] = useState('desktop')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px), (pointer: coarse)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (!activeProject) {
      document.body.style.overflow = ''
      return
    }
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveProject(null)
      if (e.key === 'ArrowRight') {
        const i = PROJECTS.findIndex((p) => p.id === activeProject.id)
        setActiveProject(PROJECTS[(i + 1) % PROJECTS.length])
      }
      if (e.key === 'ArrowLeft') {
        const i = PROJECTS.findIndex((p) => p.id === activeProject.id)
        setActiveProject(PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [activeProject])

  return (
    <>
      {/* Subtle Monochrome Silver/Slate SoftAurora */}
      <div className="aurora-canvas" aria-hidden="true">
        <SoftAurora
          color1="#94a3b8"
          color2="#475569"
          speed={isMobile ? 0.2 : 0.3}
          scale={1.6}
          brightness={0.32}
          bandHeight={0.55}
          bandSpread={1.2}
          spectrum={0.15}
          opacity={0.42}
          enableMouseInteraction={!isMobile}
          clickPulse={!isMobile}
          mouseInfluence={0.15}
        />
      </div>

      <main className="canvas">
        {/* Minimal Edition Strip (Zero Redundant Buttons) */}
        <header className="spec-bar">
          <span>FOLIO ’26</span>
          <span className="spec-tag">{PROFILE.location}</span>
        </header>

        {/* Monumental Typographic Masthead + Clear Contact Info */}
        <section className="masthead">
          <h1 className="hero-name">
            <span>HAMZA</span>
            <span className="hero-name-serif">Ahmad Mir</span>
          </h1>

          <div className="masthead-grid">
            <div className="masthead-role-block">
              <div className="role-display">
                Frontend Developer &amp; <em>UI/UX Designer</em>
              </div>
              <span className="role-edu">{PROFILE.education}</span>
            </div>

            {/* Clean, Visible Contact Directory — Each Link Appears Once */}
            <div className="contact-directory" aria-label="Contact Information">
              <div className="contact-row">
                <span className="contact-label">EMAIL</span>
                <a href={`mailto:${PROFILE.email}`} className="contact-value">
                  {PROFILE.email}
                </a>
              </div>

              <div className="contact-row">
                <span className="contact-label">PHONE</span>
                <a href="tel:+923456910939" className="contact-value">
                  {PROFILE.phone}
                </a>
              </div>

              <div className="contact-row">
                <span className="contact-label">LINKS</span>
                <div className="contact-links-inline">
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-value"
                  >
                    GitHub ↗
                  </a>
                  <span className="contact-sep">/</span>
                  <a
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-value"
                  >
                    LinkedIn ↗
                  </a>
                  <span className="contact-sep">/</span>
                  <a
                    href={PROFILE.resumeUrl}
                    download="Hamza Ahmad Mir - Frontend Dev.pdf"
                    className="contact-value contact-resume"
                  >
                    Resume PDF ↓
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kinetic Typographic LogoLoop Ribbon */}
        <div className="loop-strip" aria-label="Toolkit">
          <LogoLoop
            logos={STACK_ITEMS}
            speed={isMobile ? 34 : 46}
            gap={isMobile ? 28 : 40}
            logoHeight={isMobile ? 20 : 24}
            fadeOut={true}
            fadeOutWidth={0.08}
            pauseOnHover={!isMobile}
            draggable={true}
          />
        </div>

        {/* Selected Frontend Work (Top Priority) */}
        <section id="work" aria-label="Selected Frontends">
          <div className="work-header">
            <h2 className="work-heading">
              Selected <em>Frontends</em>
              <span className="work-count">(01 — 0{PROJECTS.length})</span>
            </h2>

            <div className="view-toggle">
              <button
                type="button"
                className={`toggle-link ${
                  previewMode === 'live' ? 'active' : ''
                }`}
                onClick={() => setPreviewMode('live')}
              >
                [Live Canvas]
              </button>
              <button
                type="button"
                className={`toggle-link ${
                  previewMode === 'screenshot' ? 'active' : ''
                }`}
                onClick={() => setPreviewMode('screenshot')}
              >
                [Still]
              </button>
            </div>
          </div>

          <div className="work-grid">
            {PROJECTS.map((project) => (
              <WorkItem
                key={project.id}
                project={project}
                previewMode={previewMode}
                isMobile={isMobile}
                onSelect={(p) => {
                  setViewport('desktop')
                  setActiveProject(p)
                }}
              />
            ))}
          </div>
        </section>

        {/* Clean 4-Column Categorized Skills & Background at the Bottom */}
        <section id="skills" className="skills-bottom" aria-label="Skills and Background">
          <div className="skills-bottom-header">
            <h2 className="work-heading">
              Skills &amp; <em>Capabilities</em>
            </h2>
          </div>

          <div className="skills-columns">
            {SKILL_COLUMNS.map((col, idx) => (
              <div key={col.title} className="skill-column">
                <div className="skill-col-head">
                  <span className="skill-col-num">0{idx + 1}</span>
                  <h3 className="skill-col-title">{col.title}</h3>
                </div>
                <ul className="skill-col-list">
                  {col.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <footer className="minimal-footer">
          <span>© 2026 {PROFILE.name}</span>
          <span>Click any project frame to interact live</span>
        </footer>
      </main>

      {/* Clean Frameless Live Preview Modal */}
      {activeProject && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveProject(null)
          }}
        >
          <div className="modal-sheet" role="dialog" aria-modal="true">
            <div className="modal-bar">
              <div className="modal-bar-group">
                <button
                  type="button"
                  className="toggle-link active"
                  onClick={() => {
                    const i = PROJECTS.findIndex(
                      (p) => p.id === activeProject.id
                    )
                    setActiveProject(
                      PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length]
                    )
                  }}
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  className="toggle-link active"
                  onClick={() => {
                    const i = PROJECTS.findIndex(
                      (p) => p.id === activeProject.id
                    )
                    setActiveProject(PROJECTS[(i + 1) % PROJECTS.length])
                  }}
                >
                  Next →
                </button>
                <span className="modal-project-title">
                  /{activeProject.index} — {activeProject.title}
                </span>
              </div>

              <div className="modal-bar-group">
                <div className="modal-bar-group modal-device-toggles">
                  <button
                    type="button"
                    className={`toggle-link ${
                      viewport === 'desktop' ? 'active' : ''
                    }`}
                    onClick={() => setViewport('desktop')}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    className={`toggle-link ${
                      viewport === 'tablet' ? 'active' : ''
                    }`}
                    onClick={() => setViewport('tablet')}
                  >
                    Tablet
                  </button>
                  <button
                    type="button"
                    className={`toggle-link ${
                      viewport === 'mobile' ? 'active' : ''
                    }`}
                    onClick={() => setViewport('mobile')}
                  >
                    Mobile
                  </button>
                </div>
                <a
                  href={activeProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="toggle-link active"
                >
                  Open ↗
                </a>
                <button
                  type="button"
                  className="toggle-link active"
                  onClick={() => setActiveProject(null)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="modal-stage">
              <div
                className="modal-viewport"
                style={{
                  width: isMobile
                    ? '100%'
                    : viewport === 'mobile'
                      ? '390px'
                      : viewport === 'tablet'
                        ? '768px'
                        : '100%',
                }}
              >
                <iframe
                  key={activeProject.url}
                  src={activeProject.url}
                  title={activeProject.title}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
