# Nerdle League Application

## Overview

This is a React-based gaming/league platform being rebranded from "Leleague" to match Nerdle's branding and styling. The application includes functionality for user management, leagues, game statistics, and social authentication. Built with Create React App and modern React patterns.

## Recent Changes

### 2025-07-30: Project Migration & Rebranding Initiative
- Successfully migrated React app from leleague-react directory to root
- Installed dependencies with yarn using legacy peer deps
- Fixed environment variable issues for API connectivity
- Added REACT_APP_API_URL secret pointing to https://api.leaderboardle.com/
- **COMPLETED**: Nerdle rebranding process
  - Updated all branding to "Nerdle League" throughout the application
  - Applied Nerdle color scheme (#820458 purple, #398874 teal) 
  - Replaced all logos with official Nerdle branding assets
  - Removed all "leaderboardle" references from UI and sharing text
  - **Changed background from dark to clean white** to match Nerdle's aesthetic
  - Updated text colors from white to dark gray/black for proper contrast
  - Applied Quicksand font family as primary typography

### 2025-08-06: Game Filter UX Improvements
- **COMPLETED**: Updated games filter dropdown to prioritize Nerdle
  - Changed default game selection from "All Games" to "Nerdle" (nerdlegame)
  - Reordered dropdown options to show "Nerdle" first  
  - Updated all API hooks to default to "nerdlegame" game parameter (fixed from "classic")
  - Modified game filter logic in statistics and leagues components
  - Fixed initial load issue where statistics showed 0 games despite recent play
  - **CRITICAL FIX**: Corrected API parameter from "classic" to "nerdlegame" for proper Nerdle data loading

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript/JSX
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **Routing**: Wouter for client-side routing (lightweight React Router alternative)
- **State Management**: TanStack Query (React Query) for server state, Zustand for client state
- **Build Tool**: Vite for fast development and optimized production builds
- **Component Library**: Radix UI primitives with custom shadcn/ui styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **Development**: Hot reload with tsx for TypeScript execution
- **API Design**: RESTful APIs with /api prefix routing

### Build System
- **Frontend**: Vite with React plugin for fast HMR and optimized builds
- **Backend**: esbuild for server bundling and compilation
- **TypeScript**: Shared configuration across frontend, backend, and shared modules
- **Development**: Concurrent development servers with Vite middleware integration

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Located in `shared/schema.ts` for type sharing between frontend and backend
- **Migrations**: Generated to `./migrations` directory
- **Connection**: Neon Database serverless connection via environment variables

### Authentication & Storage
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **User Management**: Basic user CRUD operations with username-based lookup
- **Session**: Placeholder for session management implementation

### UI Components
- **Design System**: shadcn/ui with Tailwind CSS for consistent styling
- **Error Handling**: React Error Boundaries for graceful error recovery
- **Responsive Design**: Mobile-first approach with Tailwind utilities
- **Toast Notifications**: Integrated toast system for user feedback

### Legacy Integration
- **Existing React App**: `leleague-react` directory contains existing React application
- **Migration Path**: Current structure suggests migration from legacy app to new stack
- **Feature Parity**: Legacy app includes extensive gaming/league functionality to be ported

## Data Flow

### Client-Server Communication
1. Frontend makes API requests to `/api/*` endpoints
2. Express server handles routing and business logic
3. Drizzle ORM manages database operations
4. Responses flow back through the same chain

### State Management
1. TanStack Query handles server state caching and synchronization
2. Local component state for UI interactions
3. Shared types between frontend and backend ensure type safety

### Development Workflow
1. Vite serves frontend with HMR
2. Express server runs concurrently with hot reload
3. Database changes managed through Drizzle migrations
4. TypeScript provides compile-time error checking

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: Managed via DATABASE_URL environment variable
- **Pooling**: Built-in connection pooling through Neon's serverless architecture

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Replit Integration**: Custom plugins for development environment
- **Error Overlay**: Runtime error modal for development debugging
- **Hot Reload**: File watching and automatic refresh

## Deployment Strategy

### Production Build
1. **Frontend**: Vite builds optimized static assets to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: Local development with Vite dev server
- **Production**: Served static files through Express with API routes
- **Database**: Environment-based connection strings for different stages

### Scalability Considerations
- **Database**: Serverless PostgreSQL scales automatically
- **Static Assets**: Can be served via CDN in production
- **API**: Express server can be deployed to serverless platforms
- **Caching**: TanStack Query provides client-side caching strategy

The architecture prioritizes developer experience with fast hot reload, type safety, and modern tooling while maintaining production readiness with optimized builds and scalable database solutions.