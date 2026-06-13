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
