/**
 * API service module for handling data fetching operations
 * This will be used to fetch data from the backend or external APIs
 */

export interface Workshop {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'ebook' | 'infographic' | 'toolkit' | 'video';
  description: string;
  downloadUrl: string;
  imageUrl?: string;
}

export interface Initiative {
  id: string;
  title: string;
  description: string;
  detailUrl: string;
  imageUrl: string;
}

// Mock data for future use
const MOCK_INITIATIVES: Initiative[] = [
  {
    id: 'digital-democracy',
    title: 'Digital Democracy Initiative',
    description: 'Equipping youth with skills to identify misinformation and participate in healthy online political discourse.',
    detailUrl: '/initiatives/digital-democracy',
    imageUrl: 'https://source.unsplash.com/random/600x400/?digital,democracy'
  },
  {
    id: 'community-policy-lab',
    title: 'Community Policy Lab',
    description: 'Hands-on workshops where youth learn to draft and advocate for local policy changes in their communities.',
    detailUrl: '/initiatives/policy-lab',
    imageUrl: 'https://source.unsplash.com/random/600x400/?community,policy'
  },
  {
    id: 'arts-advocacy',
    title: 'Arts for Advocacy',
    description: 'Using creative expression through music, visual art, and performance to engage youth in political discussions.',
    detailUrl: '/initiatives/arts-advocacy',
    imageUrl: 'https://source.unsplash.com/random/600x400/?art,advocacy'
  },
];

/**
 * Fetch all current initiatives
 */
export async function getInitiatives(): Promise<Initiative[]> {
  // This would be a real API call in production
  return MOCK_INITIATIVES;
}

/**
 * Fetch a single initiative by ID
 */
export async function getInitiativeById(id: string): Promise<Initiative | null> {
  // This would be a real API call in production
  return MOCK_INITIATIVES.find(initiative => initiative.id === id) || null;
}

/**
 * Subscribe user to newsletter
 */
export async function subscribeToNewsletter(): Promise<{ success: boolean; message: string }> {
  // This would be a real API call in production
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Thank you for subscribing to our newsletter!'
    };
  } catch {
    return {
      success: false,
      message: 'Something went wrong. Please try again later.'
    };
  }
} 