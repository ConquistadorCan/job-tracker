## JAT — Job Application Tracker

JAT is a small web app for tracking job applications in the browser. It runs fully on the client and stores data in `localStorage`.

### Features

- Add applications with company, position, date, city, job type, expected salary and currency.
- Update status (Pending, Interview, Accepted, Rejected) directly from the table.
- Delete applications with a confirmation modal.
- Search by company and filter by status.
- Sort by company name or application date.
- See total applications, interviews and rejections in the header.
- Configure defaults (currency, status, job type) and suggestion lists (positions, cities) in the settings page.

### Internationalization

UI text is driven by `js/translations.js` via the `TRANSLATIONS` object and the `t(key, ...args)` helper.

- Supported languages: English (`en`), Turkish (`tr`), Spanish (`es`), German (`de`), Italian (`it`), French (`fr`).
- The active language is stored in `settings.language`.
- The language switcher in the header shows the current language and flag.
- The dropdown only lists languages that are not currently selected.

To add a new language:

1. Add a new language entry to `TRANSLATIONS` in `js/translations.js` (for example `pt`).
2. Provide values for the same keys used by the existing languages.

### Responsive design

The layout is built with Tailwind CSS using a mobile‑first approach.

- On small screens the header stacks vertically and the logo, language switcher and settings icon share one row.
- The search input uses full width on mobile; the filter select and `+ Add` button wrap as needed.
- The table is wrapped in `overflow-x-auto` so it can be scrolled horizontally on narrow screens.
- Modals are centered, padded, and limited in height (`max-h` with `overflow-y-auto`) so they remain usable on small devices.

### Running locally

No build step is required; this is a static site.

1. Clone the repo or download the files.
2. Open `index.html` in a browser, either:
   - directly from the filesystem, or
   - via a simple HTTP server (for example `npx serve` or `python -m http.server`).
3. Data is stored in the browser’s `localStorage`, so it does not sync across devices or browsers.

### Project structure

- `index.html` — main application page
- `settings.html` — settings page
- `js/config.js` — app configuration and defaults
- `js/storage.js` — `localStorage` access and CRUD helpers
- `js/translations.js` — translation data and `t()` helper
- `js/util.js` — utility functions (for example salary formatting)
- `js/applications.js` — main page logic (table, filters, modals)
- `js/settings.js` — settings page logic

### Notes

- The app is purely client-side; there is no backend or authentication.
- For production use you would normally connect this UI to an API or other persistent storage.

