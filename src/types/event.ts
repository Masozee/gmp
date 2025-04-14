"use client"

// EventStatus enum
export enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Define types for the speakers and tags
export interface EventSpeaker {
  id: string;
  firstName: string;
  lastName: string;
  organization: string | null;
  photoUrl: string | null;
  order: number;
  role: string | null;
}

export interface EventTag {
  id: string;
  name: string;
  slug: string;
}

export interface EventWithRelations {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  location: string;
  venue: string | null;
  startDate: string;
  endDate: string;
  posterImage: string | null;
  posterCredit: string | null;
  status: string;
  published: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  speakers: EventSpeaker[];
  tags: EventTag[];
}

// Event without relations for database operations
export interface EventRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  location: string;
  venue: string | null;
  startDate: string;
  endDate: string;
  posterImage: string | null;
  posterCredit: string | null;
  status: string;
  published: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category_id: string;
  category_name: string;
} 