# Graph Report - NeelumResorts  (2026-09-25)

## Corpus Check
- 141 files · ~56,759 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 2, (none) 1, .toml 1)

## Summary
- 756 nodes · 1947 edges · 40 communities (36 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 57 edges (avg confidence: 0.86)
- Token cost: 95,776 input · 0 output

## Community Hubs (Navigation)
- Public Pages & Layout
- Contact & Enquiry Forms
- Seed Data
- Admin Forms & Actions
- Errors & Shared UI
- Room Admin Actions
- Admin List Pages
- Admin Shell & Icons
- Tour Admin Actions
- Cloudinary Media Components
- Branding Assets Admin
- Enquiry Inbox & Dashboard
- Hero & Media Actions
- TypeScript Config
- SEO & Keyword Research
- Page Header Photos
- Package & Prisma Config
- Admin Users & Upload Signing
- Reviews & Settings Actions
- Admin Login
- Stack & Performance Rules
- Media Pipeline Design
- Dev Dependencies
- Build Brief & Phase Plan
- Runtime Dependencies
- Auth.js Setup
- Design Reference Spec
- Non-Negotiable Rules
- ESLint Config
- Data Models & WhatsApp Flow
- Admin Home
- npm Scripts
- Enquiry Detail Page
- Section Headings
- Auth Type Augmentation
- Scroll Reveal
- Auth Route Handlers

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 64 edges
2. `next` - 42 edges
3. `react` - 33 edges
4. `waLink()` - 28 edges
5. `prisma` - 25 edges
6. `getSettings` - 24 edges
7. `ActionState` - 22 edges
8. `imageUrl()` - 21 edges
9. `getMedia` - 20 edges
10. `stroke()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `People-also-ask honesty filter (no durations/distances)` --semantically_similar_to--> `Price per jeep, range with reason, ratesUpdated line`  [INFERRED] [semantically similar]
  docs/keywords.md → PROMPT.md
- `PHASE 3 ADDENDUM CSS block` --conceptually_related_to--> `FareList component`  [INFERRED]
  CLAUDE.md → PROMPT.md
- `PHASE 3 ADDENDUM CSS block` --conceptually_related_to--> `Tours 'How it works' three-step strip`  [INFERRED]
  CLAUDE.md → PROMPT.md
- `PHASE 7 ADDENDUM CSS block` --implements--> `Phase 7 - Polish (metadata, JSON-LD, sitemap, a11y, rate limit)`  [INFERRED]
  CLAUDE.md → PROMPT.md
- `pageMetadata() SEO helper` --implements--> `Keyword research (Phase 7 Step 1)`  [INFERRED]
  CLAUDE.md → docs/keywords.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Tour fare publishing and enquiry flow** — prompt_model_tour, prompt_model_tourfare, prompt_fare_list, prompt_pickup_selector, prompt_whatsapp_flow, prompt_model_setting [EXTRACTED 0.95]
- **Cloudinary media system** — prompt_media_pipeline, prompt_cloudinary_sign_route, prompt_cloudinary_url_helpers, prompt_model_media, prompt_brand_assets, prompt_desktop_only_video [EXTRACTED 0.95]
- **Phase 7 SEO work** — docs_keywords_research, claude_seo_page_metadata, claude_canonical_host, claude_structured_data_schema, claude_faq_fare_generation [INFERRED 0.85]

## Communities (40 total, 4 thin omitted)

### Community 0 - "Public Pages & Layout"
Cohesion: 0.05
Nodes (95): body, display, generateMetadata(), GalleryPage(), generateMetadata(), revalidate, SiteLayout(), generateMetadata() (+87 more)

### Community 1 - "Contact & Enquiry Forms"
Cohesion: 0.06
Nodes (68): ContactPage(), generateMetadata(), revalidate, asDate(), EnquiryInput, saveEnquiry(), schema, BookBar() (+60 more)

### Community 2 - "Seed Data"
Cohesion: 0.07
Nodes (37): JEEP_INCLUDES, rooms, settings, tours, ALL_PLACEMENTS, BRAND, CTA, DINING (+29 more)

### Community 3 - "Admin Forms & Actions"
Cohesion: 0.12
Nodes (24): react, deleteEnquiry(), setEnquiryStatus(), statusSchema, EnquiryActions(), ReviewItem, RoomFormValues, RoomRow (+16 more)

### Community 4 - "Errors & Shared UI"
Cohesion: 0.11
Nodes (19): nextConfig, next, metadata, NotFound(), Button(), ButtonProps, classes(), Variant (+11 more)

### Community 5 - "Room Admin Actions"
Cohesion: 0.15
Nodes (21): PageHeadersPage(), addRoomPhoto(), deleteRoom(), deleteRoomPhoto(), orderSchema, photoSchema, read(), reorderRooms() (+13 more)

### Community 6 - "Admin List Pages"
Cohesion: 0.10
Nodes (17): dynamic, GalleryPage(), dynamic, ReviewsPage(), dynamic, RoomsPage(), RoomList(), dynamic (+9 more)

### Community 7 - "Admin Shell & Icons"
Cohesion: 0.14
Nodes (20): dynamic, metadata, signOut, DashboardIcon(), EnquiryIcon(), GalleryIcon(), LogoMark(), RoomIcon() (+12 more)

### Community 8 - "Tour Admin Actions"
Cohesion: 0.15
Nodes (18): addTourPhoto(), deleteTour(), deleteTourPhoto(), fareSchema, orderSchema, photoSchema, readFares(), reorderTours() (+10 more)

### Community 9 - "Cloudinary Media Components"
Cohesion: 0.21
Nodes (16): CldImage(), MediaPlaceholder(), CldVideo(), DeferredImage(), Gallery(), HeroSlider(), PhotoStrip(), useDialogFocus() (+8 more)

### Community 10 - "Branding Assets Admin"
Cohesion: 0.15
Nodes (18): clearBrandAsset(), saveBrandAsset(), schema, BrandSlot(), onUploaded(), BrandSlotProps, previewUrl(), BRAND_KEYS (+10 more)

### Community 11 - "Enquiry Inbox & Dashboard"
Cohesion: 0.17
Nodes (18): chipHref(), dates(), dynamic, EnquiriesPage(), KINDS, STATUSES, when(), AdminLayout() (+10 more)

### Community 12 - "Hero & Media Actions"
Cohesion: 0.19
Nodes (16): dynamic, HeroPage(), addMedia(), addSchema, deleteMedia(), MANAGED, ManagedPlacement, reorderMedia() (+8 more)

### Community 13 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 14 - "SEO & Keyword Research"
Cohesion: 0.16
Nodes (18): Canonical host www.neelumresortstaobat.com, FAQ Kel-Taobat fare answer generated from TourFare (faq.ts), PHASE 7 ADDENDUM CSS block, pageMetadata() SEO helper, Structured data (schema.ts) without aggregateRating, People-also-ask honesty filter (no durations/distances), Keyword research (Phase 7 Step 1), Review count from Settings ratingCount (704 vs 705) (+10 more)

### Community 15 - "Page Header Photos"
Cohesion: 0.26
Nodes (13): altSchema, clearPageHeader(), revalidatePage(), savePageHeader(), savePageHeaderAlt(), saveSchema, dynamic, SLOTS (+5 more)

### Community 16 - "Package & Prisma Config"
Cohesion: 0.13
Nodes (14): name, private, version, dotenv, eslint, eslint-config-next, prisma, @prisma/adapter-pg (+6 more)

### Community 17 - "Admin Users & Upload Signing"
Cohesion: 0.17
Nodes (14): bcryptjs, ref_node_crypto, createSchema, createUser(), deleteUser(), passwordSchema, resetPassword(), UserAdmin() (+6 more)

### Community 18 - "Reviews & Settings Actions"
Cohesion: 0.22
Nodes (11): zod, deleteReview(), reorderReviews(), saveReview(), schema, ReviewAdmin(), ReviewRow(), saveSettings() (+3 more)

### Community 19 - "Admin Login"
Cohesion: 0.22
Nodes (8): react-dom, login(), LoginState, schema, LoginForm(), dynamic, metadata, signIn

### Community 20 - "Stack & Performance Rules"
Cohesion: 0.20
Nodes (11): DeferredImage / below-fold deferral, loading.tsx only under [slug] routes, CLAUDE.md Project Summary, pnpm allowBuilds (prisma, @prisma/engines, esbuild, unrs-resolver), ISR revalidate=3600 + revalidatePath on admin save, Performance budget (Lighthouse, LCP, CLS, 1.2 MB), Phase 6 - Admin CRUD (Enquiries, Rooms, Tours, Gallery, Branding, Settings, Users), Phase 8 - Deploy and HANDOVER.md (+3 more)

### Community 21 - "Media Pipeline Design"
Cohesion: 0.24
Nodes (11): /ref-images route (design-reference image server), RefImage component (fill vs width/height modes), Brand assets (logo-light, logo-dark, favicon, og-image), POST /api/cloudinary/sign, lib/cloudinary.ts URL helpers (imageUrl, videoUrl, posterUrl, logoUrl, faviconUrl), Desktop-only autoplay video, Graceful degradation of unseeded media sections, Media pipeline (signed direct upload to Cloudinary) (+3 more)

### Community 22 - "Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, dotenv, eslint, eslint-config-next, @eslint/eslintrc, prisma, tsx, @types/node (+3 more)

### Community 23 - "Build Brief & Phase Plan"
Cohesion: 0.24
Nodes (10): src/lib/copy.ts page copy, Database before pages principle, PHASE-PROMPTS.md Phase Prompts, PROMPT.md Build Brief, AdminUser model (OWNER/STAFF), Phase 2 - Database first, Phase 5 - Auth and admin shell (Auth.js Credentials, middleware), Phase plan (Phases 0-8) (+2 more)

### Community 24 - "Runtime Dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcryptjs, cloudinary, next, next-auth, @prisma/adapter-pg, @prisma/client, react (+2 more)

### Community 25 - "Auth.js Setup"
Cohesion: 0.31
Nodes (6): next-auth, authConfig, credentialsSchema, handlers, auth, config

### Community 26 - "Design Reference Spec"
Cohesion: 0.29
Nodes (7): design-reference Layout Notes (scrambled filenames), Missing story.jpg photograph, PHASE 3 ADDENDUM CSS block, design-reference/ static HTML spec, Design tokens (ink, pine, brass, sand, cream; Cormorant Garamond + Jost), Homepage section order, Rule: Design does not change

### Community 27 - "Non-Negotiable Rules"
Cohesion: 0.29
Nodes (8): Deliberately untargeted keywords, 'If Claude Code drifts' correction lines, Environment variables (section 9), Non-negotiable rules (section 1), Rule: No Discounted Offers section, Rule: No email, WhatsApp only, Rule: Rooms show no prices, tours fares only where published, Rule: Never commit secrets

### Community 28 - "ESLint Config"
Cohesion: 0.25
Nodes (7): compat, __dirname, eslintConfig, __filename, @eslint/eslintrc, ref_path, ref_url

### Community 29 - "Data Models & WhatsApp Flow"
Cohesion: 0.29
Nodes (8): Enquiry model (kind STAY/TOUR, status), Media model (Cloudinary publicId, Placement, brandKey), Room model, Tour model (no price field), PickupSelect pick-up selector, Open window first, save enquiry second, PriceTag component (rooms only), WhatsApp flow (wa.me entry points)

### Community 30 - "Admin Home"
Cohesion: 0.38
Nodes (6): dates(), dynamic, EnquiryRow(), when(), ChevronIcon(), UploadIcon()

### Community 31 - "npm Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, postinstall, start

### Community 32 - "Enquiry Detail Page"
Cohesion: 0.40
Nodes (5): DAY, dynamic, EnquiryPage(), LONG, getEnquiry()

### Community 33 - "Section Headings"
Cohesion: 0.40
Nodes (3): Eyebrow(), EyebrowProps, SectionHeadProps

### Community 34 - "Auth Type Augmentation"
Cohesion: 0.33
Nodes (5): JWT, next-auth, next-auth/jwt, Session, User

### Community 35 - "Scroll Reveal"
Cohesion: 0.60
Nodes (3): Reveal(), RevealProps, useReveal()

## Ambiguous Edges - Review These
- `Structured data (schema.ts) without aggregateRating` → `Review count from Settings ratingCount (704 vs 705)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **195 isolated node(s):** `__filename`, `__dirname`, `compat`, `eslintConfig`, `nextConfig` (+190 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 233 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Structured data (schema.ts) without aggregateRating` and `Review count from Settings ratingCount (704 vs 705)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `next` connect `Errors & Shared UI` to `Enquiry Detail Page`, `Public Pages & Layout`, `Contact & Enquiry Forms`, `Admin Forms & Actions`, `Room Admin Actions`, `Admin List Pages`, `Admin Shell & Icons`, `Tour Admin Actions`, `Cloudinary Media Components`, `Enquiry Inbox & Dashboard`, `Page Header Photos`, `Package & Prisma Config`, `Admin Users & Upload Signing`, `Admin Home`?**
  _High betweenness centrality (0.221) - this node is a cross-community bridge._
- **Why does `react` connect `Admin Forms & Actions` to `Public Pages & Layout`, `Contact & Enquiry Forms`, `Scroll Reveal`, `Errors & Shared UI`, `Tour Admin Actions`, `Cloudinary Media Components`, `Branding Assets Admin`, `Hero & Media Actions`, `Page Header Photos`, `Package & Prisma Config`, `Admin Login`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `requireAdmin()` connect `Room Admin Actions` to `Admin Forms & Actions`, `Admin List Pages`, `Tour Admin Actions`, `Branding Assets Admin`, `Hero & Media Actions`, `Page Header Photos`, `Admin Users & Upload Signing`, `Reviews & Settings Actions`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `__filename`, `__dirname`, `compat` to the rest of the system?**
  _195 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Public Pages & Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.050397877984084884 - nodes in this community are weakly interconnected._
- **Should `Contact & Enquiry Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.05851619644723093 - nodes in this community are weakly interconnected._