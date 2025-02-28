import { PrismaClient } from '@prisma/client'

declare global {
  namespace PrismaClient {
    interface PrismaClient {
      eventCategory: any;
      event: any;
    }
  }
}

export {}; 