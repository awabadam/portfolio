# Build Error Fixes - Client/Server Component Issues

## Problem

The build was failing with the error:

```
Error: Event handlers cannot be passed to Client Component props.
  {href: ..., children: </>, className: ..., onClick: function onClick}
                                                       ^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
```

## Root Cause

In Next.js App Router, components that use event handlers (onClick, onSubmit, onChange, etc.) or React hooks (useState, useEffect, etc.) must be Client Components. The error occurred because several components were using these features without the `"use client"` directive.

## Components Fixed

### 1. Footer Component (`src/components/layout/Footer.tsx`)

**Issue**: Using onClick handlers for GTM tracking without "use client" directive
**Fix**: Added `"use client"` at the top of the file

```typescript
"use client";

import Link from "next/link";
// ... rest of imports
```

### 2. ProjectCard Component (`src/components/ui/ProjectCard.tsx`)

**Issue**: Using onClick handlers for GTM tracking without "use client" directive
**Fix**: Added `"use client"` at the top of the file

```typescript
"use client";

import Link from "next/link";
// ... rest of imports
```

## Components Already Correct

The following components were already properly configured as Client Components:

### ✅ Already Client Components

- `src/components/layout/Navbar.tsx` - Uses onClick handlers for GTM tracking
- `src/components/sections/Services.tsx` - Uses onClick handlers for GTM tracking
- `src/components/sections/Header.tsx` - Uses useState and onClick handlers
- `src/components/sections/Contact.tsx` - Uses useState and onClick handlers
- `src/components/ui/Navbar.tsx` - Uses useState and onClick handlers
- `src/components/ui/mode-toggle.tsx` - Uses onClick handlers
- `src/components/ui/ImageGallery.tsx` - Uses useState and onClick handlers
- `src/components/ui/ContentCard.tsx` - Uses onClick prop
- `src/components/ui/PageHero.tsx` - Uses useState and onSubmit handlers
- `src/components/about/DetailedSkills.tsx` - Uses useState and onClick handlers
- `src/components/admin/layout/AdminLayout.tsx` - Uses useState, useEffect, and onClick handlers
- `src/components/admin/forms/ProjectForm.tsx` - Uses useState, useCallback, and form handlers
- `src/components/auth/LoginForm.tsx` - Uses useState, useEffect, and form handlers

## Next.js App Router Rules

### Server Components (Default)

- Cannot use event handlers (onClick, onSubmit, onChange, etc.)
- Cannot use React hooks (useState, useEffect, useCallback, etc.)
- Cannot use browser APIs (window, document, etc.)
- Can use async/await for data fetching
- Better for SEO and initial page load

### Client Components (Require "use client")

- Can use event handlers
- Can use React hooks
- Can use browser APIs
- Can be interactive
- Hydrated on the client side

## Best Practices Applied

### 1. Minimal Client Components

Only converted components that actually need interactivity to Client Components. This maintains the benefits of Server Components for static content.

### 2. GTM Tracking Integration

All GTM tracking functions are properly integrated in Client Components where user interactions occur.

### 3. Form Handling

All forms with state management and submission handling are Client Components.

### 4. Interactive UI Elements

All components with onClick handlers, state management, or other interactivity are Client Components.

## Verification

To verify the fixes work:

1. **Local Development**: Run `npm run dev` and check for any console errors
2. **Build Test**: Run `npm run build` to ensure no build errors
3. **Deployment**: Deploy to Vercel and verify successful build

## Common Patterns

### When to Use "use client"

- Components with onClick, onSubmit, onChange handlers
- Components using useState, useEffect, useCallback hooks
- Components that need browser APIs
- Interactive components (modals, dropdowns, etc.)
- Forms with state management

### When to Keep as Server Component

- Static content display
- Data fetching components
- SEO-critical components
- Components without interactivity

## Future Considerations

1. **Performance**: Keep Client Components minimal to reduce bundle size
2. **SEO**: Use Server Components for content that needs to be indexed
3. **Interactivity**: Convert to Client Components only when needed
4. **Testing**: Test both development and production builds

This fix ensures the portfolio website builds successfully while maintaining optimal performance and SEO benefits of Next.js App Router.
