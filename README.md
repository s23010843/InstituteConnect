# Excellence Institute - Replit Development Guide

## Overview

Excellence Institute is a modern university website application built with a full-stack architecture using React (frontend), Express.js (backend), and PostgreSQL (database). The application serves as a comprehensive educational platform showcasing university programs, faculty, research initiatives, and providing student authentication and dashboard functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for the institute's brand
- **State Management**: TanStack Query for server state, React Context for authentication
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with support for Google and Apple OAuth
- **Session Management**: Database-stored sessions with token-based access
- **API Design**: RESTful API endpoints following standard HTTP conventions

### Progressive Web App (PWA)
- **Service Worker**: Custom caching strategy for offline functionality
- **App Manifest**: Configured for native app-like experience
- **Install Prompts**: Automatic PWA installation banners

## Key Components

### Authentication System
- **Multi-provider OAuth**: Google and Apple Sign-In integration
- **Session Management**: Secure token-based authentication with database session storage
- **Protected Routes**: Dashboard access restricted to authenticated users
- **User Roles**: Support for student, faculty, and admin roles

### Database Schema
- **Users Table**: Stores user profiles with OAuth provider information and role flags
- **Sessions Table**: Manages authentication tokens and expiration
- **Programs Table**: University academic programs with metadata
- **Faculty Table**: Faculty member profiles and specializations

### UI Component System
- **Design System**: Custom theme based on institute branding (blue, orange, green color palette)
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: Radix UI primitives ensure WCAG compliance
- **Reusable Components**: Modular component architecture for maintainability

## Data Flow

### Authentication Flow
1. User initiates OAuth sign-in (Google/Apple)
2. OAuth provider returns credential/authorization code
3. Backend validates with OAuth provider and creates/updates user record
4. JWT token generated and stored in database sessions table
5. Token returned to client and stored in localStorage
6. Subsequent requests include Bearer token for authentication

### Page Navigation Flow
1. Unauthenticated users land on marketing homepage
2. Authentication modal provides OAuth sign-in options
3. Successful authentication redirects to student dashboard
4. Dashboard displays personalized academic information and progress

### API Communication
- **Client-Server**: REST API with JSON payloads
- **Error Handling**: Standardized error responses with proper HTTP status codes
- **Query Management**: TanStack Query handles caching, background updates, and optimistic updates

## External Dependencies

### Authentication Providers
- **Google OAuth**: Requires `VITE_GOOGLE_CLIENT_ID` environment variable
- **Apple Sign-In**: Apple Developer account and domain verification required

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Connection**: Requires `DATABASE_URL` environment variable
- **Migration**: Drizzle Kit handles schema migrations

### Third-party Libraries
- **UI Components**: Radix UI primitives for accessibility and functionality
- **Icons**: Lucide React for consistent icon set
- **Fonts**: Google Fonts (Roboto and Roboto Slab)
- **Form Handling**: React Hook Form with Zod validation

## Deployment Strategy

### Development Setup
- **Environment**: Node.js with ES modules
- **Dev Server**: Vite development server with HMR
- **Database**: Local development uses same Neon database as production
- **Scripts**: `npm run dev` for development, `npm run build` for production

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied with `npm run db:push`
- **Deployment**: Single server deployment serving both API and static files

### Environment Configuration
- **Development**: Uses `.env` file for local configuration
- **Production**: Environment variables set in deployment platform
- **Required Variables**: `DATABASE_URL`, `VITE_GOOGLE_CLIENT_ID`

## Changelog

- July 02, 2025: Added client-side routing, authentication pages, error pages, and dynamic year functionality
  - Implemented client-side routing with wouter (no page reloads)
  - Created dedicated login and signup pages with OAuth integration
  - Added 404, 500, and 403 error pages with appropriate styling
  - Implemented dynamic current year functionality using date utilities
  - Updated navigation to use Link components for seamless routing
  - Added protected routes for dashboard access
  - Created terms of service and privacy policy pages
  - Enhanced user experience with proper authentication flow
- July 02, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.