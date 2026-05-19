import siteConfig from '../data/global/site-config.json';
import contactConfig from '../data/global/contact.json';

/**
 * homeService.js
 *
 * Generic home-page data service.
 * The caller (Home.js) is responsible for importing/fetching the raw JSON
 * and passing it here. This keeps the service decoupled from any specific
 * file path or URL.
 */

/**
 * Extracts the team categories object from a raw team JSON resource.
 *
 * @param {object} teamJson - The parsed JSON object (e.g. imported from registry.json or team.json)
 * @returns {Record<string, Array>} teamCategories
 */
export const getTeamCategories = (teamJson) => {
  if (!teamJson) return {};
  if (teamJson.members) {
    const members = teamJson.members || [];
    const boardOfDirectors = members
      .filter(m => m.assignments?.isBoardMember)
      .map(m => ({
        ...m,
        designation: m.assignments.boardDesignation
      }));
    const whoWeAre = members
      .filter(m => m.assignments?.isExpertStaff)
      .map(m => ({
        ...m,
        designation: m.assignments.staffDesignation
      }));
    return {
      "Board of Directors": boardOfDirectors,
      "Who We Are": whoWeAre
    };
  }
  return teamJson?.team || {};
};

/**
 * Returns an ordered list of category names from a raw team JSON resource.
 *
 * @param {object} teamJson
 * @returns {string[]}
 */
export const getTeamCategoryNames = (teamJson) => {
  return Object.keys(getTeamCategories(teamJson));
};

/**
 * Returns all members for a given category from a raw team JSON resource.
 *
 * @param {object} teamJson
 * @param {string} category
 * @returns {Array}
 */
export const getTeamByCategory = (teamJson, category) => {
  return getTeamCategories(teamJson)[category] || [];
};

/**
 * Returns a flat list of all team members across all categories.
 *
 * @param {object} teamJson
 * @returns {Array}
 */
export const getAllTeamMembers = (teamJson) => {
  return Object.values(getTeamCategories(teamJson)).flat();
};

// ─── Statistics ───────────────────────────────────────────────────────────────

/**
 * Extracts the statistics array from a raw statistics JSON resource.
 *
 * @param {object} statisticsJson - Parsed JSON object (e.g. imported from statistics.json)
 * @returns {Array} statCards
 */
export const getStatistics = (statisticsJson) => {
  return {
    cards: statisticsJson?.statistics || [],
    breakdown: statisticsJson?.breakdown || []
  };
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

/**
 * @param {object} heroJson
 * @returns {object} hero
 */
export const getHero = (heroJson) => {
  return heroJson?.hero || {};
};

// ─── About ────────────────────────────────────────────────────────────────────

/**
 * @param {object} aboutJson
 * @returns {object} about
 */
export const getAbout = (aboutJson) => {
  if (!aboutJson) return {};
  if (aboutJson.about) return aboutJson.about;
  return aboutJson;
};

// ─── Services ─────────────────────────────────────────────────────────────────

/**
 * @param {object} servicesJson
 * @returns {Array} services
 */
export const getServices = (servicesJson) => {
  return servicesJson?.services || [];
};

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 * @param {object} projectsJson
 * @returns {Array} projects
 */
export const getProjects = (projectsJson) => {
  return projectsJson?.projects || [];
};

// ─── News & Events ────────────────────────────────────────────────────────────

/**
 * @param {object} newsJson
 * @returns {Array} newsAndEvents
 */
export const getNewsAndEvents = (newsJson) => {
  return newsJson?.newsAndEvents || [];
};

// ─── Company ──────────────────────────────────────────────────────────────────

/**
 * @param {object} companyJson
 * @returns {object} company
 */
export const getCompany = (companyJson) => {
  const config = (companyJson && companyJson.meta) ? companyJson : siteConfig;
  const contact = contactConfig || {};

  // Helper to format office hours to string
  const formatOfficeHours = (hoursArray) => {
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
      twitter: config.socialMedia?.twitter,
      instagram: config.socialMedia?.instagram
    }
  };
};

/**
 * @param {object} profileJson
 * @returns {object} profile
 */
export const getCompanyProfile = (profileJson) => {
  return profileJson || {};
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────

/**
 * @param {object} faqJson
 * @returns {Array} faqs
 */
export const getFAQs = (faqJson) => {
  return faqJson?.faq || [];
};
