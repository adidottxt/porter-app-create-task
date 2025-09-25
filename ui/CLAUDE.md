# Claude Code Instructions

This file contains important instructions and patterns for working with this codebase.

## Tailwind CSS & Custom Colors

### Using Custom CSS Variables in Tailwind

When using custom CSS variables defined in `globals.css`, you have two approaches:

#### 1. Pre-configured Colors (Recommended)

Use the pre-configured color names in `tailwind.config.ts`:

```tsx
// ✅ Good - these work because they're defined in tailwind.config.ts
className = 'bg-primary text-primary-foreground'
```

#### 2. Direct CSS Variable Access (For new/custom colors)

Use the bracket notation with CSS variables:

```tsx
// ✅ Good - direct CSS variable access
className = 'bg-[var(--nordic-gray-600)]'
className = 'text-[var(--custom-color)]'
className = 'border-[var(--nordic-gray-700)]'
```

#### ❌ What Doesn't Work

```tsx
// ❌ Bad - Tailwind doesn't know about custom color names not in config
className = 'bg-nordicGray-600' // Won't work unless added to tailwind.config.ts
```

### Custom Color Palette

The following custom colors are available:

**Nordic Gray Shades:**

- `--nordic-gray-100`: #F4F5F8
- `--nordic-gray-200`: #E1E2E8
- `--nordic-gray-300`: #CACBD5
- `--nordic-gray-400`: #AAAAB5
- `--nordic-gray-500`: #92939A
- `--nordic-gray-600`: #76777C
- `--nordic-gray-700`: #5A5B5F
- `--nordic-gray-800`: #14151A
- `--nordic-gray-900`: #0F1014

**Other Color Families:**

- Magic Blue (100, 300, 500, 700, 900)
- Ocean Teal (100, 300, 500, 700, 900)
- Forest Green (100, 300, 500, 700, 900)
- Golden Amber (100, 300, 500, 700, 900)
- Crimson Red (100, 300, 500, 700, 900)
- Rose Pink (100, 300, 500, 700, 900)

### Adding New Colors

1. **Add to CSS variables** in `src/app/globals.css`:

```css
--new-color-500: #123456;
```

2. **Add to Tailwind config** in `tailwind.config.ts`:

```ts
newColor: {
  500: 'var(--new-color-500)',
}
```

3. **Use in components**:

```tsx
className = 'bg-newColor-500' // Now this works
// OR
className = 'bg-[var(--new-color-500)]' // This always works
```

## Development Patterns

### Component Structure

- Use shadcn/ui components as base
- Extend with custom styling using CSS variables
- Keep components in `src/components/ui/` for reusable UI elements
- Keep page-specific components in `src/components/` subdirectories

### API Integration

- Use the service layer in `src/services/api.ts`
- Use error handling utilities from `src/utils/errorHandling.ts`
- Use loading state hooks from `src/hooks/useApiState.ts`

### Testing

- No unit tests required for this project
- Focus on functionality and user experience

### Linting

- Run `npm run lint` to check for issues
- Fix all TypeScript errors before committing
- Avoid using `any` types - use `unknown` instead
