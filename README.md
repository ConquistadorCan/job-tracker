# JAT — Job Application Tracker

A simple, minimal web application to track your job applications.

🌐 **Live Demo:** [jat-career.netlify.app](https://jat-career.netlify.app)

## Purpose

JAT (Job Application Tracker) is a web application to help people track their job applications in one place. The second goal of this project is to learn and practice base web technologies with vibecoding.

## Tech Stack

- HTML
- JavaScript
- Tailwind CSS (via CDN)

## Features

- Add new job applications
- Track application status (Pending, Interview, Accepted, Rejected)
- Update status with a custom dropdown
- Delete applications with a confirmation modal
- Statistics overview (Total, Interviews, Rejected)
- Data persisted in browser via localStorage
- Empty state UI

## File Structure

```
jat/
  index.html
  js/
    utils.js     — utility functions
    config.js    — app configuration
    storage.js   — localStorage operations
    app.js       — UI rendering and interactions
```

## Usage

To run locally, use [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or any local web server.
