# Nerdle League Application

## Overview

This project is a React-based gaming/league platform, rebranded as "Nerdle League" to align with Nerdle's branding and styling. Its core purpose is to provide a platform for user management, league participation, game statistics tracking, and social authentication, specifically tailored for the Nerdle game. The application aims to offer a consistent and engaging user experience through a clean, branded interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript/JSX
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design, including Nerdle's specific color scheme (#820458 purple, #398874 teal) and a preference for a clean white background with dark gray/black text. Quicksand is the primary typography.
- **Routing**: Wouter for client-side routing.
- **State Management**: TanStack Query for server state, Zustand for client state.
- **Build Tool**: Vite for fast development and optimized production builds.
- **Component Library**: Radix UI primitives with custom shadcn/ui styling.
- **UI/UX Decisions**: Incorporates Nerdle branding elements like logos, favicons, and chart colors. Features dark mode functionality with persistence, and enhanced game filter UX prioritizing "Nerdle." Includes interactive play link dialogs and an enhanced multi-game diary with visual elements. Header redesigned to match the `nerdlegame.com` aesthetic, including specific fonts and iconography.

### Backend Architecture
- **Framework**: Express.js with TypeScript.
- **Database ORM**: Drizzle ORM for type-safe database operations.
- **Database**: PostgreSQL (configured for Neon Database).
- **API Design**: RESTful APIs with `/api` prefix routing.

### Build System
- **Frontend**: Vite with React plugin.
- **Backend**: esbuild for server bundling and compilation.
- **TypeScript**: Shared configuration across frontend, backend, and shared modules.

### Key Components
- **Database Layer**: Drizzle ORM with PostgreSQL dialect, schema in `shared/schema.ts`, migrations managed.
- **Authentication & Storage**: Abstracted storage layer, basic user CRUD, placeholder for session management.
- **UI Components**: shadcn/ui design system, React Error Boundaries, responsive design, integrated toast notifications.

## External Dependencies

- **Neon Database**: Serverless PostgreSQL hosting, connected via `DATABASE_URL`.
- **Radix UI**: Accessible component primitives for UI.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Lucide React**: Icon library.

## Recent Fixes

- **Authentication Data Loading Issue**: Fixed the "blank data" screen that appeared after login by ensuring the AuthProvider triggers a page refresh after successful authentication. This ensures all user data is properly loaded when the user signs in, preventing the need for manual page refresh.