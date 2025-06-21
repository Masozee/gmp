'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import FooterEn from '../en/components/FooterEn';

const ConditionalFooter = () => {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith('/en');
  const isAdmin = pathname.startsWith('/admin');
  const isLogin = pathname.startsWith('/login');
  
  // Don't show footer on admin or login pages
  if (isAdmin || isLogin) {
    return null;
  }

  return isEnglish ? <FooterEn /> : <Footer />;
};

export default ConditionalFooter; 