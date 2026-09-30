import { publicContent, findService } from '../services/publicContent';
const pages: Record<string, string> = {"/":"Home","/about":"About","/company-profile":"Company profile","/services":"Services","/projects":"Projects","/team":"Team","/news":"News & events","/gallery":"Gallery","/downloads":"Downloads","/careers":"Careers","/faq":"FAQ","/contact":"Contact","/privacy":"Privacy policy","/terms":"Terms of service"};
export function getPageMetadata(url: string) {
  const pathname = new URL(url, 'http://localhost').pathname.replace(/\/$/, '') || '/';
  let title = pages[pathname];
  if (pathname.startsWith('/service/')) title = (findService(decodeURIComponent(pathname.slice(9))) as any)?.title;
  if (pathname.startsWith('/project/')) title = publicContent.projects.find(item => item.slug === decodeURIComponent(pathname.slice(9)))?.name;
  if (pathname.startsWith('/news-event/')) title = publicContent.news.find(item => item.slug === decodeURIComponent(pathname.slice(12)) || String(item.id) === pathname.slice(12))?.title;
  const browserRoute = /^\/(admin|auth|account)(\/|$)/.test(pathname);
  return { status: title || browserRoute ? 200 : 404, title: (title || (browserRoute ? 'Administration' : 'Page not found')) + ' | CEC Nepal' };
}
