'use client';

import React from 'react';
import { useVisitorTracking } from '@/hooks/use-visitor-tracking';

interface Publication {
  id: number;
  title: string;
  slug: string;
  date: string;
  count: string;
  image_url: string | null;
  type: string;
  pdf_url: string | null;
  content: string;
  author: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface PublicationClientComponentProps {
  publication: Publication;
  currentSlug: string;
}

export default function PublicationClientComponent({ 
  publication, 
  currentSlug 
}: PublicationClientComponentProps) {
  // Use visitor tracking hook
  const { trackDownload } = useVisitorTracking({
    contentType: 'publication',
    contentId: currentSlug,
    contentTitle: publication.title,
    enabled: true
  });

  const handleDownload = () => {
    if (publication.pdf_url) {
      trackDownload(publication.pdf_url);
    }
  };

  return (
    <>
      {publication.pdf_url && (
        <div className="not-prose mt-8 flex justify-center">
          <button
            onClick={handleDownload}
            className="inline-block rounded bg-green-600 px-4 py-2 font-semibold text-white no-underline hover:bg-green-700 transition-colors"
          >
            Download PDF
          </button>
        </div>
      )}
    </>
  );
}
