'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import FooterEn from '../en/components/FooterEn';

const ConditionalFooter = () => {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith('/en');

  return isEnglish ? <FooterEn /> : <Footer />;
};

export default ConditionalFooter; 