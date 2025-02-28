export type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    events: number;
  };
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  categoryId: string;
  startDate: string | Date;
  endDate: string | Date;
  location?: string;
  venue?: string;
  posterUrl?: string;
  posterCredit?: string;
  published: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  category?: EventCategory;
  speakers?: EventSpeaker[];
  presentations?: Presentation[];
  tags?: TagOnEvent[];
}

export interface Speaker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organization?: string | null;
  position?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  events?: EventSpeaker[];
  presentations?: Presentation[];
}

export interface EventSpeaker {
  id: string;
  eventId: string;
  speakerId: string;
  order: number;
  role?: string | null;
  createdAt: Date;
  updatedAt: Date;
  event?: Event;
  speaker?: Speaker;
}

export interface Presentation {
  id: string;
  title: string;
  abstract?: string | null;
  slides?: string | null;
  videoUrl?: string | null;
  duration?: number | null; // in minutes
  speakerId: string;
  eventId?: string | null;
  startTime?: Date | null;
  endTime?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  speaker?: Speaker;
}

export interface TagOnEvent {
  eventId: string;
  tagId: string;
  createdAt: Date;
  event?: Event;
  tag?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface EventWithRelations extends Event {
  category: EventCategory;
  speakers: (EventSpeaker & {
    speaker: Speaker;
  })[];
  tags: (TagOnEvent & {
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  })[];
} 