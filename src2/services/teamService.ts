import { neonClient } from '../lib/auth';
import teamRegistry from '../data/collections/team/registry.json'; // keep for tabs config

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
  id?: number | string;
  slug: string;
  name: string;
  image_url?: string;
  education?: string;
  experience?: string | ExperienceObject;
  more_info?: string;
  bio?: string;
  assignments?: MemberAssignment;
  designation?: string;
  _primaryCatIndex?: number;
  _ordering?: number;
  [key: string]: any;
}

interface Tab {
  label: string;
  categories: string[];
}

export interface TeamCategory {
  id?: number | string;
  slug: string;
  label: string;
  tab_group?: string;
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

export const teamDbService = {
  /**
   * Fetch all members from the Neon Database.
   */
  getAllTeamMembers: async (): Promise<Member[]> => {
    try {
      const dbUrl = import.meta.env.VITE_NEON_DATA_API_URL;
      const hasDbConfig = !!dbUrl;
      
      if (!hasDbConfig) {
        console.warn("VITE_NEON_DATA_API_URL not set, falling back to static team members");
        return (teamRegistry.members || []) as Member[];
      }

      const { data, error } = await neonClient.schema('public').from('team_members').select('*');
      if (error) {
        console.error("Neon DB error fetching team members:", error);
        throw error;
      }
      return (data || []) as Member[];
    } catch (err) {
      console.error('Error fetching team members:', err);
      // Fallback to static if DB fails
      return (teamRegistry.members || []) as Member[];
    }
  },

  /**
   * Fetch mapped categories based on the DB members and static tabs config.
   */
  getTeamCategories: async (): Promise<Record<string, Member[]>> => {
    const members = await teamDbService.getAllTeamMembers();
    const tabs = (teamRegistry.tabs || []) as Tab[];
    
    const mappedCategories: Record<string, Member[]> = {};

    tabs.forEach(tab => {
      const matchedMembers = members.filter(m => {
        const memberCats = m.assignments?.categories || [];
        return tab.categories.some(cat => memberCats.includes(cat));
      });

      const mappedMembers = matchedMembers.map(m => {
        const expDetails = mapExperienceDetails(m);
        const primaryCat = tab.categories.find(cat => (m.assignments?.categories || []).includes(cat)) || "";
        const designation = m.assignments?.meta?.[primaryCat] || m.assignments?.designation || "";

        return {
          ...m,
          experience: expDetails.experience,
          more_info: expDetails.more_info,
          designation: designation,
          _primaryCatIndex: tab.categories.indexOf(primaryCat),
          _ordering: m.assignments?.ordering || 999
        };
      });

      mappedMembers.sort((a, b) => {
        if (a._primaryCatIndex !== b._primaryCatIndex) {
          return (a._primaryCatIndex || 0) - (b._primaryCatIndex || 0);
        }
        return (a._ordering || 0) - (b._ordering || 0);
      });

      mappedCategories[tab.label] = mappedMembers;
    });

    return mappedCategories;
  },

  /**
   * Fetch categories from the Neon Database.
   */
  getTeamCategoriesList: async (): Promise<TeamCategory[]> => {
    try {
      const { data, error } = await neonClient.schema('public').from('team_categories').select('*');
      if (error) throw error;
      return (data || []) as TeamCategory[];
    } catch (err) {
      console.error('Error fetching team categories list:', err);
      return [];
    }
  },

  /**
   * Create a new team member
   */
  createTeamMember: async (member: Partial<Member>): Promise<any> => {
    const { data, error } = await neonClient.schema('public').from('team_members').insert([member]);
    if (error) throw error;
    return data;
  },

  /**
   * Update an existing team member
   */
  updateTeamMember: async (id: string | number, member: Partial<Member>): Promise<any> => {
    const { data, error } = await neonClient.schema('public').from('team_members').update(member).eq('id', id);
    if (error) throw error;
    return data;
  },

  /**
   * Delete a team member
   */
  deleteTeamMember: async (id: string | number): Promise<any> => {
    const { data, error } = await neonClient.schema('public').from('team_members').delete().eq('id', id);
    if (error) throw error;
    return data;
  }
};
