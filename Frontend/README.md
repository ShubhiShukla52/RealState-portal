# EstateX Frontend

> **Find a place you'll love to live in.**

EstateX is a modern, high-performance real estate marketplace application designed for discovering, buying, renting, managing, and selling residential and commercial properties across major Indian metropolises (Mumbai, Bangalore, Delhi NCR, Hyderabad, Pune, Chennai).

Built with React 18, Vite, TypeScript, and Tailwind CSS, EstateX combines an architectural aesthetic with accessible, responsive UX patterns.

---

## 1. Technology Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Schema Validation**: [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

---

## 2. Design System & Palette

EstateX follows a cohesive architectural design token system prioritizing contrast, typography hierarchy, and subtle micro-interactions:

| Token | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| **Charcoal** | `#171717` | Primary buttons, headers, brand mark, dark elements |
| **Off White** | `#F5F5F2` | Page backgrounds, section backdrops, subtle canvas |
| **Concrete Gray** | `#A3A3A3` | Muted text, subtle borders, inactive control indicators |
| **Terracotta** | `#C66A4A` | Brand accent, active tabs, favorites, status highlights |
| **White** | `#FFFFFF` | Card surfaces, modals, popovers, dropdown containers |
| **Text Primary** | `#222222` | Body copy, heading text, form labels |

---

## 3. Implemented Features (Steps 1–15)

### Marketplace & Discovery
- **Hero & Curated Collections**: Dynamic hero search, city cards, featured collections, and promotional CTA sections.
- **Search & Advanced Filtering**: Filter by keyword, city, property type, price range, bedrooms, bathrooms, and amenities with real-time URL search param synchronization.
- **Map & Split View Preview**: Interactive listing view with toggleable split-screen map preview.
- **Property Details**: High-resolution gallery with fallback resilience, verified badges, amenity grids, pricing breakdowns, mortgage calculator, and neighborhood highlights.

### Inquiries & Visit Requests (Step 14)
- **Direct Visit Booking**: Date/time scheduling modal with validation and automated calendar notification.
- **Custom Inquiries**: Price inquiries, general questions, and availability inquiries with timeline tracking.
- **Inquiry Management**: Dedicated `/inquiries` and `/inquiries/:id` routes featuring status milestones, cancellation dialogs, and owner response previews.
- **Inquiry Persistence**: Local storage state sync (`estatex_inquiries`) with reactive notification triggers.

### User & Host Dashboard
- **Overview Metrics**: Active listings, total inquiries, saved searches, and favorited properties.
- **My Listings**: Tabbed status views (Active, Pending, Sold) with mobile-responsive card transitions and direct edit actions.
- **My Inquiries**: Upcoming scheduled visits, inquiry status tracking, and quick-access property links.
- **Messages & Notifications**: Unread badge counters, instant mock messaging threads, and interactive notification clearing.
- **Favorites & Saved Searches**: LocalStorage persistence (`estatex_favorites`, `estatex_saved_searches`) with instant toggle actions.
- **Review Center**: Verified buyer/tenant reviews with rating summaries, helpfulness voting, and report modals.

### Administration Console
- **Admin Dashboard**: System health metrics, user growth analytics, and high-level inquiry counts.
- **Properties Management**: Listing review, verification approvals, and status transitions.
- **User Directory**: Role management, user status toggles, and verification audits.
- **Reports Moderation**: Content flagging and moderation workflows for reviews and properties.

### Quality, Accessibility & Production Readiness (Step 15)
- **Top-Level Error Boundary**: `ErrorBoundary.tsx` prevents full-page crashes and provides user-friendly recovery flows.
- **Branded 404 Route**: `NotFoundPage.tsx` with architectural styling, helpful navigation, and root catch-all routing.
- **Image Resilience**: Automatic fallback handling via `PropertyImage.tsx` with native lazy-loading for non-critical assets.
- **Accessible Dialogs & Modals**: Focus trap containment, explicit `role="dialog"`, accessible ARIA labels, and `Escape` key listeners.
- **Standardized Formatting**: Consistent Indian currency (`formatPrice`), square footage (`formatArea`), and localized dates (`formatDate`).
- **Responsive Table Layouts**: Dual-mode rendering (standard tables for desktop, stacked card views for mobile) preventing horizontal overflow across all screen sizes (320px–1440px+).

---

## 4. Current Architecture & Mock Limitations

> [!IMPORTANT]
> **EstateX is currently operating in Frontend-Only / Prototype Mode.**
> - All authentication, inquiry booking, messaging, review submissions, and property listings operate client-side using mock data and `localStorage` persistence.
> - No real backend APIs, database connections, payment gateways, or WebSocket servers are active in this phase.
> - Full backend integration (Node/Express API, PostgreSQL database, authentication services) is planned for a subsequent phase.

---

## 5. Project Directory Structure

```text
Frontend/
├── public/                     # Static assets and icons
├── src/
│   ├── assets/                 # SVGs and images
│   ├── components/             # Reusable UI components
│   │   ├── common/             # ErrorBoundary, EmptyState, Badges, Timelines
│   │   ├── forms/              # Form inputs, select dropdowns, textareas
│   │   ├── layout/             # Navbar, Footer, Mobile Navigation
│   │   ├── notifications/      # NotificationBell and notification items
│   │   ├── property/           # PropertyCard, PropertyImage, Visit schedules
│   │   └── ui/                 # Button, Input, Modal, Card, Container, Badge
│   ├── context/                # Auth, Favorites, Inquiries, Notifications Contexts
│   ├── data/                   # Mock properties, inquiries, reviews, notifications
│   ├── hooks/                  # Custom hooks (useMediaQuery, useDebounce, etc.)
│   ├── layouts/                # RootLayout, AuthLayout, DashboardLayout, AdminLayout
│   ├── pages/                  # Route views (Home, Properties, Details, Sell, Dashboard, Admin, Inquiries, 404)
│   ├── routes/                 # AppRoutes declaration and route guards
│   ├── services/               # Axios API client structure
│   ├── types/                  # Strict TypeScript domain interfaces
│   ├── utils/                  # Currency, area, date, and inquiry formatters
│   ├── constants/              # Route paths and configuration constants
│   ├── App.tsx                 # Root application wrapper with ErrorBoundary
│   ├── main.tsx                # React DOM entry point
│   └── index.css               # Design tokens, typography, and Tailwind directives
├── package.json                # Project dependencies and build scripts
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # Vite bundler configuration
└── README.md                   # Application documentation
```

---

## 6. Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (v9 or higher)

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### Production Build
```bash
npm run build
```
This runs TypeScript compiler checks (`tsc -b`) and bundles optimized production assets via Vite into `dist/`.

### Preview Production Build
```bash
npm run preview
```
