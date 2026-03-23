
  # Grid Intelligence

A modern dashboard web app scaffold built using React + Vite + Tailwind + MUI, modeled after a Figma design system.

Original design source: https://www.figma.com/design/Zw6Q67oyLudqmdKn8EJlNa/Grid-Intelligence

## Key Features

- React 18.3 (peer dependency)
- Vite-powered build and dev server
- Tailwind CSS + @tailwindcss/vite plugin
- Radix UI plus custom design system components
- MUI icons and theming support
- Charts with Recharts, maps with React Leaflet
- Responsive dashboard pages for assets, consumers, forecast, revenue, studies, reports, settings, etc.

## Getting Started

1. Clone the repository

```bash
git clone <repo-url>
cd "Grid Intelligence 3"
```

2. Install dependencies

```bash
npm install
```

> Optional: use `npm audit fix` or `npm audit fix --force` if any vulnerability warnings are reported.

3. Start the local dev server

```bash
npm run dev
```

4. Open browser

- Local: `http://localhost:5173/`
- To expose on LAN: `npm run dev -- --host`

## Build for production

```bash
npm run build
```

Then serve from `dist` using any static server, e.g.:

```bash
npm install -g serve
serve -s dist
```

## Directory structure

- `src/` - app source
  - `app/` - main app, routes, pages and UI components
  - `styles/` - CSS, Tailwind and theme styles
  - `components/` - reusable UI components (dashboard, layout, etc.)
- `index.html` - Vite entry HTML
- `vite.config.ts` - Vite configuration
- `postcss.config.mjs` - postcss and Tailwind config

## Dependencies

Key dependencies from `package.json`:
- @mui/material, @mui/icons-material
- @radix-ui/react-* (accordion, dialog, menu, popover, etc.)
- react-router
- recharts
- react-leaflet
- tailwindcss, @tailwindcss/vite

## Notes

- `react` and `react-dom` are listed as optional peer dependencies; install matching versions if not present already.
- If you hit a TypeScript path/npm env issue, confirm Node 18+ and npm 10+ are installed.

## Troubleshooting

- Clean cache and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- If Vite port is busy:
  ```bash
  npm run dev -- --port 5174
  ```

## License

This repository is a private bundle copy of a Figma-based design demo. Verify license/usage rights with your organization before redistributing.
  
