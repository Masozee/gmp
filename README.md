# GMP - Government Monitoring Platform

A comprehensive monitoring platform built with Next.js, TypeScript, and shadcn/ui components.

## Tech Stack

- Next.js 15
- TypeScript
- PostgreSQL
- shadcn/ui components
- Tailwind CSS

## Features

- User Authentication & Authorization
- Dark Mode Support
- Responsive Dashboard
- Error Logging System
- User Management
- Calendar Integration

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Masozee/gmp.git
cd gmp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/gmp"
JWT_SECRET="your-secure-jwt-secret"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and configurations
└── prisma/          # Database schema and migrations
```

## Development Guidelines

- Follow TypeScript best practices
- Use shadcn components for UI
- Implement proper error handling
- Write comprehensive tests
- Document new features

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License
