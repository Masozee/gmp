'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import NavbarEn from '../en/components/NavbarEn';

const ConditionalNavbar = () => {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith('/en');

  return isEnglish ? <NavbarEn /> : <Navbar />;
};

export default ConditionalNavbar; 