import { useEffect, useRef, useState, useCallback } from "react";
import { VENETH_PHOTO } from "./veneth_photo";

/* ── DATA ──────────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    num: "01", tag: "UI/UX · No-Code",
    title: "CoreShift Gym",
    subtitle: "High-Performance Athletic Platform",
    liveUrl: "https://coreshift.lovable.app",
    thumb: "https://image.thum.io/get/width/900/crop/560/https://coreshift.lovable.app",
    accent: "#e85d26",
    features: ["Dynamic class scheduling UI with live filter system","Scroll-triggered hero with kinetic typography","Interactive membership plan finder & BMI widget","Full mobile-first layout with touch gestures","Performance-optimised video background — sub-3s load","Clip-path & text-skew reveal animations"],
    description: "A bold, conversion-focused fitness platform built to drive memberships and class bookings through frictionless UX and energetic visual design.",
  },
  {
    num: "02", tag: "Web Design · 3D",
    title: "Vēlā Estates",
    subtitle: "Luxury Real Estate Portal",
    liveUrl: "https://vela-estates.netlify.app/",
    thumb: "https://image.thum.io/get/width/900/crop/560/https://vela-estates.netlify.app/",
    accent: "#b8922a",
    features: ["Advanced property filtering — price, location & amenities","Full-screen immersive galleries with virtual tour links","Parallax hero with slow editorial text reveals","Sticky lead-capture forms on property pages","Three.js ambient particle background","GSAP page transitions & smooth scroll"],
    description: "A premium real estate portal crafted for high-net-worth buyers in Tamil Nadu — editorial aesthetics meets conversion-engineered lead capture.",
  },
  {
    num: "03", tag: "UI/UX · Accessibility",
    title: "Elara Dental",
    subtitle: "Premium Clinic & Care Platform",
    liveUrl: null, thumb: null, accent: "#2a7ab8",
    features: ["Multi-step appointment booking with progress UI","Before & After interactive image comparison slider","WCAG 2.1 AA — high-contrast for elderly users","Calming fade-in motion system across all pages","Service directory with filterable categories","Patient review carousel with trust signals"],
    description: "A patient-first dental platform combining trust-building design with intuitive booking flows — lowering anxiety, raising appointments.",
  },
];

const SERVICES = [
  { num: "01", title: "UI/UX Design", items: ["Wireframing and interactive prototyping","User Interface design for web & mobile","Usability testing and feedback analysis","Interaction design and micro-animations"] },
  { num: "02", title: "No-Code Development", items: ["Wix Studio, Framer & Webflow builds","CMS setup and content management","Responsive, mobile-first architecture","Third-party integrations and automation"] },
  { num: "03", title: "Web Design", items: ["Landing page design and optimisation","Responsive website design for all screens","Performance-first architecture","SEO setup and post-launch support"] },
  { num: "04", title: "Branding", items: ["Brand strategy and visual identity","Typography and colour system design","Brand storytelling and messaging","Style guide and asset handoff"] },
];

const TESTIMONIALS = [
  { name: "Rajan Krishnamurthy", role: "Director, Vēlā Estates", text: "Veneth completely transformed our property listings. The site feels premium and our leads doubled in the first month.", initials: "RK" },
  { name: "Priya Suresh", role: "Owner, CoreShift Gym", text: "Incredible attention to detail. The animations and mobile experience are exactly what we needed to convert visitors into members.", initials: "PS" },
  { name: "Dr. Anand Mehra", role: "Elara Dental Clinic", text: "Professional, fast, and truly understood our brand. The booking flow alone saved us hours of admin work every week.", initials: "AM" },
];

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
    // Run immediately
    const obs1 = observe();
    // Re-run after paint to catch late-mounted elements
    const t1 = setTimeout(() => { obs1.disconnect(); observe(); }, 200);
    const t2 = setTimeout(() => { observe(); }, 600);
    return () => { obs1.disconnect(); clearTimeout(t1); clearTimeout(t2); };
  }, []);
}

/* ── MAGNETIC BUTTON ────────────────────────────────────────────────────────── */
function MagBtn({ children, className, onClick, href, target }: { children: React.ReactNode; className?: string; onClick?: () => void; href?: string; target?: string }) {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  const props = { ref: ref as React.RefObject<HTMLAnchorElement>, className, onMouseMove: onMove, onMouseLeave: onLeave, onClick, href, target, rel: target ? "noreferrer" : undefined };
  if (href) return <a {...props}>{children}</a>;
  return <button {...(props as unknown as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>;
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
function ProjectThumb({ p }: { p: typeof PROJECTS[0] }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  if (!p.thumb || err) {
    return (
      <div className="thumb-placeholder" style={{ background: `linear-gradient(145deg,#f5f0e8,#ece5d5)` }}>
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
function ServiceRow({ s, idx, defaultOpen }: { s: typeof SERVICES[0]; idx: number; defaultOpen?: boolean }) {
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
function ProjectCard({ p, idx, onPreview }: { p: typeof PROJECTS[0]; idx: number; onPreview: (p: typeof PROJECTS[0]) => void }) {
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
function PreviewModal({ project, onClose }: { project: typeof PROJECTS[0]; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [blocked, setBlocked] = useState(false);
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
          {!loaded && !blocked && <div className="pv-loading"><div className="pv-spinner" style={{ borderTopColor: project.accent }} /><span>Loading…</span></div>}
          {project.liveUrl
            ? <iframe 
                src={project.liveUrl} 
                title={project.title} 
                onLoad={() => setLoaded(true)} 
                onError={() => setBlocked(true)}
                style={{ opacity: loaded ? 1 : 0, transition: "opacity .5s" }} 
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups" 
              />
            : <div className="pv-nourl" style={{ color: project.accent }}><span className="pn-icon">◎</span><p>Live preview coming soon.</p></div>
          }
          {blocked && (
            <div className="pv-nourl" style={{ color: project.accent }}>
              <span className="pn-icon">🔒</span>
              <p>This site cannot be embedded.</p>
              <a href={project.liveUrl || "#"} target="_blank" rel="noreferrer" className="pv-visit" style={{ background: project.accent, marginTop: 16 }}>Open in New Tab ↗</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── CONTACT MODAL ──────────────────────────────────────────────────────────── */
function ContactModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", project: "", budget: "", message: "" });
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
    <div className="modal-bg" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="ct-title">
      <div className="ct-modal" onClick={e => e.stopPropagation()} role="document">
        <button className="pv-close" onClick={onClose} style={{ position: "absolute", top: 20, right: 20 }} aria-label="Close">✕</button>
        <button className="pv-close" onClick={onClose} style={{ position: "absolute", top: 20, right: 20 }}>✕</button>
        {sent ? (
          <div className="ct-sent"><div className="ct-check">✓</div><h3 id="ct-title">Message received.</h3><p>I'll respond within 24 hours. Looking forward to building something remarkable.</p></div>
        ) : (
          <>
            <span className="ct-eyebrow">New Project Inquiry</span>
            <h2 className="ct-h2" id="ct-title">Let's Talk</h2>
            <p className="ct-sub">Tell me your vision and I'll map out how we make it real.</p>
            <form onSubmit={e => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); setSent(true); }, 1200); }} className="ct-form">
              <div className="ct-row">
                <div className="ct-field"><label>Name</label><input required placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="ct-field"><label>Email</label><input type="email" required placeholder="you@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              </div>
              <div className="ct-row">
                <div className="ct-field"><label>Project Type</label>
                  <select value={form.project} onChange={e => setForm({ ...form, project: e.target.value })}>
                    <option value="">Select type</option>
                    <option>Landing Page</option><option>Business Website</option>
                    <option>Real Estate Portal</option><option>Gym / Fitness Platform</option>
                    <option>UI/UX Design Only</option><option>Full Brand + Web</option>
                  </select></div>
                <div className="ct-field"><label>Budget</label>
                  <select value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}>
                    <option value="">Select range</option>
                    <option>₹15,000 – ₹30,000</option><option>₹30,000 – ₹60,000</option>
                    <option>₹60,000 – ₹1,20,000</option><option>₹1,20,000+</option>
                  </select></div>
              </div>
              <div className="ct-field"><label>Tell me about your project</label>
                <textarea rows={4} placeholder="Goals, timeline, references…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div>
              <button type="submit" className="ct-submit" disabled={loading}>
                {loading ? <span className="ct-loader" /> : "Send Inquiry →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}



/* ── MARQUEE ────────────────────────────────────────────────────────────────── */
function Marquee({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const all = [...items, ...items];
  return (
    <div className="marquee-wrap">
      <div className={`marquee-track${reverse ? " rev" : ""}`}>
        {all.map((t, i) => <span key={i} className="mq-item">{t}<span className="mq-sep">◆</span></span>)}
      </div>
    </div>
  );
}



/* ── APP ─────────────────────────────────────────────────────────────────────── */
export default function App() {
  useReveal();
  const [contactOpen, setContactOpen] = useState(false);
  const [previewProj, setPreviewProj] = useState<typeof PROJECTS[0] | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [dark, setDark] = useState(false);

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
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setMenuOpen(false);
  }, []);

  return (
    <>
      <Cursor />

      {/* ── NAV ── */}
      <header className={`site-nav${scrolled ? " stuck" : ""}`}>
        <div className="nav-wrap">
          <div className="nav-brand" onClick={() => scrollTo("top")}>
            <div className="nav-av"><img src={VENETH_PHOTO} alt="Veneth" /></div>
            <span className="nav-name">Veneth Studio</span>
          </div>
          <nav className={`nav-menu${menuOpen ? " open" : ""}`}>
            {[["about","About"],["services","Services"],["projects","Work"],["process","Process"]].map(([id,label]) => (
              <button key={id} className="nav-item" onClick={() => scrollTo(id)}>{label}</button>
            ))}
            <button className="nav-cta" onClick={() => { setContactOpen(true); setMenuOpen(false); }}>Contact</button>
          </nav>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button className="theme-toggle" onClick={() => setDark(v => !v)} aria-label="Toggle theme">
              {dark ? "☀️" : "🌙"}
            </button>
            <button className="burger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
              <span className={menuOpen ? "x" : ""}/><span className={menuOpen ? "x" : ""}/><span className={menuOpen ? "x" : ""}/>
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="top" className="hero-sec">
        <div className="hero-blob b1" aria-hidden="true"/>
        <div className="hero-blob b2" aria-hidden="true"/>
        <div className="hero-blob b3" aria-hidden="true"/>

        <div className="hero-wrap">
          {/* LEFT */}
          <div className="hero-left">
            <div className={`hero-badge${heroLoaded ? " in" : ""}`} style={{ transitionDelay: ".1s" }}>
              <span className="badge-dot"/><span>Veneth ChandraKumar · UI/UX &amp; No-Code Developer</span>
            </div>
            <h1 className={`hero-h1${heroLoaded ? " in" : ""}`} style={{ transitionDelay: ".25s" }}>
              <span className="hl hl-serif">i design</span>
              <span className="hl hl-italic">&amp; build</span>
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
              {[["5+","Projects Delivered"],["3","No-Code Platforms"],["100%","Client Satisfaction"]].map(([n,l]) => (
                <div key={l} className="hstat"><span className="hstat-n">{n}</span><span className="hstat-l">{l}</span></div>
              ))}
            </div>
          </div>

          {/* RIGHT: Photo */}
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
        <Marquee items={["UI/UX Design","No-Code Dev","Wix Studio","Framer","Webflow","Motion Design","Three.js","GSAP","Brand Systems","Figma","Prototyping","Vibe Coding"]} />
      </div>

      {/* ── SERVICES ── */}
      <main id="main-content">
        <section id="services" className="services-sec" role="region" aria-label="Services">
        <div className="sec-wrap">
          <div className="sec-head" data-reveal>
            <span className="eyebrow">What I Can Do For You</span>
            <h2 className="sec-h2">Services &amp;<br/><em>expertise</em></h2>
          </div>
          <div className="services-grid">
            <div data-reveal style={{ "--d": ".05s" } as React.CSSProperties}>
              <p className="srv-blurb">As a digital designer, I am a visual storyteller — crafting experiences that connect deeply and spark creativity. I bridge the gap between creative vision and technical execution.</p>
              <div className="srv-tags">
                {["UI/UX Design","No-Code Dev","Motion Design","Brand Systems","3D Web"].map(b => <span key={b} className="srv-tag">{b}</span>)}
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
                <div className="apf-deco"/>
                <div className="apf-badge">
                  <span className="apf-name">Veneth ChandraKumar</span>
                  <span className="apf-role">UI/UX · No-Code Developer</span>
                  <span className="apf-loc">📍 Trichy, Tamil Nadu</span>
                </div>
              </div>
            </div>
            <div className="about-content" data-reveal style={{ "--d": ".15s" } as React.CSSProperties}>
              <span className="eyebrow">About Me</span>
              <h2 className="sec-h2">The Architect<br/><em>Behind the Screen.</em></h2>
              <p className="about-para">Hi, I'm Veneth — a UI/UX designer and No-Code developer based in Trichy, Tamil Nadu, passionate about crafting meaningful and impactful digital experiences.</p>
              <p className="about-para">Great design is more than aesthetics — it's about seamless interaction and intuitive logic. By leveraging modern design systems and <strong>"vibe coding"</strong> — an AI-assisted, flow-state approach — I rapidly prototype and launch scalable websites perfectly aligned with business goals.</p>
              <div className="about-skills">
                {[["UI/UX Design",95],["No-Code Dev",90],["Motion & Animation",85],["3D Web (Three.js)",75]].map(([l,v]) => (
                  <div key={l} className="sk-bar" data-reveal>
                    <div className="sk-top"><span>{l}</span><span className="sk-pct">{v}%</span></div>
                    <div className="sk-track"><div className="sk-fill is-visible" style={{ width: `${v}%` }}/></div>
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
            <h2 className="sec-h2">Problems solved,<br/><em>beautifully.</em></h2>
            <p className="sec-sub">These selected projects reflect a passion for blending strategy with creativity — solving real problems through thoughtful design and impactful storytelling.</p>
          </div>
          <div className="projects-list">
            {PROJECTS.map((p, i) => <ProjectCard key={p.num} p={p} idx={i} onPreview={setPreviewProj} />)}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section id="process" className="process-sec">
        <div className="sec-wrap">
          <div className="sec-head" data-reveal>
            <span className="eyebrow">How I Work</span>
            <h2 className="sec-h2">The method behind<br/><em>the magic.</em></h2>
          </div>
          <div className="process-grid">
            {[["01","Discovery","Understanding your brand, audience, and objectives through structured research.","🔍"],
              ["02","Design","High-fidelity UI in Figma — pixel-perfect, interactive prototypes you approve before build.","✦"],
              ["03","Build","Live site on Framer, Wix Studio, or Webflow. Motion-first, CMS-ready, performance-optimised.","⚡"],
              ["04","Launch","Full-device QA, SEO setup, handoff, and post-launch support. Lead automation via n8n.","🚀"]
            ].map(([num,title,desc,icon],i) => (
              <div key={num} className="proc-card" data-reveal style={{ "--d": `${i * 0.1}s` } as React.CSSProperties}>
                <span className="proc-icon">{icon}</span>
                <div className="proc-num">{num}</div>
                <h4 className="proc-title">{title as string}</h4>
                <p className="proc-desc">{desc as string}</p>
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
            <h2 className="sec-h2">Trusted by brands<br/><em>across Tamil Nadu.</em></h2>
          </div>
          <div className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi-card" data-reveal style={{ "--d": `${i * 0.1}s` } as React.CSSProperties}>
                <p className="testi-q">"{t.text}"</p>
                <div className="testi-who">
                  <div className="testi-av">{t.initials}</div>
                  <div><strong>{t.name}</strong><br/><span>{t.role}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE 2 ── */}
      <div className="strip strip-dark">
        <Marquee items={["Real Estate","Fitness","Healthcare","Hospitality","Lifestyle","Education","Dental","Retail","Startups","Local Brands"]} reverse />
      </div>

      {/* ── CTA ── */}
      <section id="contact" className="cta-sec">
        <div className="sec-wrap">
          <div className="cta-box" data-reveal>
            <span className="eyebrow" style={{ color: "rgba(248,244,238,.55)" }}>Ready to Build?</span>
            <h2 className="cta-h2">Your Next Web Experience<br/><em>Starts Here.</em></h2>
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
    </>
  );
}
