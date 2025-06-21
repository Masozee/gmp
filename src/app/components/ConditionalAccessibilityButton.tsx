'use client';

import { usePathname } from 'next/navigation';
import AccessibilityButton from './AccessibilityButton';

const ConditionalAccessibilityButton = () => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isLogin = pathname.startsWith('/login');
  
  // Don't show accessibility button on admin or login pages
  if (isAdmin || isLogin) {
    return null;
  }

  return <AccessibilityButton />;
};

export default ConditionalAccessibilityButton; 