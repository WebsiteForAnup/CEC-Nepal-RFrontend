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
 * @param {object} teamJson - The parsed JSON object (e.g. imported from team.json)
 * @returns {Record<string, Array>} teamCategories
 */
export const getTeamCategories = (teamJson) => {
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
  return statisticsJson?.statistics || [];
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
  return aboutJson?.about || {};
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
  return companyJson?.company || {};
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
