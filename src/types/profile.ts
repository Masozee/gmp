export interface Profile {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  organization?: string
  bio?: string
  category: "AUTHOR" | "BOARD" | "STAFF" | "RESEARCHER"
  photoUrl?: string
  createdAt?: string
  updatedAt?: string
}

export type ProfileFormData = Omit<Profile, "id" | "createdAt" | "updatedAt"> 