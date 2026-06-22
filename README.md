# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



//
UiVault/
├── server.ts               # Core Express app, authentication middlewares, & API routes
├── vite.config.js          # Vite config (Tailwind integration, HMR watch exceptions)
├── db.json                 # Local database backup file
├── package.json            # Node scripts, client/server dependencies
├── server/                 # Backend Database Modules
│   ├── store.ts            # Memory store cache, local CRUD, and backup methods
│   └── mongodb.ts          # Mongoose connections, models, and cloud seed functions
├── src/                    # React Frontend
│   ├── main.tsx            # Main application entry point
│   ├── App.tsx             # Main router, session checker, global layout, and state
│   ├── index.css           # Global typography, theme variables, and Tailwind imports
│   ├── types.ts            # Shared TypeScript interface models
│   ├── lib/
│   │   └── api.ts          # Client API requests handler (unified Fetch client)
│   ├── data/
│   │   └── components.tsx  # Pre-defined native components list (mock catalog)
│   ├── components/         # Reusable UI Widgets
│   │   ├── Navbar.tsx      # Sticky blurry header with search and theme configurations
│   │   ├── Footer.tsx      # Footer map
│   │   ├── Dock.tsx        # Floating mobile navigation dock
│   │   ├── Toast.tsx       # Interactive toast notifications system
│   │   ├── CommandMenu.tsx # Modal shortcut search menu (Cmd/Ctrl + K)
│   │   ├── BlobBackground.tsx   # Ambient animated vector background blobs
│   │   └── SafeComponentPreview.tsx  # Compiled sandbox preview engine
│   └── pages/              # Primary View Layouts
│       ├── Home.tsx             # Interactive dashboard showcase
│       ├── Components.tsx       # Filterable catalog directory list
│       ├── Preview.tsx          # Component inspection sandbox, code viewer, & comments
│       ├── Auth.tsx             # Registration, Login, & OAuth simulation
│       ├── Upload.tsx           # Creator component editor/publisher
│       ├── CreatorProfile.tsx   # Dashboard with profile settings, uploads, & alerts
│       ├── AdminDashboard.tsx   # Moderation console with reports and system analytics
│       ├── About.tsx            # About info page
│       ├── Contact.tsx          # Contact form page
│       └── Pricing.tsx          # Simulated license plans page

//