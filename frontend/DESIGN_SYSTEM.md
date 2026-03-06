# CompliQuest Design System

## Overview
A minimal, liquid, sleek modern design system featuring glassmorphism effects, smooth animations, and gradient accents.

## Core Design Principles

### 1. Liquid Glassmorphism
- **Glass Effects**: Frosted glass backgrounds with backdrop blur
- **Transparency**: Layered opacity for depth
- **Smooth Borders**: Rounded corners (2xl, 3xl, 4xl)

### 2. Color Palette

#### Primary Colors
- Primary: `#667eea` (Purple-Blue)
- Secondary: `#764ba2` (Deep Purple)

#### Accent Colors
- Pink: `#f093fb`
- Coral: `#f5576c`
- Cyan: `#4facfe`
- Teal: `#00f2fe`

#### Gradients
- `liquid-gradient`: Purple-blue gradient (primary)
- `liquid-gradient-alt`: Pink-coral gradient
- `liquid-gradient-success`: Cyan-teal gradient
- `liquid-gradient-warning`: Pink-yellow gradient

### 3. Typography
- Font Family: Inter (primary), system fonts (fallback)
- Font Weights: Light (300), Medium (500), Semibold (600), Bold (700)
- Sizes: Responsive scaling from sm to 5xl

### 4. Animations

#### Available Animations
- `animate-float`: Gentle floating motion (6s loop)
- `animate-glow`: Pulsing glow effect (2s alternate)
- `animate-slide-up`: Slide up entrance (0.5s)
- `animate-fade-in`: Fade in entrance (0.3s)

#### Hover Effects
- `hover-lift`: Elevates element on hover with shadow
- Smooth transitions (300ms cubic-bezier)

### 5. Components

#### Glass Components
```css
.glass - Semi-transparent with blur
.glass-strong - More opaque with stronger blur
```

#### Buttons
- Primary: `liquid-gradient` with white text
- Secondary: `glass-strong` with dark text
- Hover: Opacity change + lift effect

#### Cards
- Rounded: `rounded-3xl` or `rounded-4xl`
- Shadow: `shadow-xl` or `shadow-2xl`
- Border: Subtle white borders or colored left borders

#### Forms
- Inputs: `glass-strong` backgrounds
- Focus: Ring effect with primary color
- Rounded: `rounded-2xl`

### 6. Layout
- Background: `liquid-gradient` on main container
- Sidebar: Glass effect with white text
- Header: Glass effect with backdrop blur
- Content: Floating glass cards

## Usage Examples

### Button
```tsx
<button className="liquid-gradient text-white px-8 py-4 rounded-2xl font-bold hover:opacity-90 hover-lift shadow-xl">
  Click Me
</button>
```

### Card
```tsx
<div className="glass-strong rounded-3xl p-8 shadow-2xl hover-lift">
  Content here
</div>
```

### Gradient Text
```tsx
<h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
  Title
</h1>
```

## Accessibility
- Sufficient color contrast maintained
- Focus states clearly visible
- Smooth transitions don't interfere with reduced motion preferences
- Semantic HTML structure preserved
