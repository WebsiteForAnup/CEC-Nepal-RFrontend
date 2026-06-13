import { AuthView } from '@neondatabase/neon-js/auth/react/ui';
import { useLocation } from 'react-router-dom';

export default function Auth() {
  const { pathname } = useLocation();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <AuthView pathname={pathname} />
    </div>
  );
}