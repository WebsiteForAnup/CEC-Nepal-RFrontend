import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook that scrolls to the top of the page when the route changes
 */
const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' for immediate scroll, 'smooth' for animated
    });
  }, [pathname]);
};

export default useScrollToTop;
