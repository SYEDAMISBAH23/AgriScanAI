# AgriScan - AI-Powered Organic Produce Verification System

## Overview

AgriScan is a web-based application that uses AI-powered image analysis to verify the authenticity of organic produce. Users can upload photos of fruits and vegetables, and the system analyzes both visual features and PLU (Price Look-Up) codes to determine whether the produce is genuinely organic. The application provides detailed verification results including confidence scores, reliability ratings, nutritional information, and handling recommendations.

The system addresses organic food fraud by combining computer vision with PLU code verification, offering consumers a trustworthy tool to validate their organic produce purchases before consumption.

## Recent Updates (November 2025)

- **Complete Color Palette Redesign**: Updated to sage green, green, and cream color scheme
- **Simplified UI**: Removed bright gradients and flashy effects across all pages
- **Fixed History Page**: Resolved undefined property errors in history card component
- **About Page Redesign**: Simplified with subdued colors and clean layout

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

**Storage Interface**: Abstracted storage layer with an in-memory implementation (`MemStorage`). The interface defines CRUD operations for users, allowing future database integration without frontend changes.

**Database Schema**: Drizzle ORM configured for PostgreSQL with a basic users table (id, username, password). The schema is defined but not actively used since the application relies on localStorage for session management and the external API for produce verification.

**Session Management**: Currently implemented client-side via localStorage. The backend includes session middleware setup but authentication is handled as a mock implementation in the frontend.

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
4. Results are stored in localStorage and displayed on the results page
5. Past scans are maintained in history for user reference

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

**PostgreSQL**: Configured via Drizzle ORM and Neon serverless driver (`@neondatabase/serverless`), though not actively storing application data. User authentication and scan history currently persist in localStorage rather than the database.

**Migration Strategy**: Drizzle Kit handles schema migrations with configuration pointing to `./migrations` directory.

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