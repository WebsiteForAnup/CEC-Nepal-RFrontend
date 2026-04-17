import teamData from '../data/team.json';

/**
 * Returns the full team categories object from team.json.
 * Keys are category names, values are arrays of team member objects.
 *
 * @returns {Record<string, Array>} teamCategories
 */
export const getTeamCategories = () => {
  return teamData.team || {};
};

/**
 * Returns a flat array of all team members across every category.
 *
 * @returns {Array} allMembers
 */
export const getAllTeamMembers = () => {
  const categories = getTeamCategories();
  return Object.values(categories).flat();
};

/**
 * Returns team members for a specific category.
 *
 * @param {string} category - Category name (e.g. "Board of Directors")
 * @returns {Array} members
 */
export const getTeamByCategory = (category) => {
  const categories = getTeamCategories();
  return categories[category] || [];
};

/**
 * Returns an array of all available category names.
 *
 * @returns {string[]} categoryNames
 */
export const getTeamCategoryNames = () => {
  return Object.keys(getTeamCategories());
};
