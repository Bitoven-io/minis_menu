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
- Logo URL, footer text, contact information (phone, email, address)
- Address link (optional) for custom Google Maps URL
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

**Object Storage (Replit App Storage):**
- Google Cloud Storage backend via Replit's built-in object storage integration
- Direct file uploads through Uppy dashboard modal interface
- Public read access for customer-facing images (menu items, banners, logo)
- Private uploads with ACL policy management for access control
- Normalized object paths for stable, non-expiring image URLs
- Upload flow: Admin uploads → signed URL → ACL set to public → normalized path stored
- Serve flow: GET /objects/:objectPath serves images with public read access

**Image Upload Architecture:**
- **ObjectUploader Component**: Reusable React component using Uppy for file selection and upload
- **Uppy UI Styling**: CSS loaded via CDN (jsDelivr) for @uppy/core and @uppy/dashboard to avoid bundle bloat
- **Server Endpoints**:
  - POST /api/objects/upload: Returns signed upload URL for direct-to-storage uploads
  - PUT /api/images: Normalizes uploaded image path and sets public ACL policy
  - GET /objects/:objectPath: Serves uploaded images with public read access
- **ObjectStorageService**: Handles upload URL generation, ACL management, and file serving
- **ACL Policies**: Metadata-based access control with visibility: "public" for customer-facing images

**Build & Deployment:**
- ESBuild for server-side bundling
- Vite for client-side bundling and optimization
- Production build outputs to dist/ directory
- Separate client and server build processes

## Implementation Status

### Completed Features

**Customer-Facing Features:**
- Mobile-first homepage with banner carousel
- Category-based menu browsing with horizontal scrolling
- Menu item display with images, descriptions, and pricing
- Shopping cart with per-item special requests/notes
- WhatsApp checkout integration with formatted order messages
- Persistent cart storage using localStorage
- Restaurant branding (logo, name, contact information) from settings

**Admin Dashboard:**
- Secure authentication system with username/password login
- Protected routes with session-based authentication (admin/admin123)
- Category management (create, edit, delete, reorder)
- Menu item management (create, edit, delete, hide, toggle availability)
  - File upload functionality for menu item images via Uppy modal
  - Image preview and removal capabilities
- Banner management (create, edit, delete, reorder, toggle active status)
  - File upload functionality for banner images via Uppy modal
  - Image preview and removal capabilities
- Restaurant settings (name, logo, footer tagline, contact information, address link)
  - File upload functionality for restaurant logo via Uppy modal
  - Logo preview and removal capabilities
  - Custom Google Maps link field with URL validation
- Responsive sidebar navigation for all admin pages
- Comprehensive data-testid attributes for testing
- All images stored in Replit App Storage with public access for customers

**Technical Implementation:**
- Full-stack TypeScript with type-safe database operations
- Drizzle ORM with PostgreSQL database
- TanStack Query for efficient data fetching and caching
- React Hook Form with Zod validation
- Shadcn/ui component library with custom branding
- Session-based authentication with Passport.js
- RESTful API design with proper error handling

### Known Limitations

**Cache Synchronization:**
- Admin settings changes require a manual page refresh for updates to appear on the public homepage
- This is due to TanStack Query's aggressive caching strategy (`staleTime: Infinity`)
- All data is correctly saved to the database; the limitation only affects immediate cache updates
- Workaround: Refresh the public page after making admin changes
- Future enhancement: Implement WebSocket-based real-time updates or reduce staleTime

### Future Enhancements (Post-MVP)

**Phase 2 Features:**
- Customer user registration and authentication
- Order history tracking for registered customers
- Map-based delivery location selection
- Order status tracking
- Real-time cache synchronization between admin and public views