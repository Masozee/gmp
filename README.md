# AI Agent Dashboard

A modern dashboard application built with Next.js 15, TypeScript, and shadcn components.

## Tech Stack

- Next.js 15
- TypeScript
- better-sqlite3 (optimized for performance)
- shadcn/ui components
- Tailwind CSS

## Features

- User Authentication
- Profile Management
- Error Logging System
- Dark Mode Support
- Responsive Design
- Calendar Integration
- Optimized Database Performance
- Raw SQL Queries for Speed

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

4. Initialize database with performance optimizations:
```bash
curl http://localhost:3000/api/init
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
│   ├── sqlite.ts     # SQLite database utilities
│   ├── api-helpers.ts # API route helpers
│   └── init-database.ts # Database optimization
├── styles/           # Global styles
└── types/            # TypeScript type definitions
```

## Database Performance Optimizations

This project uses better-sqlite3 instead of Prisma ORM for improved performance:

- **Raw SQL Queries**: Direct SQL execution for faster response times
- **Prepared Statements**: Pre-compiled SQL for repeated operations
- **Transaction Support**: Atomic operations for data integrity
- **WAL Mode**: Write-Ahead Logging for better concurrency
- **Optimized Indices**: Strategic indices for common query patterns
- **Memory Optimizations**: Efficient cache utilization

To reinitialize performance settings after significant database changes:

```bash
curl http://localhost:3000/api/init
```

## Development Guidelines

- Follow TypeScript best practices
- Use shadcn components for UI consistency
- Implement proper error handling
- Write comprehensive documentation
- Maintain test coverage
- Use prepared statements for better query performance

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
