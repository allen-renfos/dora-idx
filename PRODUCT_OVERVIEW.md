# RealtiPro — Complete Product Overview
**For Internal Use & Marketing Team Reference**

---

## Table of Contents

1. [Product Summary](#1-product-summary)
2. [Technology Stack](#2-technology-stack)
3. [Pages & URL Structure](#3-pages--url-structure)
4. [Feature Modules — Detailed Breakdown](#4-feature-modules--detailed-breakdown)
   - 4.1 [Homepage & Hero Search](#41-homepage--hero-search)
   - 4.2 [MLS Property Search (IDX)](#42-mls-property-search-idx)
   - 4.3 [Property Listing Cards](#43-property-listing-cards)
   - 4.4 [Single Property Detail Page](#44-single-property-detail-page)
   - 4.5 [Mortgage Calculator](#45-mortgage-calculator)
   - 4.6 [Property Enquiry & Tour Request](#46-property-enquiry--tour-request)
   - 4.7 [Social Sharing](#47-social-sharing)
   - 4.8 [Property Visit Tracking](#48-property-visit-tracking)
   - 4.9 [Google Maps & Local Information](#49-google-maps--local-information)
   - 4.10 [User Authentication System](#410-user-authentication-system)
   - 4.11 [User Dashboard](#411-user-dashboard)
   - 4.12 [Favorites / Wishlist](#412-favorites--wishlist)
   - 4.13 [Saved Searches](#413-saved-searches)
   - 4.14 [Market Report](#414-market-report)
   - 4.15 [My Agent / Chat](#415-my-agent--chat)
   - 4.16 [Testimonials](#416-testimonials)
   - 4.17 [Neighborhoods](#417-neighborhoods)
   - 4.18 [Blog / News](#418-blog--news)
   - 4.19 [About Us / Agent Bio](#419-about-us--agent-bio)
   - 4.20 [Connect / Contact Page](#420-connect--contact-page)
   - 4.21 [Newsletter Subscription](#421-newsletter-subscription)
   - 4.22 [Sell Enquiry Modal](#422-sell-enquiry-modal)
   - 4.23 [Agent Branding System](#423-agent-branding-system)
   - 4.24 [Layout & Navigation](#424-layout--navigation)
   - 4.25 [Legal & Compliance Pages](#425-legal--compliance-pages)
5. [Advanced Search Filter Parameters](#5-advanced-search-filter-parameters)
6. [API & Backend Integration](#6-api--backend-integration)
7. [Infrastructure & Deployment](#7-infrastructure--deployment)
8. [UI/UX Design System](#8-uiux-design-system)
9. [Security & Data Handling](#9-security--data-handling)
10. [All Modules & Components Index](#10-all-modules--components-index)

---

## 1. Product Summary

**RealtiPro** is a full-stack, white-label real estate web platform built for real estate agents and brokerages. It provides end-to-end IDX/MLS property search, agent branding, user account management, lead capture, and property marketing tools — all in a single, unified web application.

The platform is built on **Next.js 15** with **React 19**, deployed as a standalone application, and integrates live MLS data feeds via a custom API backend. It is fully responsive and works on desktop, tablet, and mobile devices.

**Brand Name:** RealtiPro  
**Title:** RealtiPro — Find Your Dream Home  
**Target Users:** Home buyers, sellers, renters, and the real estate agents who serve them  
**Agent ID System:** Each agent deployment is scoped to a unique agent UUID (`NEXT_PUBLIC_REALTY_PRO_AGENT_ID`) — making it a true multi-tenant, white-label solution  

---

## 2. Technology Stack

### Frontend Framework
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 15.x | App framework, routing, SSR/SSG/Standalone |
| **React** | 19.x | UI component library |
| **TypeScript** | 5.x | Static typing throughout the codebase |
| **Tailwind CSS** | 4.x | Utility-first styling |

### Data Fetching & State
| Technology | Version | Purpose |
|---|---|---|
| **TanStack React Query** | 5.x | Server state management, caching, background refetch |
| **Axios** | 1.x | HTTP client for API calls |

### Maps & Location
| Technology | Version | Purpose |
|---|---|---|
| **@react-google-maps/api** | 2.x | Google Maps for local information on single property pages |
| **Leaflet / React-Leaflet** | 1.9 / 5.x | Map rendering for MLS map view |

### Backend & Cloud
| Technology | Version | Purpose |
|---|---|---|
| **Firebase Admin** | 13.x | Server-side Firebase integration |
| **Firebase Functions** | 6.x | Cloud Functions for backend logic |
| **Firebase Hosting** | — | Application deployment option |
| **Vercel** | — | Primary deployment platform (standalone output) |

### UI & Notifications
| Technology | Version | Purpose |
|---|---|---|
| **React Icons** | 5.x | 1000+ icons (HeroIcons, Font Awesome, etc.) |
| **React Hot Toast** | 2.x | Lightweight toast notifications |
| **React Toastify** | 11.x | Rich toast & alert notifications |

### Typography
| Font | Type | Weights |
|---|---|---|
| **Lato** | Google Font | 300, 400, 700, 900 |
| **Playfair Display** | Local/Self-hosted | Regular 400, Bold 700, Italic 400 |

---

## 3. Pages & URL Structure

| Route | Page Name | Description |
|---|---|---|
| `/home` | **Homepage** | Hero search, featured listings, neighborhoods, testimonials, news |
| `/properties` | **MLS Property Search** | Full IDX property search with advanced filters, grid & map views |
| `/properties/[id]` | **Single Property Detail** | Full listing page with gallery, details, calculator, enquiry |
| `/neighborhoods` | **Neighborhoods** | Browse all neighborhoods with search and filter |
| `/blog` | **Blog / News** | News articles and market insights with pagination |
| `/blog/[id]` | **Single Blog Post** | Full article content page |
| `/about-us` | **About Us** | Agent bio, stats, social links, featured properties |
| `/connect` | **Connect / Contact** | Contact form, social media, agent address |
| `/collection` | **Dashboard Home** | Main user dashboard landing |
| `/collection/favourites` | **Favourites** | User's saved/wishlisted properties |
| `/saved-searches` | **Saved Searches** | User's saved search criteria |
| `/market-report` | **Market Report** | Location-based market trend tool + app download promo |
| `/profile` | **My Profile** | Edit personal info, view account details |
| `/testimonial` | **Testimonial** | Submit or view user testimonial |
| `/login` | **Login** | Email & password authentication |
| `/register` | **Register** | New user account creation |
| `/forgot-password` | **Forgot Password** | Password reset request |
| `/reset-password` | **Reset Password** | Password reset with token |
| `/privacy-policy` | **Privacy Policy** | Full IDX/MLS data & DMCA policy |
| `/terms-of-service` | **Terms of Service** | Platform usage terms |

---

## 4. Feature Modules — Detailed Breakdown

---

### 4.1 Homepage & Hero Search

The homepage is the primary landing and conversion surface for visitors.

**Hero Section:**
- Full-screen hero image/video background with gradient overlay
- Agent name and tagline dynamically loaded from the agent profile API
- **Buy / Rent tab switcher** — toggles search intent between buying and renting
- **Smart keyword search bar** with real-time autocomplete suggestions grouped by category:
  - Address suggestions
  - ZIP code suggestions
  - County suggestions
  - City suggestions
  - Suggestions are deduplicated and sorted by relevance priority
- Clicking a suggestion immediately navigates to the properties search page with that filter applied
- **Property Type dropdown** — filter by home type before searching
- **Max Price dropdown** — quick price ceiling selector
- **Neighborhood dropdown** — browse by neighborhood directly from hero
- **"Sell My Home" CTA button** — opens the Sell Enquiry Modal

**Homepage Sections (below the hero):**
- **Featured / Recent Properties** — carousel or grid of highlighted listings
- **Neighborhoods** — visual grid of neighborhood cards linking to the neighborhoods directory
- **Testimonials section** — rotating client testimonials loaded from the API
- **News / Blog articles** — latest blog posts displayed as cards

---

### 4.2 MLS Property Search (IDX)

The core product functionality — a live, searchable MLS/IDX property database.

**Search Bar (Top Filter Bar):**
- Keyword/location input with live autocomplete (address, zip, city, county)
- Price range quick filters (min/max dropdowns)  
- Beds quick filter (min/max)
- Baths quick filter (min/max)
- Property type quick filter
- **"All Filters" button** — opens the full Advanced Search panel with a badge count showing how many filter groups are active
- **"Save Search" button** (for authenticated users) — saves the current filter set to their account
- **"Clear Filters" button** — resets all active filters at once
- Active filter state detection and display

**View Modes (Listing Options Toolbar):**
- **Grid view** — property cards in a responsive grid
- **Map + Grid view** — split layout: property cards on left, interactive map on right
- **Map only view** — full-width Google Maps / Leaflet map with price markers
- View toggle buttons have tooltips on hover

**Property Listing Results:**
- Paginated results (configurable page size, default 25 per page)
- Skeleton loading placeholders during data fetch (matches the exact card layout)
- Results count displayed
- Sort by featured by default
- Each card links to the single property detail page

**Sorting & Pagination:**
- Page-based navigation
- Results per page: 25 default
- URL-based state management (keyword via query params)
- Session-storage-based filter persistence for navigating back

---

### 4.3 Property Listing Cards

Used across the search results page, homepage featured sections, and the user's Favorites page.

**Card displays:**
- Property hero image (with fallback for missing images)
- Image hover effect/overlay
- Property price (formatted: $1.2M, $450,000, etc.)
- Number of Bedrooms (with bed icon)
- Number of Bathrooms (with bath icon)
- Square footage (with area icon)
- Property type badge
- Location / address
- "For Sale" / "For Rent" status badge
- **Heart/Wishlist button** — add or remove from favorites with optimistic UI updates
  - Unauthenticated users are shown a Login modal instead of being redirected
- Click anywhere on the card to navigate to the property detail page
- Hover state animation

---

### 4.4 Single Property Detail Page

The most content-rich page on the platform. Every listing gets its own full detail page.

**Image Section:**
- Primary hero image displayed at full width
- Image gallery strip showing multiple photos
- **"View All Photos" button** opens a full-screen Image Gallery Modal
- Gallery modal supports:
  - Keyboard navigation (← → arrow keys, Escape to close)
  - Previous/Next chevron buttons
  - Current slide indicator
  - Full dark background

**Property Overview Panel:**
- Property price (large, prominent)
- Property address (full address line)
- MLS listing key / listing ID
- Beds count with icon
- Baths count with icon
- Square footage with icon
- Lot size
- Year built
- Property type
- Property status (Active, Active with contingency, Pending)
- MLS list agent name
- All fields pulled live from the MLS data feed

**Action Buttons:**
- **"Enquire / Request Tour" button** — opens the Property Enquiry Modal
- **"Save / Favourite" button (heart icon)** — toggle property in/out of wishlist
  - Real-time sync with user's wishlist
  - Login prompt for unauthenticated users
  - Toast feedback on success/failure
- **"Share" button** — opens the Social Share popup

**Property Description:**
- Full listing description text from MLS
- Property highlights

**Property Features Sections:**
- Interior features list
- Site features / exterior
- Lot features
- Community amenities
- Property views
- Basement details
- Sewer type
- Garage count
- Stories
- School district
- Builder name

**Mortgage Calculator (built-in, interactive):**
- See Section 4.5 below

**Local Information Map:**
- See Section 4.9 below

**Agent Contact Card:**
- Dynamic agent name from the Name Context
- Agent profile photo
- Agent phone number
- Agent email
- Quick contact CTA

**Property Visit Tracking:**
- Automatically tracks each property page view
- Uses a unique session ID (generated and persisted per browser session)
- Sends property ID, session ID, and agent UUID to the visit tracking API
- Only tracks when a customer_id is present in sessionStorage (authenticated users)

---

### 4.5 Mortgage Calculator

An interactive, inline mortgage estimator built directly into every single property page.

**Inputs (all editable inline):**
- **Home Price** — defaults to the listing price, user-editable
- **Down Payment %** — defaults to 20%, adjustable
- **Loan Term** — dropdown: 10, 15, 20, 30 years
- **Interest Rate** — defaults to 5.91%, user-editable
- Calculated down payment dollar amount shown in real time

**Outputs:**
- **Monthly payment** — calculated dynamically using standard amortization formula
- Updates instantly as any input changes

**UX Details:**
- Inline click-to-edit fields (no separate modal)
- Loan term dropdown with custom styling
- All values formatted with currency symbols and commas

---

### 4.6 Property Enquiry & Tour Request

A dual-purpose modal available on every property detail page.

**Two Tabs:**

**Tab 1 — Request a Tour:**
- Tour date picker
- Tour time selector
- When-to-sell selector (for sellers)
- First name / Last name
- Email
- Phone
- Message / notes
- Auto-fills from logged-in user profile (name, email, phone)

**Tab 2 — Enquire:**
- First name / Last name
- Email
- Phone
- Message / notes (free text)
- Auto-fills from logged-in user profile

**Both tabs include:**
- TCPA / Privacy consent checkbox (required before submitting)
- Full disclaimer text with links to Privacy Policy and Terms of Service
- Validation feedback
- Toast notification on success / failure
- Form resets after successful submission

---

### 4.7 Social Sharing

A share popup available on every property listing page.

**Share channels:**
1. **Copy Link** — copies current URL to clipboard with visual confirmation (icon turns green)
2. **WhatsApp** — pre-fills message with property address and price
3. **Facebook** — opens Facebook share dialog
4. **Twitter / X** — opens Twitter compose with pre-filled text
5. **SMS / Text** — opens native SMS app with pre-filled message
6. **Email** — opens email client with pre-filled subject and body

**UX Details:**
- Popup opens over a backdrop overlay
- Closes on Escape key
- Body scroll locked while open
- Toast notification on successful link copy

---

### 4.8 Property Visit Tracking

Passive analytics tracking built into every single property page.

- Fires automatically when a property page loads and data is available
- Creates or reuses a `visitor_session_id` (UUID stored in sessionStorage)
- Posts to `/v1/property/visit` API endpoint with:
  - `property_id` — the MLS listing's internal ID
  - `session_id` — the browser session identifier
  - `uuid` — the agent's UUID
  - JWT bearer token (if authenticated)
- Enables agents to see which properties their clients are viewing

---

### 4.9 Google Maps & Local Information

Two separate map integrations serve different purposes on the platform.

**MLS Search Map View (Leaflet + Google Maps):**
- Displays all search results on an interactive map
- Price labels shown as floating overlay markers (formatted as $450k, $1.2M)
- Hovering a marker shows a mini property card popup (MlsMapModalCard)
- Clicking a marker can navigate to the property detail page
- Map bounds auto-fit to show all results
- Split-panel mode: cards on left, map on right (synchronized hover state)

**Single Property Local Information Map (Google Maps + Places API):**
- Embedded Google Map centered on the property's GPS coordinates
- **Category filter tabs** (toggle to show different place types):
  - Schools
  - Super Shops (Supermarkets)
  - Parks
  - ATMs
- Pins plotted for nearby places within 5km radius using Google Places API
- Map auto-fits bounds to show the property and all found places
- Active category highlighted in gold accent color

---

### 4.10 User Authentication System

A complete authentication flow built on JWT token-based sessions.

**Login:**
- Email and password fields
- Client-side validation (empty field detection)
- Server-side error messages shown inline
- TCPA/Privacy consent checkbox
- On success: stores `access_token` and `customer_id` in `sessionStorage`, redirects to `/collection` dashboard
- Available as both a **standalone page** (`/login`) and as an **inline modal** (triggered from anywhere on the site)

**Registration:**
- Fields: full name, email, phone, password, confirm password
- Password confirmation validation (must match)
- All validation shown inline
- On success: redirects to `/login`
- Available as both a **standalone page** (`/register`) and as an **inline modal**

**Forgot Password:**
- Email input field
- Submits password reset request to API
- Available as both a **standalone page** and as an **inline modal**

**Reset Password:**
- Standalone page at `/reset-password`
- Accepts reset token from email link
- New password + confirm new password fields

**Session Management:**
- JWT token stored in `sessionStorage` (cleared on browser close)
- Token included as `Authorization: Bearer <token>` header on all authenticated API calls
- `logout` API call + `sessionStorage.clear()` on logout
- All dashboard pages check for `access_token` presence

---

### 4.11 User Dashboard

A private section of the platform accessible only to authenticated users.

**Dashboard Layout:**
- Persistent **left sidebar navigation** with links to all dashboard sections
- Sidebar shows active route with gold highlight indicator
- Sidebar bottom: Copyright notice
- Top header bar: Page title + subtitle + action buttons

**Sidebar Navigation Items:**
| Label | Route | Icon |
|---|---|---|
| Favourites | `/collection/favourites` | Heart/Collection |
| Saved Searches | `/saved-searches` | Bookmark |
| Testimonial | `/testimonial` | Star |
| Profile | `/profile` | User |

---

### 4.12 Favorites / Wishlist

**My Favourites Page (`/collection/favourites`):**
- Displays all properties the user has saved/wishlisted
- Uses the same `PropertyCard` component as the main search results
- Shows the total count of saved listings in the page subtitle ("Saved Listings (12)")
- **Empty state** shown when no favorites: heart icon, instructions, and a "Search Listings" CTA button
- Real-time sync — removes card if un-favorited from within the page

**Wishlist Mechanics (available platform-wide):**
- Add to wishlist: POST to `/v1/property/wishlist`
- Remove from wishlist: DELETE to `/v1/customer/property/wishlist/{id}`
- Stores `listing_id`, `listing_key`, `agent_id`, `user_id`, and `uuid`
- Optimistic UI updates (card updates instantly before API confirmation)
- Toast notification on add / remove
- Login modal shown if user is not authenticated
- Query cache auto-invalidated after every wishlist change (affects all property cards site-wide)

---

### 4.13 Saved Searches

**Saved Searches Page (`/saved-searches`):**
- Lists all search criteria sets the user has previously saved
- Each saved search card displays:
  - Search name / keyword
  - Filter tags (property type, price range, beds, baths, city, state, ZIP, "For Sale/Rent")
  - Date saved (formatted as "Apr 13, 2026")
- Clicking a saved search card:
  - Restores the full filter set into `sessionStorage`
  - Navigates to `/properties` with the full filter applied — exactly matching the original search
- **Empty state** with a "Start Searching" CTA
- Skeleton loading placeholders while data fetches

**Save Search Feature (from Properties page):**
- "Save Search" button in the filter bar (authenticated users only)
- Saves the entire current `SearchFilters` object to the backend
- `isSavingSearch` loading state on the button
- Toast notification on success

---

### 4.14 Market Report

**Market Report Page (`/market-report`):**
- Location-based search input to generate a market trend report
- Search icon inside the styled input
- "Create Your First Market Report" headline + description

**App Download Promo (two blocks):**
- Promo banner with the RealtiPro app illustration
- Phone number input field
- "Text Me This Free App" CTA button (SMS-to-download flow)
- Disclaimer: "Standard messaging rates apply"
- Mobile app promotional image alongside the form

---

### 4.15 My Agent / Chat

**My Agent Page:**
- Agent profile photo in a styled frame
- Agent full name (dynamic)
- Agent title / platform name
- Agent phone number (with gold phone icon)
- Agent bio — long-form paragraph text
- **Contact Your Agent** section:
  - Subject field
  - Message textarea (180px height)
  - Send button

**Chat Interface (ChatInterfaceAdvanced):**
- Dark-themed messaging UI
- Agent profile image and name in the top header
- Illustrated empty state (two avatars with speech bubbles)
- Headline: "Let's start Chatting"
- Description: "Directly communicate with your agent..."
- **Message input bar** at the bottom:
  - Attachment button (paperclip icon, gold border)
  - Text input (full-width, dark background with gold focus ring)
  - Send button (gold background, arrow icon, disabled until message typed)
- Send on Enter key (Shift+Enter for new line)

**Mobile Chat Interface:**
- Separate optimized layout for mobile screens

---

### 4.16 Testimonials

**User Testimonial Page (`/testimonial`):**
- **Existing Testimonial View:** If the user has already submitted a testimonial, it is displayed:
  - Testimonial text / details
  - Star rating display
  - Submission date
  - A note that only one testimonial can be submitted per account
- **Submission Form:** For users who have not yet submitted:
  - Name field (auto-filled from profile)
  - Testimonial text area
  - Submit button with loading state
  - Success message on submission
  - Error message on failure with inline server error details
  - Validation: both fields required
- Skeleton loading state while fetching existing testimonial

**Public Testimonials (Homepage):**
- A curated list of testimonials pulled from the API
- Displayed as styled cards with client name, review text, and rating

---

### 4.17 Neighborhoods

**Neighborhoods Page (`/neighborhoods`):**
- Visual grid of all neighborhoods managed by the agent
- Each neighborhood card:
  - Full-bleed background image
  - Neighborhood name (text overlay)
  - Description / highlights
  - Clickable to a neighborhood detail page
- **Live search/filter** — client-side search across:
  - Neighborhood name
  - City
  - Description text
- Skeleton loading (6 placeholder cards while loading)
- Staggered entrance animation on load (CSS animation delay per card)

**Neighborhood on Homepage:**
- A featured subset display in the homepage neighborhoods section
- `NeighborhoodHomeCard` component used for the homepage display

---

### 4.18 Blog / News

**Blog List Page (`/blog`):**
- Grid of blog articles (6 per page)
- Each blog card:
  - Full-bleed image background
  - Category label
  - Article title
  - Subtitle / excerpt
  - Author name
  - Publication date
- **Pagination** — numbered page navigation
- **Client-side search** — filters visible cards across title, subtitle, content, author, category
- Skeleton loading (6 placeholder cards + 5 pagination skeleton circles while loading)

**Featured Articles Section:**
- A highlighted section for "featured" or "trending" articles
- Separate `FeaturedArticleList` and `FeaturedNewsList` components

**Single Blog Post:**
- Full article content
- Article banner image (`SingleBlogBanner`)
- Structured content body (`SingleBlogContent`)

---

### 4.19 About Us / Agent Bio

**About Us Page (`/about-us`):**

**Hero Section:**
- Background image with dark gradient overlay
- Animated grid background pattern (gold tint)
- Radial gold glow overlay for depth
- "ABOUT ME" badge in uppercase with gold border
- Agent's full name as the H1
- Agent's short description / tagline

**Stats Bar (3 achievement cards):**
- 20+ Years Experience
- 500+ Properties Sold
- Trusted Advisor
- Each card has a gold icon, bold title, and description
- All content can be customized via the agent's CMS profile

**Agent Bio Section:**
- Agent profile photo (full portrait)
- Long-form bio text (`longDescription` from the agent API)
- Dynamic — all content pulled from the backend per agent

**Social Links:**
- Facebook, Instagram, Twitter, LinkedIn, YouTube
- Displayed as icon links

**Featured Properties Section:**
- A curated selection of the agent's featured/premium listings
- `FeaturedPropertyList` component with `FeaturedProperties` sub-component

---

### 4.20 Connect / Contact Page

**Connect Page (`/connect`):**

**Contact Form:**
- First name + Last name
- Email address
- Phone number
- Message (free text area)
- **CAPTCHA validation** — custom text-based CAPTCHA displayed before submit
  - CAPTCHA appears after the user starts filling the form
  - Must match the displayed code to submit
- TCPA/Privacy consent checkbox (required)
- Auto-fills from logged-in user profile data
- Submit sends to `/v1/enquiry` API
- Toast notifications on success / failure

**Agent Information Panel:**
- Agent name (dynamic from context)
- Short description / tagline
- Full address (structured: address_1, address_2, city, state, zip, country)
- Email address with envelope icon
- Map pin icon for address
- Social media icon links:
  - Facebook
  - Instagram
  - Twitter
  - LinkedIn
  - YouTube

---

### 4.21 Newsletter Subscription

Available site-wide in the footer or as a standalone section.

- Email address input field
- **Real-time email validation** (regex pattern validation as the user types)
- Input border turns green for valid email, shows inline error for invalid
- TCPA / Privacy consent checkbox (required before subscribing)
- Consent error message if checkbox is not checked
- Auto-fills email from logged-in user profile
- On success: clears form, shows success toast
- On error: shows error toast with server message

---

### 4.22 Sell Enquiry Modal

Triggered from the homepage "Sell My Home" CTA button.

**Form Fields:**
- First name + Last name
- Email address
- Phone number
- Property address
- City
- State
- ZIP code
- "When do you want to sell?" selector (timeline dropdown)
- TCPA consent checkbox
- Auto-fills from logged-in user profile

All fields styled with a transparent background, bottom-border-only input style for a clean, premium look.

---

### 4.23 Agent Branding System

RealtiPro is a **white-label platform** — every agent deployment is fully branded to that agent.

**How it works:**
- A global `SocialUrlFetcher` component runs on every page load
- Fetches the agent's profile data from `/social_urls?lagnt={agentUUID}` API
- Populates a global `NameContext` (React Context) accessible throughout the entire app

**Data populated globally:**
- `name` — Agent's full name (displayed in header, footer, about us, connect page, etc.)
- `shortDescription` — One-line tagline
- `longDescription` — Full bio text
- `company_logo` — Company/agency logo image URL
- `company_name` — Brokerage or agency name
- `profile_image` — Agent headshot photo URL
- `email` — Agent email address
- `phone` — Agent phone number
- `address` — Agent/office address
- `socialUrls` — Object containing:
  - `facebook`
  - `instagram`
  - `twitter`
  - `linkedin` / `linked_in`
  - `youtube`
  - `email`

**Effect on the UI:**
- Header shows the company logo (with skeleton while loading)
- Footer shows the agent name, description, social links, and logo
- About Us page shows the full agent bio and profile image
- Connect page shows the agent's address and social links
- All enquiry forms attributed to the correct agent

---

### 4.24 Layout & Navigation

**Header:**
- Fixed/sticky to the top — background becomes opaque on scroll (transparent when at top)
- Company logo (with skeleton loading)
- Navigation links (Home, Properties, Neighborhoods, Blog, About, Connect)
- Auth-aware: shows "Login / Register" buttons when logged out, "Dashboard" when logged in
- **Mobile hamburger menu:**
  - Slides in full-screen overlay menu
  - Body scroll locked while open (position:fixed technique to prevent scroll jump)
  - Restores scroll position on close
  - All nav links accessible on mobile
- Login Modal, Registration Modal, and Forgot Password Modal all accessible directly from the header
- Scroll detection: `window.scrollY > 10` triggers scrolled state

**Footer:**
- Company logo
- Agent name and short description
- Navigation links
- Social media icon links (Facebook, Instagram, Twitter, LinkedIn, YouTube)
- Legal links: Privacy Policy, Terms of Service
- Copyright

**Dashboard Header:**
- Separate header for dashboard pages
- Shows current page context

**Dashboard Sidebar:**
- Persistent left sidebar (desktop)
- "R" logo mark + "Dashboard" label
- Navigation buttons: Favourites, Saved Searches, Testimonial, Profile
- Active state: gold left-border indicator + active icon variant
- Footer divider + copyright

---

### 4.25 Legal & Compliance Pages

**Privacy Policy (`/privacy-policy`):**
- Property ownership & copyright statement
- IDX data usage policy (MLS rules, consumer use restrictions, no commercial reproduction)
- DMCA notice and process
- Contact information: RealtiPro Corp, 22722 29th DR SE, STE 100, Bothell, 98021 / legal@realtipro.com

**Terms of Service (`/terms-of-service`):**
- Platform usage terms

**TCPA Consent Disclaimer:**
Included on every form across the platform:
> *"By submitting your phone number, you provide your express written consent to receive calls and text messages, including marketing communications, at the number you entered. Your consent is not a condition of purchasing any goods or services. Message and data rates may apply depending on your mobile carrier. You may opt out at any time by replying STOP to any text message. This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply."*

---

## 5. Advanced Search Filter Parameters

The MLS Advanced Search drawer (`MLSAdvanceSearch.tsx`) exposes granular filtering for power users.

### Basic Filters
| Filter | Options |
|---|---|
| **Property Type** | Business Opportunity, Commercial Sale, Apartment, Condo, Villa, Townhouse, Penthouse, Single Family, Multi-Family, Land, Mobile Home, Farm |
| **Property Status** | Active, Active with Contingency, Pending |
| **For** | Sale / Rent |
| **Price Range** | Min / Max (full range of dollar values) |
| **Bedrooms** | Min / Max (numeric) |
| **Bathrooms** | Min / Max (numeric) |

### MLS-Specific Filters
| Filter | Options |
|---|---|
| **Square Footage** | 750 — 10,000+ sq ft (20 preset options, min/max range) |
| **Lot Size** | 2,000 sq ft — 100 acres (16 preset options, min/max range) |
| **Year Built** | 1900 — 2026 (23 preset options, min/max range) |
| **Garage Spaces** | 1, 2, 3, 4, 5, 6+ |
| **Stories** | 1, 2, 3, 4, 5+ |
| **Basement** | None, Partial, Full, Finished, Unfinished, Walk-out |
| **Sewer** | Public Sewer, Septic Tank, Cesspool, None |
| **Annual Tax** | Max annual tax threshold |
| **City** | Free-text MLS city |
| **State** | Free-text MLS state |
| **ZIP Code** | Free-text ZIP |
| **School District** | Text search |
| **Builder Name** | Text search |
| **List Agent** | Text search |

### Listing Attributes
| Filter | Options |
|---|---|
| **Construction Status** | Ready to Move, Under Construction, Pre-Launch, Off Plan |
| **Furnishing** | Furnished, Semi-Furnished, Unfurnished |
| **Available From** | Date picker |
| **Special Flags** | Premium, Exclusive, Price on Request, Rented |

### Amenities & Features (Multi-Select Tag Groups)

**Community Amenities (20 options):**
Swimming Pool, Gym / Fitness Center, Clubhouse, Gated Access / Security, Children's Play Area / Park, Tennis Courts, Basketball Courts, Golf Course, Jogging/Walking Trails, BBQ / Picnic Area, Community Garden, Business Center, Elevator, Rooftop Deck, Covered Parking / Guest Parking, Pet Area / Dog Park, Lake / Waterfront Access, Marina / Boat Docks, Sauna / Spa / Hot Tub, On-site Maintenance or Management

**Property Views (21 options):**
Ocean View, Beach View, Lake View, Mountain View, City View / Skyline View, Golf Course View, Park / Greenbelt View, Water View (General), River / Canal View, Desert View, Pool View, Courtyard View, Garden View, Hills View, Panoramic View, Bay View, Harbor View, Marina View, Forest / Woods View, Pasture View, No View / None

**Interior Features (44 options):**
Hardwood Floors, Carpet, Tile Floors, Marble Floors, Granite Countertops, Quartz Countertops, Stainless Steel Appliances, Built-in Appliances, Walk-in Closet, Master Suite, En-suite Bathroom, Jacuzzi Tub, Walk-in Shower, Double Vanity, Kitchen Island, Breakfast Nook, Formal Dining Room, Family Room, Home Office, Mudroom, Laundry Room, Pantry, Wine Cellar, Home Theater, Game Room, Exercise Room, Library/Study, Fireplace, Ceiling Fans, Recessed Lighting, Crown Molding, Bay Windows, Skylights, French Doors, Sliding Glass Doors, Central Air Conditioning, Central Heating, Smart Home Features, Security System, Elevator, Loft, Basement, Attic, Storage Space

**Site Features (15 options):**
Corner Lot, Cul-de-Sac, Waterfront, Greenbelt, Paved Road, Private Driveway, Fenced Yard, Swimming Pool, Outdoor Kitchen, Deck / Patio, Solar Panels, Sprinkler System, Fruit Trees, Shed / Workshop, Guest House / ADU

**Lot Features (12 options):**
Flat / Level, Sloped, Wooded, Open, Cleared, Flood Zone, Easement, Corner, Irregular Shape, Rectangular, Oversized, Pie-shaped

---

## 6. API & Backend Integration

### Base URL Configuration
- **Server-side (SSR):** `NEXT_API_BASE_URL` — direct backend URL (e.g., `http://145.223.121.84:8081/api`)
- **Client-side (browser):** `NEXT_PUBLIC_API_BASE_URL=/api` — proxied through Next.js rewrites
- All `/api/*` requests are transparently rewritten to the upstream backend
- This means no CORS issues and no backend URL exposed to the browser

### Authentication Headers
- All API calls use an Axios instance (`Api.tsx`) with interceptors
- The JWT `access_token` from `sessionStorage` is automatically attached as `Authorization: Bearer <token>` on every private request

### API Endpoints by Module

**Authentication:**
- `POST /customer/login` — login
- `POST /customer/register` — register
- `POST /customer/forgot-password` — password reset request
- `POST /customer/reset` — password reset with token
- `POST /customer/logout` — logout (invalidates token server-side)
- `GET /customer/profile` — get logged-in user profile
- `POST /customer/profile` — update profile (supports multipart/form-data for photo upload)

**Properties / MLS:**
- `GET /v1/properties` — basic property list (paginated, with search by title)
- `GET /v1/properties/featured-properties` — featured properties for homepage
- `GET /v1/properties/search` — full MLS search with all filter parameters
- `GET /v1/property/listingkey/{id}` — single property by MLS listing key
- `POST /v1/property/visit` — track property view
- `POST /v1/property/wishlist` — add to wishlist
- `DELETE /v1/customer/property/wishlist/{id}` — remove from wishlist
- `GET /v1/customer/property/wishlist` — get user's wishlist
- `POST /v1/property/saved-search` — save a search
- `GET /v1/saved-search` — get user's saved searches

**Neighborhoods:**
- `GET /v1/neighborhoods` — full neighborhood list

**Blog:**
- `GET /v1/blogs` — paginated blog list
- `GET /v1/blogs/{id}` — single blog post

**Testimonials:**
- `GET /v1/testimonials` — public testimonials list
- `GET /v1/user/testimonial` — user's own testimonial
- `POST /v1/testimonial` — submit testimonial

**General:**
- `POST /v1/newsletter` — newsletter subscription
- `POST /v1/enquiry` — general or property-specific enquiry form submission
- `GET /social_urls?lagnt={uuid}` — agent profile data (name, bio, logo, social URLs)
- `GET /v1/search/autocomplete` — location autocomplete suggestions

### Agent UUID
Every major API call is scoped to the agent via the query param `lagnt={NEXT_PUBLIC_REALTY_PRO_AGENT_ID}`, ensuring data isolation between agent deployments on the same backend.

---

## 7. Infrastructure & Deployment

### Deployment Options
| Platform | Configuration File | Notes |
|---|---|---|
| **Vercel** | `vercel.json` | Primary deployment; Next.js standalone output |
| **Firebase Hosting** | `firebase.json` | Alternative deployment option |

### Build & Run
```bash
npm run dev       # Development server
npm run build     # Production build (standalone output)
npm run start     # Start production server
npm run export    # Static export
npm run lint      # ESLint check
```

### Next.js Configuration (`next.config.ts`)
- `output: 'standalone'` — self-contained build artifact
- `reactStrictMode: true`
- API proxy rewrites: `/api/*` → `NEXT_API_BASE_URL/*`
- Allowed remote image domains:
  - `storage.googleapis.com` (Google Cloud Storage)
  - `demorealestate.webnapps.net`
  - `demorealestate2.webnapps.net`
  - `adminapi.realtipro.com` (HTTP + HTTPS)
  - `cdn.realtipro.com`
  - `images.unsplash.com`
  - `dor1non99fv9y.cloudfront.net` (AWS CloudFront CDN)

### Firebase Cloud Functions (`functions/`)
- Separate TypeScript project in `functions/`
- `functions/src/index.ts` — main cloud functions entry point
- Handles server-side logic that runs outside the Next.js app

### Environment Variables
| Variable | Purpose |
|---|---|
| `NEXT_API_BASE_URL` | Server-side backend URL (not exposed to client) |
| `NEXT_PUBLIC_API_BASE_URL` | Client-side API path (`/api`) |
| `NEXT_PUBLIC_REALTY_PRO_AGENT_ID` | Agent UUID scoping identifier |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps / Places API key |
| `NEXT_PUBLIC_LISTING_AGENT_LOGO_URL` | MLS NWMLS logo image path |
| `NEXT_PUBLIC_BLOG_NO_IMAGE` | Fallback image for blog cards |
| `NEXT_PUBLIC_NEIGHBORHOOD_NO_IMAGE` | Fallback image for neighborhoods |
| `NEXT_PUBLIC_SOCIAL_API_BASE_URL` | Base URL for agent social/branding API |

---

## 8. UI/UX Design System

### Color Palette
| Color | Hex | Usage |
|---|---|---|
| **Gold / Accent** | `#EDB75E` | Primary CTA buttons, active states, icons, highlights, borders |
| **Dark Gold** | `#e0a94e` | Button hover state |
| **Black** | `#000000` | Main page background |
| **Near Black** | `#0a0a0a` | Card backgrounds |
| **Dark Grey 1** | `#171717` | Dashboard background |
| **Dark Grey 2** | `#202020` | Dashboard card/panel background |
| **Dark Grey 3** | `#3B3B3B` | Borders in dashboard |
| **Dark Grey 4** | `#4E4E4E` | Input borders |
| **Muted Text** | `#ADADAD` | Secondary/helper text |
| **White** | `#ffffff` | Primary text |
| **Success Green** | `#22c55e` | Favorites added, success toasts |
| **Error Red** | `#ef4444` | Error states, validation messages |

### Typography
- **Body text:** Lato (sans-serif) — weights 300, 400, 700, 900
- **Display / Headings:** Playfair Display (serif) — regular, bold, italic
- CSS variables: `--font-lato`, `--font-playfair`

### Design Style
- **Dark luxury real estate aesthetic** — dark backgrounds with warm gold accents
- Flat/geometric buttons (no border-radius on primary CTAs)  
- Clean, whitespace-generous layouts
- Grid-based property listing layouts
- Skeleton loaders that exactly match content shapes (no generic spinners)
- Staggered entrance animations for list items
- Smooth hover transitions throughout

### Responsive Breakpoints
- Mobile-first approach
- Full mobile-menu implementation
- Dashboard has separate mobile/desktop layouts
- Property grid adapts columns based on viewport

### Loading States
Every data-fetching page and component has a matching skeleton loading UI including:
- Property card skeletons (image placeholder + text lines)
- Blog card skeletons
- Neighborhood card skeletons
- Pagination skeleton circles
- Profile page skeletons
- Saved searches skeletons

---

## 9. Security & Data Handling

### Authentication Security
- JWT tokens only stored in `sessionStorage` (not `localStorage`) — cleared on browser tab close
- Authorization header auto-injected on private API calls
- Server-side logout invalidates the token on the backend

### Form Security
- TCPA consent checkbox required on all lead-capture forms before submission
- Custom CAPTCHA on the Connect page form
- Client-side validation before API call on all forms
- Server error messages surfaced inline to the user

### API Security
- All client-facing API calls routed through the Next.js proxy (`/api/*`)
- The actual backend URL (`NEXT_API_BASE_URL`) is a server-only environment variable — never exposed to the browser
- Agent UUID scoping prevents cross-agent data leakage

### GDPR / Privacy
- Privacy Policy page fully documents IDX data usage, DMCA process, and contact information
- All marketing consent is ticbox-gated (opt-in, not pre-checked)
- Users can opt out of SMS at any time (STOP instruction on all forms)

---

## 10. All Modules & Components Index

### Pages (`src/app/`)
- `layout.tsx` — Root layout (fonts, providers, body)
- `page.tsx` — Root redirect
- `home/page.tsx`
- `properties/page.tsx`
- `properties/[id]/page.tsx`
- `neighborhoods/page.tsx`
- `blog/page.tsx`
- `blog/[id]/page.tsx`
- `about-us/page.tsx`
- `connect/page.tsx`
- `collection/page.tsx`
- `collection/favourites/page.tsx`
- `saved-searches/page.tsx`
- `market-report/page.tsx`
- `profile/page.tsx`
- `testimonial/page.tsx`
- `login/page.tsx`
- `register/page.tsx`
- `forgot-password/page.tsx`
- `reset-password/page.tsx`
- `privacy-policy/page.tsx`
- `terms-of-service/page.tsx`

### Main Page Containers (`src/main-pages/`)

**Home:**
- `SearchContainer.tsx` — Hero search with tabs, autocomplete, dropdowns
- `PropertyHomeList.tsx` — Featured property grid on homepage
- `NeighborhoodHomeList.tsx` — Neighborhood preview on homepage
- `TestmonialList.tsx` — Testimonials section on homepage
- `NewsArticleList.tsx` — Blog articles on homepage
- `SellEnquiryModal.tsx` — "Sell My Home" form modal

**MLS Search:**
- `MlsSearchHomePage.tsx` — Full MLS search page orchestrator

**Properties:**
- `PropertyList.tsx` — Standard property list view

**Single Property:**
- `SinglePropertyPage.tsx` — Single listing page with visit tracking

**Neighborhoods:**
- `NeighborhoodList.tsx` — Full neighborhood browse list

**Blog:**
- `BlogList.tsx` — Paginated blog list
- `FeaturedArticleList.tsx` — Featured articles section
- `FeaturedNewsList.tsx` — Featured news grid
- `SingleBlog.tsx` — Individual blog post

**About Us:**
- `AboutUsMain.tsx` → `AboutUsPage.tsx` — Full about page
- `AboutUsBanner.tsx` — Hero banner
- `AboutUsTextSection.tsx` — Bio text section
- `AboutUsVideo.tsx` — Video embed section
- `FeaturedProperties.tsx` / `FeaturedPropertyList.tsx` — Agent's featured listings

**Connect:**
- `ConnectMainPage.tsx` — Contact form + agent info

**Auth:**
- `LoginPage.tsx` / `LoginModal.tsx`
- `RegistrationPage.tsx` / `RegistrationModal.tsx` / `Registration.tsx`
- `ForgotPasswordPage.tsx` / `ForgotPasswordModal.tsx`
- `ResetPasswordPage.tsx`

**Dashboard:**
- `FavouritesPage.tsx`
- `SavedSearchesPage.tsx`
- `MarketReportPage.tsx`
- `Profile.tsx`
- `TestimonialPage.tsx`
- `MyAgent.tsx`
- `ChatInterface.tsx`
- `ChatInterfaceAdvanced.tsx`
- `ChatInterfaceMobile.tsx`

### Shared Components (`src/component/`)

**Sharable:**
- `Header.tsx` — Global header with mobile menu, auth modals, scroll detection
- `Footer.tsx` — Global footer with social links and logo
- `DashboardHeader.tsx` — Dashboard-specific header
- `Sidebar.tsx` — Dashboard left navigation sidebar
- `NewsLetter.tsx` — Email subscription widget
- `FormDisclaimer.tsx` — TCPA consent checkbox component

**MLS Search Menu:**
- `filterTop.tsx` — Top filter bar with quick filters
- `MLSAdvanceSearch.tsx` — Full advanced search drawer
- `MlsListingOptions.tsx` — View mode toggle toolbar with tooltips
- `MlsPropertyCard.tsx` — Property card for MLS search results
- `MlsPropertyPage.tsx` — MLS property grid
- `MlsPropertyMapPage.tsx` — Split map + grid layout
- `MlsMpPage.tsx` — Full map view
- `MlsMap.tsx` — Google Maps component with price markers
- `MlsMapModalCard.tsx` — Popup card on map marker hover
- `LocationSearch.tsx` — Location autocomplete input
- `MLSToolbar.tsx` — Toolbar component

**Properties (Detail):**
- `PropertyCard.tsx` — Universal property card (list + favorites)
- `SinglePropertyDetails.tsx` — All property info, mortgage calculator, actions
- `SinglePropertyImageSection.tsx` — Hero image and gallery strip
- `ImageGalleryModal.tsx` — Full-screen image lightbox
- `PropertyEnquiryModal.tsx` — Tour request + enquiry form
- `SharePopup.tsx` — Social sharing overlay
- `LocalInformation.tsx` — Google Maps nearby amenities

**Neighborhood:**
- `NeighborhoodHomeCard.tsx` — Neighborhood card for list view

**Blog:**
- `BlogListCard.tsx` — Blog post card
- `FeaturedNewsListCard.tsx` — Featured news card
- `SingleBlogBanner.tsx` — Blog hero banner
- `SingleBlogContent.tsx` — Blog article body

**Home:**
- `EnquiryModal.tsx` — General enquiry form modal
- `NewsArticleCard.tsx` — News card on homepage
- `TestimonialCard.tsx` — Testimonial card

**Dashboard:**
- `EditProfileModal.tsx` — Profile edit form modal

### Global Context & Providers
- `NameProvider.tsx` — Global React Context for agent branding data
- `SocialUrlFetcher.tsx` — Fetches agent data on app load and populates context
- `QueryClientProvider.tsx` — TanStack React Query provider
- `GoogleMapProvider.tsx` — Google Maps API loader provider

### Services (`src/services/`)
- `Api.tsx` — Axios instance with auth interceptor
- `auth/AuthServices.tsx` — Login, register, forgot/reset password, enquiry, newsletter
- `properties/PropertyServices.tsx` — MLS search, property fetch, wishlist, saved searches
- `properties/PropertyQueries.tsx` — TanStack Query hooks for properties
- `search/AutocompleteServices.tsx` — Location autocomplete
- `search/AutocompleteQueries.tsx` — Autocomplete query hooks
- `neighborhood/NeighborhoodServices.tsx` — Neighborhood data
- `neighborhood/NeighborhoodQueries.tsx` — Neighborhood query hooks
- `blog/BlogServices.tsx` — Blog list and single post
- `blog/BlogQueries.tsx` — Blog query hooks
- `testimonial/TestimonialServices.tsx` — Testimonial CRUD
- `testimonial/TestmonialQueris.tsx` — Testimonial query hooks
- `profile/ProfileServices.tsx` — Profile fetch, update, logout, wishlist
- `profile/ProfileQueries.tsx` — Profile query hooks

### Type Definitions (`src/types/`)
- `Property.tsx` — `SearchFilters`, `FilterTopProps`, `MLSAdvanceSearchProps`
- `User.tsx` — `UserProfile`
- `Blog.tsx` — `Blog` type
- `Enquiry.tsx` — Enquiry form types
- `Tesimonials.tsx` — Testimonial type

### Helpers & Utilities (`src/helpers/`)
- `apiBaseUrl.ts` — Returns the correct API base URL based on environment (client vs server)
- `DateConverters.tsx` — Date formatting utilities

---

*This document was generated from a full analysis of the RealtiPro codebase as of April 2026.*  
*For technical queries, refer to the source code. For business queries, contact the product team.*
