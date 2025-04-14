# AI Agent Dashboard

A modern dashboard application built with Next.js 15, TypeScript, and shadcn components, using Bun as the runtime and package manager.

## Tech Stack

- Next.js 15
- TypeScript
- SQLite
- shadcn/ui components
- Tailwind CSS
- Bun runtime

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

2. Install dependencies with Bun:
```bash
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL=file:./data.db
JWT_SECRET=your_jwt_secret_key
NEXT_RUNTIME_BUN=true
```

4. Initialize the database:
```bash
bun run db:init
```

5. Start the development server:
```bash
bun run dev
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

## Using Bun

This project uses [Bun](https://bun.sh) for faster dependency installation, development, and production builds.

### Key Benefits:

- Faster package installation
- Improved development server performance
- Native TypeScript support without transpilation
- Built-in API for common tasks

### Useful Bun Commands:

- `bun install` - Install dependencies
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Run production server

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
