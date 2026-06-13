import siteConfig from '../data/global/site-config.json';
import contactConfig from '../data/global/contact.json';

/**
 * homeService.ts
 *
 * Generic home-page data service.
 * The caller (Home.js) is responsible for importing/fetching the raw JSON
 * and passing it here. This keeps the service decoupled from any specific
 * file path or URL.
 */

export interface ExperienceObject {
  joinDate?: string | number;
  recruitmentType?: string;
  more_info?: string;
}

export interface MemberAssignment {
  categories?: string[];
  designation?: string;
  meta?: Record<string, string>;
  ordering?: number;
}

export interface Member {
  name: string;
  image?: string;
  experience?: string | ExperienceObject;
  more_info?: string;
  assignments?: MemberAssignment;
  designation?: string;
  _primaryCatIndex?: number;
  _ordering?: number;
  [key: string]: any;
}

export interface TeamJson {
  members?: Member[];
  tabs?: Array<{
    label: string;
    categories: string[];
  }>;
}

const calculateExperience = (joinDate: string | number | undefined, recruitmentType: string | undefined): string => {
  if (!joinDate) return "";
  const joinYear = parseInt(String(joinDate).substring(0, 4));
  if (isNaN(joinYear)) return "";
  const currentYear = 2026;
  const years = currentYear - joinYear;
  let yearsStr;
  if (years === 0) {
    yearsStr = "Less than a year";
  } else if (years === 1) {
    yearsStr = "1 year";
  } else {
    const isConsultant = recruitmentType === "Consultant";
    yearsStr = isConsultant ? `${years}+ years` : `${years} years`;
  }
  return recruitmentType ? `${yearsStr}, ${recruitmentType}` : yearsStr;
};

const mapExperienceDetails = (m: Member): { experience: string; more_info: string } => {
  if (m.experience && typeof m.experience === 'object') {
    const { joinDate, recruitmentType, more_info } = m.experience as ExperienceObject;
    return {
      experience: calculateExperience(joinDate, recruitmentType),
      more_info: more_info || ""
    };
  }
  return {
    experience: (m.experience as string) || "",
    more_info: m.more_info || ""
  };
};

export const getTeamCategories = (teamJson: TeamJson | undefined): Record<string, Member[]> => {
  if (!teamJson) return {};
  const members = (teamJson.members || []) as Member[];
  const tabs = teamJson.tabs || [];
  
  const mappedCategories: Record<string, Member[]> = {};

  tabs.forEach(tab => {
    // 1. Filter members that match ANY of the categories in the tab
    const matchedMembers = members.filter(m => {
      const memberCats = m.assignments?.categories || [];
      return tab.categories.some(cat => memberCats.includes(cat));
    });

    // 2. Map the members to include calculated experience and their designation
    const mappedMembers = matchedMembers.map(m => {
      const expDetails = mapExperienceDetails(m);
      
      // Find the first matching category to use as their primary group for this tab
      const primaryCat = tab.categories.find(cat => (m.assignments?.categories || []).includes(cat)) || "";
      
      // Get their specific designation for this category
      const designation = m.assignments?.meta?.[primaryCat] || m.assignments?.designation || "";

      return {
        ...m,
        experience: expDetails.experience,
        more_info: expDetails.more_info,
        designation: designation,
        _primaryCatIndex: tab.categories.indexOf(primaryCat), // Used for primary sort (Group)
        _ordering: m.assignments?.ordering || 999 // Used for secondary sort (Ordering Meta)
      };
    });

    // 3. Multi-level sort:
    // First, by group (the index of their matched category within the tab's `categories` array)
    // Then, by their explicit ordering meta defined in registry.json
    mappedMembers.sort((a, b) => {
      if (a._primaryCatIndex !== b._primaryCatIndex) {
        return (a._primaryCatIndex || 0) - (b._primaryCatIndex || 0);
      }
      return (a._ordering || 0) - (b._ordering || 0);
    });

    mappedCategories[tab.label] = mappedMembers;
  });

  return mappedCategories;
};

/**
 * Returns an ordered list of category names from a raw team JSON resource.
 */
export const getTeamCategoryNames = (teamJson: TeamJson | undefined): string[] => {
  return Object.keys(getTeamCategories(teamJson));
};

/**
 * Returns all members for a given category from a raw team JSON resource.
 */
export const getTeamByCategory = (teamJson: TeamJson | undefined, category: string): Member[] => {
  return getTeamCategories(teamJson)[category] || [];
};

/**
 * Returns a flat list of all team members across all categories.
 */
export const getAllTeamMembers = (teamJson: TeamJson | undefined): Member[] => {
  return Object.values(getTeamCategories(teamJson)).flat();
};

// ─── Statistics ───────────────────────────────────────────────────────────────

export interface StatisticsJson {
  statistics?: any[];
  breakdown?: any[];
}

/**
 * Extracts the statistics array from a raw statistics JSON resource.
 */
export const getStatistics = (statisticsJson: StatisticsJson | undefined): { cards: any[]; breakdown: any[] } => {
  return {
    cards: statisticsJson?.statistics || [],
    breakdown: statisticsJson?.breakdown || []
  };
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

/**
 */
export const getHero = (heroJson: any): any => {
  return heroJson?.hero || {};
};

// ─── About ────────────────────────────────────────────────────────────────────

/**
 */
export const getAbout = (aboutJson: any): any => {
  if (!aboutJson) return {};
  if (aboutJson.about) return aboutJson.about;
  return aboutJson;
};

// ─── Services ─────────────────────────────────────────────────────────────────

/**
 */
export const getServices = (servicesJson: any): any[] => {
  return servicesJson?.services || [];
};

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 */
export const getProjects = (projectsJson: any): any[] => {
  return projectsJson?.projects || [];
};

// ─── News & Events ────────────────────────────────────────────────────────────

/**
 */
export const getNewsAndEvents = (newsJson: any): any[] => {
  const items = newsJson?.newsAndEvents || [];
  if (process.env.NODE_ENV === 'production') {
    return items.filter((item: any) => !item.isDemo);
  }
  return items;
};

// ─── Company ──────────────────────────────────────────────────────────────────

export interface Company {
  id: string;
  name?: string;
  shortName?: string;
  tagline?: string;
  description?: string;
  founded?: number | string;
  headquarters?: string;
  logo?: string;
  favicon?: string;
  contact: {
    email?: string;
    phone?: string;
    address?: string;
    openingHours?: string;
    formspreeId?: string;
    mapCoordinates?: number[];
  };
  social: {
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
  };
}

/**
 */
export const getCompany = (companyJson?: any): Company => {
  const config = (companyJson && companyJson.meta) ? companyJson : siteConfig;
  const contact: any = contactConfig || {};

  // Helper to format office hours to string
  const formatOfficeHours = (hoursArray: any[] | undefined): string => {
    if (!hoursArray || !hoursArray.length) return '';
    const activeHours = hoursArray.filter(h => h.openTime !== 'Closed');
    if (activeHours.length > 0) {
      const h = activeHours[0];
      return `${h.days}: ${h.openTime} - ${h.closeTime}`;
    }
    return '';
  };

  return {
    id: config.siteId || 'cec-nepal',
    name: config.meta?.name,
    shortName: config.meta?.shortName,
    tagline: config.meta?.tagline,
    description: config.meta?.description,
    founded: config.meta?.foundedYear,
    headquarters: contact.headquarters,
    logo: config.assets?.logoUrl,
    favicon: config.assets?.favicon,
    contact: {
      email: contact.email,
      phone: contact.phone,
      address: contact.addressLines?.[0] || contact.headquarters,
      openingHours: formatOfficeHours(contact.officeHours),
      formspreeId: contact.formspreeId,
      mapCoordinates: contact.mapCoordinates || []
    },
    social: {
      facebook: config.socialMedia?.facebook,
      linkedin: config.socialMedia?.linkedin,
      youtube: config.socialMedia?.youtube,
      instagram: config.socialMedia?.instagram,
      twitter: config.socialMedia?.twitter
    }
  };
};

/**
 */
export const getCompanyProfile = (profileJson: any): any => {
  return profileJson || {};
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────

/**
 */
export const getFAQs = (faqJson: any): any[] => {
  return faqJson?.faq || [];
};
