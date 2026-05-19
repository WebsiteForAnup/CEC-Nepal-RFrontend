import teamRegistry from '../data/collections/team/registry.json';

/**
 * Returns the full team categories object from the normalized registry.
 * Keys are category names ("Board of Directors", "Who We Are"), values are arrays of mapped member objects.
 *
 * @returns {Record<string, Array>} teamCategories
 */
export const getTeamCategories = () => {
  const members = teamRegistry.members || [];
  
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

