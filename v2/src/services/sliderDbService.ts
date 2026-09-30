import { neonClient } from '../lib/auth';

export interface Slider {
  id?: number | string;
  image?: string;
  badge?: string;
  titleHighlight?: string;
  titleSuffix?: string;
  description?: string;
  link?: string;
  ordering?: number;
}

export const sliderDbService = {
  /**
   * Fetch all sliders from the DB, ordered by ordering.
   */
  getAllSliders: async (): Promise<Slider[]> => {
    try {
      const { data, error } = await neonClient
        .schema('public')
        .from('hero_sliders')
        .select('*')
        .order('ordering', { ascending: true });

      if (error) throw error;
      
      return (data || []).map(row => ({
        id: row.id,
        image: row.image,
        badge: row.badge,
        titleHighlight: row.title_highlight,
        titleSuffix: row.title_suffix,
        description: row.description,
        link: row.link,
        ordering: row.ordering
      }));
    } catch (err) {
      console.error('Error fetching sliders:', err);
      return [];
    }
  },

  /**
   * Create a new slider
   */
  createSlider: async (slider: Partial<Slider>): Promise<any> => {
    try {
      const { data, error } = await neonClient
        .schema('public')
        .from('hero_sliders')
        .insert([{
          image: slider.image,
          badge: slider.badge,
          title_highlight: slider.titleHighlight,
          title_suffix: slider.titleSuffix,
          description: slider.description,
          link: slider.link,
          ordering: slider.ordering || 999
        }]);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating slider:', err);
      throw err;
    }
  },

  /**
   * Update an existing slider
   */
  updateSlider: async (id: string | number, slider: Partial<Slider>): Promise<any> => {
    try {
      const { data, error } = await neonClient
        .schema('public')
        .from('hero_sliders')
        .update({
          image: slider.image,
          badge: slider.badge,
          title_highlight: slider.titleHighlight,
          title_suffix: slider.titleSuffix,
          description: slider.description,
          link: slider.link,
          ordering: slider.ordering
        })
        .eq('id', Number(id));

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating slider:', err);
      throw err;
    }
  },

  /**
   * Delete a slider
   */
  deleteSlider: async (id: string | number): Promise<any> => {
    try {
      const { data, error } = await neonClient
        .schema('public')
        .from('hero_sliders')
        .delete()
        .eq('id', Number(id));

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error deleting slider:', err);
      throw err;
    }
  }
};
