import React, { useState, useEffect, useRef } from 'react'
import SoftAurora from './components/SoftAurora'
import LogoLoop from './components/LogoLoop'
import { PROFILE, PROJECTS } from './data/projects'

const STACK_ITEMS = [
  { label: 'React.js', voice: 'sans', num: '01' },
  { label: 'Figma Prototyping', voice: 'serif', num: '02' },
  { label: 'JavaScript ES6+', voice: 'sans', num: '03' },
  { label: 'Design Systems', voice: 'serif', num: '04' },
  { label: 'HTML5 & CSS3', voice: 'sans', num: '05' },
  { label: 'Server-Driven UI', voice: 'serif', num: '06' },
  { label: 'Auto-Layout Handoff', voice: 'sans', num: '07' },
  { label: 'UX Teardowns', voice: 'serif', num: '08' },
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

function WorkItem({ project, previewMode, onSelect }) {
  const frameRef = useRef(null)
  const [scale, setScale] = useState(0.38)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(
    project.url
  )}&screenshot=true&meta=false&embed=screenshot.url`

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const update = () => {
      if (el.clientWidth > 0) setScale(el.clientWidth / 1440)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const useIframe = previewMode === 'live' || failed

  return (
    <article className="work-item">
      <div
        ref={frameRef}
        className="work-frame"
        onClick={() => onSelect(project)}
        role="button"
        tabIndex={0}
        aria-label={`Preview ${project.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect(project)
          }
        }}
      >
        {!loaded && !useIframe && (
          <div className="work-placeholder">{project.domain}</div>
        )}

        {!useIframe ? (
          <img
            src={screenshotUrl}
            alt={project.title}
            className="work-img"
            loading="lazy"
            style={{ opacity: loaded ? 1 : 0 }}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        ) : (
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

        <div className="caption-actions">
          <button
            type="button"
            className="caption-link"
            onClick={() => onSelect(project)}
          >
            [Preview]
          </button>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="caption-link"
          >
            Visit ↗
          </a>
        </div>
      </div>
    </article>
  )
}

export default function App() {
  const [previewMode, setPreviewMode] = useState('screenshot')
  const [activeProject, setActiveProject] = useState(null)
  const [viewport, setViewport] = useState('desktop')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!activeProject) return
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
    return () => window.removeEventListener('keydown', onKey)
  }, [activeProject])

  const copyEmail = () => {
    navigator.clipboard?.writeText(PROFILE.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <>
      {/* Subtle Monochrome Silver/Slate SoftAurora */}
      <div className="aurora-canvas" aria-hidden="true">
        <SoftAurora
          color1="#94a3b8"
          color2="#475569"
          speed={0.3}
          scale={1.6}
          brightness={0.32}
          bandHeight={0.55}
          bandSpread={1.2}
          spectrum={0.15}
          opacity={0.42}
          enableMouseInteraction={true}
          mouseInfluence={0.15}
        />
      </div>

      <main className="canvas">
        {/* Top Monospace Index Strip */}
        <header className="spec-bar">
          <div className="spec-left">
            <span>FOLIO ’26</span>
            <span className="spec-tag">ISLAMABAD, PK</span>
          </div>

          <nav className="spec-links" aria-label="Links">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="spec-link"
            >
              <sup>01</sup>GitHub ↗
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="spec-link"
            >
              <sup>02</sup>LinkedIn ↗
            </a>
            <a
              href={PROFILE.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="spec-link"
            >
              <sup>03</sup>Resume PDF ↗
            </a>
            <button type="button" className="spec-link" onClick={copyEmail}>
              <sup>04</sup>
              {copied ? 'Copied Email' : PROFILE.email}
            </button>
          </nav>
        </header>

        {/* Monumental Typographic Masthead */}
        <section className="masthead">
          <h1 className="hero-name">
            <span>HAMZA</span>
            <span className="hero-name-serif">Ahmad Mir</span>
          </h1>

          <div className="masthead-subgrid">
            <div className="masthead-role-block">
              <span className="role-kicker">DISCIPLINE</span>
              <div className="role-display">
                Frontend Engineer &amp; <em>UI/UX Designer</em>
              </div>
            </div>

            <p className="masthead-statement">
              Three years of hands-on practice <em>designing in Figma</em> and
              building clean, responsive <strong>React interfaces</strong> with
              zero-friction user flows.
            </p>
          </div>
        </section>

        {/* Kinetic Typographic LogoLoop Ribbon */}
        <div className="loop-strip" aria-label="Toolkit">
          <LogoLoop
            logos={STACK_ITEMS}
            speed={46}
            gap={40}
            logoHeight={24}
            fadeOut={true}
            fadeOutWidth={0.1}
            pauseOnHover={true}
            draggable={true}
          />
        </div>

        {/* Selected Frontend Work */}
        <section aria-label="Selected Frontends">
          <div className="work-header">
            <h2 className="work-heading">
              Selected <em>Frontends</em>
              <span className="work-count">(01 — 0{PROJECTS.length})</span>
            </h2>

            <div className="view-toggle">
              <button
                type="button"
                className={`toggle-link ${
                  previewMode === 'screenshot' ? 'active' : ''
                }`}
                onClick={() => setPreviewMode('screenshot')}
              >
                [Still]
              </button>
              <button
                type="button"
                className={`toggle-link ${
                  previewMode === 'live' ? 'active' : ''
                }`}
                onClick={() => setPreviewMode('live')}
              >
                [Live Canvas]
              </button>
            </div>
          </div>

          <div className="work-grid">
            {PROJECTS.map((project) => (
              <WorkItem
                key={project.id}
                project={project}
                previewMode={previewMode}
                onSelect={(p) => {
                  setViewport('desktop')
                  setActiveProject(p)
                }}
              />
            ))}
          </div>
        </section>

        {/* Editorial Typographic Index */}
        <section className="index-section" aria-label="Background and UX Work">
          <div className="index-col">
            <h2 className="index-heading">
              Product <em>UX &amp; Systems</em>
            </h2>
            <div className="index-list">
              <div className="index-row">
                <span className="row-primary">Food Ordering Mobile App</span>
                <span className="row-secondary">
                  Figma Prototype · Smart Wait UX
                </span>
              </div>
              <div className="index-row">
                <span className="row-primary">Saeed Book Bank Redesign</span>
                <span className="row-secondary">
                  Search &amp; Checkout Teardown
                </span>
              </div>
              <div className="index-row">
                <span className="row-primary">Frontend Architecture</span>
                <span className="row-secondary">
                  React, JavaScript, HTML/CSS, SDUI
                </span>
              </div>
              <div className="index-row">
                <span className="row-primary">Design Systems</span>
                <span className="row-secondary">
                  Figma Auto-Layout &amp; Dev Handoff
                </span>
              </div>
            </div>
          </div>

          <div className="index-col">
            <h2 className="index-heading">
              Background &amp; <em>Credentials</em>
            </h2>
            <div className="index-list">
              <div className="index-row">
                <span className="row-primary">B.S. Computer Science</span>
                <span className="row-secondary">FAST NUCES · 2022–2025</span>
              </div>
              <div className="index-row">
                <span className="row-primary">
                  Enterprise Design Thinking
                </span>
                <span className="row-secondary">IBM Certified</span>
              </div>
              <div className="index-row">
                <span className="row-primary">
                  Frontend Development Libraries V8
                </span>
                <span className="row-secondary">freeCodeCamp</span>
              </div>
              <div className="index-row">
                <span className="row-primary">Graphic Designer</span>
                <span className="row-secondary">
                  FAST Literary &amp; Computing Societies
                </span>
              </div>
            </div>
          </div>
        </section>

        <footer className="minimal-footer">
          <span>{PROFILE.name} — ALL RIGHTS RESERVED</span>
          <span>{PROFILE.location}</span>
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
                <span>
                  /{activeProject.index} — {activeProject.title}
                </span>
              </div>

              <div className="modal-bar-group">
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
                  Close [Esc]
                </button>
              </div>
            </div>

            <div className="modal-stage">
              <div
                className="modal-viewport"
                style={{
                  width:
                    viewport === 'mobile'
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
