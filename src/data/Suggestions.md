Optimizing these JSON schemas for modern web development requires restructuring them to align with standard architectural patterns used in modern web frameworks (such as Next.js, Astro, Nuxt, or Remix).

Currently, the data suffers from **redundancy and state conflicts** (e.g., conflicting team member experience metrics and conflicting project statistics across files), **unoptimized routing hooks** (using numeric IDs instead of human-readable slugs), and **mixed structural concerns** (hardcoding UI layout strings within global corporate schemas).

The following architectural optimizations, file structures, and refactored schemas resolve these challenges to deliver an elite web development experience.

---

### Part 1: Strategic JSON Optimizations

#### 1. Data Normalization & Single Source of Truth

- **The Problem:** There are severe consistency issues in the current data. In `team.json`, individual profiles are duplicated across `"Board of Directors"` and `"Who We Are"`, leading to conflicting data (e.g., Er. Mani Raj Dahal is listed with both $25+$ and $26+$ years of experience; Dr. Chhatra Basnet has $12+$ vs $18+$ years). Similarly, operational metrics contradict each other across `company.json` (Completed Projects: $50$), `statistics.json` (Completed Projects: $60+$), and `team.json` (Team Members: $50+$ vs $40+$ in statistics).
- **The Fix:** Flatten entities into unified "Collections" where each entity exists exactly once. Use relations (like lists of structural IDs or string category tags) to populate layout variations or dynamic groups.

#### 2. SEO & Clean Routing via Slugs

- **The Problem:** Using sequential numeric IDs (`"id": 1`) results in low-quality web URLs such as `/projects/1` or `/services/2`.
- **The Fix:** Replace or augment numeric keys with an URL-friendly `slug` parameter (e.g., `"slug": "kabeli-b-hep"` or `"slug": "solar-energy"`). This enables automated, human-readable routing pipelines for static site generation (SSG) or dynamic server rendering.

#### 3. Separating Structural Domains

To maintain clean codebases, content files must be strictly partitioned into three types:

- **Global Layout Configs:** Data persistent across the entire view hierarchy (e.g., navigation nodes, global corporate contact metrics, tracking elements).
- **Page Content Configs:** Single-instance static page headers, hero text blocks, and specific marketing taglines.
- **Collections:** Relational or queryable uniform content modules mapped to dedicated layout components (e.g., separate files or query structures for Projects, Services, and Articles).

#### 4. Asset Accessibility and Type Standardization

- **The Problem:** Current image strings use deep, unoptimized WordPress system directory hashes, lack accessibility hooks, and feature fragmented date layouts (ranging from standard years to localized sub-strings).
- **The Fix:** Enforce clear asset conventions with mandatory image configurations containing a explicit source URL (`src`) and an alternate description (`alt`) tag for SEO and screen-reader compliance. Enforce a unified ISO-8601 string layout for all time metrics.

---

### Part 2: Optimized Project File Structure

By separating content data from presentation layers, we can organize a highly efficient data store directory. This layout can sit inside a web framework repository (like a Next.js `/public` layout or an `/assets/data` source) or serve as the structured output mapping for a Headless CMS API:

```text
src/
└── data/
    ├── global/
    │   ├── site-config.json         # Master settings: Identity, branding assets, social configurations
    │   ├── navigation.json          # Top-nav arrays, call-to-actions, and footer dynamic paths
    │   └── contact.json             # Office addresses, operational hours, active coordinate sets
    ├── pages/
    │   ├── home.json                # Homepage marketing copy (Hero definitions, impact metrics layout)
    │   ├── about.json               # About page static structures (Mission, vision, core engineering values)
    │   └── careers.json             # Career text nodes (Join team requirements, benefits breakdown)
    └── collections/
        ├── team/                    # Unified team registry (Single profile records with categorical groupings)
        │   └── registry.json
        ├── services/                # Specialized service modules mapped directly to product lines
        │   ├── hydropower.json
        │   ├── solar-energy.json
        │   ├── environment.json
        │   └── infrastructure.json
        ├── projects/                # Production project records (Engineering metrics, active timelines)
        │   ├── kabeli-b-hep.json
        │   ├── jogmai-khola-shp.json
        │   └── seti-khola-hydro.json
        ├── news-events/             # Timeline announcements, corporate releases, and seminar events
        │   └── feed.json
        ├── gallery.json             # Flat digital asset index with structural search tags
        └── downloads.json           # Indexed corporate PDFs, compliance guides, and engineering standards

```

---

### Part 3: Concrete Refactored Schema Specifications

Below are fully optimized blueprints demonstrating how the unorganized source files merge into clean, production-ready schemas.

#### 1. Global Setup (`src/data/global/site-config.json`)

Consolidates corporate layout details, matching the branding rules established in the company profile:

```json
{
  "siteId": "cec-nepal",
  "meta": {
    "name": "Clean Energy Consultants Pvt. Ltd.",
    "shortName": "CEC Nepal",
    "tagline": "From Nature to Nation: Clean Energy for All",
    "description": "Nepal's leading hydropower and renewable energy consultancy firm.",
    "foundedYear": 1999
  },
  "assets": {
    "favicon": "/images/branding/favicon.png",
    "logoUrl": "/images/branding/cec-logo.png",
    "logoAlt": "Clean Energy Consultants Logo"
  },
  "socialMedia": {
    "facebook": "https://facebook.com/cecnepal",
    "linkedin": "https://linkedin.com/company/cecnepal",
    "twitter": "https://twitter.com/cecnepal",
    "instagram": "https://instagram.com/cecnepal"
  }
}
```

#### 2. The Team Repository (`src/data/collections/team/registry.json`)

Normalizes human resources. Profiles are declared once, removing redundant structural arrays and conflicting work history rows. Layouts filter by properties within the fields:

```json
{
  "members": [
    {
      "slug": "mani-raj-dahal",
      "name": "Mr. Mani Raj Dahal",
      "credentials": "MSc, BE",
      "education": "MSc Hydraulic Engineering & River Basin Development (IHE Delft, Netherlands), BE Civil Engineering (IOE Pulchowk)",
      "totalYearsExperience": 26,
      "expertise": ["Hydropower", "Hydraulics"],
      "image": {
        "src": "/images/team/mani-raj-dahal.jpg",
        "alt": "Mr. Mani Raj Dahal - Executive Chairman and Hydropower Expert"
      },
      "assignments": {
        "isBoardMember": true,
        "isExpertStaff": true,
        "boardDesignation": "Executive Chairman",
        "staffDesignation": "Hydropower and Hydraulics Expert"
      },
      "bio": "Founder and Director of Clean Energy Consultants Pvt. Ltd., specializing in river basin development and technical project consultation across major regional installations."
    },
    {
      "slug": "chhatra-basnet",
      "name": "Dr. Chhatra Basnet",
      "credentials": "PhD, MSc, BE",
      "education": "PhD Rock Mechanics (NTNU Norway), MSc Hydropower Development (NTNU Norway), BE Civil (IOE Pulchowk)",
      "totalYearsExperience": 18,
      "expertise": ["Tunneling", "Geotechnical Engineering"],
      "image": {
        "src": "/images/team/chhatra-basnet.jpg",
        "alt": "Dr. Chhatra Basnet - CEO and Geotechnical Expert"
      },
      "assignments": {
        "isBoardMember": true,
        "isExpertStaff": true,
        "boardDesignation": "Director / Chief Executive Officer",
        "staffDesignation": "Tunneling and Geotechnical Expert"
      },
      "bio": "Drives strategic corporate direction while introducing advanced sub-surface design and rock mechanics workflows to rugged Himalayan layouts."
    }
  ]
}
```

#### 3. Individual Project Routing Template (`src/data/collections/projects/seti-khola-hydro.json`)

Extracting separate files for large profiles accelerates web compilation by allowing applications to ingest only the required component payload on static sub-pages:

```json
{
  "slug": "seti-khola-hydropower",
  "name": "Seti Khola Hydropower Project",
  "developer": "Seti Khola Hydropower Pvt Ltd",
  "status": "feasibility",
  "location": "Pokhara Metropolitan City-33, Kaski",
  "categories": ["Detail Engineering Design", "Feasibility Study"],
  "description": "A significant run-of-river (RoR) hydropower project located in the Kaski district utilizing advanced tunnel alignments and high-efficiency Francis turbines.",
  "image": {
    "src": "/images/projects/seti-khola.jpg",
    "alt": "Topographic map view of the proposed Seti Khola Hydropower layout"
  },
  "metrics": {
    "capacityMW": 22.0,
    "headHeightMeters": 68.5,
    "designDischargeM3s": 39.93,
    "annualDeemedEnergyGWh": 133.432
  },
  "technicalSpecs": {
    "turbineType": "2 Units of Francis Turbine",
    "weir": "30 m length, 12 m height (Barrage)",
    "intake": "4 orifices each 5.75 m x 2.8 m",
    "desander": "2 units; 64 m x 13 m x 6 m (Surface)",
    "headrace": "3151 m length, 5.8 m diameter (Tunnel)",
    "penstock": "1500 m length, 4 m diameter (Pipe)",
    "transmissionLine": "3 km length, 132 kV LILO"
  },
  "timeline": [
    {
      "phase": "Survey & Investigation",
      "year": "2021",
      "status": "completed"
    },
    { "phase": "Feasibility Study", "year": "2022", "status": "completed" },
    { "phase": "Detailed Design", "year": "Ongoing", "status": "active" }
  ]
}
```

#### 4. The Unified Layout Configuration (`src/data/pages/home.json`)

Consolidates scattered landing-page arrays and structures analytics targets into uniform, easily queryable types:

```json
{
  "hero": {
    "badge": "Engineering Excellence Since 2006",
    "titlePrefix": "Developing Clean",
    "titleHighlight": "Energy Solutions",
    "titleSuffix": "for Generations",
    "subtitle": "Leading national consultancy for Hydropower, Solar, and Infrastructure development in Nepal.",
    "ctas": {
      "primary": { "label": "Explore Services", "target": "/services" },
      "secondary": { "label": "Consult with Experts", "target": "/contact" }
    }
  },
  "impactMetrics": [
    {
      "id": "proj-comp",
      "label": "Projects Completed",
      "value": 60,
      "suffix": "+"
    },
    {
      "id": "mw-dev",
      "label": "MW Capacity Developed",
      "value": 1000,
      "suffix": "+"
    },
    {
      "id": "team-size",
      "label": "Active Team Members",
      "value": 40,
      "suffix": "+"
    },
    {
      "id": "exp-years",
      "label": "Years of Market Experience",
      "value": 25,
      "suffix": "+"
    }
  ]
}
```

### Key Gains for Web Engineering:

1. **Developer Velocity:** Front-end engineering components can map directly to clean TypeScript interfaces without parsing arbitrary typography formats (e.g., converting text-based layout strings like `"1,000+"` back to workable numbers).
2. **Optimal Build Assets:** Standardized image models enable rapid drop-in integration with performant picture components (like Next.js `<Image />` or Astro `<Image />`) to handle automated web-optimization scaling.
3. **Data Integrity:** Centralizing core indicators ensures that updating corporate metrics inside a single config module instantly populates changes across header cards, landing views, and footer instances.
