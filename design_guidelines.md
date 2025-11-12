# Design Guidelines: Mobile-First Restaurant Menu Ordering App

## Design Approach

**Reference-Based Approach** drawing from leading food delivery platforms (UberEats, DoorDash, Swiggy) with emphasis on:
- Appetizing, image-forward presentation
- Effortless mobile navigation optimized for thumb reach
- Trust-building through clarity and visual hierarchy
- Seamless WhatsApp integration that feels native

## Typography

**Font Family**: Inter or similar modern sans-serif via Google Fonts CDN
- **Headings**: Semi-bold (600) for restaurant name, category titles, item names
- **Body**: Regular (400) for descriptions, notes, cart details
- **Price**: Bold (700) to emphasize value
- **Sizes**: 
  - Restaurant/App name: text-2xl
  - Category headers: text-lg 
  - Item names: text-base
  - Descriptions/notes: text-sm
  - Prices: text-lg (bold)

## Layout System

**Tailwind Spacing**: Use units of 2, 3, 4, 6, and 8 consistently
- Sections: p-4, py-6
- Cards: p-3, gap-3
- Buttons: px-6, py-3
- Modal padding: p-6

**Container**: max-w-lg centered (mx-auto) for optimal mobile reading width

## Component Library

### Homepage
**Banner Carousel** (top priority):
- Full-width image slider with auto-play (5s intervals)
- Minimum height: 180px (h-45)
- Dots navigation below carousel
- Images should showcase promotional offers/special dishes

**Category Navigation**:
- Horizontal scrollable pill buttons below banner
- Active category highlighted with filled background
- Smooth scroll to category sections

**Menu Display**:
- Category headers: Sticky on scroll, full-width with separator line
- Item cards: Full-width with left-aligned image (80px × 80px), name, description (2-line truncate), price right-aligned

### Item Detail Modal
**Full-screen overlay** (mobile) with:
- Hero image at top (h-64)
- Close button (X) top-right with blurred background
- Content section: name (text-xl), description, price (prominent)
- Quantity selector: Circle buttons (-/+) flanking number
- Note textarea: Placeholder "Special instructions (optional)", 3 rows
- Fixed bottom CTA: "Add to Cart" button spanning full width

### Shopping Cart (Slide-up drawer or dedicated page)
**Header**: "Your Order" with item count badge
**Item List**:
- Each item card shows: name, quantity (×N), subtotal, note preview (1 line, italic)
- Edit icon to reopen item modal
- Remove icon (trash)
- Dividers between items

**Footer**: Subtotal display + "Proceed to Order Summary" button

### Order Summary Page
**Header**: "Order Summary"
**Detailed List**: Full item breakdown with all notes visible
**Note Section**: "Additional Instructions" text area for delivery/general notes
**WhatsApp CTA**: Large button "Send Order via WhatsApp" with WhatsApp icon from Font Awesome

### Admin Dashboard (Desktop-optimized)
**Sidebar Navigation**: Categories, Items, Banners, Settings
**Content Area**: 
- Tables with action buttons (Edit, Delete, Toggle Visibility)
- Forms with image upload previews
- Status badges (Available/Out of Stock/Hidden)

## Core Patterns

**Cards**: Rounded corners (rounded-lg), subtle shadow, white background
**Buttons**: 
- Primary: Full color with white text, rounded-lg
- Secondary: Outlined with border-2
- Icon buttons: Circular with subtle background
- CTA buttons on images: backdrop-blur-md with semi-transparent background

**Modals/Drawers**: 
- Overlay with backdrop-blur
- Slide-up animation from bottom
- Rounded top corners (rounded-t-2xl)

**Empty States**: Friendly icon + message for empty cart, no items in category

## Images

**Required Images**:
1. **Banner Carousel**: 3-5 promotional images (offers, specials, new items) - 16:9 ratio, vibrant food photography
2. **Menu Items**: Each item card includes square product photo (1:1 ratio) - appetizing, well-lit food shots
3. **Item Detail Modal**: Larger hero image of the dish - same image as card, displayed prominently

**Placeholder Strategy**: Use food-themed illustrations or solid colors with dish icons for items without images during development

## Accessibility

- Minimum touch target: 44px × 44px for all buttons
- Form inputs with clear labels
- Sufficient contrast ratios (4.5:1 minimum)
- Focus states visible on all interactive elements
- Modal close buttons easily accessible

## Mobile-First Optimizations

- Bottom navigation bar for cart access (fixed)
- Thumb-zone friendly: Primary actions in bottom third
- Generous padding to prevent mis-taps
- Quick add-to-cart from item cards (no modal) with default quantity 1, optional modal for customization
- Pull-to-refresh on menu page

## Visual Hierarchy

1. **Most Prominent**: Food images, prices, CTAs
2. **Secondary**: Item names, category headers
3. **Tertiary**: Descriptions, notes, metadata

**Whitespace**: Generous breathing room between sections (py-6), tighter within cards (gap-2)