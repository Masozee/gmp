"use client"

// PublicationStatus enum
export enum PublicationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// Define types
export interface PublicationAuthor {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  organization: string | null;
  photoUrl: string | null;
}

export interface PublicationTag {
  id: string;
  name: string;
  slug: string;
}

export interface PublicationCategory {
  id: string;
  name: string;
}

export interface Publication {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  content: string;
  publicationDate: string | null;
  coverImage: string | null;
  imageCredit: string | null;
  published: number;
  status: PublicationStatus;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  category: PublicationCategory | null;
  authors: PublicationAuthor[];
  tags: PublicationTag[];
} 