# Pathfinder Dashboard - Guidelines & Best Practices

## 📋 Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Advanced Customization](#advanced-customization)
5. [Theme System](#theme-system)
6. [Props Reference](#props-reference)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Examples](#examples)

## 🎯 Overview

Pathfinder Dashboard is a highly customizable, ultra-modern React component built with Next.js 15 and TypeScript. It features:

- **Dark Theme Design** - Modern glassmorphism effects
- **Responsive Layout** - Perfect on mobile, tablet, and desktop
- **Interactive Animations** - Smooth transitions and micro-interactions
- **Theme System** - 3 built-in themes (Pathfinder, Adventurer, MasterGuide)
- **TypeScript Support** - Full type safety
- **Reusable Component** - Easy to integrate and customize

## 🚀 Installation

The component is already included in your project. Simply import it:

```tsx
import PathfinderDashboard from '@/components/dashboards/PathfinderDashboard'
```

## 📖 Basic Usage

### Minimal Setup

```tsx
import PathfinderDashboard from '@/components/dashboards/PathfinderDashboard'

export default function MyPage() {
  return <PathfinderDashboard />
}
```

### With Custom User Data

```tsx
import PathfinderDashboard from '@/components/dashboards/PathfinderDashboard'

export default function MyPage() {
  const userData = {
    name: "John Doe",
    class: "RANGER",
    club: "Pathfinder Club",
    overallProgress: 75,
    streak: 10,
    totalPoints: 2500,
    rank: "Gold Pathfinder",
    joinDate: "January 2024"
  }

  return <PathfinderDashboard userData={userData} />
}
```

## 🎨 Advanced Customization

### Custom Menu Cards

```tsx
const customMenuCards = [
  {
    id: 'my-module',
    title: 'My Module',
    description: 'Module description',
    icon: BookOpen,
    color: 'from-blue-500 to-purple-600',
    href: '/my-route',
    gradient: 'bg-gradient-to-br from-blue-50 to-purple-50',
    borderColor: 'border-blue-200',
    stats: 'Active'
  }
]

<PathfinderDashboard menuCards={customMenuCards} />
```

### Custom Chapters

```tsx
const customChapters = [
  { 
    name: 'Custom Chapter', 
    icon: '🎯', 
    progress: 80, 
    color: 'from-purple-400 to-pink-500' 
  }
]

<PathfinderDashboard chapters={customChapters} />
```

### Custom Activities

```tsx
const customActivities = [
  { 
    activity: 'Custom Activity', 
    time: '2 hours ago', 
    icon: '✨', 
    color: 'text-purple-500' 
  }
]

<PathfinderDashboard recentActivities={customActivities} />
```

## 🎭 Theme System

### Available Themes

1. **Pathfinder** (Default) - Purple/Pink gradient
2. **Adventurer** - Blue/Indigo gradient
3. **MasterGuide** - Gray/Slate gradient

### Usage

```tsx
// Default theme
<PathfinderDashboard />

// Specific theme
<PathfinderDashboard theme="adventurer" />
<PathfinderDashboard theme="masterguide" />
```

### Custom Theme Colors

Each theme uses specific color gradients:

- **Pathfinder**: `from-slate-900 via-purple-900 to-slate-900`
- **Adventurer**: `from-blue-900 via-indigo-900 to-purple-900`
- **MasterGuide**: `from-gray-900 via-slate-900 to-zinc-900`

## 📋 Props Reference

### Core Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `userData` | `Partial<UserData>` | `{}` | No | User data to display |
| `theme` | `'pathfinder' \| 'adventurer' \| 'masterguide'` | `'pathfinder'` | No | Dashboard theme |

### Content Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `menuCards` | `MenuCard[]` | `defaultMenuCards` | No | Menu cards configuration |
| `chapters` | `Chapter[]` | `defaultChapters` | No | Chapter progress data |
| `recentActivities` | `Activity[]` | `defaultActivities` | No | Recent activity feed |
| `pathfinderClasses` | `Array<{value, label, age}>` | `defaultPathfinderClasses` | No | Pathfinder class list |

### Display Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `showQuickActions` | `boolean` | `true` | No | Show quick actions section |
| `showRecentActivity` | `boolean` | `true` | No | Show recent activity section |
| `showChapterProgress` | `boolean` | `true` | No | Show chapter progress section |

### Customization Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `customLogo` | `ReactNode` | `null` | No | Custom logo for navbar |
| `customActions` | `ReactNode` | `null` | No | Custom action buttons |

## 🎯 Interface Definitions

### UserData

```tsx
interface UserData {
  name: string          // User display name
  class: string         // Pathfinder class
  club: string          // Club name
  avatar: string        // Avatar URL
  overallProgress: number // Overall progress percentage
  streak: number        // Current streak
  totalPoints: number   // Total points earned
  rank: string          // User rank/title
  joinDate: string      // Join date
}
```

### MenuCard

```tsx
interface MenuCard {
  id: string           // Unique identifier
  title: string        // Card title
  description: string  // Card description
  icon: any           // Lucide icon component
  color: string       // Gradient color class
  href: string        // Navigation link
  gradient: string    // Background gradient
  borderColor: string // Border color class
  stats: string       // Stats display text
}
```

### Chapter

```tsx
interface Chapter {
  name: string        // Chapter name
  icon: string       // Emoji icon
  progress: number   // Progress percentage (0-100)
  color: string      // Progress bar gradient
}
```

### Activity

```tsx
interface Activity {
  activity: string   // Activity description
  time: string       // Relative time
  icon: string       // Emoji icon
  color: string      // Icon color class
}
```

## 💡 Best Practices

### 1. Performance Optimization

```tsx
// ✅ Good: Memoize custom data
const memoizedUserData = useMemo(() => ({
  name: "John Doe",
  class: "RANGER",
  // ... other data
}), [])

// ✅ Good: Use stable references
const menuCards = useMemo(() => customMenuCards, [])

// ❌ Avoid: Creating new objects on every render
<PathfinderDashboard 
  userData={{ name: "John Doe" }} // Creates new object each render
/>
```

### 2. Responsive Design

```tsx
// ✅ Good: Let component handle responsiveness
<PathfinderDashboard />

// ✅ Good: Custom responsive wrapper if needed
<div className="container mx-auto px-4">
  <PathfinderDashboard />
</div>
```

### 3. Theme Consistency

```tsx
// ✅ Good: Use consistent theme across app
const THEME = 'pathfinder'
<PathfinderDashboard theme={THEME} />
<OtherComponent theme={THEME} />
```

### 4. Data Validation

```tsx
// ✅ Good: Validate progress values
const validatedChapters = chapters.map(chapter => ({
  ...chapter,
  progress: Math.min(100, Math.max(0, chapter.progress))
}))

<PathfinderDashboard chapters={validatedChapters} />
```

### 5. Accessibility

```tsx
// ✅ Good: Provide meaningful descriptions
const menuCards = [
  {
    id: 'learning',
    title: 'Learning Materials',
    description: 'Access interactive learning modules and resources',
    // ... other props
  }
]
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Component Not Rendering

**Problem**: Component shows blank screen

**Solution**: Check if all required dependencies are installed

```bash
npm install lucide-react
```

#### 2. TypeScript Errors

**Problem**: Type errors with props

**Solution**: Ensure proper TypeScript types

```tsx
import PathfinderDashboard, { UserData } from '@/components/dashboards/PathfinderDashboard'

const userData: Partial<UserData> = {
  name: "John Doe"
}
```

#### 3. Styling Issues

**Problem**: Styles not applying correctly

**Solution**: Ensure Tailwind CSS is properly configured

```tsx
// Check if Tailwind classes are working
<div className="bg-red-500">Test</div>
```

#### 4. Animation Performance

**Problem**: Animations are laggy

**Solution**: Reduce number of animated elements

```tsx
// Use minimal configuration for better performance
<PathfinderDashboard 
  showQuickActions={false}
  showRecentActivity={false}
/>
```

### Debug Mode

Enable debug logging:

```tsx
<PathfinderDashboard 
  userData={userData}
  // Debug: Log user data
  onUserDataChange={(data) => console.log('User data:', data)}
/>
```

## 📚 Examples

### Basic Examples

See `./examples/PathfinderExamples.tsx` for complete working examples:

1. **Basic Usage** - Simple implementation
2. **Custom User Data** - Personalized dashboard
3. **Custom Menu Cards** - Custom navigation
4. **Custom Content** - Custom chapters and activities
5. **Theme Variations** - All three themes
6. **Minimal Configuration** - Essential features only
7. **Custom Branding** - Custom logo and actions
8. **Complete Customization** - Fully customized

### Advanced Examples

#### Multi-Theme Application

```tsx
import { useState } from 'react'
import PathfinderDashboard from '@/components/dashboards/PathfinderDashboard'

export default function ThemedApp() {
  const [theme, setTheme] = useState<'pathfinder' | 'adventurer' | 'masterguide'>('pathfinder')

  return (
    <div>
      <ThemeSelector theme={theme} setTheme={setTheme} />
      <PathfinderDashboard theme={theme} />
    </div>
  )
}
```

#### Data Integration

```tsx
import { useEffect, useState } from 'react'
import PathfinderDashboard from '@/components/dashboards/PathfinderDashboard'

export default function IntegratedDashboard() {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Fetch user data from API
    fetch('/api/user')
      .then(res => res.json())
      .then(setUserData)
  }, [])

  if (!userData) return <div>Loading...</div>

  return <PathfinderDashboard userData={userData} />
}
```

## 🎨 Design System

### Color Palette

#### Pathfinder Theme
- **Primary**: Purple (#8B5CF6)
- **Secondary**: Pink (#EC4899)
- **Accent**: Blue (#3B82F6)
- **Background**: Slate-900 to Purple-900

#### Adventurer Theme
- **Primary**: Blue (#3B82F6)
- **Secondary**: Indigo (#6366F1)
- **Accent**: Purple (#8B5CF6)
- **Background**: Blue-900 to Indigo-900

#### MasterGuide Theme
- **Primary**: Gray (#6B7280)
- **Secondary**: Slate (#64748B)
- **Accent**: Zinc (#71717A)
- **Background**: Gray-900 to Slate-900

### Typography

- **Headings**: Bold, large font sizes
- **Body**: Regular weight, good contrast
- **Stats**: Bold, high visibility
- **Labels**: Small, subtle colors

### Spacing

- **Container**: Max-width 7xl
- **Cards**: Padding 6 (24px)
- **Sections**: Padding 16 (64px)
- **Grid Gaps**: 6 (24px)

### Animations

- **Duration**: 300ms (fast), 500ms (normal), 1000ms (slow)
- **Easing**: Ease-out for most transitions
- **Transforms**: Scale, rotate, translate
- **Opacity**: Fade in/out effects

## 🚀 Migration Guide

### From Custom Dashboard

If you have an existing custom dashboard:

```tsx
// Before: Custom implementation
function CustomDashboard() {
  return (
    <div className="custom-dashboard">
      {/* Custom implementation */}
    </div>
  )
}

// After: Using Pathfinder Dashboard
import PathfinderDashboard from '@/components/dashboards/PathfinderDashboard'

function CustomDashboard() {
  return (
    <PathfinderDashboard 
      userData={customUserData}
      menuCards={customMenuCards}
      theme="pathfinder"
    />
  )
}
```

### Data Mapping

Map your existing data structure:

```tsx
// Your existing data
const existingUser = {
  fullName: "John Doe",
  level: "Ranger",
  team: "Pathfinder Club",
  completionRate: 75,
  currentStreak: 10,
  totalScore: 2500,
  title: "Gold Pathfinder",
  memberSince: "2024-01-01"
}

// Mapped to Pathfinder Dashboard
const mappedUserData = {
  name: existingUser.fullName,
  class: existingUser.level.toUpperCase(),
  club: existingUser.team,
  overallProgress: existingUser.completionRate,
  streak: existingUser.currentStreak,
  totalPoints: existingUser.totalScore,
  rank: existingUser.title,
  joinDate: new Date(existingUser.memberSince).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  })
}
```

## 📞 Support

For issues, questions, or contributions:

1. **Documentation**: Check this guide first
2. **Examples**: See `./examples/PathfinderExamples.tsx`
3. **Issues**: Create GitHub issue with detailed description
4. **Contributions**: Follow contribution guidelines

## 📝 Changelog

### v2.1.0 (Current)
- ✅ Ultra-modern design with glassmorphism
- ✅ Theme system (Pathfinder, Adventurer, MasterGuide)
- ✅ Interactive animations and micro-interactions
- ✅ Full TypeScript support
- ✅ Responsive design
- ✅ Customizable props
- ✅ Complete documentation

### Future Releases
- 🔄 More theme options
- 🔄 Additional chart types
- 🔄 Real-time data integration
- 🔄 Advanced filtering options
- 🔄 Export functionality

---

**Pathfinder Dashboard** - Build beautiful, modern dashboards with ease! 🚀