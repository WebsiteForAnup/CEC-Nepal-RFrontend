// Universal, deterministic data access: safe in Node and in the browser.
// Browser session clients remain in the existing admin services.
import home from '../data/pages/home.json';
import about from '../data/pages/about.json';
import profile from '../data/pages/company_profile.json';
import services from '../data/collections/services.json';
import projects from '../data/collections/projects.json';
import news from '../data/collections/news-events/feed.json';
import team from '../data/collections/team/registry.json';
import gallery from '../data/collections/gallery.json';
import downloads from '../data/collections/downloads.json';
import faq from '../data/collections/faq.json';
import careers from '../data/pages/careers.json';
import contact from '../data/global/contact.json';
import company from '../data/global/site-config.json';
import type { Member, TeamJson } from './homeService';
function getTeamCategories(registry: TeamJson): Record<string, Member[]> {
  return Object.fromEntries(
    (registry.tabs || []).map((tab) => [
      tab.label,
      (registry.members || [])
        .filter((member) =>
          tab.categories.some((category) => member.assignments?.categories?.includes(category)),
        )
        .map((member) => {
          const category = tab.categories.find((category) =>
            member.assignments?.categories?.includes(category),
          );
          const experience = typeof member.experience === 'object' ? member.experience : null;
          return {
            ...member,
            designation:
              member.assignments?.meta?.[category || ''] || member.assignments?.designation || '',
            experience: experience
              ? [
                  experience.recruitmentType,
                  experience.joinDate ? 'Joined ' + experience.joinDate : '',
                ]
                  .filter(Boolean)
                  .join(' · ')
              : member.experience,
            more_info: experience?.more_info || member.more_info,
          };
        })
        .sort((a, b) => (a.assignments?.ordering || 999) - (b.assignments?.ordering || 999)),
    ]),
  );
}
const detailFiles = import.meta.glob('../data/collections/services/*.json', {
  eager: true,
  import: 'default',
});
export const publicContent = {
  home,
  about,
  profile,
  services: services.services,
  projects: projects.projects,
  news: news.newsAndEvents.filter((item) => !import.meta.env.PROD || !item.isDemo),
  team,
  teamCategories: getTeamCategories(team),
  gallery: gallery.gallery,
  downloads: downloads.downloads,
  faq: faq.faq,
  careers,
  contact,
  company,
};
export function findService(id: string) {
  const detail = Object.values(detailFiles).find((item: any) => item.slug === id);
  return detail || publicContent.services.find((item) => item.slug === id);
}

// Explicit relationships mirror the original portfolio categories.
export const serviceCategories: Record<string, string> = {
  'feasibility-studies': 'Feasibility Study',
  'detail-engineering-design': 'Detail Engineering Design',
  'construction-supervision': 'Construction Supervision',
  'bill-verification': 'Bill Verification',
  'due-diligence-audit': 'Due Diligence Audit',
};
export function getServiceProjects(slug: string) {
  const category = serviceCategories[slug];
  return category
    ? publicContent.projects.filter((project) => project.categories.includes(category))
    : [];
}
export function getProjectServices(project: { categories: string[] }) {
  return publicContent.services.filter((service) =>
    project.categories.includes(serviceCategories[service.slug]),
  );
}
export function getRelatedNews(slug: string) {
  const item = publicContent.news.find((item) => item.slug === slug);
  return publicContent.news.filter((candidate) => item?.relatedNewsSlugs?.includes(candidate.slug));
}
export const serviceGroups = [
  {
    title: 'Plan & investigate',
    description: 'Clarity before you commit.',
    slugs: [
      'project-inception-analysis',
      'feasibility-studies',
      'survey-investigations',
      'due-diligence-audit',
    ],
  },
  {
    title: 'Design & deliver',
    description: 'Precision at every stage.',
    slugs: [
      'detail-engineering-design',
      'physical-modelling',
      'tender-evaluations',
      'construction-supervision',
      'bill-verification',
    ],
  },
  {
    title: 'Operate & evolve',
    description: 'Performance for the long term.',
    slugs: ['testing-commissioning', 'repair-maintenance-rehabilitation'],
  },
];
