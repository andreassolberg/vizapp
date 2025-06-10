# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Andreas Viz Kit (vizapp) is a SvelteKit-based data visualization application for Norwegian political and educational statistics. It uses D3.js for visualizations and presents data through interactive Sankey diagrams and geographic maps.

## Development Commands

```bash
npm run dev         # Start development server (runs on port 5173)
npm run build       # Build for production
npm run preview     # Preview production build
npm run prepare     # Run svelte-kit sync (with fallback)
npm run check       # Type check with svelte-check
npm run check:watch # Continuous type checking
```

## Architecture

### Routing Structure
- SvelteKit file-based routing with server-side data loading
- Each route has `+page.server.ts` for data fetching and `+page.svelte` for rendering
- Current routes: `/` (home), `/politikk`, `/politikk2`, `/feidenord`

### Data Flow Pattern
1. Static JSON data stored in `/static` directory
2. Server-side loading in `+page.server.ts` files reads and processes data
3. Data passed to page components via `load` function
4. Components use D3.js for visualization rendering

### Key Visualization Components
- **PolitikkSankey.svelte**: Renders Sankey diagrams showing voting flow between groups (editors → journalists → population)
- **FylkeMap.svelte**: Geographic visualization using Norwegian county/municipality GeoJSON data with D3-geo
- **FeideStats.svelte**: Statistical displays for educational login data

### Data Structure
- Political data includes voting preferences across parties with metadata (colors, logos)
- Geographic data uses standard GeoJSON format for Norwegian administrative boundaries
- All TypeScript interfaces are defined inline within components

## Important Technical Details

- Uses Svelte 5 with runes syntax (`$state`, `$effect`)
- D3.js integration requires careful lifecycle management in `$effect` blocks
- Geographic projections use `d3.geoAlbers()` centered on Norway
- SVG party logos are stored in `/static/partilogoer/` with consistent naming
- Turf.js is used for geographic operations (note: both turf@3.0.14 and @turf/turf@7.2.0 are installed)

## Dependencies

### Visualization & Geographic
- **d3@7.9.0**: Core visualization library
- **d3-geo@3.1.1**: Geographic projections and paths
- **d3-geo-projection@4.0.0**: Additional map projections
- **@turf/turf@7.2.0**: Geographic operations and calculations
- **@turf/rewind@7.2.0**: Ensures correct polygon winding order

### Utilities
- **lodash@4.17.21**: Data manipulation utilities

## Testing Visualization Changes

When modifying visualizations:
1. Check responsive behavior at different screen sizes
2. Verify data binding with `npm run check`
3. Test interactive elements (hover, click) across browsers
4. Ensure geographic projections render correctly for all Norwegian regions
5. Validate GeoJSON winding order when working with maps