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
const calculateExperience = (joinDate, recruitmentType) => {
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

const mapExperienceDetails = (m) => {
  if (m.experience && typeof m.experience === 'object') {
    const { joinDate, recruitmentType, more_info } = m.experience;
    return {
      experience: calculateExperience(joinDate, recruitmentType),
      more_info: more_info || ""
    };
  }
  return {
    experience: m.experience || "",
    more_info: m.more_info || ""
  };
};

export const getTeamCategories = (teamJson) => {
  if (!teamJson) return {};
  const members = teamJson.members || [];
  const tabs = teamJson.tabs || [];
  
  const mappedCategories = {};

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
      const primaryCat = tab.categories.find(cat => (m.assignments?.categories || []).includes(cat));
      
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
        return a._primaryCatIndex - b._primaryCatIndex;
      }
      return a._ordering - b._ordering;
    });

    mappedCategories[tab.label] = mappedMembers;
  });

  return mappedCategories;
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
  const items = newsJson?.newsAndEvents || [];
  if (process.env.NODE_ENV === 'production') {
    return items.filter(item => !item.isDemo);
  }
  return items;
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
      youtube: config.socialMedia?.youtube,
      instagram: config.socialMedia?.instagram,
      twitter: config.socialMedia?.twitter
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
