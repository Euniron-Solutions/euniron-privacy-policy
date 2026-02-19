# Euniron Privacy Policy

A single-page static website that hosts the official **Data Use Policy** for **Euniron Solutions & Technology Limited**. Built for Meta WhatsApp Business API verification compliance.

> **Live Document Version:** 1.0 · Effective February 19, 2026
> **Document Reference:** ESTL-DUP-2026-001

---

## Overview

This repository contains a lightweight, framework-free privacy policy viewer built with pure HTML, CSS, and vanilla JavaScript. The policy document is rendered using [PDF.js](https://mozilla.github.io/pdf.js/) directly in the browser — no server-side processing required.

The Data Use Policy covers how Euniron Solutions & Technology Limited collects, uses, stores, shares, and protects personal data across its events and ticketing platform, payment systems (M-Pesa), and WhatsApp Business API messaging channels.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, flexbox, responsive) |
| Logic | Vanilla JavaScript (ES5 compatible, IIFE pattern) |
| PDF Rendering | [PDF.js v3.11.174](https://mozilla.github.io/pdf.js/) via CDN |
| Hosting | Any static file server (GitHub Pages, Vercel, Netlify, Nginx, etc.) |

**Zero build step. Zero dependencies. Zero frameworks.**

---

## Project Structure

```
euniron-privacy-policy/
├── index.html              # Main HTML page
├── styles.css              # All styles (responsive, dark theme)
├── app.js                  # PDF viewer logic (navigation, zoom, keyboard)
├── data-use-policy.pdf     # The actual policy document (A4, styled)
└── README.md               # This file
```

---

## Features

### PDF Viewer
- **Page navigation** — Previous/Next buttons with page counter
- **Zoom controls** — Zoom in/out with percentage display (50%–300%)
- **Keyboard shortcuts** — Arrow keys for pages, `+`/`-` for zoom
- **High-DPI support** — Crisp rendering on Retina and HiDPI displays
- **Loading state** — Spinner while PDF loads
- **Error fallback** — Direct download link if PDF.js fails to load

### Design
- **Responsive** — Full mobile and desktop support with breakpoints at 768px and 480px
- **Sticky header** — Company branding always visible
- **Hero section** — Document title, version badge, and description
- **Download CTA** — Prominent download section with PDF link
- **Dark navy theme** — Consistent with Euniron brand identity

### Accessibility
- Semantic HTML structure
- ARIA labels on all interactive elements
- Keyboard navigable
- Sufficient color contrast ratios

---

## Getting Started

### Local Development

No build tools needed. Just serve the files:

```bash
# Clone the repository
git clone https://github.com/Euniron-Solutions/euniron-privacy-policy.git
cd euniron-privacy-policy

# Option 1: Python
python -m http.server 8080

# Option 2: Node.js
npx serve .

# Option 3: PHP
php -S localhost:8080
```

Open `http://localhost:8080` in your browser.

> **Note:** Opening `index.html` directly as a file (`file://`) will not work due to PDF.js CORS restrictions. You must use a local server.

### Deployment

This is a static site — deploy anywhere:

**GitHub Pages:**
1. Go to repo Settings → Pages
2. Set source to `main` branch, root `/`
3. Site will be live at `https://euniron-solutions.github.io/euniron-privacy-policy/`

**Vercel / Netlify:**
1. Connect the repository
2. No build command needed
3. Publish directory: `/` (root)

**Nginx:**
```nginx
server {
    listen 80;
    server_name privacy.eunironsolutions.co.ke;
    root /var/www/euniron-privacy-policy;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

## Policy Coverage

The Data Use Policy document addresses the following areas required by Meta for WhatsApp Business API verification:

| Section | Description |
|---------|-------------|
| **Data Collection** | Identity, contact, transaction, communication, device, and usage data |
| **Lawful Bases** | Contract performance, consent, legitimate interest, legal obligation |
| **WhatsApp API Usage** | Transactional notifications, service updates, support, marketing (opt-in only) |
| **Third-Party Sharing** | Meta, Safaricom (M-Pesa), MailerSend, DigitalOcean — with DPAs |
| **Cross-Border Transfers** | Standard Contractual Clauses, adequacy decisions, encryption |
| **Data Retention** | Specific retention periods per data category |
| **Data Subject Rights** | Access, rectification, erasure, portability, objection, withdrawal |
| **Consent Management** | Explicit opt-in, no pre-checked boxes, withdrawal process |
| **Children's Data** | Under-18 exclusion |
| **Security Measures** | TLS 1.2+, AES-256, RBAC, VPC, firewall, incident response |
| **Automated Decisions** | No solely automated decision-making with legal effects |

### Regulatory Compliance

- **Kenya Data Protection Act, 2019** (primary jurisdiction)
- **EU General Data Protection Regulation (GDPR)**
- **Meta WhatsApp Business API Terms of Service**

---

## Updating the Policy

1. Edit the source markdown at `cloud-services/documentation/data-use-policy.md`
2. Regenerate the PDF:
   ```bash
   cd cloud-services/documentation
   npx md-to-pdf data-use-policy.md --config-file .md-to-pdf.js
   ```
3. Copy the new PDF to this repository:
   ```bash
   cp cloud-services/documentation/data-use-policy.pdf euniron-privacy-policy/data-use-policy.pdf
   ```
4. Update the version number and effective date in `index.html` hero section
5. Commit and push

---

## Browser Support

| Browser | Supported |
|---------|-----------|
| Chrome 80+ | ✅ |
| Firefox 78+ | ✅ |
| Safari 14+ | ✅ |
| Edge 80+ | ✅ |
| Mobile Chrome | ✅ |
| Mobile Safari | ✅ |

---

## Company Information

**Euniron Solutions & Technology Limited**
6th Parklands Road, Office Suites A10
Nairobi, Kenya

**Privacy Contact:** info@eunironsolutions.co.ke

---

## License

Copyright &copy; 2026 Euniron Solutions & Technology Limited. All rights reserved.

The policy document and website design are proprietary. The source code structure may be referenced for similar implementations.
