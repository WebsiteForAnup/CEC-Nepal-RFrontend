import { neonClient } from '../lib/auth';
import initialFeed from '../data/collections/news-events/feed.json';

export interface NewsEventItem {
  id: string | number;
  slug: string;
  type: 'news' | 'event';
  title: string;
  date: string;
  description?: string;
  image?: string;
  category?: string;
  author?: string;
  content?: string;
  richContent?: any[];
  relatedNewsSlugs?: string[];
  isDemo?: boolean;
  
  // Optional metadata / specific fields
  location?: string;
  cecRole?: string;
  capacity?: string;
  status?: string;
  projectSpecs?: any;

  // New fields from feed.json
  importantDates?: { date_title: string; date: string; meta?: any }[];
  registration?: string;
  awardName?: string;
  trainer?: string;
  team?: string;
  coordinator?: string;
}

const LOCAL_STORAGE_KEY = 'cec_news_events';

// Initialize LocalStorage with feed.json if empty and migrate legacy dates
const initLocalStorage = (): NewsEventItem[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  let items: NewsEventItem[] = [];
  if (stored) {
    try {
      items = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse news from localStorage, resetting...', e);
    }
  }
  if (!items || items.length === 0) {
    // items = (initialFeed.newsAndEvents || []) as NewsEventItem[];
  }
  
  let updated = false;
  items.forEach(item => {
    if (!item.importantDates) {
      item.importantDates = [];
      const anyItem = item as any;
      if (anyItem.startDate) {
        item.importantDates.push({ date_title: 'Project Start Date', date: anyItem.startDate, meta: {} });
        delete anyItem.startDate;
        updated = true;
      }
      if (anyItem.breakthroughDate) {
        item.importantDates.push({ date_title: 'Breakthrough Date', date: anyItem.breakthroughDate, meta: {} });
        delete anyItem.breakthroughDate;
        updated = true;
      }
    }
  });

  if (updated || !stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }
  return items;
};

// Check if Neon DB is configured
const hasDbConfig = (): boolean => {
  return !!import.meta.env.VITE_NEON_AUTH_URL;
};

export const newsDbService = {
  /**
   * Fetch all news and events
   */
  async getNewsAndEvents(): Promise<NewsEventItem[]> {
    if (hasDbConfig()) {
      try {
        const { data, error } = await neonClient
          .from('news_events')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
        
        // Map database snake_case columns back to camelCase properties
        return (data || []).map((row: any) => ({
          id: row.id,
          slug: row.slug,
          type: row.type,
          title: row.title,
          date: row.date,
          description: row.description,
          image: row.image,
          category: row.category,
          author: row.author,
          content: row.content,
          richContent: row.rich_content,
          relatedNewsSlugs: row.related_news_slugs,
          isDemo: row.is_demo,
          location: row.location,
          cecRole: row.cec_role,
          capacity: row.capacity,
          status: row.status,
          projectSpecs: row.project_specs,
          importantDates: row.important_dates || [],
          registration: row.registration,
          awardName: row.award_name,
          trainer: row.trainer,
          team: row.team,
          coordinator: row.coordinator,
        }));
      } catch (err) {
        console.error('Failed to fetch news from database, falling back to LocalStorage', err);
      }
    }
    
    const items = initLocalStorage();
    // Sort descending by date
    return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  /**
   * Fetch a single news/event item by slug
   */
  async getNewsAndEventBySlug(slug: string): Promise<NewsEventItem | null> {
    if (hasDbConfig()) {
      try {
        const { data, error } = await neonClient
          .from('news_events')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) throw error;
        if (data) {
          return {
            id: data.id,
            slug: data.slug,
            type: data.type,
            title: data.title,
            date: data.date,
            description: data.description,
            image: data.image,
            category: data.category,
            author: data.author,
            content: data.content,
            richContent: data.rich_content,
            relatedNewsSlugs: data.related_news_slugs,
            isDemo: data.is_demo,
            location: data.location,
            cecRole: data.cec_role,
            capacity: data.capacity,
            status: data.status,
            projectSpecs: data.project_specs,
            importantDates: data.important_dates || [],
            registration: data.registration,
            awardName: data.award_name,
            trainer: data.trainer,
            team: data.team,
            coordinator: data.coordinator,
          };
        }
      } catch (err) {
        console.error(`Failed to fetch slug ${slug} from DB, checking LocalStorage`, err);
      }
    }

    const items = initLocalStorage();
    return items.find((item) => item.slug === slug) || null;
  },

  /**
   * Create a new news/event item
   */
  async createNewsAndEvent(item: Omit<NewsEventItem, 'id'>): Promise<NewsEventItem> {
    if (hasDbConfig()) {
      try {
        // Map camelCase to snake_case for DB columns
        const dbRow = {
          slug: item.slug,
          type: item.type,
          title: item.title,
          date: item.date,
          description: item.description,
          image: item.image,
          category: item.category,
          author: item.author || 'CEC Nepal Team',
          content: item.content,
          rich_content: item.richContent || [],
          related_news_slugs: item.relatedNewsSlugs || [],
          is_demo: !!item.isDemo,
          location: item.location,
          cec_role: item.cecRole,
          capacity: item.capacity,
          status: item.status,
          project_specs: item.projectSpecs || {},
          important_dates: item.importantDates || [],
          registration: item.registration,
          award_name: item.awardName,
          trainer: item.trainer,
          team: item.team,
          coordinator: item.coordinator,
        };

        const { data, error } = await neonClient
          .from('news_events')
          .insert([dbRow])
          .select()
          .single();
        
        if (error) throw error;
        if (data) {
          return {
            id: data.id,
            slug: data.slug,
            type: data.type,
            title: data.title,
            date: data.date,
            description: data.description,
            image: data.image,
            category: data.category,
            author: data.author,
            content: data.content,
            richContent: data.rich_content,
            relatedNewsSlugs: data.related_news_slugs,
            isDemo: data.is_demo,
            location: data.location,
            cecRole: data.cec_role,
            capacity: data.capacity,
            status: data.status,
            projectSpecs: data.project_specs,
            importantDates: data.important_dates || [],
            registration: data.registration,
            awardName: data.award_name,
            trainer: data.trainer,
            team: data.team,
            coordinator: data.coordinator,
          };
        }
      } catch (err) {
        console.error('Failed to insert news to DB, saving to LocalStorage', err);
      }
    }

    const items = initLocalStorage();
    const newItem: NewsEventItem = {
      ...item,
      id: Date.now(), // Local fallback ID
    };
    items.push(newItem);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    return newItem;
  },

  /**
   * Update an existing news/event item
   */
  async updateNewsAndEvent(id: string | number, item: Partial<NewsEventItem>): Promise<NewsEventItem> {
    if (hasDbConfig()) {
      try {
        // Map camelCase to snake_case for DB columns
        const dbRow: any = {};
        if (item.slug !== undefined) dbRow.slug = item.slug;
        if (item.type !== undefined) dbRow.type = item.type;
        if (item.title !== undefined) dbRow.title = item.title;
        if (item.date !== undefined) dbRow.date = item.date;
        if (item.description !== undefined) dbRow.description = item.description;
        if (item.image !== undefined) dbRow.image = item.image;
        if (item.category !== undefined) dbRow.category = item.category;
        if (item.author !== undefined) dbRow.author = item.author;
        if (item.content !== undefined) dbRow.content = item.content;
        if (item.richContent !== undefined) dbRow.rich_content = item.richContent;
        if (item.relatedNewsSlugs !== undefined) dbRow.related_news_slugs = item.relatedNewsSlugs;
        if (item.isDemo !== undefined) dbRow.is_demo = item.isDemo;
        if (item.location !== undefined) dbRow.location = item.location;
        if (item.cecRole !== undefined) dbRow.cec_role = item.cecRole;
        if (item.capacity !== undefined) dbRow.capacity = item.capacity;
        if (item.status !== undefined) dbRow.status = item.status;
        if (item.projectSpecs !== undefined) dbRow.project_specs = item.projectSpecs;
        if (item.importantDates !== undefined) dbRow.important_dates = item.importantDates;
        if (item.registration !== undefined) dbRow.registration = item.registration;
        if (item.awardName !== undefined) dbRow.award_name = item.awardName;
        if (item.trainer !== undefined) dbRow.trainer = item.trainer;
        if (item.team !== undefined) dbRow.team = item.team;
        if (item.coordinator !== undefined) dbRow.coordinator = item.coordinator;

        const { data, error } = await neonClient
          .from('news_events')
          .update(dbRow)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        if (data) {
          return {
            id: data.id,
            slug: data.slug,
            type: data.type,
            title: data.title,
            date: data.date,
            description: data.description,
            image: data.image,
            category: data.category,
            author: data.author,
            content: data.content,
            richContent: data.rich_content,
            relatedNewsSlugs: data.related_news_slugs,
            isDemo: data.is_demo,
            location: data.location,
            cecRole: data.cec_role,
            capacity: data.capacity,
            status: data.status,
            projectSpecs: data.project_specs,
            importantDates: data.important_dates || [],
            registration: data.registration,
            awardName: data.award_name,
            trainer: data.trainer,
            team: data.team,
            coordinator: data.coordinator,
          };
        }
      } catch (err) {
        console.error(`Failed to update ID ${id} in DB, updating LocalStorage`, err);
      }
    }

    const items = initLocalStorage();
    const index = items.findIndex((i) => String(i.id) === String(id));
    if (index !== -1) {
      const updatedItem = {
        ...items[index],
        ...item,
      } as NewsEventItem;
      items[index] = updatedItem;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
      return updatedItem;
    }
    throw new Error(`Item with ID ${id} not found`);
  },

  /**
   * Delete an existing news/event item
   */
  async deleteNewsAndEvent(id: string | number): Promise<boolean> {
    if (hasDbConfig()) {
      try {
        const { error } = await neonClient
          .from('news_events')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return true;
      } catch (err) {
        console.error(`Failed to delete ID ${id} from DB, deleting from LocalStorage`, err);
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
