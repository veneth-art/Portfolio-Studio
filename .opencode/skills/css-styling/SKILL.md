---
name: css-styling
description: CSS organization, responsive design, dark mode, and styling best practices
license: MIT
---

## What I do
Guides CSS styling following the project's established patterns.

## CSS Variables
- Use CSS variables for colors (`--cream`, `--dark`, `--accent`)
- Support both light and dark modes via `[data-theme="dark"]`
- Keep variables in `:root` and override in dark mode

## Responsive Design
- Use `clamp()` for fluid typography
- Mobile-first approach
- Breakpoints: `max-width: 768px`, `max-width: 1024px`

## Dark Mode Pattern
```css
[data-theme="dark"] {
  --cream: #1a1612;
  --dark: #f0ebe0;
}
```

## When to use me
- Adding new CSS styles
- Implementing dark mode
- Creating responsive layouts
- Styling components
