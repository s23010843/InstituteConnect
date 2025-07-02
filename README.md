# Institute Website Project

## Overview
A comprehensive institute website with AJAX routing and multi-modal authentication including email/OTP verification and social login (Google/Apple). Built with React frontend and Express backend using MySQL database.

## System Architecture
**Frontend (React + TypeScript):**
- Vite for build tooling and development
- React Query for API state management  
- Wouter for client-side routing (AJAX navigation)
- Tailwind CSS for styling
- React Hook Form for form handling

**Backend (Node.js + Express):**
- Express.js RESTful API server
- MySQL database with Drizzle ORM
- JWT-based authentication
- Passport.js for OAuth (Google/Apple)
- Nodemailer for email services
- bcryptjs for password hashing

**Database (MySQL):**
- Users with social login integration
- Pages, News, Courses, Faculty content
- Contact inquiries
- Session management

## Key Components

**Authentication System:**
- Email/password registration with OTP verification
- Google OAuth integration
- Apple OAuth integration  
- JWT tokens for session management
- Protected route middleware

**Content Management:**
- Dynamic pages system
- News/announcements
- Course catalog
- Faculty directory
- Contact inquiry handling

**Frontend Features:**
- AJAX routing without page reloads
- Responsive navigation
- Authentication state management
- Form validation with Zod schemas
- Toast notifications

## Data Flow
1. User registers/logs in through email or social providers
2. Backend validates credentials and issues JWT tokens
3. Frontend stores tokens and makes authenticated API requests
4. React Query manages server state and caching
5. Wouter handles client-side navigation without page reloads

## External Dependencies
- MySQL database for data persistence
- SMTP service for email delivery (OTP codes)
- Google OAuth API for social login
- Apple OAuth API for social login

## Deployment Strategy
- Express server serves both API and static frontend files
- Environment variables for database and OAuth credentials
- Replit deployment with automatic SSL and domain handling

## Recent Changes
- July 02, 2025: Initial project architecture established
- Set up full-stack TypeScript application structure
- Implemented MySQL schema with Drizzle ORM
- Created authentication system with multiple providers
- Built React frontend with AJAX routing
- Configured development environment

## User Preferences
Preferred communication style: Simple, everyday language.

---

**Tech Stack:** React, TypeScript, Express.js, MySQL, Drizzle ORM, Tailwind CSS, React Query, Wouter