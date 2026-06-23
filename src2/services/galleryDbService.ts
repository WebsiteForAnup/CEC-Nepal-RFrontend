import { neonClient } from '../lib/auth';
import galleryJson from '../data/collections/gallery.json';

export interface GalleryImage {
  id?: number | string;
  slug: string;
  image: string;
  title: string;
  category: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

const LOCAL_STORAGE_KEY = 'cec_gallery';

// Initialize LocalStorage with gallery.json if empty
const initLocalStorage = (): GalleryImage[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  let items: GalleryImage[] = [];
  if (stored) {
    try {
      items = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse gallery from localStorage, resetting...', e);
    }
  }
  if (!items || items.length === 0) {
    items = (galleryJson.gallery || []) as GalleryImage[];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }
  return items;
};

// Check if Neon DB is configured
const hasDbConfig = (): boolean => {
  return !!import.meta.env.VITE_NEON_DATA_API_URL;
};

export const galleryDbService = {
  /**
   * Fetch all gallery images
   */
  async getAllGalleryImages(): Promise<GalleryImage[]> {
    if (hasDbConfig()) {
      try {
        const { data, error } = await neonClient
          .schema('public')
          .from('gallery')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        return (data || []).map((row: any) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          category: row.category,
          image: row.image,
          description: row.description,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }));
      } catch (err) {
        console.error('Failed to fetch gallery images from database, falling back to LocalStorage', err);
      }
    }

    return initLocalStorage();
  },

  /**
   * Create a new gallery image
   */
  async createGalleryImage(item: Omit<GalleryImage, 'id'>): Promise<GalleryImage> {
    if (hasDbConfig()) {
      try {
        const dbRow = {
          slug: item.slug,
          title: item.title,
          category: item.category,
          image: item.image,
          description: item.description,
        };

        const { data, error } = await neonClient
          .schema('public')
          .from('gallery')
          .insert([dbRow])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          return {
            id: data.id,
            slug: data.slug,
            title: data.title,
            category: data.category,
            image: data.image,
            description: data.description,
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
        }
      } catch (err) {
        console.error('Failed to insert gallery image to DB, saving to LocalStorage', err);
      }
    }

    const items = initLocalStorage();
    const newItem: GalleryImage = {
      ...item,
      id: Date.now(), // Local fallback ID
    };
    items.push(newItem);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    return newItem;
  },

  /**
   * Update an existing gallery image
   */
  async updateGalleryImage(id: string | number, item: Partial<GalleryImage>): Promise<GalleryImage> {
    if (hasDbConfig()) {
      try {
        const dbRow: any = {};
        if (item.slug !== undefined) dbRow.slug = item.slug;
        if (item.title !== undefined) dbRow.title = item.title;
        if (item.category !== undefined) dbRow.category = item.category;
        if (item.image !== undefined) dbRow.image = item.image;
        if (item.description !== undefined) dbRow.description = item.description;
        dbRow.updated_at = new Date().toISOString();

        const { data, error } = await neonClient
          .schema('public')
          .from('gallery')
          .update(dbRow)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          return {
            id: data.id,
            slug: data.slug,
            title: data.title,
            category: data.category,
            image: data.image,
            description: data.description,
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
        }
      } catch (err) {
        console.error(`Failed to update gallery image ID ${id} in DB, updating LocalStorage`, err);
      }
    }

    const items = initLocalStorage();
    const index = items.findIndex((i) => String(i.id) === String(id));
    if (index !== -1) {
      const updatedItem = {
        ...items[index],
        ...item,
      } as GalleryImage;
      items[index] = updatedItem;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
      return updatedItem;
    }
    throw new Error(`Gallery image with ID ${id} not found`);
  },

  /**
   * Delete an existing gallery image
   */
  async deleteGalleryImage(id: string | number): Promise<boolean> {
    if (hasDbConfig()) {
      try {
        const { error } = await neonClient
          .schema('public')
          .from('gallery')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (err) {
        console.error(`Failed to delete gallery image ID ${id} from DB, deleting from LocalStorage`, err);
      }
    }

    const items = initLocalStorage();
    const filtered = items.filter((i) => String(i.id) !== String(id));
    if (filtered.length !== items.length) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  }
};
