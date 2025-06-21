'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import NavbarEn from '../en/components/NavbarEn';

const ConditionalNavbar = () => {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith('/en');
  const isAdmin = pathname.startsWith('/admin');
  const isLogin = pathname.startsWith('/login');
  
  // Don't show navbar on admin or login pages
  if (isAdmin || isLogin) {
    return null;
  }

  return isEnglish ? <NavbarEn /> : <Navbar />;
};

export default ConditionalNavbar; 