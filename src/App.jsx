import React, { useState, useEffect, useRef } from 'react'
import SoftAurora from './components/SoftAurora'
import LogoLoop from './components/LogoLoop'
import { PROFILE, PROJECTS, SKILL_COLUMNS } from './data/projects'

// Pure monochrome SVG brand logos for LogoLoop (zero text duplication with the Skills directory)
const BRAND_LOGOS = [
  {
    title: 'React',
    node: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    title: 'TypeScript',
    node: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="3" width="18" height="18" rx="2.5" />
        <path d="M8 11h5M10.5 11v6M17.5 12.5c-.5-.6-1.8-.8-2.4 0-.5.8.2 1.4 1.3 1.8 1.2.4 1.7 1.1 1.2 2-.5.8-1.9.8-2.6 0" />
      </svg>
    ),
  },
  {
    title: 'Figma',
    node: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M9 3h3v6H9a3 3 0 0 1 0-6Z" />
        <path d="M12 3h3a3 3 0 0 1 0 6h-3V3Z" />
        <circle cx="15" cy="12" r="3" />
        <path d="M9 9h3v6H9a3 3 0 0 1 0-6Z" />
        <path d="M9 15h3v3a3 3 0 1 1-3-3Z" />
      </svg>
    ),
  },
  {
    title: 'Three.js',
    node: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
        <polygon points="4,4 20,9 9,20" />
        <polygon points="12,6.5 14.5,14.5 6.5,12" />
      </svg>
    ),
  },
  {
    title: 'Vite',
    node: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M21 4L12 21 3 4l9 2.5L21 4Z" />
        <path d="M13 3l-3 7h4l-2 6" />
      </svg>
    ),
  },
  {
    title: 'WebGL',
    node: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
        <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" />
        <path d="M12 22V12M21 7l-9 5-9-5" />
      </svg>
    ),
  },
  {
    title: 'HTML5',
    node: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 3h16l-1.5 15L12 21l-6.5-3L4 3Z" />
        <path d="M8 8h8l-.5 4h-7l.4 3.5 3.1 1 3.1-1 .2-2" />
      </svg>
    ),
  },
  {
    title: 'Git',
    node: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="7" cy="6" r="2" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="12" r="2" />
        <path d="M7 8v8M9 6.5c4 0 4 5.5 6 5.5" />
      </svg>
    ),
  },
]

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
        {/* Monumental Typographic Masthead + Contact Directory (Zero Redundant Bars) */}
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
              <span className="role-edu">
                {PROFILE.education} · {PROFILE.location}
              </span>
            </div>

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

        {/* Visual SVG LogoLoop Ribbon (No Duplicate Text Strings) */}
        <div className="loop-strip" aria-label="Tech Logos">
          <LogoLoop
            logos={BRAND_LOGOS}
            speed={isMobile ? 32 : 42}
            gap={isMobile ? 44 : 64}
            logoHeight={22}
            fadeOut={true}
            fadeOutWidth={0.1}
            pauseOnHover={!isMobile}
            draggable={true}
          />
        </div>

        {/* Selected Frontend Work */}
        <section id="work" aria-label="Selected Frontends">
          <div className="work-header">
            <h2 className="work-heading">
              Selected <em>Frontends</em>
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

        {/* Clean 4-Column Categorized Skills at the Bottom */}
        <section id="skills" className="skills-bottom" aria-label="Skills and Capabilities">
          <div className="skills-bottom-header">
            <h2 className="work-heading">
              Skills &amp; <em>Toolkit</em>
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
