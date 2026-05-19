import teamRegistry from '../data/collections/team/registry.json';

/**
 * Returns the full team categories object from the normalized registry.
 * Keys are category names ("Board of Directors", "Who We Are"), values are arrays of mapped member objects.
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

const getCategoryDisplayName = (metaArray, categoryKey, defaultName) => {
  if (Array.isArray(metaArray)) {
    const found = metaArray.find(item => item && typeof item === 'object' && categoryKey in item);
    if (found) {
      return found[categoryKey];
    }
  }
  return defaultName;
};

export const getTeamCategories = () => {
  const members = teamRegistry.members || [];
  const meta = teamRegistry.meta || [];
  
  const boardLabel = getCategoryDisplayName(meta, "board_member", "Board of Directors");
  const expertLabel = getCategoryDisplayName(meta, "expert_staff", "Who We Are");
  const staffLabel = getCategoryDisplayName(meta, "staff", "Staffs");

  const boardOfDirectors = members
    .filter(m => m.assignments?.categories?.includes("board_member") || m.assignments?.isBoardMember)
    .map(m => {
      const expDetails = mapExperienceDetails(m);
      return {
        ...m,
        experience: expDetails.experience,
        more_info: expDetails.more_info,
        designation: m.assignments?.meta?.board_member || m.assignments?.boardDesignation || ""
      };
    });

  const whoWeAre = members
    .filter(m => m.assignments?.categories?.includes("expert_staff") || m.assignments?.isExpertStaff)
    .map(m => {
      const expDetails = mapExperienceDetails(m);
      return {
        ...m,
        experience: expDetails.experience,
        more_info: expDetails.more_info,
        designation: m.assignments?.meta?.expert_staff || m.assignments?.staffDesignation || ""
      };
    });

  const staffsList = members
    .filter(m => m.assignments?.categories?.includes("staff"))
    .map(m => {
      const expDetails = mapExperienceDetails(m);
      return {
        ...m,
        experience: expDetails.experience,
        more_info: expDetails.more_info,
        designation: m.assignments?.meta?.staff || ""
      };
    });

  return {
    [boardLabel]: boardOfDirectors,
    [expertLabel]: whoWeAre,
    [staffLabel]: staffsList
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

