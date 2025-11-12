# Restaurant Menu Ordering System

## Overview

This is a mobile-first restaurant menu ordering application that allows customers to browse menu items and place orders via WhatsApp. The system features an admin dashboard for managing menu items, categories, banners, and settings. Built with a focus on appetizing visual presentation and effortless mobile navigation, drawing inspiration from leading food delivery platforms (UberEats, DoorDash, Swiggy).

The application enables restaurant owners to showcase their menu with image-forward presentation, manage availability and pricing, and receive orders directly through WhatsApp integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)

**UI Component System:**
- Shadcn/ui component library (Radix UI primitives) for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- "New York" style variant from Shadcn configuration
- Mobile-first responsive design approach with max-width constraints (max-w-lg)

**State Management:**
- TanStack Query (React Query) for server state management, caching, and data fetching
- Local React state (useState) for client-side UI state (cart, modals, navigation)
- Session-based authentication state managed through Passport.js sessions

**Key Design Patterns:**
- Component composition with proper separation of concerns (presentational vs. container components)
- Custom hooks for reusable logic (use-mobile, use-toast)
- Path aliases (@/, @shared/, @assets/) for clean imports
- TypeScript strict mode for compile-time safety

**Frontend Structure:**
```
client/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ui/        # Shadcn base components
│   │   └── [feature]  # Feature-specific components
│   ├── pages/         # Route-level page components
│   ├── hooks/         # Custom React hooks
│   └── lib/           # Utilities and configurations
```

### Backend Architecture

**Server Framework:**
- Express.js for HTTP server and API routing
- Node.js runtime with ES modules (type: "module")
- TypeScript for type safety across the entire stack

**Authentication & Session Management:**
- Passport.js with Local Strategy for username/password authentication
- Express-session for session management
- Bcrypt.js for password hashing
- Session-based authentication (no JWT) with HTTP-only cookies

**API Design:**
- RESTful API endpoints under `/api/*` prefix
- Authentication endpoints: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- Protected routes using `requireAuth` middleware
- Resource-based endpoints for categories, menu items, banners, and settings

**Server Structure:**
```
server/
├── index.ts        # Express app setup and middleware configuration
├── routes.ts       # API route definitions
├── auth.ts         # Passport configuration and auth middleware
├── storage.ts      # Data access layer abstraction
├── db.ts           # Database client initialization
└── vite.ts         # Vite integration for development
```

**Data Access Layer:**
- Abstract IStorage interface defining all data operations
- Separation between storage interface and implementation
- Methods for CRUD operations on all entities (users, categories, items, banners, settings)
- Support for ordering/reordering operations

### Database Architecture

**ORM & Database:**
- Drizzle ORM for type-safe database operations
- PostgreSQL as the primary database (configured via Neon serverless)
- WebSocket-based connection pooling for serverless environments
- Schema-first approach with shared types between frontend and backend

**Database Schema:**

**Users Table:**
- UUID primary key
- Username (unique) and hashed password
- Used for admin authentication

**Categories Table:**
- UUID primary key
- Name and order (integer for sorting)
- Supports manual reordering

**Menu Items Table:**
- UUID primary key with foreign key to categories
- Name, description, price (stored as integers in cents)
- Image URL, availability flag, hidden flag
- No cascade delete (items reference categories)

**Banners Table:**
- UUID primary key
- Image URL, order, and active status
- Auto-play carousel on homepage

**Settings Table:**
- UUID primary key
- WhatsApp number, restaurant name, currency
- Single row configuration table

**Schema Validation:**
- Zod schemas generated from Drizzle schema using drizzle-zod
- Shared validation logic between client and server
- Type inference for Insert and Select operations

### External Dependencies

**Third-Party Services:**

**WhatsApp Integration:**
- Direct wa.me URL scheme for order submission
- No API authentication required
- Order details formatted as text message
- Opens in new window/tab for seamless experience

**Database Hosting:**
- Neon serverless PostgreSQL (via DATABASE_URL environment variable)
- WebSocket-based connections for serverless compatibility
- Connection pooling through @neondatabase/serverless

**UI Component Libraries:**
- Radix UI primitives for accessible component foundations
- Lucide React for consistent iconography
- React Hook Form with Zod resolvers for form validation
- Class Variance Authority for component variant management

**Development Tools:**
- Replit-specific plugins for development environment integration
- Vite plugins for error overlay and debugging
- Drizzle Kit for database migrations and schema management

**Asset Management:**
- Local image storage in attached_assets directory
- Placeholder images for menu items and banners
- CDN-ready structure for production optimization

**Build & Deployment:**
- ESBuild for server-side bundling
- Vite for client-side bundling and optimization
- Production build outputs to dist/ directory
- Separate client and server build processes