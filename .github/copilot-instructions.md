# Copilot Instructions for cuti-cuti.my

This document provides key information for AI agents working in the cuti-cuti.my codebase.

## Project Overview

cuti-cuti.my is a React-based web application that displays Malaysia's public and school holidays for 2025 & 2026. Key features include:

- Interactive calendar view and list view of holidays
- Filtering by holiday type (public/school) and states
- Calendar event download (.ics) with reminder support
- Dark/light mode theming
- Travel blog integration
- PWA support with offline capabilities
- SEO optimizations

## Architecture

The project follows a component-based React architecture:

```
src/
├── App.js                 # Main app container with routing and layout
├── components/           
│   ├── HolidayCalendar.js # Main holiday display logic
│   ├── CalendarView.js    # Calendar grid visualization
│   └── BlogSection.js     # Travel blog content
├── index.js              # App entry point
└── tailwind.css         # Global styles
```

### Key Components

1. **HolidayCalendar.js**
   - Manages holiday data and filtering logic
   - Handles .ics file generation for calendar exports
   - Contains both list and calendar view states

2. **CalendarView.js** 
   - Renders interactive calendar grid
   - Handles date-based holiday highlighting
   - Manages modal interactions for holiday details

3. **BlogSection.js**
   - Fetches and displays travel blog content
   - Implements pagination and modal views
   - Handles date formatting and image placeholders

## Important Patterns

### State Management
- Uses React hooks (`useState`, `useEffect`) for local state
- Theme state persisted in localStorage
- Holiday data stored in component state (no global state management needed)

### Data Formatting
- Dates follow the format: "DD MMM YYYY(DDD)" for consistency
- Holiday states are carefully formatted for national vs state-specific logic
- Blog content uses slug-based URLs and excerpts limited to 150 chars

### PWA Implementation
- Service worker handles offline caching of assets
- Manifest.json configures app installation behavior
- Assets cached: HTML, CSS, JS, images

## Development Workflows

1. **Starting Development:**
   ```bash
   npm start # Runs dev server
   npm run watch:tailwind # Watch Tailwind changes
   ```

2. **Building for Production:**
   ```bash
   npm run build:tailwind # Build Tailwind CSS
   npm run build # Create production build
   ```

## Integration Points

1. **Blog API Endpoint:**
   - URL: `https://81zon8jxx5.execute-api.ap-southeast-5.amazonaws.com/Prod/releases`
   - Returns blog posts with title, content, date, image_url

2. **Calendar Export:**
   - Generates .ics files compatible with Google Calendar/iCal
   - Includes event details and optional reminders

## Common Tasks

### Adding New Holidays
1. Edit `holidaysV23` object in `HolidayCalendar.js`
2. Follow existing format for date and state information
3. Use Boolean filtering for efficient state filtering

### Modifying Calendar View
1. Check `CalendarView.js` for rendering logic
2. Holiday highlighting uses conditional classes based on type
3. Modal interactions handle both single and multiple holidays per date

### Blog Updates
1. Posts fetch from API on component mount
2. Content formatting preserves paragraphs
3. Date parsing handles "DDth of Month YYYY" format

## Project-Specific Conventions

1. **State Filtering:**
   - "All Public Holidays" shows everything
   - "National" excludes state-specific holidays
   - Individual states show relevant national and state holidays

2. **Calendar Colors:**
   - Blue: National holidays
   - Orange: State holidays
   - Green: School holidays
   - Gradient: Mixed holiday types

3. **Error Handling:**
   - Failed API calls show user-friendly messages
   - Invalid dates fallback to "Date Unavailable"
   - Service worker errors logged but non-blocking

Remember to maintain PWA compatibility and responsive design when making changes. Test in both light and dark modes.
