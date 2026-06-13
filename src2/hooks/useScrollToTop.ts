import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

/**
 * Hook that scrolls to the top of the page when the route changes
 */
const useScrollToTop = (): void => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as any // Use 'instant' for immediate scroll
    });
    // Track Google Analytics pageview
    trackPageView(pathname);
  }, [pathname]);
};

export default useScrollToTop;
