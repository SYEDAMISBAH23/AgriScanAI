# AgriScan Design Guidelines

## Design Approach
**Selected Approach**: Custom Application Design with Nature-Inspired Aesthetic
- Primary focus: Trust, credibility, and scientific accuracy in organic food verification
- Industry references: Health/wellness apps (MyFitnessPal for data clarity), Agricultural tech platforms, Scientific verification tools
- Balance between professional credibility and approachable user experience

## Core Design Principles
1. **Trust & Transparency**: Visual design should reinforce scientific accuracy and reliability
2. **Natural & Organic**: Reflect the product's purpose through earth-inspired aesthetics
3. **Clarity First**: Information-dense results must be scannable and digestible
4. **Action-Oriented**: Guide users smoothly through scan → results → decision workflow

## Color System
### Primary Palette (Earth & Natural Tones)
- **Primary Green**: #10B981 (emerald) - organic indicators, success states, primary CTAs
- **Forest Green**: #059669 - headers, navigation, brand elements
- **Warm Brown**: #92400E - accent elements, secondary text
- **Natural Beige**: #FEF3C7 - backgrounds, cards, subtle highlights

### Confidence Indicator Colors (Critical)
- **Very High Reliability**: #10B981 (green) - 90%+ confidence
- **High Reliability**: #F59E0B (amber/yellow) - 70-89% confidence  
- **Moderate Reliability**: #EF4444 (red) - below 70% confidence

### Neutral Foundation
- **Dark Text**: #1F2937 (slate-800) - primary text
- **Medium Gray**: #6B7280 - secondary text, labels
- **Light Gray**: #F3F4F6 - backgrounds, dividers
- **White**: #FFFFFF - card backgrounds, clean sections

## Typography System
### Font Selection
- **Primary Font**: Inter or Poppins (Google Fonts) - modern, readable, professional
- **Accent Font**: Space Grotesk or DM Sans - headings, emphasis elements
- **Monospace**: JetBrains Mono - PLU codes, technical data

### Type Scale
- **Display**: 3xl to 4xl (36-48px) - page titles, hero headings
- **Heading 1**: 2xl (30px) - section headers
- **Heading 2**: xl (24px) - card titles, subsection headers  
- **Heading 3**: lg (20px) - component headers
- **Body Large**: base (16px) - primary content, form labels
- **Body**: sm (14px) - secondary content, descriptions
- **Caption**: xs (12px) - timestamps, metadata, helper text

## Layout System
### Spacing Units (Tailwind Scale)
- **Micro spacing**: 1, 2 units (4px, 8px) - tight element spacing
- **Standard spacing**: 4, 6, 8 units (16px, 24px, 32px) - component padding, gaps
- **Section spacing**: 12, 16, 20 units (48px, 64px, 80px) - page sections, major divisions
- **Macro spacing**: 24, 32 units (96px, 128px) - between major page sections

### Grid & Containers
- **Max container width**: 7xl (1280px) for main content
- **Responsive breakpoints**: Mobile-first (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- **Content grids**: 1 column mobile, 2-3 columns tablet/desktop for cards

## Component Library

### Navigation Bar
- Fixed top position with subtle shadow
- Forest green background with white text
- Logo/brand left, navigation links center, user profile right
- Responsive hamburger menu on mobile
- Dropdown for user profile (username, logout)
- Active page indicator with bottom border accent

### Authentication Pages (Login)
- Centered card layout (max-width 400px)
- AgriScan branding with leaf icon or produce illustration at top
- Clean form inputs with green focus states
- Primary green submit button
- Professional, minimal design without distracting imagery

### Image Upload Section (Home Page Hero)
- Large, prominent upload area (400px+ height on desktop)
- Dashed border with green accent when hovering/dragging
- Centered upload icon (cloud with arrow) and instructional text
- Alternative camera capture button below main upload
- Optional manual PLU code input field beneath upload area
- Preview of uploaded image before submission

### Results Display Cards
- White background with subtle shadow
- Header showing produce name with confidence percentage badge
- Verdict section with large color-coded status (ORGANIC/NON-ORGANIC)
- Color-coded reliability indicator with icon (checkmark for very_high, warning for moderate)
- Collapsible sections for: PLU details, reasoning, recommendations, nutrition
- Icons for each information category (shield for verdict, book for nutrition, sparkles for cleaning)

### History Cards
- Timeline layout with most recent first
- Each card shows: thumbnail image, produce name, timestamp, verdict badge, confidence
- Click to expand full details
- Delete button (trash icon) on hover
- Search bar at top with filter options
- Empty state: illustration with "No scans yet" message

### Fraud Report Form
- Multi-step form with progress indicator
- Image upload with preview
- Severity dropdown with color coding (high=red, medium=yellow, low=green)
- Location and vendor fields with map icon
- Text area for description (3-5 rows minimum)
- Submit button with loading spinner state
- Success message with checkmark animation after submission

### Fraud Reports List
- Table or card grid showing: date, produce, PLU, severity badge, status label
- Status color coding: Pending (gray), Verified (yellow), Resolved (green)
- Statistics dashboard at top: total reports, verified count, resolved percentage
- Filter by severity and status

### About Page Structure
- Hero section with AgriScan mission statement
- Problem section: statistics on organic food fraud with visual data representation
- Solution section: how AgriScan works with illustrated step-by-step process
- Features grid (2-3 columns): list capabilities with icons
- Technology stack section with logos/icons for PyTorch, EasyOCR, Flask, React
- How it works: numbered steps with icons showing workflow
- Confidence levels explained with color-coded examples
- PLU code information panel with database examples
- Team/contact section at bottom

## Images & Visual Assets
### Hero Images
- **Home Page**: No traditional hero image - instead use large interactive upload zone as focal point
- **About Page**: Optional header image showing fresh organic produce in natural lighting (overhead shot, vibrant colors)

### Iconography
- Use Heroicons (outline style) throughout for consistency
- Key icons needed: camera, cloud-upload, shield-check, document-text, chart-bar, map-pin, exclamation-triangle, check-circle, x-circle

### Illustrations
- Empty states: Simple line illustrations in primary green
- Success states: Animated checkmark or gentle pulse effect
- Loading states: Spinning leaf or produce icon animation

## Interactive States
### Buttons
- **Primary**: Green background, white text, subtle shadow, scale transform on hover
- **Secondary**: Green border, green text, filled background on hover
- **Danger**: Red for delete actions, lighter red hover

### Form Inputs
- Neutral gray border at rest
- Green border on focus with subtle glow
- Error state: red border with error message below
- Success state: green border with checkmark icon

### Loading States
- Skeleton screens for data-heavy sections (history, reports)
- Spinner with green accent color for API calls
- Progress bar for image upload

### Transitions
- Smooth page transitions (200ms ease)
- Card hover: subtle lift with shadow increase
- Button hover: slight scale increase (102%)
- Minimal animation use - prioritize performance

## Responsive Behavior
### Mobile (< 768px)
- Single column layouts throughout
- Full-width cards and buttons
- Collapsible navigation menu
- Stacked form fields
- Reduced padding (py-8 vs py-16)

### Tablet (768px - 1024px)
- 2-column grids for history/reports
- Balanced sidebar + content layouts
- Medium padding values

### Desktop (> 1024px)
- 3-column grids where appropriate
- Generous whitespace and padding
- Maximum container widths enforced
- Side-by-side layouts (form + preview)

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Minimum contrast ratio 4.5:1 for text
- Focus indicators visible on all interactive elements
- Alt text for all images and icons
- ARIA labels for complex interactions
- Keyboard navigation support throughout

## Performance Considerations
- Lazy load images in history section
- Compress uploaded images before sending (max 5MB)
- Debounce search/filter inputs (300ms)
- Virtualize long lists (history with 100+ items)
- Optimize bundle with code splitting by route