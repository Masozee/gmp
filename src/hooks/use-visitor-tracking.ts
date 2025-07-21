import { useEffect, useRef } from 'react';

interface VisitorTrackingParams {
  contentType: 'publikasi' | 'acara';
  contentId: string;
  contentTitle: string;
  enabled?: boolean;
}

interface DownloadTrackingParams {
  contentType: 'publikasi' | 'acara';
  contentId: string;
  contentTitle: string;
  downloadUrl: string;
}

export function useVisitorTracking({
  contentType,
  contentId,
  contentTitle,
  enabled = true
}: VisitorTrackingParams) {
  const hasTracked = useRef(false);
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || hasTracked.current) return;

    // Get or generate session ID
    if (!sessionId.current) {
      sessionId.current = sessionStorage.getItem('visitor-session-id') || 
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('visitor-session-id', sessionId.current);
    }

    const trackView = async () => {
      try {
        const response = await fetch('/api/visitor-tracking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contentType,
            contentId,
            contentTitle,
            actionType: 'view',
            sessionId: sessionId.current,
          }),
        });

        if (response.ok) {
          hasTracked.current = true;
        }
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };

    // Track view after a short delay to ensure the page has loaded
    const timer = setTimeout(trackView, 1000);

    return () => clearTimeout(timer);
  }, [contentType, contentId, contentTitle, enabled]);

  const trackDownload = async (downloadUrl: string) => {
    try {
      // First track the download
      await fetch('/api/visitor-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          contentId,
          contentTitle,
          actionType: 'download',
          sessionId: sessionId.current,
        }),
      });

      // Then trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = '';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to track download:', error);
      // Still trigger download even if tracking fails
      window.open(downloadUrl, '_blank');
    }
  };

  return { trackDownload };
}

// Helper hook for download-only tracking (useful for buttons that only download)
export function useDownloadTracking({
  contentType,
  contentId,
  contentTitle,
  downloadUrl
}: DownloadTrackingParams) {
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    // Get or generate session ID
    if (!sessionId.current) {
      sessionId.current = sessionStorage.getItem('visitor-session-id') || 
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('visitor-session-id', sessionId.current);
    }
  }, []);

  const handleDownload = async () => {
    try {
      // Track the download
      await fetch('/api/visitor-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          contentId,
          contentTitle,
          actionType: 'download',
          sessionId: sessionId.current,
        }),
      });

      // Trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = '';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to track download:', error);
      // Still trigger download even if tracking fails
      window.open(downloadUrl, '_blank');
    }
  };

  return { handleDownload };
} 