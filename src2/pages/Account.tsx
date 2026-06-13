import { AccountView } from '@neondatabase/neon-js/auth/react/ui';
import { useLocation } from 'react-router-dom';

export default function Account() {
  const { pathname } = useLocation();
  return <AccountView pathname={pathname} />;
}