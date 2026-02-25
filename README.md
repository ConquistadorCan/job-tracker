# JAT — Job Application Tracker

JAT is a lightweight, browser-based job application tracker built with vanilla HTML, JavaScript, and Tailwind CSS. No accounts, no backend, no nonsense — just open it and start tracking.

🌐 **Live Demo:** [jat-career.netlify.app](https://jat-career.netlify.app)

## Why JAT?

Keeping track of dozens of job applications across different companies, positions, and statuses can get messy fast. JAT gives you a clean, minimal interface to log every application, update its status as things progress, and get a quick overview of where you stand.

It was also built as a hands-on learning project to practice core web technologies — HTML, JavaScript, and Tailwind CSS — without any frameworks or build tools.

## Features

- **Add applications** — Log company, position, date, city, job type, expected salary and currency
- **Update status** — Change application status (Pending, Interview, Accepted, Rejected) directly from the table with a custom dropdown
- **Delete applications** — Remove entries with a confirmation modal to prevent accidental deletions
- **Filter & search** — Filter by status or search by company name in real time
- **Sort** — Sort the table by company name or application date
- **Statistics** — See total applications, interviews, and rejections at a glance
- **Settings** — Configure default values, salary formatting, and manage position/city suggestions
- **Smart suggestions** — Position and city fields learn from your past entries and suggest them next time
- **Persistent storage** — All data is saved in your browser via localStorage, no account needed
- **Empty state** — A friendly message when no applications are found

## Tech Stack

- HTML
- JavaScript (vanilla)
- Tailwind CSS (via CDN)

## File Structure

```
jat/
  index.html          — main application page
  settings.html       — settings page
  js/
    config.js         — app-wide configuration and defaults
    storage.js        — all localStorage read/write operations
    util.js           — utility functions (e.g. salary formatting)
    applications.js   — UI rendering, table, modals and interactions
    settings.js       — settings page logic
```

## Running Locally

Clone the repo and open `index.html` with [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or any local web server. No build step required.
