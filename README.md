# AI Agent Dashboard

A modern dashboard application built with Next.js 15, TypeScript, and shadcn components.

## Tech Stack

- Next.js 15
- TypeScript
- SQLite (Development)
- shadcn/ui components
- Tailwind CSS
- Prisma ORM

## Features

- User Authentication
- Profile Management
- Error Logging System
- Dark Mode Support
- Responsive Design
- Calendar Integration

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
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
├── lib/             # Utility functions and shared logic
├── styles/          # Global styles
└── types/           # TypeScript type definitions
```

## Development Guidelines

- Follow TypeScript best practices
- Use shadcn components for UI consistency
- Implement proper error handling
- Write comprehensive documentation
- Maintain test coverage

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
