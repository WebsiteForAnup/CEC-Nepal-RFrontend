import teamRegistry from '../data/collections/team/registry.json';

interface ExperienceObject {
  joinDate?: string | number;
  recruitmentType?: string;
  more_info?: string;
}

interface MemberAssignment {
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
  [key: string]: any; // fallback for other dynamic properties
}

interface Tab {
  label: string;
  categories: string[];
}

const calculateExperience = (joinDate: string | number | undefined, recruitmentType: string | undefined): string => {
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

export const getTeamCategories = (): Record<string, Member[]> => {
  const members = (teamRegistry.members || []) as Member[];
  const tabs = (teamRegistry.tabs || []) as Tab[];
  
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
 * Returns a flat array of all team members across every category.
 *
 * @returns {Member[]} allMembers
 */
export const getAllTeamMembers = (): Member[] => {
  const categories = getTeamCategories();
  return Object.values(categories).flat();
};

/**
 * Returns team members for a specific category.
 *
 * @param {string} category - Category name (e.g. "Board of Directors")
 * @returns {Member[]} members
 */
export const getTeamByCategory = (category: string): Member[] => {
  const categories = getTeamCategories();
  return categories[category] || [];
};

/**
 * Returns an array of all available category names.
 *
 * @returns {string[]} categoryNames
 */
export const getTeamCategoryNames = (): string[] => {
  return Object.keys(getTeamCategories());
};
