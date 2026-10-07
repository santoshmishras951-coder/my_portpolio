# Santosh Mishra - Full-Stack Developer Portfolio & Headless CMS

A production-ready, industry-grade personal portfolio website and headless administrative Content Management System (CMS) engineered for **Santosh Mishra** (3rd-Year B.Tech Computer Science & Engineering Undergraduate, Odisha, India).

Built without generic templates or "AI slop" cliches, this system adheres to strict design discipline (zero-pill unboxed metadata, typographic hierarchy, 60-30-10 color budget, single-elevation depth, tabular figures, and full WCAG AA accessibility).

---

## 🌟 Architecture Overview

```
                      +---------------------------------------+
                      |           Client Web Browser          |
                      +---------------------------------------+
                                     |        |
                      Public Visitor |        | Protected Admin
                      (Portfolio UI) |        | (Bearer JWT)
                                     v        v
                   +--------------------------------------------+
                   |          Express.js Full-Stack App         |
                   |      (port 3000, Vite Middleware)          |
                   +--------------------------------------------+
                           |            |              |
                           v            v              v
                   +--------------+ +-----------+ +-------------+
                   | REST API     | | Static    | | Security    |
                   | Endpoints    | | Uploads   | | Rate Limit, |
                   | (/api/*)     | | (/uploads)| | Crypto Auth |
                   +--------------+ +-----------+ +-------------+
                                        |
                                        v
                          +----------------------------+
                          |   Persistent Data Engine   |
                          |  (/data/portfolio_db.json) |
                          |  (PostgreSQL/MongoDB ready)|
                          +----------------------------+
```

---

## ✨ Key Capabilities & Features

### 1. Public-Facing Portfolio
- **Hero Section**: Typographic presence with rotating roles (*Frontend Developer*, *Web Developer*, *Full-Stack Enthusiast*), availability status badge (*"Open to internships & software opportunities"*), quick CTA actions, and high-fidelity studio portrait.
- **About Section**: Personal background, computer science coursework focus, development philosophy, and technical trajectory.
- **Skills System**: Categorized into *Frontend*, *Backend*, *Database*, *Programming*, *Tools*, and *Cloud* with verified proficiency levels (*Proficient*, *Intermediate*, *Beginner*) rather than arbitrary percentages.
- **Projects Showcase**: Interactive case study explorer featuring **Kaniha Medical**, **TechGrads**, **CraftOdisha AI Artisan Marketplace**, and the **Portfolio CMS**. Each project features overview, architectural challenges, engineering solution, key capabilities, contribution, results, and code/demo links.
- **Experience Timeline**: Chronological milestones covering student developer leadership and departmental engineering projects.
- **Education Section**: B.Tech CSE degree coursework, CGPA records, and academic background.
- **Achievements & Certifications**: Hackathons, certificates, and academic honors with verification links and preview modal.
- **Resume System**: Dynamic recruiter resume preview with direct one-click PDF download (`/api/resume/download`).
- **Contact Inquiries**: Validated contact form with anti-spam rate limiting, direct email reach-out, and copy email button.
- **Theme Modes**: Dark mode, light mode, and system preference detection with seamless persistence.
- **Search Engine Optimization**: Live `/sitemap.xml` and `/robots.txt` dynamic generation with OpenGraph cards.

### 2. Private Admin CMS Dashboard (`#admin`)
- **Secure Authentication**: Salted scrypt key-derivation password hashing, constant-time verification, and 24-hour HMAC-SHA256 signed bearer tokens.
- **Zero-Code Updates**: Admin can edit profile details, add projects, update skills, upload new resume PDFs, manage social links, and update SEO metadata without changing source code.
- **Contact Message Inbox**: Track inquiries with status flags (*New*, *Read*, *Replied*, *Archived*), search filtering, internal admin notes, direct **"Reply via Email"**, and formatted **"Reply via WhatsApp"** chat generation.
- **Media Library**: OWASP-compliant file upload engine with mime-type checking, extension verification, and size limits.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express.js, TypeScript (`tsx`)
- **Security & Cryptography**: Native Node.js `node:crypto` (`scryptSync`, `timingSafeEqual`, `createHmac`), Multer with sanitized storage, sliding-window IP rate limiters
- **Data Persistence**: Atomic file-backed relational store (`/data/portfolio_db.json`) with modular connector interface for PostgreSQL / MongoDB

---

## 🚀 Getting Started

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/santoshmishra/portfolio-cms.git
cd portfolio-cms

# Install dependencies
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Review options in `.env`:

```env
# Port is managed automatically (defaults to 3000)
PORT=3000

# Admin initial credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="Admin@Santosh2026!"
JWT_SECRET="generate-a-secure-random-secret"

# Optional Cloud Database (if migrating to hosted PostgreSQL or MongoDB)
# DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db"
# MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/portfolio_db"
```

### 3. Running Locally

```bash
# Start full-stack development server with Vite middleware on port 3000
npm run dev
```

Visit:
- Public portfolio: `http://localhost:3000`
- Admin dashboard: `http://localhost:3000/#admin`

---

## 🔐 Admin Access & Credentials

- **Initial Username**: `admin` (or `santoshmishras951@gmail.com`)
- **Initial Password**: `Admin@Santosh2026!`

*Note: You can update your password and contact notification email anytime inside the **Settings & Security** tab in the Admin Dashboard.*

---

## 📦 Deployment Instructions

### Full-Stack Node / Container (Cloud Run / Railway / Render / VPS)
```bash
# Build frontend client assets
npm run build

# Start production server
npm start
```
The Express server automatically serves the built SPA from `/dist` and handles all `/api/*`, `/uploads/*`, `/sitemap.xml`, and `/robots.txt` routes.

---

## 🛡 Security Architecture

1. **Password Protection**: Passwords are never stored in plaintext. They are hashed using `crypto.scryptSync` with unique 16-byte random salts and evaluated using constant-time comparison (`crypto.timingSafeEqual`) to prevent timing side-channel attacks.
2. **Brute-Force Rate Limiting**: Consecutive failed authentication attempts trigger progressive backoffs to prevent dictionary and brute-force attacks.
3. **Upload Sanitization**: Uploaded files are verified against a whitelist of MIME types (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`). Executable files (`.exe`, `.sh`, `.php`, `.js`) are strictly rejected. Filenames are regenerated with cryptographically secure random tokens.
4. **Header Hardening**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and strict referrer policies are enforced.
