import teamRegistry from '../data/collections/team/registry.json';

/**
 * Returns the full team categories object from the normalized registry.
 * Keys are tab labels ("Board of Directors", "Experts & Staffs"), values are arrays of mapped member objects.
 *
 * @returns {Record<string, Array>} teamCategories
 */
const calculateExperience = (joinDate, recruitmentType) => {
  if (!joinDate) return "";
  const joinYear = parseInt(String(joinDate).substring(0, 4));
  if (isNaN(joinYear)) return "";
  const currentYear = new Date().getFullYear();
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

export const getTeamCategories = () => {
  const members = teamRegistry.members || [];
  const tabs = teamRegistry.tabs || [];
  
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
