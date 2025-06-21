'use client';

import { usePathname } from 'next/navigation';

const ConditionalSkipLink = () => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isLogin = pathname.startsWith('/login');
  
  // Don't show skip link on admin or login pages
  if (isAdmin || isLogin) {
    return null;
  }

  return (
    <a href="#main-content" className="skip-to-content">
      Loncat ke konten utama
    </a>
  );
};

export default ConditionalSkipLink; 