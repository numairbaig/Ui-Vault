# 🛸 UiVault — Interactive Code Component Hub

UiVault is a full-stack, real-time interactive component catalog and live-rendering code sandbox inspired by Uiverse. It provides a visual repository where web developers can discover, customize, live-preview, and share custom HTML, CSS, JavaScript, React, and Tailwind CSS components.


---

## ⚡ Key Features

* **🎨 Live Interactive Sandbox**: Dynamically renders HTML, CSS, JS, and Tailwind code parameters inside an isolated, theme-adaptive `<iframe>` sandbox. Supports Desktop, Tablet, and Mobile viewport testing.
* **🔍 Multi-Dimensional Catalog**: Filter and query components by categories (Buttons, Cards, Loaders, Forms, Pricing tables, etc.), custom tags, search text, or sort parameters (Trending, Most Liked, Most Downloaded, Newest).
* **👤 Creator Profile Portfolios**: Register and authenticate profiles (featuring Google OAuth simulations). Track custom component uploads, liked items, bookmarks, and notification streams.
* **📂 Folder collections**: Organize bookmarked catalog components into public or private custom collections.
* **🛡️ Content Moderation & Admin Center**: Dedicated administrator console containing site-wide metrics dashboards, pending component approval tables, user management/ban controls, and reported violation queues.
* **🔄 Dual-Sync Database Architecture**: Uses localized JSON cache speed optimization synced seamlessly in the background with a MongoDB Atlas cloud cluster.

---

## 💻 Tech Stack

### Frontend
* **Core**: React 18+ (with TypeScript)
* **Build tool**: Vite (configured with Hot Module Replacement and specific watcher rules)
* **Styling**: Tailwind CSS & Vanilla CSS (integrated via the `@tailwindcss/vite` plugin)
* **Animations**: Motion (`motion/react`)
* **Vector Icons**: Lucide React

### Backend
* **Server Framework**: Node.js & Express (TypeScript compiled dynamically via `tsx`)
* **Security & Auth**: JSON Web Tokens (JWT) & BcryptJS password hashing

### Database
* **Database**: MongoDB Atlas (connected through Mongoose)
* **Local Cache**: File-based `db.json` storage database for offline fallbacks

---

## 📂 Project Structure

```bash
UiVault/
├── server.ts               # Core Express app, authentication middlewares, & API routes
├── vite.config.js          # Vite configuration (Tailwind integration & HMR exceptions)
├── db.json                 # Local database storage cache (fallback)
├── package.json            # Client and server dependencies & dev script wrappers
├── server/                 # Backend Database Modules
│   ├── store.ts            # Local memory cache store, local CRUD, and backup methods
│   └── mongodb.ts          # Mongoose connections, models, and seed sync functions
├── src/                    # React Frontend
│   ├── main.tsx            # Application entry point
│   ├── App.tsx             # Main routing framework, session syncer, and global layout
│   ├── index.css           # Global typography, color tokens, and Tailwind directives
│   ├── types.ts            # Shared TypeScript interface models
│   ├── lib/
│   │   └── api.ts          # client-side API helper (unified fetch request framework)
│   ├── data/
│   │   └── components.tsx  # Static local catalog list (pre-seeded assets)
│   ├── components/         # Reusable Widgets
│   │   ├── Navbar.tsx      # Sticky header navigation
│   │   ├── Footer.tsx      # Footer mapping
│   │   ├── Dock.tsx        # Floating mobile navigation dock
│   │   ├── Toast.tsx       # Toast alert container
│   │   ├── CommandMenu.tsx # Shortcut search overlay (Cmd/Ctrl + K)
│   │   ├── BlobBackground.tsx   # Blurry animated background glow effects
│   │   └── SafeComponentPreview.tsx  # Dynamic sandboxed rendering engine
│   └── pages/              # Primary Page Views
│       ├── Home.tsx             # Main dashboard feed
│       ├── Components.tsx       # Catalog directory browsing page
│       ├── Preview.tsx          # Sandbox editor workspace, code inspector, & reviews
│       ├── Auth.tsx             # Authentication portal (Sign In / Register / Reset)
│       ├── Upload.tsx           # Creator component editor/publisher
│       ├── CreatorProfile.tsx   # Dashboard for creator uploads, favorites, & alerts
│       ├── AdminDashboard.tsx   # Moderation center console for admin accounts
│       ├── About.tsx            # Platform introduction page
│       ├── Contact.tsx          # Support contact form
│       └── Pricing.tsx          # Simulated license configuration page
```

---

## 🚀 Getting Started

### 📋 Prerequisites
* **Node.js**: Version 18.0.0 or higher
* **MongoDB**: A local MongoDB connection or a MongoDB Atlas cloud URI

### ⚙️ Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/uivault?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_here
```

### 📥 Installation & Running
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/UiVault.git
   cd UiVault
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   *This starts the Express server on `http://localhost:3000` and configures Vite middleware for hot-reloading frontend development.*

4. **Production Build**:
   To compile and package the frontend for production deployment:
   ```bash
   npm run build
   ```

---

## 🔒 Default Credentials (Development Seeding)
On first startup, the database is pre-seeded with two accounts for easy verification:

* **Administrator Profile**:
  * **Username/Email**: `uivault_admin` (or `admin@uivault.com`)
  * **Password**: `admin123`
* **Regular Developer Profile**:
  * **Username/Email**: `pixel_architect` (or `pixel@uivault.com`)
  * **Password**: `user123`

---

## 📡 API Reference Overview

### Authentication
* `POST /api/auth/register` - Create a new user profile
* `POST /api/auth/login` - Authenticate local credentials and sign JWT
* `POST /api/auth/google` - Simulates a Google OAuth sign-in flow
* `GET /api/auth/me` - Resolves active session token

### Components Management
* `GET /api/components` - Fetch catalog items (supports search, category, tag, and sort queries)
* `GET /api/components/:id` - Fetch details for a specific component and increment views
* `POST /api/components` - Upload a new code sandbox
* `PATCH /api/components/:id` - Edit a custom component layout
* `DELETE /api/components/:id` - Discard component from catalog

### Administration Center (Guarded)
* `GET /api/admin/analytics` - System metrics logs
* `GET /api/admin/pending` - Code uploads awaiting approval
* `POST /api/admin/components/:id/approve` - Approve pending uploads
* `GET /api/admin/users` - Registered user listing
* `POST /api/admin/users/:id/ban` - Ban/unban developer profile accounts
* `GET /api/admin/reports` - active layout violation logs queue
* `POST /api/admin/reports/:id/resolve` - Resolve reported violations

