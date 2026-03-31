import { useEffect, useRef, useState, useCallback } from "react";
import { VENETH_PHOTO } from "./veneth_photo";
import ParticleBackground from "./ParticleBackground";
import SmoothScroll from "./SmoothScroll";
import { submitContact } from "./lib/api";

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
    title: "3D Web & Motion",
    items: [
      "Three.js Web Experiences",
      "GSAP Animations",
      "Scroll-Driven Animations",
      "Interactive 3D Elements",
      "WebGL Effects",
      "Performance Optimization",
    ],
  },
  {
    id: 4,
    num: "04",
    title: "Brand & Identity",
    items: [
      "Logo Design",
      "Brand Guidelines",
      "Social Media Templates",
      "Marketing Collateral",
      "Brand Strategy",
      "Visual Identity Systems",
    ],
  },
];

const PROJECTS: Project[] = [
  {
    id: 1,
    num: "01",
    tag: "Web Design",
    title: "Modern E-Commerce Platform",
    subtitle: "E-Commerce · UI/UX",
    liveUrl: null,
    thumb: null,
    accent: "#c9a84c",
    description: "A fully responsive e-commerce experience with seamless checkout flow and optimized conversion paths.",
    features: [
      "Custom product configurator",
      "One-click checkout integration",
      "Advanced filtering system",
      "Mobile-first design approach",
    ],
  },
  {
    id: 2,
    num: "02",
    tag: "No-Code",
    title: "SaaS Dashboard Design",
    subtitle: "SaaS · Dashboard",
    liveUrl: null,
    thumb: null,
    accent: "#c9a84c",
    description: "An intuitive analytics dashboard with real-time data visualization and customizable widgets.",
    features: [
      "Real-time data visualization",
      "Customizable widget layout",
      "Role-based access control",
      "Export & reporting tools",
    ],
  },
  {
    id: 3,
    num: "03",
    tag: "3D Web",
    title: "Immersive Portfolio",
    subtitle: "3D · Portfolio",
    liveUrl: null,
    thumb: null,
    accent: "#c9a84c",
    description: "An interactive 3D portfolio experience showcasing creative work through immersive web design.",
    features: [
      "Three.js powered scenes",
      "Scroll-driven animations",
      "Interactive 3D elements",
      "Smooth page transitions",
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
          <MagBtn className="proj-preview-btn" onClick={() => onPreview(p)}>View Case Study →</MagBtn>
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

/* ── CONTACT MODAL ──────────────────────────────────────────────────────────── */
function ContactModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isIndia, setIsIndia] = useState<boolean | null>(null);
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    project: "", 
    budget: "", 
    message: "" 
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    // Detect location
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setIsIndia(data?.country_code === 'IN');
      })
      .catch(() => setIsIndia(null));

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(form);
      setSent(true);
    } catch (err) {
      alert("Failed to send message. Please try again or email directly.");
    } finally {
      setLoading(false);
    }
  };

  const budgetOptionsIndia = [
    { value: "25k-50k", label: "₹25,000 - ₹50,000" },
    { value: "50k-1L", label: "₹50,000 - ₹1,00,000" },
    { value: "1L-2.5L", label: "₹1,00,000 - ₹2,50,000" },
    { value: "2.5L-5L", label: "₹2,50,000 - ₹5,00,000" },
    { value: "5L+", label: "₹5,00,000+" },
  ];

  const budgetOptionsGlobal = [
    { value: "2.5k-5k", label: "$2,500 - $5,000" },
    { value: "5k-10k", label: "$5,000 - $10,000" },
    { value: "10k-25k", label: "$10,000 - $25,000" },
    { value: "25k-50k", label: "$25,000 - $50,000" },
    { value: "50k+", label: "$50,000+" },
  ];

  const budgetOptions = isIndia === true ? budgetOptionsIndia : budgetOptionsGlobal;

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
                  <input id="ct-name" type="text" placeholder="John Smith" required value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} />
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-email">Email Address *</label>
                  <input id="ct-email" type="email" placeholder="john@company.com" required value={form.email} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} />
                </div>
              </div>
              <div className="ct-row">
                <div className="ct-field">
                  <label htmlFor="ct-phone">Phone Number</label>
                  <input id="ct-phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(v => ({ ...v, phone: e.target.value }))} />
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-project">Project Type</label>
                  <select id="ct-project" value={form.project} onChange={e => setForm(v => ({ ...v, project: e.target.value }))}>
                    <option value="">Select a type...</option>
                    <option value="website">Website</option>
                    <option value="webapp">Web Application</option>
                    <option value="branding">Branding</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="ct-row">
                <div className="ct-field">
                  <label htmlFor="ct-budget">Budget Range {isIndia === true && <span className="budget-badge">₹ INR</span>}</label>
                  <select id="ct-budget" value={form.budget} onChange={e => setForm(v => ({ ...v, budget: e.target.value }))}>
                    <option value="">Select range...</option>
                    {budgetOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-location">Your Location</label>
                  <input 
                    id="ct-location" 
                    type="text" 
                    placeholder="City, Country" 
                    value={isIndia === null ? "Detecting location..." : (isIndia ? "🇮🇳 India" : "🌍 International")}
                    disabled 
                  />
                </div>
              </div>
              <div className="ct-field">
                <label htmlFor="ct-message">Project Details *</label>
                <textarea id="ct-message" rows={4} placeholder="Tell me about your project..." required value={form.message} onChange={e => setForm(v => ({ ...v, message: e.target.value }))} />
              </div>
              <button type="submit" className="ct-submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message →"}
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
  const [dark, setDark] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button className="theme-toggle" onClick={() => setDark(v => !v)} aria-label="Toggle theme">
                {dark ? "☀️" : "🌙"}
              </button>
              <button className="burger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
                <span className={menuOpen ? "x" : ""} /><span className={menuOpen ? "x" : ""} /><span className={menuOpen ? "x" : ""} />
              </button>
            </div>
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
                <span className="badge-dot" /><span>Veneth ChandraKumar · UI/UX &amp; No-Code Developer</span>
              </div>
              <h1 className={`hero-h1${heroLoaded ? " in" : ""}`} style={{ transitionDelay: ".25s" }}>
                <span className="hl hl-serif">I design <span className="hl hl-italic">&amp; build</span></span>
                <span className="hl hl-sm">digital experiences</span>
                <span className="hl hl-accent">that convert.</span>
              </h1>
              <p className={`hero-para${heroLoaded ? " in" : ""}`} style={{ transitionDelay: ".4s" }}>
                Specialising in UI/UX Design, No-Code Development, and Vibe Coding.
                I engineer responsive, fully functional web platforms that elevate brands and drive real user action.
              </p>
              <div className={`hero-btns${heroLoaded ? " in" : ""}`} style={{ transitionDelay: ".55s" }}>
                <MagBtn className="btn-dark" onClick={() => scrollTo("projects")}>View Selected Works →</MagBtn>
                <MagBtn className="btn-outline" onClick={() => setContactOpen(true)}>Let's Talk ↗</MagBtn>
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
                  <img src={VENETH_PHOTO} alt="Veneth ChandraKumar" className="ps-photo" />
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
                    <img src={VENETH_PHOTO} alt="Veneth ChandraKumar" className="about-photo" />
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
                    <a href="mailto:hello@venethstudio.com" className="alink">✉ hello@venethstudio.com</a>
                    <a href="https://instagram.com/Veneth_design" target="_blank" rel="noreferrer" className="alink">Instagram ↗</a>
                  </div>
                  <MagBtn className="btn-dark" onClick={() => setContactOpen(true)}>Work With Me →</MagBtn>
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
                <span className="eyebrow" style={{ color: "var(--text-on-dark-muted)" }}>Ready to Build?</span>
                <h2 className="cta-h2">Your Next Web Experience<br /><em>Starts Here.</em></h2>
                <p className="cta-sub">Available for real estate, healthcare, hospitality, fitness, and lifestyle brands across Tamil Nadu and beyond.</p>
                <div className="cta-btns">
                  <MagBtn className="btn-light" onClick={() => setContactOpen(true)}>Start a Project →</MagBtn>
                  <MagBtn className="btn-outline-light" href="https://instagram.com/Veneth_design" target="_blank">Follow on Instagram</MagBtn>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* ── FOOTER ── */}
        <footer className="site-footer">
          <div className="ft-wrap">
            <div className="ft-brand">
              <span>Veneth Studio</span>
            </div>
            <div className="ft-links">
              <a href="https://instagram.com/Veneth_design" target="_blank" rel="noreferrer">Instagram</a>
              <a href="mailto:hello@venethstudio.com">Email</a>
            </div>
            <p className="ft-copy">© 2025 Veneth Studio · Trichy, Tamil Nadu</p>
          </div>
        </footer>

        {/* MODALS */}
        {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
        {previewProj && <PreviewModal project={previewProj} onClose={() => setPreviewProj(null)} />}
      </div>
    </SmoothScroll>
  );
}
