import { useEffect, useState, useCallback, useRef } from "react";
import { VENETH_PHOTO } from "./veneth_photo";
import ParticleBackground from "./ParticleBackground";
import SmoothScroll from "./SmoothScroll";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";

/* ── TYPES ─────────────────────────────────────────────────────────────────── */
interface Project {
  id: number;
  num: string;
  tag: string;
  title: string;
  subtitle: string;
  liveUrl: string | null;
  embedUrl?: string;
  thumb: string | null;
  accent: string;
  description: string;
  features: string[];
  ongoing?: boolean;
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
    title: "Website Design",
    items: [
      "Premium website design",
      "Conversion-focused UI",
      "Responsive across devices",
      "Performance optimization",
      "SEO-friendly structure"
    ],
  },
  {
    id: 2,
    num: "02",
    title: "Landing Pages",
    items: [
      "High-converting landing pages",
      "A/B testing ready",
      "Clear CTAs",
      "Fast load times",
      "Analytics integration"
    ],
  },
  {
    id: 3,
    num: "03",
    title: "Visiting Card & Branding",
    items: [
      "Brand identity design",
      "Logo and visual assets",
      "Business card design",
      "Brand guidelines",
      "Consistent across touchpoints"
    ],
  },
];

const PROJECTS: Project[] = [
  {
    id: 1,
    num: "01",
    tag: "E-commerce",
    title: "GSSS & Co",
    subtitle: "Home Décor · Web Design",
    liveUrl: "https://gsss-co.web.app/",
    thumb: null,
    accent: "#6b705c",
    ongoing: true,
    description: "Designed a luxury-inspired website for GSSS & Co, a premium home décor and lifestyle products manufacturer. Features elegant visuals, clean layouts, and a seamless browsing experience.",
    features: [
      "Premium & Elegant UI/UX Design",
      "Product Collection Showcase",
      "Luxury Brand Experience",
      "Modern Visual Hierarchy",
    ],
  },
  {
    id: 2,
    num: "02",
    tag: "Real Estate",
    title: "Rhymer Corp",
    subtitle: "Real Estate · Web Design",
    liveUrl: "https://rhymer-corp.web.app/",
    thumb: null,
    accent: "#4a90d9",
    description: "Designed and developed a modern, responsive website for a real estate company to showcase Land, Projects , and Investments — focused on building trust, generating qualified leads, and providing a premium browsing experience.",
    features: [
      "Premium UI/UX Design",
      "Property & Investment Showcase",
      "Contact & WhatsApp Integration",
      "Fully Responsive Design",
    ],
  },
  {
    id: 3,
    num: "03",
    tag: "Branding & Business Card Design",
    title: "KARMA by Sapna",
    subtitle: "Business Card Design · Branding",
    liveUrl: "https://www.behance.net/gallery/251127317/KARMA-by-Sapna-Business-Card-Design",
    embedUrl: "https://www.behance.net/embed/project/251127317?ilo0=1",
    thumb: null,
    accent: "#d4a574",
    description: "Elegant business card design for KARMA by Sapna — a brand identity project that combines modern minimalism with a warm, premium feel through thoughtful typography and refined finishes.",
    features: [
      "Business card design",
      "Brand identity system",
      "Typography & layout",
      "Premium finish mockups",
    ],
  },
  {
    id: 4,
    num: "04",
    tag: "Branding & Business Card Design",
    title: "Rhymer Corp",
    subtitle: "Business Card Design · Branding",
    liveUrl: "https://www.behance.net/gallery/252775565/Rhymer-Corp-Corporate-Business-Card-Identity-Design",
    thumb: null,
    accent: "#5c9ea4",
    description: "Premium corporate identity system for Rhymer Corp — a minimal business card design built around refined typography, generous whitespace, and a carefully curated neutral color palette to communicate trust, professionalism, and timeless elegance.",
    features: [
      "Corporate identity system",
      "Luxury minimal business card",
      "QR code integration",
      "Print-ready layout",
    ],
  },
  {
    id: 5,
    num: "05",
    tag: "Events & Decoration",
    title: "Ravanaa Events",
    subtitle: "Birthday & Wedding Decoration · Web Design",
    liveUrl: "https://ravanaa.netlify.app/",
    thumb: null,
    accent: "#ff7b00",
    description: "Designed and developed a modern, visual-rich website for Ravanaa Events — showcasing premium Birthday & Wedding Decoration services, stage setups, floral themes, and event portfolio to attract prospective clients.",
    features: [
      "Birthday & Wedding Decoration Showcase",
      "Event Theme & Stage Gallery",
      "Booking & Contact Integration",
      "Fully Responsive Design",
    ],
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: " Mr. Sudheshwar Saran",
    role: "Founder, GSSS & Co, Uttar Pradesh,india",
    text: "Veneth captured the luxury feel we wanted for our home decor brand. The website looks elegant, loads fast, and our customers love the browsing experience.",
    initials: "SS",
  },
  {
    id: 2,
    name: "M. Ismail Sait",
    role: "Director, Rhymer Corp, Bangalore, India",
    text: "We needed a premium website and brand identity that reflected trust and professionalism. Veneth delivered both — a stunning website and refined business cards that impressed our investors.",
    initials: "IS",
  },
  {
    id: 3,
    name: "Ms. Sapna",
    role: "Founder, KARMA by Sapna, Uttar Pradesh,india",
    text: "The business card design exceeded my expectations. Veneth understood my vision perfectly and created something elegant yet modern — exactly what my brand needed.",
    initials: "SD",
  },
  {
    id: 4,
    name: "Ravanaa Events Team",
    role: "Founder, Ravanaa Events, Tamil Nadu",
    text: "Veneth created a stunning website for Ravanaa Events that perfectly highlights our birthday and wedding decoration work. The design is vibrant, elegant, and brings us great client inquiries.",
    initials: "RE",
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
function useScrollLock(locked: boolean) {
  const scrollPosRef = useRef(0);
  useEffect(() => {
    if (locked) {
      scrollPosRef.current = window.scrollY;
      const scrollY = scrollPosRef.current;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollPosRef.current);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
    };
  }, [locked]);
}

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
  const hasMovedRef = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let rx = -100, ry = -100, mx = -100, my = -100;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        setVisible(true);
        rx = e.clientX;
        ry = e.clientY;
      }
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      rx = lerp(rx, mx, 0.12);
      ry = lerp(ry, my, 0.12);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    const interactives = "a, button, input, select, textarea, [role=button], .clickable";
    const onOver = () => {
      dotRef.current?.classList.add("hovering");
      ringRef.current?.classList.add("hovering");
    };
    const onOut = () => {
      dotRef.current?.classList.remove("hovering");
      ringRef.current?.classList.remove("hovering");
    };

    document.addEventListener("mouseover", (e) => {
      const t = e.target as HTMLElement;
      if (t.matches?.(interactives) || t.closest?.(interactives)) {
        onOver();
      }
    });
    document.addEventListener("mouseout", (e) => {
      const t = e.target as HTMLElement;
      if (t.matches?.(interactives) || t.closest?.(interactives)) {
        onOut();
      }
    });

    const onDown = () => {
      dotRef.current?.classList.add("pressing");
      ringRef.current?.classList.add("pressing");
    };
    const onUp = () => {
      dotRef.current?.classList.remove("pressing");
      ringRef.current?.classList.remove("pressing");
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cur-dot"
        style={{ opacity: visible ? 1 : 0 }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="cur-ring"
        style={{ opacity: visible ? 1 : 0 }}
        aria-hidden="true"
      />
    </>
  );
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
      <img src={p.thumb} alt={`Thumbnail for ${p.title}`} className="thumb-img" loading="lazy" width="420" height="340"
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
  useScrollLock(true);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
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
            <button className="pv-close" onClick={onClose} aria-label="Close preview">✕</button>
          </div>
        </div>
        <div className="pv-frame">
          {project.embedUrl
            ? <iframe
              src={project.embedUrl}
              title={`Preview of ${project.title}`}
              style={{ width: "100%", height: "100%", border: 0 }}
              allowFullScreen
              loading="lazy"
              allow="clipboard-write"
            />
            : project.liveUrl && !isDevUrl
              ? <>
                {!loaded && <div className="pv-loading"><div className="pv-spinner" style={{ borderTopColor: project.accent }} /><span>Loading…</span></div>}
                <iframe
                  src={project.liveUrl}
                  title={`Live preview of ${project.title}`}
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
export const WHATSAPP_URL = "https://wa.me/919092081231";

function ContactModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isIndia, setIsIndia] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", project: "", budget: "", message: "" });
  useScrollLock(true);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
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
        <button className="ct-close" onClick={onClose} aria-label="Close contact form">✕</button>
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
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ct-wa-banner">
                <span>💬</span>
                <span>Chat directly on WhatsApp: <strong>+91 90920 81231</strong> ↗</span>
              </a>
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
                  <label htmlFor="ct-phone">Phone Number</label>
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
  useScrollLock(menuOpen);

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
              <div className="nav-av"><img src={VENETH_PHOTO} alt="Portrait of Veneth" width="38" height="38" /></div>
              <span className="nav-name">Veneth Studio</span>
            </div>
            <nav className={`nav-menu${menuOpen ? " open" : ""}`} role="navigation" aria-label="Main navigation">
              {[["about", "About"], ["services", "Services"], ["projects", "Work"], ["process", "Process"]].map(([id, label]) => (
                <button key={id} className="nav-item" onClick={() => scrollTo(id)}>{label}</button>
              ))}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nav-cta" onClick={() => setMenuOpen(false)}>Contact</a>
            </nav>
            <button className="burger" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle navigation menu" aria-expanded={menuOpen}>
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
                I Design Websites That Help Businesses Look Premium and Get More Clients
              </h1>
              <p className={`hero-para${heroLoaded ? " in" : ""}`} style={{ transitionDelay: ".4s" }}>Helping small and growing businesses transform their online presence into a powerful client-generating system through strategic design.</p>
              <div className={`hero-btns${heroLoaded ? " in" : ""}`} style={{ transitionDelay: ".55s" }}>
                <MagBtn className="btn-dark" href={WHATSAPP_URL} target="_blank">Book Your Free Consultation</MagBtn>
                {/* <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hero-talk-btn">
                  Get in touch
                </a> */}
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
                  <img src="/veneth-hero.png" alt="Veneth ChandraKumar portrait" className="ps-photo" width="380" height="480" loading="eager" fetchPriority="high" />
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
                <span className="eyebrow">What I Offer</span>
                <h2 className="sec-h2">Services &amp;<br /><em>expertise</em></h2>
              </div>
              <div className="services-grid">
                <div data-reveal style={{ "--d": ".05s" } as React.CSSProperties}>
                  <p className="srv-blurb">As a digital designer, I am a visual storyteller — crafting experiences that connect deeply and spark creativity. I bridge the gap between creative vision and technical execution.</p>
                  <div className="srv-tags">
                    {["Vibe Coding", "No-Code Dev", "Motion Design", "Brand Systems"].map(b => <span key={b} className="srv-tag">{b}</span>)}
                  </div>
                </div>
                <div className="srv-accordion">
                  {SERVICES.map((s, i) => <ServiceRow key={s.num} s={s} idx={i} />)}
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
                    <img src="/veneth-hero.png" alt="Veneth ChandraKumar portrait" className="about-photo" width="400" height="533" loading="eager" fetchPriority="high" />
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
                  <h2 className="sec-h2">A little about me.</h2>
                  <p className="about-para">I’m Veneth, a freelance UI/UX designer from India, focused on designing websites, landing pages, and simple brand visuals.</p>
                  <p className="about-para">I started my journey with curiosity about how websites are made and how design can influence the way people experience a brand online. Over time, I developed skills in tools like Figma, Framer, Wix Studio, Vibe Coding, and Some AI tools also use. And started working on real and practice projects to improve my craft.</p>
                  <p className="about-para">Right now, I’m still growing as a designer and building my experience through freelance work and personal projects. Each project helps me learn more about user behavior, layout thinking, and how to create clean and usable interfaces.</p>
                  <p className="about-para">Outside of design, I spend time learning new tools, exploring UI trends, and improving my design process step by step.</p>

                  <div className="about-icons" data-reveal>
                    <span className="skill-icon">UI/UX Design</span>
                    <span className="skill-icon">Website Design</span>
                    <span className="skill-icon">Landing Pages</span>
                    <span className="skill-icon">Brand Identity</span>
                    <span className="skill-icon">Vibe Coding</span>
                    <span className="skill-icon">Motion Design</span>
                    <span className="skill-icon">Framer</span>
                    <span className="skill-icon">Webflow</span>
                    <span className="skill-icon">Wix Studio</span>
                    <span className="skill-icon">Figma</span>

                  </div>
                  <p className="about-trust">I prefer working with clients who value quality, clarity, and long-term brand growth over quick, low-cost solutions.</p>
                  <div className="about-links">
                    <a href="mailto:venethck34@gmail.com" className="alink">✉ Venethck34@gmail.com</a>
                    <a href="https://instagram.com/Veneth_design" target="_blank" rel="noreferrer" className="alink">Instagram ↗</a>
                  </div>
                  <MagBtn className="btn-dark" href={WHATSAPP_URL} target="_blank">Work With Me</MagBtn>
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
            </div>
            <div className="scroll-stack-container">
              <ScrollStack
                useWindowScroll
                active={true}
                itemDistance={90}
                itemStackDistance={25}
                stackPosition="18%"
                scaleEndPosition="8%"
                baseScale={0.82}
              >
                {PROJECTS.map(p => (
                  <ScrollStackItem key={p.id}>
                    <div className="ssc-inner">
                      <div className="ssc-accent" style={{ background: p.accent }} />
                      <div className="ssc-body">
                        <div className="ssc-meta">
                          <span className="ssc-tag" style={{ color: p.accent }}>{p.tag}</span>
                          {p.ongoing && <span className="ongoing-badge">Ongoing</span>}
                          <span className="ssc-num">{p.num}</span>
                        </div>
                        <h3 className="ssc-title">{p.title}</h3>
                        <p className="ssc-desc">{p.description}</p>
                        <ul className="ssc-feats">
                          {p.features.slice(0, 3).map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                        <div className="ssc-actions">
                          <button className="proj-preview-btn" onClick={() => setPreviewProj(p)}>
                            View Case Study
                          </button>
                          {p.liveUrl && (
                            <a className="proj-live-btn" href={p.liveUrl} target="_blank" rel="noreferrer">
                              Live Site →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollStackItem>
                ))}
              </ScrollStack>
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
                      <div><strong>{t.name}</strong><span>{t.role}</span></div>
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
                <span className="eyebrow cta-eyebrow">Let’s Work Together</span>
                <h2 className="cta-h2">Let’s Work Together</h2>
                <p className="cta-sub">I work with businesses who value premium design and measurable results. Connect directly with me on WhatsApp to discuss your project.</p>
                <div className="cta-btns">
                  {/* <MagBtn className="btn-dark" href={WHATSAPP_URL} target="_blank">Chat on WhatsApp</MagBtn> */}
                  <MagBtn className="btn-outline" href={WHATSAPP_URL} target="_blank">Book a Free Consultation</MagBtn>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="ft-wrap">
          <div className="ft-grid">
            <div className="ft-brand-col">
              <div className="ft-logo">Veneth Studio</div>
              <p className="ft-tagline">Transforming ideas into impactful digital experiences through thoughtful design and strategy.</p>
              <div className="ft-social">
                <a href="https://instagram.com/Veneth_design" target="_blank" rel="noreferrer" className="ft-social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5Z" /><circle cx="12" cy="12" r="3" /><path d="M17.5 6.5h.01" /></svg>
                </a>
                <a href="https://www.behance.net/veneth_studio" target="_blank" rel="noreferrer" className="ft-social-link" aria-label="Behance">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7V5h7v2Zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168Zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219Zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061ZM3.002 11.97H6.94c2.056 0 2.654-.876 2.654-2.157 0-1.282-.598-2.157-2.654-2.157H3.002v4.314Zm0 2.051v4.966h3.986c2.211 0 2.884-1.052 2.884-2.483 0-1.43-.673-2.483-2.884-2.483H3.002Z" /></svg>
                </a>
              </div>
            </div>
            <div className="ft-col">
              <h4 className="ft-col-title">What I Do</h4>
              <ul className="ft-nav">
                <li><span>Web Design</span></li>
                <li><span>UI/UX Design</span></li>
                <li><span>Brand Identity</span></li>
                <li><span>E-commerce</span></li>
              </ul>
            </div>
            <div className="ft-col">
              <h4 className="ft-col-title">Quick Links</h4>
              <ul className="ft-nav">
                <li><a onClick={() => scrollTo('top')}>Home</a></li>
                <li><a onClick={() => scrollTo('projects')}>Projects</a></li>
                <li><a onClick={() => scrollTo('process')}>Process</a></li>
                <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Contact</a></li>
              </ul>
            </div>
            <div className="ft-col">
              <h4 className="ft-col-title">Get in Touch</h4>
              <ul className="ft-nav">
                <li className="ft-location">Tamil Nadu, India</li>
                <li><a href="mailto:venethck34@gmail.com">venethck34@gmail.com</a></li>
                <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp: +91 90920 81231</a></li>
              </ul>
            </div>
          </div>
          <div className="ft-bottom">
            <span className="ft-copy">&copy; {new Date().getFullYear()} Veneth Studio. All rights reserved.</span>
            <span className="ft-made">Made with passion in Tamil Nadu</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      {previewProj && <PreviewModal project={previewProj} onClose={() => setPreviewProj(null)} />}
    </SmoothScroll>
  );
}
