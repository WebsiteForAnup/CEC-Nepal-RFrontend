import { neonClient } from '../lib/auth';

export interface CaseStudy {
  title: string;
  metric: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
}

export interface EngineeringService {
  id?: number | string;
  slug: string;
  ordering_rank?: number;
  icon?: string;
  title: string;
  subheadline?: string;
  description?: string;
  image?: string;
  category?: string;
  fullDescription?: string;
  painPoints?: string;
  approach?: string;
  benefits?: string[];
  process?: string[];
  capabilities?: string[];
  techStack?: string[];
  caseStudy?: CaseStudy;
  testimonial?: Testimonial;
  has_page?: boolean;
}

export const serviceDbService = {
  /**
   * Fetch all services
   */
  getAllServices: async (): Promise<EngineeringService[]> => {
    try {
      const { data, error } = await neonClient
        .schema('public')
        .from('services')
        .select('*')
        .order('ordering_rank', { ascending: true });

      if (error) throw error;
      
      return (data || []).map(row => ({
        id: row.id,
        slug: row.slug,
        ordering_rank: row.ordering_rank,
        icon: row.icon,
        title: row.title,
        subheadline: row.subheadline,
        description: row.description,
        image: row.image,
        category: row.category,
        fullDescription: row.full_description,
        painPoints: row.pain_points,
        approach: row.approach,
        benefits: row.benefits,
        process: row.process,
        capabilities: row.capabilities,
        techStack: row.tech_stack,
        caseStudy: row.case_study,
        testimonial: row.testimonial,
        has_page: row.has_page
      }));
    } catch (err) {
      console.error('Error fetching services:', err);
      return [];
    }
  },

  /**
   * Fetch a single service by slug
   */
  getServiceBySlug: async (slug: string): Promise<EngineeringService | null> => {
    try {
      const { data, error } = await neonClient
        .schema('public')
        .from('services')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        slug: data.slug,
        ordering_rank: data.ordering_rank,
        icon: data.icon,
        title: data.title,
        subheadline: data.subheadline,
        description: data.description,
        image: data.image,
        category: data.category,
        fullDescription: data.full_description,
        painPoints: data.pain_points,
        approach: data.approach,
        benefits: data.benefits,
        process: data.process,
        capabilities: data.capabilities,
        techStack: data.tech_stack,
        caseStudy: data.case_study,
        testimonial: data.testimonial,
        has_page: data.has_page
      };
    } catch (err) {
      console.error(`Error fetching service by slug ${slug}:`, err);
      return null;
    }
  },

  /**
   * Create a new service
   */
  createService: async (service: Partial<EngineeringService>): Promise<any> => {
    try {
      const { data, error } = await neonClient
        .schema('public')
        .from('services')
        .insert([{
          slug: service.slug,
          ordering_rank: service.ordering_rank || 999,
          icon: service.icon,
          title: service.title,
          subheadline: service.subheadline,
          description: service.description,
          image: service.image,
          category: service.category,
          full_description: service.fullDescription,
          pain_points: service.painPoints,
          approach: service.approach,
          benefits: service.benefits,
          process: service.process,
          capabilities: service.capabilities,
          tech_stack: service.techStack,
          case_study: service.caseStudy,
          testimonial: service.testimonial,
          has_page: service.has_page
        }]);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating service:', err);
      throw err;
    }
  },

  /**
   * Update an existing service
   */
  updateService: async (id: string | number, service: Partial<EngineeringService>): Promise<any> => {
    try {
      const { data, error } = await neonClient
        .schema('public')
        .from('services')
        .update({
          slug: service.slug,
          ordering_rank: service.ordering_rank,
          icon: service.icon,
          title: service.title,
          subheadline: service.subheadline,
          description: service.description,
          image: service.image,
          category: service.category,
          full_description: service.fullDescription,
          pain_points: service.painPoints,
          approach: service.approach,
          benefits: service.benefits,
          process: service.process,
          capabilities: service.capabilities,
          tech_stack: service.techStack,
          case_study: service.caseStudy,
          testimonial: service.testimonial,
          has_page: service.has_page
        })
        .eq('id', Number(id));

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating service:', err);
      throw err;
    }
  },

  /**
   * Delete a service
   */
  deleteService: async (id: string | number): Promise<any> => {
    try {
      const { data, error } = await neonClient
        .schema('public')
        .from('services')
        .delete()
        .eq('id', Number(id));

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error deleting service:', err);
      throw err;
    }
  }
};
