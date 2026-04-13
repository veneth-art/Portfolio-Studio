import { useEffect, useRef, useState, useCallback } from "react";
import { VENETH_PHOTO } from "./veneth_photo";
import ParticleBackground from "./ParticleBackground";
import SmoothScroll from "./SmoothScroll";

/* ── TYPES ─────────────────────────────────────────────────────────────────── */
interface Project {
  id: number;
  num: string;
  tag: string;
  title: string;
  subtitle: string;
  liveUrl: string | null;
  thumb: string | null;
  accent: string;
  description: string;
  features: string[];
}

interface Service {
  id: number;
  num: string;
  title: string;
  items: string[];
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  initials: string;
}

/* ── STATIC DATA ───────────────────────────────────────────────────────────── */
const SERVICES: Service[] = [
  {
    id: 1,
    num: "01",
    title: "UI/UX Design",
    items: [
      "User Research & Analysis",
      "Wireframing & Prototyping",
      "High-Fidelity Visual Design",
      "Design Systems & Component Libraries",
      "Usability Testing & Iteration",
      "Responsive Design",
    ],
  },
  {
    id: 2,
    num: "02",
    title: "No-Code Development",
    items: [
      "Webflow Development",
      "Framer Sites",
      "Wix Studio",
      "Bubble.io Applications",
      "Zapier Automation",
      "CMS Integration",
    ],
  },
  {
    id: 3,
    num: "03",
    title: "Mobile App Design",
    items: [
      "User Research & Analysis",
      "Wireframing & Prototyping",
      "UI Design & Visual Design",
      "Interaction Design",
      "Usability Testing",
      "App Store Optimization",
    ],
  },
  {
    id: 4,
    num: "04",
    title: "Vibe Coding",
    items: [
      "AI-Assisted Development",
      "Rapid Prototyping",
      "Full-Stack Solutions",
      "API Integration",
      "MVP Launch",
      "Iterative Refinement",
    ],
  },
];

const PROJECTS: Project[] = [
  {
    id: 1,
    num: "01",
    tag: "Fitness",
    title: "CoreShift Gym",
    subtitle: "Fitness · Web Design",
    liveUrl: "https://coreshift.lovable.app",
    thumb: null,
    accent: "#ff6b35",
    description: "A high-energy fitness platform featuring class schedules, trainer profiles, membership plans, and an immersive user experience for gym enthusiasts.",
    features: [
      "Dynamic class booking system",
      "Trainer profiles & availability",
      "Membership tier management",
      "Responsive mobile-first design",
    ],
  },
  {
    id: 2,
    num: "02",
    tag: "Real Estate",
    title: "Vela Estates",
    subtitle: "Real Estate · Web Design",
    liveUrl: "https://vela-estates.lovable.app",
    thumb: null,
    accent: "#4a90d9",
    description: "A sleek real estate platform for browsing luxury properties with advanced filtering, virtual tours, and seamless agent contact functionality.",
    features: [
      "Advanced property search & filters",
      "High-resolution gallery views",
      "Agent contact integration",
      "Responsive across all devices",
    ],
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "CEO, TechStart",
    text: "Veneth transformed our vision into a stunning reality. The attention to detail and creative approach exceeded our expectations.",
    initials: "SM",
  },
  {
    id: 2,
    name: "David Chen",
    role: "Founder, DesignCo",
    text: "Working with Veneth was a game-changer. The no-code solution saved us months of development time without compromising quality.",
    initials: "DC",
  },
  {
    id: 3,
    name: "Maria Santos",
    role: "Marketing Director, Brandify",
    text: "The 3D elements and animations brought our brand to life. Our engagement metrics increased by 300% after the redesign.",
    initials: "MS",
  },
];

/* ── MAG BTN (helper) ───────────────────────────────────────────────────────── */
type MagBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  target?: string;
  children: React.ReactNode;
};
function MagBtn({ href, target, children, className, ...props }: MagBtnProps) {
  if (href) {
    return (
      <a href={href} className={className} target={target || "_blank"} rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

/* ── HOOKS ──────────────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const observe = () => {
      const els = document.querySelectorAll("[data-reveal]:not(.is-visible)");
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0, rootMargin: "0px 0px 0px 0px" });
      els.forEach(el => obs.observe(el));
      return obs;
    };
    const obs1 = observe();
    const t1 = setTimeout(() => { obs1.disconnect(); observe(); }, 200);
    const t2 = setTimeout(() => { observe(); }, 600);
    return () => { obs1.disconnect(); clearTimeout(t1); clearTimeout(t2); };
  }, []);
}

/* ── CURSOR ─────────────────────────────────────────────────────────────────── */
function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let rx = -100, ry = -100, mx = -100, my = -100;
    let raf: number;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; if (dotRef.current) { dotRef.current.style.left = mx + "px"; dotRef.current.style.top = my + "px"; } };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      rx = lerp(rx, mx, 0.12); ry = lerp(ry, my, 0.12);
      if (ringRef.current) { ringRef.current.style.left = rx + "px"; ringRef.current.style.top = ry + "px"; }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    const onDown = () => { dotRef.current?.classList.add("pressing"); ringRef.current?.classList.add("pressing"); };
    const onUp = () => { dotRef.current?.classList.remove("pressing"); ringRef.current?.classList.remove("pressing"); };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); window.removeEventListener("mousedown", onDown); window.removeEventListener("mouseup", onUp); };
  }, []);
  return (<><div ref={dotRef} className="cur-dot" aria-hidden="true" /><div ref={ringRef} className="cur-ring" aria-hidden="true" /></>);
}

/* ── PROJECT THUMB ──────────────────────────────────────────────────────────── */
function ProjectThumb({ p }: { p: Project }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  if (!p.thumb || err) {
    return (
      <div className="thumb-placeholder" style={{ background: "var(--thumb-placeholder-bg)" }}>
        <div className="tp-bignum" style={{ color: p.accent + "20" }}>{p.num}</div>
        <div className="tp-tag" style={{ color: p.accent }}>{p.tag}</div>
        <div className="tp-lines">{[...Array(7)].map((_, i) => <div key={i} className="tp-line" />)}</div>
      </div>
    );
  }
  return (
    <div className="thumb-wrap">
      {!loaded && <div className="thumb-skel"><div className="thumb-spinner" style={{ borderTopColor: p.accent }} /></div>}
      <img src={p.thumb} alt={p.title} className="thumb-img" loading="lazy"
        style={{ opacity: loaded ? 1 : 0 }} onLoad={() => setLoaded(true)} onError={() => setErr(true)} />
      <div className="thumb-overlay" />
      {p.liveUrl && <div className="thumb-live" style={{ background: p.accent }}><span className="live-pulse" />LIVE</div>}
    </div>
  );
}

/* ── SERVICE ROW ────────────────────────────────────────────────────────────── */
function ServiceRow({ s, idx, defaultOpen }: { s: Service; idx: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className={`srv-row srv-row-in${open ? " open" : ""}`} style={{ animationDelay: `${idx * 0.08}s` }}>
      <button className="srv-hdr" onClick={() => setOpen(v => !v)}>
        <span className="srv-idx">{s.num}</span>
        <span className="srv-name">{s.title}</span>
        <span className="srv-tog">{open ? "−" : "+"}</span>
      </button>
      <div className="srv-body" style={{ maxHeight: open ? 280 : 0 }}>
        <ul className="srv-list">{s.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </div>
    </div>
  );
}

/* ── PROJECT CARD ───────────────────────────────────────────────────────────── */
function ProjectCard({ p, idx, onPreview }: { p: Project; idx: number; onPreview: (p: Project) => void }) {
  return (
    <div className="proj-card" data-reveal style={{ "--d": `${idx * 0.1}s` } as React.CSSProperties}>
      <div className="proj-img-col">
        <ProjectThumb p={p} />
        <div className="proj-float-tag">{p.tag}</div>
      </div>
      <div className="proj-body">
        <div className="proj-meta">
          <span className="proj-num-badge">{p.num}</span>
          <span className="proj-sub">{p.subtitle}</span>
        </div>
        <h3 className="proj-title">{p.title}</h3>
        <p className="proj-desc">{p.description}</p>
        <ul className="proj-feats">{p.features.slice(0, 4).map((f, i) => <li key={i}><span style={{ color: p.accent }}>—</span> {f}</li>)}</ul>
        <div className="proj-actions">
          <MagBtn className="proj-preview-btn" onClick={() => onPreview(p)}>View Case Study</MagBtn>
          {p.liveUrl && <MagBtn className="proj-live-btn" href={p.liveUrl} target="_blank">Live Site ↗</MagBtn>}
        </div>
      </div>
    </div>
  );
}

/* ── PREVIEW MODAL ──────────────────────────────────────────────────────────── */
function PreviewModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const isDevUrl = project.liveUrl?.includes('localhost') || project.liveUrl?.includes('127.0.0.1');
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  return (
    <div className="modal-bg" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="pv-title">
      <div className="pv-modal" onClick={e => e.stopPropagation()} ref={modalRef} role="document">
        <div className="pv-top" style={{ borderBottom: `1px solid ${project.accent}33` }}>
          <div><span className="pv-tag" style={{ color: project.accent }}>{project.tag}</span><h3 className="pv-title" id="pv-title">{project.title}</h3></div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="pv-visit" style={{ background: project.accent }}>Open in New Tab ↗</a>}
            <button className="pv-close" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>
        <div className="pv-frame">
          {project.liveUrl && !isDevUrl
            ? <>
              {!loaded && <div className="pv-loading"><div className="pv-spinner" style={{ borderTopColor: project.accent }} /><span>Loading…</span></div>}
              <iframe
                src={project.liveUrl}
                title={project.title}
                onLoad={() => setLoaded(true)}
                style={{ opacity: loaded ? 1 : 0, transition: "opacity .5s" }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </>
            : <div className="pv-nourl" style={{ color: project.accent }}>
              <span className="pn-icon">◎</span>
              <p>{isDevUrl ? "Preview not available in dev mode." : "Live preview coming soon."}</p>
              {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="pv-visit" style={{ background: project.accent, marginTop: 16 }}>Open in New Tab ↗</a>}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

/* ── STYLED SELECT ─────────────────────────────────────────────────────────── */
function StyledSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; id?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div className="ct-field">
      <label>{label}</label>
      <div className="styled-select" ref={ref}>
        <div className="ss-selected" onClick={() => setOpen(!open)}>
          <span>{options.find(o => o.value === value)?.label || `Select ${label.toLowerCase()}...`}</span>
          <svg className={`ss-arrow${open ? " open" : ""}`} viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
        </div>
        <div className={`ss-options${open ? " open" : ""}`}>
          {options.map(opt => (
            <div key={opt.value} className={`ss-option${value === opt.value ? " active" : ""}`} onClick={() => { onChange(opt.value); setOpen(false); }}>
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── CONTACT MODAL ──────────────────────────────────────────────────────────── */
const API_URL = "/api/contact";

function ContactModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isIndia, setIsIndia] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", project: "", budget: "", message: "" });
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const contactData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      project: form.project,
      budget: form.budget,
      message: form.message,
      location: isIndia ? "India" : "Other",
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      if (response.ok) {
        setSent(true);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      localStorage.setItem("veneth_contact", JSON.stringify(contactData));
      setSent(true);
    }
    setLoading(false);
  };
  return (
    <div className="modal-bg" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="ct-title">
      <div className="ct-modal" onClick={e => e.stopPropagation()} role="document">
        <button className="ct-close" onClick={onClose} aria-label="Close">✕</button>
        {sent ? (
          <div className="ct-success">
            <div className="cs-icon">✓</div>
            <h3>Message Sent!</h3>
            <p>Thanks for reaching out. I'll get back to you within 24 hours.</p>
            <MagBtn className="btn-dark" onClick={onClose} style={{ marginTop: 20 }}>Close</MagBtn>
          </div>
        ) : (
          <>
            <div className="ct-head">
              <span className="eyebrow">Get in Touch</span>
              <h2 className="ct-title" id="ct-title">Let's Build<br /><em>Something Great.</em></h2>
            </div>
            <form className="ct-form" onSubmit={handleSubmit}>
              <div className="ct-row">
                <div className="ct-field">
                  <label htmlFor="ct-name">Your Name *</label>
                  <input id="ct-name" type="text" placeholder="veneth" required value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} />
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-email">Email Address *</label>
                  <input id="ct-email" type="email" placeholder="venethck34@gmail.com" required value={form.email} onChange={e => {
                    setForm(v => ({ ...v, email: e.target.value }));
                    const domain = e.target.value.split('@')[1] || '';
                    setIsIndia(domain.endsWith('.in'));
                  }} />
                </div>
              </div>
              <div className="ct-row">
                <div className="ct-field">
                  <label>Phone Number</label>
                  <input id="ct-phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(v => ({ ...v, phone: e.target.value }))} />
                </div>
                <StyledSelect
                  label="Location"
                  value={isIndia ? "india" : "other"}
                  onChange={v => setIsIndia(v === "india")}
                  options={[
                    { value: "india", label: "India (₹ INR)" },
                    { value: "other", label: "Other Countries ($ USD)" },
                  ]}
                  id=""
                />
              </div>
              <div className="ct-row">
                <StyledSelect
                  label="Project Type"
                  value={form.project}
                  onChange={v => setForm(f => ({ ...f, project: v }))}
                  options={[
                    // { value: "", label: "Select a type..." },//
                    { value: "website", label: "Website" },
                    { value: "webapp", label: "Web Application" },
                    { value: "mobile", label: "Mobile Application Design" },
                    { value: "other", label: "Other" }
                  ]}
                  id=""
                />
                <StyledSelect
                  label="Budget Range"
                  value={form.budget}
                  onChange={v => setForm(f => ({ ...f, budget: v }))}
                  options={isIndia ? [
                    { value: "₹15,000 - ₹30,000", label: "₹15,000 - ₹30,000" },
                    { value: "₹35,000 - ₹60,000", label: "₹35,000 - ₹60,000" },
                    { value: "₹70,000 - ₹90,000", label: "₹70,000 - ₹90,000" },
                    { value: "₹1,00,000+", label: "₹1,00,000+" },
                  ] : [
                    { value: "$500 - $1,000", label: "$500 - $1,000" },
                    { value: "$1,000 - $2,500", label: "$1,000 - $2,500" },
                    { value: "$2,500 - $5,000", label: "$2,500 - $5,000" },
                    { value: "$5,000+", label: "$5,000+" }
                  ]}
                  id=""
                />
              </div>
              <div className="ct-field">
                <label htmlFor="ct-message">Project Details *</label>
                <textarea id="ct-message" rows={4} placeholder="Tell me about your project..." required value={form.message} onChange={e => setForm(v => ({ ...v, message: e.target.value }))} />
              </div>
              {error && (
                <div className="ct-error">
                  <span>⚠️</span> {error}
                </div>
              )}
              <button type="submit" className="ct-submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ── MARQUEE ───────────────────────────────────────────────────────────────── */
function Marquee({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-wrap">
      <div className={`marquee-track${reverse ? " rev" : ""}`}>
        {doubled.map((item, i) => (
          <span key={i} className="mq-item">{item}<span className="mq-sep">·</span></span>
        ))}
      </div>
    </div>
  );
}

/* ── MAIN APP ──────────────────────────────────────────────────────────────── */
export default function App() {
  useReveal();
  const [contactOpen, setContactOpen] = useState(false);
  const [previewProj, setPreviewProj] = useState<Project | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      setPageTransition(true);
      setTimeout(() => setPageTransition(false), 600);
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setMenuOpen(false);
  }, []);

  return (
    <SmoothScroll>
      <ParticleBackground />
      <div className={`page-transition ${pageTransition ? "active" : ""}`}>
        <Cursor />

        {/* ── NAV ── */}
        <header className={`site-nav${scrolled ? " stuck" : ""}`}>
          <div className="nav-wrap">
            <div className="nav-brand" onClick={() => scrollTo("top")}>
              <div className="nav-av"><img src={VENETH_PHOTO} alt="Veneth" /></div>
              <span className="nav-name">Veneth Studio</span>
            </div>
            <nav className={`nav-menu${menuOpen ? " open" : ""}`}>
              {[["about", "About"], ["services", "Services"], ["projects", "Work"], ["process", "Process"]].map(([id, label]) => (
                <button key={id} className="nav-item" onClick={() => scrollTo(id)}>{label}</button>
              ))}
              <button className="nav-cta" onClick={() => { setContactOpen(true); setMenuOpen(false); }}>Contact</button>
            </nav>
            <button className="burger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
              <span className={menuOpen ? "x" : ""} /><span className={menuOpen ? "x" : ""} /><span className={menuOpen ? "x" : ""} />
            </button>
          </div>
        </header>

        {/* ── HERO ── */}
        <section id="top" className="hero-sec">
          <div className="hero-blob b1" aria-hidden="true" />
          <div className="hero-blob b2" aria-hidden="true" />
          <div className="hero-blob b3" aria-hidden="true" />

          <div className="hero-wrap">
            <div className="hero-left">
              <div className={`hero-badge${heroLoaded ? " in" : ""}`} style={{ transitionDelay: ".1s" }}>
                <span className="badge-dot" /><span>Veneth ChandraKumar · UI/UX Designer &amp; No-Code Developer</span>
              </div>
              <h1 className={`hero-h1${heroLoaded ? " in" : ""}`} style={{ transitionDelay: ".25s" }}>
                <span className="hl hl-serif">Building <span className="hl hl-italic">high-performance</span></span>
                <span className="hl hl-sm">digital experiences</span>
                <span className="hl hl-accent">that drive growth.</span>
              </h1>
              <p className={`hero-para${heroLoaded ? " in" : ""}`} style={{ transitionDelay: ".4s" }}>
                Specialising in <span className="hero-skill-badges">
                  <span className="hsb">UI/UX Design</span>
                  <span className="hsb">No-Code Development</span>
                  <span className="hsb">Vibe Coding</span>
                </span>.
                Building high-performance digital experiences that elevate brands and drive real results.
              </p>
              <div className={`hero-btns${heroLoaded ? " in" : ""}`} style={{ transitionDelay: ".55s" }}>
                <MagBtn className="btn-dark" onClick={() => scrollTo("projects")}>View Selected Works</MagBtn>
                <button className="hero-talk-btn" onClick={() => setContactOpen(true)}>
                  Get in touch
                </button>
              </div>
              <div className={`hero-stats${heroLoaded ? " in" : ""}`}>
                {[["5+", "Projects Delivered"], ["3", "No-Code Platforms"], ["100%", "Client Satisfaction"]].map(([n, l]) => (
                  <div key={l} className="hstat"><span className="hstat-n">{n}</span><span className="hstat-l">{l}</span></div>
                ))}
              </div>
            </div>

            <div className={`hero-right${heroLoaded ? " in" : ""}`}>
              <div className="photo-stack">
                <div className="ps-back" />
                <div className="ps-front">
                  <img src="/veneth-hero.png" alt="Veneth ChandraKumar" className="ps-photo" />
                  <div className="ps-overlay" />
                  <div className="ps-pill"><span className="pill-dot" />Available for Projects</div>
                </div>
                <div className="ps-deco-ring" />
                <div className="ps-tools">
                  <span className="ps-tool">Figma</span>
                  <span className="ps-tool">Webflow</span>
                  <span className="ps-tool">Framer</span>
                  <span className="ps-tool">Three.js</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MARQUEE STRIP ── */}
        <div className="strip" aria-hidden="true">
          <Marquee items={["UI/UX Design", "No-Code Dev", "Wix Studio", "Framer", "Webflow", "Motion Design", "Three.js", "GSAP", "Brand Systems", "Figma", "Prototyping", "Vibe Coding"]} />
        </div>

        {/* ── SERVICES ── */}
        <main id="main-content">
          <section id="services" className="services-sec" role="region" aria-label="Services">
            <div className="sec-wrap">
              <div className="sec-head" data-reveal>
                <span className="eyebrow">What I Can Do For You</span>
                <h2 className="sec-h2">Services &amp;<br /><em>expertise</em></h2>
              </div>
              <div className="services-grid">
                <div data-reveal style={{ "--d": ".05s" } as React.CSSProperties}>
                  <p className="srv-blurb">As a digital designer, I am a visual storyteller — crafting experiences that connect deeply and spark creativity. I bridge the gap between creative vision and technical execution.</p>
                  <div className="srv-tags">
                    {["UI/UX Design", "No-Code Dev", "Motion Design", "Brand Systems", "3D Web"].map(b => <span key={b} className="srv-tag">{b}</span>)}
                  </div>
                </div>
                <div className="srv-accordion">
                  {SERVICES.map((s, i) => <ServiceRow key={s.num} s={s} idx={i} defaultOpen={i === 0} />)}
                </div>
              </div>
            </div>
          </section>

          {/* ── ABOUT ── */}
          <section id="about" className="about-sec">
            <div className="sec-wrap">
              <div className="about-grid">
                <div className="about-photo-col" data-reveal>
                  <div className="about-photo-frame">
                    <img src="/veneth-hero.png" alt="Veneth ChandraKumar" className="about-photo" />
                    <div className="apf-deco" />
                    <div className="apf-badge">
                      <span className="apf-name">Veneth ChandraKumar</span>
                      <span className="apf-role">UI/UX · No-Code Developer</span>
                      <span className="apf-loc">📍 Trichy, Tamil Nadu</span>
                    </div>
                  </div>
                </div>
                <div className="about-content" data-reveal style={{ "--d": ".15s" } as React.CSSProperties}>
                  <span className="eyebrow">About Me</span>
                  <h2 className="sec-h2">The Architect<br /><em>Behind the Screen.</em></h2>
                  <p className="about-para">Hi, I'm Veneth — a UI/UX designer and No-Code developer based in Trichy, Tamil Nadu, passionate about crafting meaningful and impactful digital experiences.</p>
                  <p className="about-para">Great design is more than aesthetics — it's about seamless interaction and intuitive logic. By leveraging modern design systems and <strong>"vibe coding"</strong> — an AI-assisted, flow-state approach — I rapidly prototype and launch scalable websites perfectly aligned with business goals.</p>
                  <div className="about-skills">
                    {[["UI/UX Design", 95], ["No-Code Dev", 90], ["Motion & Animation", 85], ["3D Web (Three.js)", 75]].map(([l, v]) => (
                      <div key={l} className="sk-bar" data-reveal>
                        <div className="sk-top"><span>{l}</span><span className="sk-pct">{v}%</span></div>
                        <div className="sk-track"><div className="sk-fill is-visible" style={{ width: `${v}%` }} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="about-links">
                    <a href="mailto:venethck34@gmail.com" className="alink">✉ Venethck34@gmail.com</a>
                    <a href="https://instagram.com/Veneth_design" target="_blank" rel="noreferrer" className="alink">Instagram ↗</a>
                  </div>
                  <MagBtn className="btn-dark" onClick={() => setContactOpen(true)}>Work With Me</MagBtn>
                </div>
              </div>
            </div>
          </section>

          {/* ── PROJECTS ── */}
          <section id="projects" className="projects-sec">
            <div className="sec-wrap">
              <div className="sec-head" data-reveal>
                <span className="eyebrow">Featured Projects</span>
                <h2 className="sec-h2">Problems solved,<br /><em>beautifully.</em></h2>
                <p className="sec-sub">These selected projects reflect a passion for blending strategy with creativity — solving real problems through thoughtful design and impactful storytelling.</p>
              </div>
              <div className="proj-grid">
                {PROJECTS.map((p, i) => (
                  <ProjectCard key={p.id} p={p} idx={i} onPreview={setPreviewProj} />
                ))}
              </div>
            </div>
          </section>

          {/* ── PROCESS ── */}
          <section id="process" className="process-sec">
            <div className="sec-wrap">
              <div className="sec-head" data-reveal>
                <span className="eyebrow">How I Work</span>
                <h2 className="sec-h2">A proven<br /><em>process.</em></h2>
              </div>
              <div className="process-grid">
                {[
                  ["🔍", "01", "Discovery", "Understanding your vision, goals, and target audience through deep-dive sessions."],
                  ["🎨", "02", "Design", "Creating wireframes, prototypes, and high-fidelity designs that bring ideas to life."],
                  ["⚡", "03", "Develop", "Building responsive, performant websites using modern tools and best practices."],
                  ["🚀", "04", "Launch", "Deploying, testing, and optimizing your site for maximum impact and results."],
                ].map(([icon, num, title, desc]) => (
                  <div key={num as string} className="proc-card" data-reveal style={{ "--d": `${(Number(num) - 1) * 0.1}s` } as React.CSSProperties}>
                    <span className="proc-icon">{icon}</span>
                    <div className="proc-num">{num}</div>
                    <h4 className="proc-title">{title}</h4>
                    <p className="proc-desc">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── TESTIMONIALS ── */}
          <section className="testi-sec">
            <div className="sec-wrap">
              <div className="sec-head" data-reveal>
                <span className="eyebrow">What My Clients Say</span>
                <h2 className="sec-h2">Trusted by brands<br /><em>across Tamil Nadu.</em></h2>
              </div>
              <div className="testi-grid">
                {TESTIMONIALS.map((t, i) => (
                  <div key={i} className="testi-card" data-reveal style={{ "--d": `${i * 0.1}s` } as React.CSSProperties}>
                    <p className="testi-q">"{t.text}"</p>
                    <div className="testi-who">
                      <div className="testi-av">{t.initials}</div>
                      <div><strong>{t.name}</strong><br /><span>{t.role}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── MARQUEE 2 ── */}
          <div className="strip strip-dark">
            <Marquee items={["Real Estate", "Fitness", "Healthcare", "Hospitality", "Lifestyle", "Education", "Dental", "Retail", "Startups", "Local Brands"]} reverse />
          </div>

          {/* ── CTA ── */}
          <section id="contact" className="cta-sec">
            <div className="sec-wrap">
              <div className="cta-box" data-reveal>
                <span className="eyebrow cta-eyebrow">Ready to Build?</span>
                <h2 className="cta-h2">Your Next Web Experience<br /><em>Starts Here.</em></h2>
                <p className="cta-sub">Available for real estate, healthcare, hospitality, fitness, and lifestyle brands across Tamil Nadu and beyond.</p>
                <div className="cta-btns">
                  <MagBtn className="btn-dark" onClick={() => setContactOpen(true)}>Start a Project</MagBtn>
                  <MagBtn className="btn-outline" href="https://instagram.com/Veneth_design" target="_blank">Follow on Instagram</MagBtn>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* ── FOOTER ── */}
        <footer className="site-footer">
          <div className="ft-wrap">
            <div className="ft-grid">
              <div className="ft-col ft-brand-col">
                <h3 className="ft-logo">Veneth Studio</h3>
                <p className="ft-tagline">Crafting digital experiences that elevate brands and drive results.</p>
                <div className="ft-social">
                  <a href="https://instagram.com/Veneth_design" target="_blank" rel="noreferrer" className="ft-social-link">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  </a>
                  <a href="https://twitter.com/veneth_design" target="_blank" rel="noreferrer" className="ft-social-link">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                  <a href="https://linkedin.com/in/veneth" target="_blank" rel="noreferrer" className="ft-social-link">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </a>
                </div>
              </div>
              <div className="ft-col">
                <h4 className="ft-col-title">Navigation</h4>
                <ul className="ft-nav">
                  <li><a onClick={() => scrollTo("about")}>About</a></li>
                  <li><a onClick={() => scrollTo("services")}>Services</a></li>
                  <li><a onClick={() => scrollTo("projects")}>Projects</a></li>
                  <li><a onClick={() => scrollTo("process")}>Process</a></li>
                </ul>
              </div>
              <div className="ft-col">
                <h4 className="ft-col-title">Services</h4>
                <ul className="ft-nav">
                  <li><a>UI/UX Design</a></li>
                  <li><a>Web Development</a></li>
                  <li><a>No-Code Development</a></li>
                  <li><a>Vibe Coding</a></li>
                </ul>
              </div>
              <div className="ft-col">
                <h4 className="ft-col-title">Contact</h4>
                <ul className="ft-nav">
                  <li><a href="mailto:venethck34@gmail.com">Venethck34@gmail.com</a></li>
                  <li><a href="tel:+918248547040">+91 8248547040</a></li>
                  <li><span className="ft-location">Trichy, Tamil Nadu, India</span></li>
                </ul>
              </div>
            </div>
            <div className="ft-bottom">
              <p className="ft-copy">© 2025 Veneth Studio. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* MODALS */}
        {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
        {previewProj && <PreviewModal project={previewProj} onClose={() => setPreviewProj(null)} />}
      </div>
    </SmoothScroll>
  );
}
