# Graph Report - NeelumResorts  (2026-09-23)

## Corpus Check
- 174 files · ~325,560 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 3, (none) 1, .toml 1)

## Summary
- 694 nodes · 1844 edges · 35 communities (31 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Public Site Pages & SEO
- Guest Enquiry Flow
- Branding & Root Layout
- Seed Data & Media
- Admin Client Forms
- Admin Enquiry Dashboard
- Room Admin Actions
- Admin List Pages & DB
- TypeScript Config
- Media Manager
- Page Header Admin
- Reviews & Settings Admin
- Admin Nav & Icons
- Users & Cloudinary Signing
- Tour Admin Actions
- Package Manifest
- Admin Login
- Reference Site Script
- Dev Dependencies
- Admin Shell Layout
- Fares & FAQ
- Tour Admin List
- Runtime Dependencies
- Auth.js Setup
- ESLint Config
- npm Scripts
- Enquiry Status Actions
- Drag Reorder List
- Section Headings
- Auth Type Augmentation
- Scroll Reveal
- NextAuth Route Handlers

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
- `seedSettings()` --calls--> `contactFromEnv()`  [EXTRACTED]
  prisma/seed.ts → src/lib/contact-env.ts
- `BrandingPage()` --calls--> `requireAdmin()`  [EXTRACTED]
  src/app/admin/branding/page.tsx → src/lib/admin-auth.ts
- `GalleryPage()` --calls--> `requireAdmin()`  [EXTRACTED]
  src/app/admin/gallery/page.tsx → src/lib/admin-auth.ts
- `HeroPage()` --calls--> `requireAdmin()`  [EXTRACTED]
  src/app/admin/hero/page.tsx → src/lib/admin-auth.ts
- `PageHeadersPage()` --calls--> `requireAdmin()`  [EXTRACTED]
  src/app/admin/pages/page.tsx → src/lib/admin-auth.ts

## Import Cycles
- None detected.

## Communities (35 total, 4 thin omitted)

### Community 0 - "Public Site Pages & SEO"
Cohesion: 0.05
Nodes (93): dynamic, ReviewsPage(), ContactPage(), generateMetadata(), GalleryPage(), generateMetadata(), revalidate, generateMetadata() (+85 more)

### Community 1 - "Guest Enquiry Flow"
Cohesion: 0.06
Nodes (65): revalidate, asDate(), EnquiryInput, saveEnquiry(), schema, BookBar(), onCheckinChange(), onSubmit() (+57 more)

### Community 2 - "Branding & Root Layout"
Cohesion: 0.05
Nodes (49): clearBrandAsset(), saveBrandAsset(), schema, BrandSlot(), onUploaded(), BrandSlotProps, previewUrl(), BRAND_KEYS (+41 more)

### Community 3 - "Seed Data & Media"
Cohesion: 0.07
Nodes (37): JEEP_INCLUDES, rooms, settings, tours, ALL_PLACEMENTS, BRAND, CTA, DINING (+29 more)

### Community 4 - "Admin Client Forms"
Cohesion: 0.15
Nodes (17): react, RoomRow, FareRow, FaresEditor(), TourFormValues, UserRow, ChipInput(), ConfirmButton() (+9 more)

### Community 5 - "Admin Enquiry Dashboard"
Cohesion: 0.12
Nodes (26): DAY, dynamic, EnquiryPage(), LONG, chipHref(), dates(), dynamic, EnquiriesPage() (+18 more)

### Community 6 - "Room Admin Actions"
Cohesion: 0.17
Nodes (20): addRoomPhoto(), deleteRoom(), deleteRoomPhoto(), orderSchema, photoSchema, read(), reorderRooms(), roomSchema (+12 more)

### Community 7 - "Admin List Pages & DB"
Cohesion: 0.11
Nodes (15): @prisma/adapter-pg, dynamic, GalleryPage(), dynamic, HeroPage(), dynamic, RoomsPage(), RoomList() (+7 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Media Manager"
Cohesion: 0.22
Nodes (15): addMedia(), addSchema, deleteMedia(), MANAGED, ManagedPlacement, reorderMedia(), revalidateFor(), updateMedia() (+7 more)

### Community 10 - "Page Header Admin"
Cohesion: 0.21
Nodes (14): altSchema, clearPageHeader(), revalidatePage(), savePageHeader(), savePageHeaderAlt(), saveSchema, dynamic, PageHeadersPage() (+6 more)

### Community 11 - "Reviews & Settings Admin"
Cohesion: 0.21
Nodes (11): deleteReview(), reorderReviews(), saveReview(), schema, ReviewAdmin(), ReviewItem, ReviewRow(), saveSettings() (+3 more)

### Community 12 - "Admin Nav & Icons"
Cohesion: 0.18
Nodes (14): DashboardIcon(), EnquiryIcon(), GalleryIcon(), RoomIcon(), s, TourIcon(), UploadIcon(), AdminLink (+6 more)

### Community 13 - "Users & Cloudinary Signing"
Cohesion: 0.17
Nodes (14): bcryptjs, ref_node_crypto, createSchema, createUser(), deleteUser(), passwordSchema, resetPassword(), UserAdmin() (+6 more)

### Community 14 - "Tour Admin Actions"
Cohesion: 0.19
Nodes (14): addTourPhoto(), deleteTour(), deleteTourPhoto(), fareSchema, orderSchema, photoSchema, readFares(), saveTour() (+6 more)

### Community 15 - "Package Manifest"
Cohesion: 0.14
Nodes (13): name, private, version, dotenv, eslint, eslint-config-next, prisma, @prisma/client (+5 more)

### Community 16 - "Admin Login"
Cohesion: 0.20
Nodes (9): react-dom, login(), LoginState, schema, LoginForm(), dynamic, metadata, signIn (+1 more)

### Community 17 - "Reference Site Script"
Cohesion: 0.18
Nodes (8): bookForm, contactForm, go(), header, io, lb, mob, slides

### Community 18 - "Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, dotenv, eslint, eslint-config-next, @eslint/eslintrc, prisma, tsx, @types/node (+3 more)

### Community 19 - "Admin Shell Layout"
Cohesion: 0.24
Nodes (9): AdminLayout(), dynamic, metadata, signOut, SettingsIcon(), SignOutIcon(), SignOutButton(), countNewEnquiries() (+1 more)

### Community 20 - "Fares & FAQ"
Cohesion: 0.33
Nodes (8): FareListCard(), FareListDetail(), notesOf(), FAQ, FaqItem, buildFaq(), listOf(), formatFare()

### Community 21 - "Tour Admin List"
Cohesion: 0.27
Nodes (7): nextConfig, next, reorderTours(), dynamic, ToursPage(), TourList(), TourListRow

### Community 22 - "Runtime Dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcryptjs, cloudinary, next, next-auth, @prisma/adapter-pg, @prisma/client, react (+2 more)

### Community 23 - "Auth.js Setup"
Cohesion: 0.31
Nodes (6): next-auth, authConfig, credentialsSchema, handlers, auth, config

### Community 24 - "ESLint Config"
Cohesion: 0.25
Nodes (7): compat, __dirname, eslintConfig, __filename, @eslint/eslintrc, ref_path, ref_url

### Community 25 - "npm Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, postinstall, start

### Community 26 - "Enquiry Status Actions"
Cohesion: 0.40
Nodes (5): zod, deleteEnquiry(), setEnquiryStatus(), statusSchema, EnquiryActions()

### Community 27 - "Drag Reorder List"
Cohesion: 0.47
Nodes (4): ReorderList(), move(), nudge(), onPointerMove()

### Community 28 - "Section Headings"
Cohesion: 0.40
Nodes (3): Eyebrow(), EyebrowProps, SectionHeadProps

### Community 29 - "Auth Type Augmentation"
Cohesion: 0.33
Nodes (5): JWT, next-auth, next-auth/jwt, Session, User

### Community 30 - "Scroll Reveal"
Cohesion: 0.60
Nodes (3): Reveal(), RevealProps, useReveal()

## Knowledge Gaps
- **190 isolated node(s):** `header`, `mob`, `slides`, `bookForm`, `contactForm` (+185 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 226 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Tour Admin List` to `Public Site Pages & SEO`, `Guest Enquiry Flow`, `Branding & Root Layout`, `Admin Client Forms`, `Admin Enquiry Dashboard`, `Room Admin Actions`, `Admin List Pages & DB`, `Page Header Admin`, `Reviews & Settings Admin`, `Admin Nav & Icons`, `Users & Cloudinary Signing`, `Tour Admin Actions`, `Package Manifest`, `Admin Shell Layout`, `Enquiry Status Actions`?**
  _High betweenness centrality (0.264) - this node is a cross-community bridge._
- **Why does `react` connect `Admin Client Forms` to `Public Site Pages & SEO`, `Guest Enquiry Flow`, `Branding & Root Layout`, `Room Admin Actions`, `Media Manager`, `Reviews & Settings Admin`, `Admin Nav & Icons`, `Package Manifest`, `Admin Login`, `Tour Admin List`, `Scroll Reveal`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `requireAdmin()` connect `Room Admin Actions` to `Public Site Pages & SEO`, `Branding & Root Layout`, `Admin Client Forms`, `Admin List Pages & DB`, `Media Manager`, `Page Header Admin`, `Reviews & Settings Admin`, `Users & Cloudinary Signing`, `Tour Admin Actions`, `Tour Admin List`, `Enquiry Status Actions`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `header`, `mob`, `slides` to the rest of the system?**
  _190 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Public Site Pages & SEO` be split into smaller, more focused modules?**
  _Cohesion score 0.05258583224684919 - nodes in this community are weakly interconnected._
- **Should `Guest Enquiry Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.06259183073758448 - nodes in this community are weakly interconnected._
- **Should `Branding & Root Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.05328218243819267 - nodes in this community are weakly interconnected._