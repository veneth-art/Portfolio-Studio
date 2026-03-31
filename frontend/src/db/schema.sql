-- Veneth Studio D1 Schema
-- Run: wrangler d1 execute veneth-studio --local --file=./src/db/schema.sql

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  num TEXT NOT NULL UNIQUE,
  tag TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  live_url TEXT,
  thumb TEXT,
  accent TEXT NOT NULL DEFAULT '#333',
  description TEXT NOT NULL,
  features TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  num TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  items TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  text TEXT NOT NULL,
  initials TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data: Projects
INSERT INTO projects (num, tag, title, subtitle, live_url, thumb, accent, description, features) VALUES
(
  '01',
  'UI/UX · No-Code',
  'CoreShift Gym',
  'High-Performance Athletic Platform',
  'https://coreshift.lovable.app',
  'https://image.thum.io/get/width/900/crop/560/https://coreshift.lovable.app',
  '#e85d26',
  'A bold, conversion-focused fitness platform built to drive memberships and class bookings through frictionless UX and energetic visual design.',
  '["Dynamic class scheduling UI with live filter system","Scroll-triggered hero with kinetic typography","Interactive membership plan finder & BMI widget","Full mobile-first layout with touch gestures","Performance-optimised video background — sub-3s load","Clip-path & text-skew reveal animations"]'
),
(
  '02',
  'Web Design · 3D',
  'Vēlā Estates',
  'Luxury Real Estate Portal',
  'https://vela-estates.netlify.app/',
  'https://image.thum.io/get/width/900/crop/560/https://vela-estates.netlify.app/',
  '#b8922a',
  'A premium real estate portal crafted for high-net-worth buyers in Tamil Nadu — editorial aesthetics meets conversion-engineered lead capture.',
  '["Advanced property filtering — price, location & amenities","Full-screen immersive galleries with virtual tour links","Parallax hero with slow editorial text reveals","Sticky lead-capture forms on property pages","Three.js ambient particle background","GSAP page transitions & smooth scroll"]'
),
(
  '03',
  'UI/UX · Accessibility',
  'Elara Dental',
  'Premium Clinic & Care Platform',
  NULL,
  NULL,
  '#2a7ab8',
  'A patient-first dental platform combining trust-building design with intuitive booking flows — lowering anxiety, raising appointments.',
  '["Multi-step appointment booking with progress UI","Before & After interactive image comparison slider","WCAG 2.1 AA — high-contrast for elderly users","Calming fade-in motion system across all pages","Service directory with filterable categories","Patient review carousel with trust signals"]'
);

-- Seed Data: Services
INSERT INTO services (num, title, items) VALUES
(
  '01',
  'UI/UX Design',
  '["Wireframing and interactive prototyping","User Interface design for web & mobile","Usability testing and feedback analysis","Interaction design and micro-animations"]'
),
(
  '02',
  'No-Code Development',
  '["Wix Studio, Framer & Webflow builds","CMS setup and content management","Responsive, mobile-first architecture","Third-party integrations and automation"]'
),
(
  '03',
  'Graphic Design',
  '["Typography and colour system design","Brand storytelling and messaging","Style guide and asset handoff","Visual identity and brand assets"]'
),
(
  '04',
  'Vibe Coding',
  '["Landing page design and optimisation","Responsive website design for all screens","Performance-first architecture","SEO setup and post-launch support"]'
);

-- Seed Data: Testimonials
INSERT INTO testimonials (name, role, text, initials) VALUES
(
  'Rajan Krishnamurthy',
  'Director, Vēlā Estates',
  'Veneth completely transformed our property listings. The site feels premium and our leads doubled in the first month.',
  'RK'
),
(
  'Priya Suresh',
  'Owner, CoreShift Gym',
  'Incredible attention to detail. The animations and mobile experience are exactly what we needed to convert visitors into members.',
  'PS'
),
(
  'Dr. Anand Mehra',
  'Elara Dental Clinic',
  'Professional, fast, and truly understood our brand. The booking flow alone saved us hours of admin work every week.',
  'AM'
);
