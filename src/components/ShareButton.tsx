'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button
import { Share2 } from 'lucide-react'; // Using lucide icon
import { usePathname } from 'next/navigation';

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const [canShare, setCanShare] = useState(false);
  const pathname = usePathname();
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}${pathname}` : '';

  useEffect(() => {
    // Web Share API is only available in secure contexts (HTTPS) and specific browsers
    // Check for navigator object existence as well for SSR safety
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share && typeof window !== 'undefined' && window.isSecureContext);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this publication: ${title}`,
          url: currentUrl,
        });
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback or error message if needed
      }
    } else {
      // Fallback for browsers/contexts that don't support Web Share API
      // You could open a modal with links, or copy to clipboard
      alert('Web Share API not supported in your browser or context. You can manually copy the link.');
      // Example: Copy to clipboard (requires user interaction or secure context)
      // navigator.clipboard.writeText(currentUrl).then(() => alert('Link copied to clipboard!')).catch(err => console.error('Failed to copy:', err));
    }
  };

  if (!canShare) {
    // Optionally render nothing, or render fallback links/copy button if Web Share API is unavailable
    // For simplicity, we'll just render nothing here if native share isn't available
    // You could enhance this with manual share links (Twitter, FB, etc.)
    return null; 
  }

  return (
    <Button variant="outline" onClick={handleShare} className="mt-8 flex items-center gap-2">
      <Share2 size={18} />
      Bagikan Publikasi Ini
    </Button>
  );
} 