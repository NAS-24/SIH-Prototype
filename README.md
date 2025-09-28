# INCOIS Hazard Platform

A comprehensive React-based web application for hazard reporting and monitoring, built with Vite and Tailwind CSS.

## Features

- **Login Page**: Role-based access with Field Contributor and Administrator options
- **Field Contributor Role Selection**: Priority-based role selection with different trust levels
- **Reports & Status Tracker**: Comprehensive reporting system with status tracking
- **INCOIS Updates**: Real-time alerts and advisories integration
- **Responsive Design**: Mobile and desktop optimized

## Technology Stack

- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Modern ES6+ JavaScript

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation component
│   ├── Footer.jsx      # Footer component
│   ├── Card.jsx        # Card component
│   ├── StatusBadge.jsx # Status badge component
│   └── AlertCard.jsx   # Alert card component
├── pages/              # Page components
│   ├── LoginPage.jsx   # Login page
│   ├── ContributorRolePage.jsx # Role selection page
│   └── ReportsPage.jsx # Reports dashboard
├── App.jsx             # Main app component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## Pages

### 1. Login Page
- Clean, modern design with role selection
- Field Contributor and Administrator options
- Responsive layout

### 2. Field Contributor Role Selection
- Priority-based role selection
- Visual indicators for trust levels
- Detailed role descriptions

### 3. Reports & Status Tracker
- My Reports section with status tracking
- All Reports with filtering options
- INCOIS updates and alerts
- Status badges (Received, Under Review, Verified, False Alarm)

## Components

- **Navbar**: Responsive navigation with logo and menu
- **Footer**: Context-aware footer with different variants
- **Card**: Reusable card component with hover effects
- **StatusBadge**: Color-coded status indicators
- **AlertCard**: Alert and advisory display components

## Styling

The application uses Tailwind CSS with custom components and utilities:
- Custom color scheme with INCOIS branding
- Responsive grid layouts
- Hover effects and transitions
- Status-based color coding

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
