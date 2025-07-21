### Indonesian Page Checklist (`src/app/page.tsx`)
*   [x] Carousel
*   [x] Visi & Misi
*   [x] Program Unggulan
*   [x] Laporan Kegiatan
*   [x] Berita
*   [x] Mitra Kami

### English Page Checklist (`src/app/en/page.tsx`)
*   [x] Carousel
*   [x] Vision & Mission
*   [x] Featured Programs
*   [x] Activity Reports
*   [x] News
*   [x] Our Partners

### Project Description

PartisipasiMuda is a web application built with Next.js and React, designed to be a hub for youth participation. It features a dual-language interface (Indonesian and English) and provides information on programs, events, news, and reports. The project aims to encourage and facilitate youth involvement in various activities.

### Technicalities

*   **Framework:** Next.js (with Turbopack)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** Radix UI, Geist UI
*   **Database ORM:** Drizzle ORM
*   **Database Client:** libSQL
*   **API:** Hono
*   **Authentication:** JWT, bcryptjs
*   **Data Visualization:** Chart.js, Recharts, D3.js
*   **Linting:** ESLint
*   **Package Manager:** npm

### Page Checklist

#### Indonesian Pages
*   [x] `/` (root)
*   [x] `/acara`
    *   [x] `/acara/[slug]`
*   [x] `/donasi`
*   [x] `/karir`
*   [x] `/login`
*   [x] `/mitra-strategis`
*   [x] `/program`
    *   [x] `/program/[slug]`
    *   [x] `/program/academia-politica`
    *   [x] `/program/class-of-climate-leaders`
    *   [x] `/program/council-gen-z`
    *   [x] `/program/diskusi`
    *   [x] `/program/temu-kandidat`
*   [x] `/publikasi`
    *   [x] `/publikasi/[slug]`
*   [x] `/ruang-sipil`
*   [x] `/search`
*   [x] `/tentang-kami`
    *   [x] `/tentang-kami/dewan-pengarah`
    *   [x] `/tentang-kami/perjalanan`
    *   [x] `/tentang-kami/struktur-organisasi`
*   [x] `/test-dynamic`

#### English Page Checklist (with Component Recap)

*   [x] `/en` (root) - Recap: `VerticalSlideshowEn`, `PartnersEn`, `ParticipationInfoEn`, `EngagementBannerEn`, `PublikasiTerbaruEn`, `TestimonialsCarouselEn`, `UpcomingEventsEn`
*   [ ] `/en/about-us`
    *   [ ] `/en/about-us/board-management` - Recap: `Board & Management`
    *   [ ] `/en/about-us/journey` - Recap: `Our Journey`
    *   [ ] `/en/about-us/mission` - Recap: `Our Mission`
*   [ ] `/en/careers` - Recap: `Internships`, `Volunteers`
*   [ ] `/en/civic-space` - Recap: `ReportInteractiveMap`, `Our Publications`
*   [ ] `/en/donate` - Recap: `Support Us`, `Collaborate Together`, `Contact Us`
*   [ ] `/en/events` - Recap: `Events & Activities`
*   [ ] `/en/programs`
    *   [ ] `/en/programs/academia-politica` - Recap: `Fun Political Education`, `Program Reach`, `Role-Playing Methodology`, `Measurable Impact`, `Expert Support`, `Future Vision`
    *   [ ] `/en/programs/candidate-meetings` - Recap: `Indonesia's First Digital Town Hall Meeting`, `Program Reach`, `Beneficiaries`
    *   [ ] `/en/programs/class-of-climate-leaders` - Recap: `About the Program`, `Curriculum`, `Learning Methodology`, `Measurable Impact`, `Alumni Success Stories`, `How to Join`
    *   [ ] `/en/programs/council-gen-z` - Recap: `Bridging Young Generation Aspirations`, `Council of Gen Z Initiative`, `Young People's Aspirational Demands`, `Prabowo-Gibran Government Representatives' Responses`, `About Generasi Melek Politik`
    *   [ ] `/en/programs/discussions` - Recap: `Activity Documentation`
        *   [ ] `/en/programs/discussions/[slug]` - Recap: `Discussion Detail`
*   [ ] `/en/publications` - Recap: `Our Publications`
*   [ ] `/en/reports` - Recap: `Our Achievements`, `Program Reach`, `Our Publications`
*   [ ] `/en/strategic-partners` - Recap: `Strategic Partners`

### API Routes

*   `/api`
*   `/api/admin/acara`
*   `/api/admin/acara/:id`
*   `/api/admin/create`
*   `/api/admin/dashboard/activity`
*   `/api/admin/dashboard/chart`
*   `/api/admin/dashboard/stats`
*   `/api/admin/diskusi`
*   `/api/admin/diskusi/:id`
*   `/api/admin/homepage-slides`
*   `/api/admin/homepage-slides/:id`
*   `/api/admin/karir`
*   `/api/admin/karir/:id`
*   `/api/admin/partners`
*   `/api/admin/partners/:id`
*   `/api/admin/pengurus`
*   `/api/admin/pengurus/:id`
*   `/api/admin/program`
*   `/api/admin/program/:id`
*   `/api/admin/publikasi`
*   `/api/admin/publikasi/:id`
*   `/api/admin/research`
*   `/api/admin/research/attributes`
*   `/api/admin/research/attributes/:id`
*   `/api/admin/research/data`
*   `/api/admin/social-media`
*   `/api/admin/social-media/:id`
*   `/api/admin/upload`
*   `/api/auth/login`
*   `/api/auth/register`
*   `/api/board-pengurus`
*   `/api/content/*`
*   `/api/events`
*   `/api/home`
*   `/api/hono/*`
*   `/api/page-content`
*   `/api/publikasi`
*   `/api/ruang-sipil`
*   `/api/social-media`
*   `/api/visitor-tracking`