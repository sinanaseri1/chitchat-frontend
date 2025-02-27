# Messaging App Frontend

This is the frontend code for a messaging app built using Next.js, React, and Tailwind CSS. It provides the user interface for authentication, messaging, and real-time chat functionality, interacting with the backend via API requests and WebSockets.

## Project Structure
```
├── public/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── page.js
│   │   ├── login/
│   │   │   ├── page.js
│   │   ├── signup/
│   │   │   ├── page.js
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.js
│   ├── components/
│   │   ├── dashboard/
│   │   ├── splash/
│   │   ├── Navbar.js
│   ├── services/
│   │   ├── searchService.js
├── .env.local
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tailwind.config.mjs
```

## Key Files and Directories
- `public/`: Contains static assets such as the `favicon.ico`.
- `src/app/`: Holds the main Next.js pages such as login, signup, and dashboard.
- `src/components/`: Contains reusable UI components, including `Navbar.js` and dashboard-related elements.
- `src/services/`: Includes helper functions for API interactions, such as `searchService.js`.
- `globals.css`: Global CSS styles for the application.
- `layout.js`: Defines the general layout structure of the app.
- `page.js`: The main entry point for the frontend application.
- `.env.local`: Stores environment variables for API URLs and secrets.
- `next.config.mjs`: Next.js configuration settings.
- `package.json`: Lists all project dependencies.
- `postcss.config.mjs`: Configuration for PostCSS, used with Tailwind CSS.
- `tailwind.config.mjs`: Tailwind CSS configuration file.

## Dependencies
- `next`: React framework for server-side rendering and static site generation.
- `react`: UI library for building interactive interfaces.
- `tailwindcss`: Utility-first CSS framework for styling.
- `framer-motion`: For animations and UI transitions.
- `react-icons`: Collection of icons for UI components.

## Setup and Installation
1. Clone the repository:
   ```sh
   git clone <your-repository-url>
   cd messaging-app-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open your browser and navigate to `https://capable-swan-50b68e.netlify.app` to view the app.

This frontend works in conjunction with the backend to provide a complete messaging experience. Ensure the backend is running before testing the full functionality.

