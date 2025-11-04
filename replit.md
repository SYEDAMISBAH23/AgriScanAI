# AgriScan - AI-Powered Organic Produce Verification System

## Overview

AgriScan is a web-based application that uses AI-powered image analysis to verify the authenticity of organic produce. Users can upload photos of fruits and vegetables, and the system analyzes both visual features and PLU (Price Look-Up) codes to determine whether the produce is genuinely organic. The application provides detailed verification results including confidence scores, reliability ratings, nutritional information, and handling recommendations.

The system addresses organic food fraud by combining computer vision with PLU code verification, offering consumers a trustworthy tool to validate their organic produce purchases before consumption.

## Recent Updates (November 2025)

### Enhanced Authentication System (Latest)
- **Sign In/Sign Up Toggle**: Login page now has tabs to switch between Sign In and Sign Up modes
- **Separate Signup Flow**: Dedicated /api/signup endpoint that checks for existing emails
- **Specific Error Messages**: 
  - "Email already in use" when trying to sign up with existing email
  - "Incorrect password" when password is wrong during login
  - "No account found with this email" when email doesn't exist
- **Confirm Password Field**: Added in signup mode to prevent typos
- **Forgot Password Feature**: 
  - Two-step flow: email verification → password reset
  - Dedicated /forgot-password page
  - Backend endpoints for /api/verify-email and /api/reset-password
  - Users can reset password if they forget it

### Database Migration
- **PostgreSQL Database Integration**: Migrated from localStorage to PostgreSQL for persistent, user-specific scan history
- **User Authentication**: Implemented real user accounts with UUID primary keys stored in database
- **Scan History Per User**: Each user now has their own isolated scan history that persists across devices and browsers
- **Password Management**: Users can sign up, login, and reset passwords with proper validation

### Earlier Updates
- **Complete Color Palette Redesign**: Updated to sage green, green, and cream color scheme
- **Simplified UI**: Removed bright gradients and flashy effects across all pages
- **Fixed History Page**: Resolved undefined property errors in history card component
- **About Page Redesign**: Simplified with subdued colors and clean layout
- **Smooth Scrolling**: Added smooth scroll to scanner section when clicking "Start Scanning" button
- **Updated Branding**: Changed app title to "AgriScan AI - Organic Produce Detection & Verification System" and updated logo from Leaf to ShieldCheck icon across all pages (home, login, about)
- **Manual PLU Entry**: Added ability to manually enter PLU codes when not detected in images

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, built using Vite as the build tool and development server.

**Routing**: Client-side routing implemented with Wouter, a lightweight React router. Authentication state is managed via localStorage with protected routes that redirect unauthenticated users to the login page.

**UI Component System**: Shadcn/ui component library with Radix UI primitives, providing accessible, customizable components. The design follows a subdued, professional aesthetic with a calm information-first approach.

**Styling**: Tailwind CSS with custom design tokens for consistency. The color system uses:
- **Primary**: Vibrant green (hsl 140 55% 42%) - fresh, natural brand color
- **Accent**: Sage green (hsl 95 22% 68%) - muted grayish-green for secondary elements
- **Background**: Cream (hsl 45 35% 96%) - warm, soft base color
- **Cards & Surfaces**: Light cream tones for subtle elevation
- **Subdued palette**: No bright gradients or flashy effects - emphasizes clarity and ease of use

**State Management**: React hooks for local component state, TanStack Query (React Query) for server state management and API caching. User session data and scan history are persisted in localStorage.

**Key Pages**:
- **Login page**: Split layout with form on left and informational panel on right, featuring Framer Motion animations
- **Home page**: Multi-section scrollable layout with Hero, How It Works timeline (4 steps), and expandable scanner section
- **Results page**: Clean grid layout with image, details, and tabbed content (Details/Nutrition) - simplified without elaborate gradients
- **History page**: Simple card grid with filter tabs (All/Organic/Non-Organic)
- **Fraud report page**: For user-submitted suspicious produce

**Design Philosophy**: 
- **Calm & Information-First**: Subdued color palette with no bright gradients or glowing effects
- **Clear Information Architecture**: Multi-section layouts with logical flow and easy navigation
- **Guided Workflows**: Step-by-step explanations (How It Works) to educate users
- **Subtle Microinteractions**: Framer Motion animations that are professional and restrained (fade-in, subtle slides)
- **Ease of Use**: Simplified UI with clear CTAs and reduced visual noise

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**API Strategy**: The application currently uses an external backend API hosted on Hugging Face Spaces (`https://iamsyedamisbah-agriscan-ai-backend.hf.space`) for produce verification inference. The Express server is minimal, primarily serving the built React frontend.

**Storage Interface**: Abstracted storage layer with `DatabaseStorage` implementation using PostgreSQL. The interface defines CRUD operations for users, scan history, and fraud reports with proper user isolation.

**Database Schema**: Drizzle ORM configured for PostgreSQL with three main tables:
- **users**: User accounts (id: UUID primary key, username: email, password)
- **scan_history**: User-specific scan records with foreign key to users table (id, userId, produceLabel, produceConfidence, organicLabel, detectedPlu, nutritionFacts, cleaningTips, imageUrl, createdAt)
- **fraud_reports**: Community fraud reports (id, userId, email, produceLabel, organicLabel, vendorName, location, description, createdAt)

**Session Management**: Hybrid approach - user identity (email and UUID) stored in localStorage for session persistence, while all scan history and user data persists in PostgreSQL database. Backend API routes validate userId on history operations.

### Data Flow

1. User uploads image and optional PLU code on the home page
2. FormData is sent to external Hugging Face API endpoint (`/infer_image`)
3. API returns comprehensive verification results including:
   - Produce label and detection confidence
   - Organic verdict (ORGANIC/NON_ORGANIC)
   - Verdict confidence and reliability rating
   - Detected PLU code and interpretation
   - AI reasoning for the verdict
   - Cleaning/handling recommendations
   - Nutritional information
4. Results are displayed on the results page
5. User can save scan to their history (stored in PostgreSQL database with userId)
6. Past scans are maintained in user-specific history accessible from any device

### Design Patterns

**Component Composition**: Reusable UI components (ImageUploadZone, ResultsCard, ReliabilityBadge, Navbar) promote consistency and maintainability.

**Protected Routes**: Higher-order component pattern wraps authenticated pages, centralizing authorization logic.

**Custom Hooks**: `use-toast` for notifications, `use-mobile` for responsive behavior detection.

**Example Components**: Dedicated example components for each major UI element, facilitating isolated development and testing.

## External Dependencies

### Third-Party Services

**AI Backend API**: Hugging Face Spaces hosting the Flask-based inference service
- Endpoint: `https://iamsyedamisbah-agriscan-ai-backend.hf.space`
- Functionality: Computer vision model for produce classification, OCR for PLU detection, organic verification logic
- Technology: Flask with PyTorch, MobileNetV2 architecture, OpenCV, EasyOCR

### UI Libraries

**Radix UI**: Comprehensive suite of accessible component primitives including dialogs, dropdowns, tooltips, alerts, and navigation elements.

**Shadcn/ui**: Pre-styled component library built on Radix UI with customizable theming.

**Embla Carousel**: Image carousel functionality for potential multi-image uploads.

**Class Variance Authority (CVA)**: Utility for managing component variants and conditional styling.

### Development Tools

**Vite**: Build tool and development server with hot module replacement, optimized for React applications.

**TypeScript**: Static typing across the entire application for improved developer experience and error prevention.

**Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL, though currently inactive.

**ESBuild**: Used for server-side bundling in production builds.

### Database

**PostgreSQL**: Actively used via Drizzle ORM and Neon serverless driver (`@neondatabase/serverless`) to store user accounts, scan history, and fraud reports. Each user's scan history is isolated by userId foreign key constraint.

**Migration Strategy**: Drizzle Kit handles schema migrations with `npm run db:push` command. Database schema changes are automatically applied without manual SQL migrations.

**Data Isolation**: User-specific data isolation enforced at database level - scan history queries filter by userId, ensuring each user sees only their own scans across all devices and browser sessions.

### Fonts

**Google Fonts**: 
- Inter/Poppins for primary text (readable, professional)
- Space Grotesk/DM Sans for headings and emphasis
- JetBrains Mono for technical data (PLU codes)

### Utility Libraries

**date-fns**: Date formatting and manipulation for timestamps in history and reports.

**clsx + tailwind-merge**: CSS class name composition and conflict resolution.

**Wouter**: Minimalist client-side router alternative to React Router.

**TanStack Query**: Asynchronous state management for API calls with caching, refetching, and loading states.