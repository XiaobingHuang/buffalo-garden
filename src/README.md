# Buffalo Garden - Source Code Structure

This document outlines the organized folder structure for the Buffalo Garden cannabis retail management system.

## 📁 Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Main navigation bar
│   └── Inventory.tsx    # Inventory snapshot component
├── pages/              # Main application pages
│   ├── Dashboard.tsx    # Main dashboard page
│   ├── Login.tsx        # Authentication page
│   ├── SalesPage.tsx    # Point of sale interface
│   ├── InventoryPage.tsx # Full inventory management
│   └── SettingsPage.tsx # Application settings
├── modals/             # Modal components
│   └── CustomerModal.tsx # Customer management modal
├── types/              # TypeScript type definitions
│   └── index.ts        # Centralized type definitions
├── styles/             # CSS stylesheets
│   ├── App.css         # Main application styles
│   └── index.css       # Global styles
├── utils/              # Utility functions
│   ├── reportWebVitals.ts # Performance monitoring
│   └── setupTests.ts   # Test configuration
├── assets/             # Static assets
│   └── logo.svg        # Application logo
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## 🏗️ Architecture Overview

### Components (`/components`)
Reusable UI components that can be shared across multiple pages:
- **Navigation**: Main navigation bar with routing
- **Inventory**: Inventory snapshot widget for dashboard

### Pages (`/pages`)
Main application views that represent different sections:
- **Dashboard**: Overview and quick stats
- **Login**: Authentication interface
- **SalesPage**: Point of sale system
- **InventoryPage**: Full inventory management
- **SettingsPage**: Application configuration

### Modals (`/modals`)
Overlay components for focused interactions:
- **CustomerModal**: Customer management (add/edit/select)

### Types (`/types`)
Centralized TypeScript type definitions:
- Product, Customer, Sale interfaces
- Settings and configuration types
- Navigation and modal types

### Styles (`/styles`)
CSS stylesheets organized by purpose:
- **App.css**: Main application styles
- **index.css**: Global styles and resets

### Utils (`/utils`)
Utility functions and configurations:
- Performance monitoring
- Test setup
- Helper functions

### Assets (`/assets`)
Static files like images, icons, and other media.

## 🔧 Development Guidelines

### Adding New Components
1. Place reusable components in `/components`
2. Use TypeScript interfaces from `/types`
3. Import styles from `/styles/App.css`

### Adding New Pages
1. Create the page in `/pages`
2. Add the route to `App.tsx`
3. Update navigation if needed

### Adding New Types
1. Define interfaces in `/types/index.ts`
2. Export them for use across the application
3. Use consistent naming conventions

### Styling
1. Add new styles to `/styles/App.css`
2. Use BEM methodology for CSS classes
3. Ensure responsive design for mobile devices

## 📱 Responsive Design
All components are designed to be responsive and work on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎨 Design System
The application uses a consistent design system with:
- Primary color: #4CAF50 (green)
- Secondary colors: #007bff (blue), #dc3545 (red), #ffc107 (yellow)
- Typography: System fonts with consistent sizing
- Spacing: 8px grid system
- Border radius: 6px for cards, 8px for modals

## 🔒 Security Considerations
- All customer data includes ID verification
- Age verification required for sales
- Role-based access control for settings
- Audit logging for compliance

## 📊 Compliance Features
- Seed-to-sale tracking
- BioTrack integration
- Age verification
- Legal purchase limits
- Audit trail maintenance 