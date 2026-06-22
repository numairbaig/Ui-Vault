import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { dbStore, UserDocument } from './server/store.js';

dotenv.config();

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'a_secret_quantum_key_aura_uiverse_19827';

const app = express();
app.use(express.json());

// Track Site Views overall
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
    dbStore.incrementSiteViews();
  }
  next();
});

// --- HELPER MIDDLEWARE: JWT Auth ---
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: 'user' | 'admin';
  };
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Auth token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session token' });
    }
    
    // Check if user is banned
    const dbUser = dbStore.findUserById(decoded.id);
    if (dbUser?.isBanned) {
      return res.status(403).json({ error: 'Your account has been permanently banned by an administrator.' });
    }

    req.user = decoded;
    next();
  });
}

// Optional Auth (for components listings so we can see saved/likes status optionally)
function optionalAuthenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (!err) {
      // Check if banned
      const dbUser = dbStore.findUserById(decoded.id);
      if (!dbUser?.isBanned) {
        req.user = decoded;
      }
    }
    next();
  });
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrator clearance level required' });
  }
  next();
}


// ==========================================
// 1. AUTHENTICATION API ENDPOINTS
// ==========================================

// Register Creator
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, bio, avatar } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please submit all required profile fields' });
  }

  // Basic regex validation
  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 alphanumeric characters' });
  }

  const existingEmail = dbStore.findUserByEmail(email);
  if (existingEmail) {
    return res.status(400).json({ error: 'This email is already associated with an account' });
  }

  const existingUser = dbStore.findUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username is already taken by another creator' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const user = dbStore.createUser({
    username,
    email,
    passwordHash: hash,
    avatar: avatar || `https://images.unsplash.com/photo-${1534500000000 + Math.floor(Math.random() * 500000)}?q=80&w=150&auto=format&fit=crop`,
    bio: bio || 'Visual UI Architect and code block contributor inside Aura Universe.',
    followers: [],
    following: [],
    savedComponents: [],
    collections: [],
    role: 'user'
  });

  const payload = { id: user.id, username: user.username, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    message: 'Registered successfully',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      followers: user.followers,
      following: user.following,
      savedComponents: user.savedComponents,
      collections: user.collections
    }
  });
});

// Login Creator
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both login credentials' });
  }

  // Try finding by email
  let user = dbStore.findUserByEmail(email);
  if (!user) {
    // Try finding by username
    user = dbStore.findUserByUsername(email);
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid login email, user, or password credentials' });
  }

  if (user.isBanned) {
    return res.status(403).json({ error: 'This account has been permanently banned by content moderation.' });
  }

  const verify = bcrypt.compareSync(password, user.passwordHash);
  if (!verify) {
    return res.status(401).json({ error: 'Invalid login email or password credentials' });
  }

  const payload = { id: user.id, username: user.username, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Login authorized',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      followers: user.followers,
      following: user.following,
      savedComponents: user.savedComponents,
      collections: user.collections
    }
  });
});

// Google OAuth mock login
app.post('/api/auth/google', (req, res) => {
  const { googleId, name, email, imageUrl } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Incomplete OAuth payload from Google' });
  }

  let user = dbStore.findUserByEmail(email);
  if (!user) {
    // Generate a secure username based on name
    const sanitizedUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 900);
    const hash = bcrypt.hashSync(`oauth_${Date.now()}_secured`, 10);
    user = dbStore.createUser({
      username: sanitizedUsername,
      email,
      passwordHash: hash,
      avatar: imageUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop`,
      bio: 'Cloud connected creator logged in securely with Google Auth.',
      followers: [],
      following: [],
      savedComponents: [],
      collections: [],
      role: 'user'
    });
  }

  if (user.isBanned) {
    return res.status(403).json({ error: 'This Google account has been permanently banned.' });
  }

  const payload = { id: user.id, username: user.username, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Authorized via Google Ecosystem',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      followers: user.followers,
      following: user.following,
      savedComponents: user.savedComponents,
      collections: user.collections
    }
  });
});

// Get Current User Profile Core
app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = dbStore.findUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User profiles record expired' });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    role: user.role,
    followers: user.followers,
    following: user.following,
    savedComponents: user.savedComponents,
    collections: user.collections
  });
});

// Password Reset Simulation
app.post('/api/auth/reset-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email address is required' });
  
  const user = dbStore.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'No creator profiles found matching this email address' });
  }

  // In simulated environment we instantly complete resetting passcode
  res.json({ message: 'A verification password-reset stream has been routed to your registered email. Check inbox!' });
});

// Email Verification Simulation
app.post('/api/auth/verify-email', authenticateToken, (req: AuthenticatedRequest, res) => {
  res.json({ message: 'Your creator registry email has been flagged as high-trust, verified!' });
});

// Update Profile
app.patch('/api/auth/profile', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { bio, avatar } = req.body;
  const updated = dbStore.updateUser(req.user!.id, { bio, avatar });
  if (!updated) return res.status(404).json({ error: 'Profile not found' });
  res.json({ message: 'Profile updated successfully', user: updated });
});


// ==========================================
// 2. COMPONENTS UPLOAD & UTILITY ENDPOINTS
// ==========================================

// GET Component List (Advanced Multi-Filter, Category, Tag sorting)
app.get('/api/components', optionalAuthenticate, (req: AuthenticatedRequest, res) => {
  const { search, category, tag, author, sort } = req.query;
  let list = dbStore.getComponents();

  // Filter out pending (unapproved) components unless requester is admin or the author
  const loggedInUserId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';
  list = list.filter(c => {
    const isApproved = c.approved !== false;
    if (isApproved) return true;
    if (isAdmin) return true;
    if (loggedInUserId && c.author.id === loggedInUserId) return true;
    return false;
  });

  // Search filter
  if (search) {
    const s = (search as string).toLowerCase();
    list = list.filter(c => 
      c.title.toLowerCase().includes(s) || 
      c.description.toLowerCase().includes(s) ||
      c.tags.some(t => t.toLowerCase().includes(s)) ||
      c.category.toLowerCase().includes(s)
    );
  }

  // Category filter
  if (category) {
    const cat = (category as string).toLowerCase();
    list = list.filter(c => c.category.toLowerCase() === cat);
  }

  // Tag filter
  if (tag) {
    const t = (tag as string).toLowerCase();
    list = list.filter(c => c.tags.some(g => g.toLowerCase() === t));
  }

  // Author filter
  if (author) {
    const authQuery = (author as string).toLowerCase();
    list = list.filter(c => c.author.username.toLowerCase() === authQuery);
  }

  // Sort Filter
  if (sort === 'popular') {
    list = list.sort((a, b) => b.likes.length - a.likes.length);
  } else if (sort === 'downloaded') {
    list = list.sort((a, b) => b.downloads - a.downloads);
  } else if (sort === 'views') {
    list = list.sort((a, b) => b.views - a.views);
  } else if (sort === 'trending') {
    // Trending = Views + 3*Likes + 5*Downloads
    const trendWeight = (item: any) => item.views + (item.likes.length * 4) + (item.downloads * 8);
    list = list.sort((a, b) => trendWeight(b) - trendWeight(a));
  } else {
    // Default: 'newest'
    list = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(list);
});

// GET Component Detail Page
app.get('/api/components/:id', optionalAuthenticate, (req: AuthenticatedRequest, res) => {
  const item = dbStore.findComponentById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Uiverse sandbox component not found' });
  }

  // Check if approved
  const loggedInUserId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';
  const isApproved = item.approved !== false;
  if (!isApproved && !isAdmin && (!loggedInUserId || item.author.id !== loggedInUserId)) {
    return res.status(403).json({ error: 'This component is currently undergoing administrator approval verification' });
  }

  // Increment counter asynchronously
  dbStore.incrementCounter('views', item.id);

  // Return component and similar elements
  const similar = dbStore.getComponents()
    .filter(c => c.category === item.category && c.id !== item.id)
    .slice(0, 4);

  res.json({
    component: item,
    similar
  });
});

// POST Component Upload Form
app.post('/api/components', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { title, description, category, tags, htmlCode, cssCode, jsCode, reactCode, tailwindCode, thumbnail } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Submit code payload along with category, name, and description' });
  }

  const user = dbStore.findUserById(req.user!.id);
  if (!user) return res.status(401).json({ error: 'Unrecognized user reference' });

  const comp = dbStore.createComponent({
    title,
    description,
    category,
    tags: tags || ['New'],
    thumbnail: thumbnail || '盒子',
    htmlCode: htmlCode || '',
    cssCode: cssCode || '',
    jsCode: jsCode || '',
    reactCode: reactCode || '',
    tailwindCode: tailwindCode || '',
    approved: user.role === 'admin',
    author: {
      id: user.id,
      username: user.username,
      avatar: user.avatar
    }
  });

  res.status(211).json({ message: 'Dynamic code posted successfully!', component: comp });
});

// PUT/PATCH Edit Component Sandbox
app.patch('/api/components/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
  const item = dbStore.findComponentById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Core item does not exist' });

  // Safety checks
  if (item.author.id !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'You are unauthorized to customize other author submissions' });
  }

  const { title, description, category, tags, htmlCode, cssCode, jsCode, reactCode, tailwindCode, thumbnail } = req.body;
  const updated = dbStore.updateComponent(req.params.id, {
    title, description, category, tags, htmlCode, cssCode, jsCode, reactCode, tailwindCode, thumbnail
  });

  res.json({ message: 'Code parameters updated', component: updated });
});

// DELETE Component Sandbox
app.delete('/api/components/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
  const item = dbStore.findComponentById(req.params.id);
  if (!item) return res.status(404).json({ error: 'No target component found' });

  if (item.author.id !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Admin or original author authorization required' });
  }

  dbStore.deleteComponent(req.params.id);
  res.json({ message: 'Surgical design components removed successfully' });
});

// POST Incremented download triggers
app.post('/api/components/:id/download', (req, res) => {
  dbStore.incrementCounter('downloads', req.params.id);
  res.json({ success: true });
});

// POST Favorite Toggle Component 
app.post('/api/components/:id/favorite', authenticateToken, (req: AuthenticatedRequest, res) => {
  const savedState = dbStore.saveProductToggle(req.user!.id, req.params.id);
  res.json({ saved: savedState, message: savedState ? 'Added component to your dashboard favorites!' : 'Removed from sandbox favorites.' });
});

// POST Like toggle
app.post('/api/components/:id/like', authenticateToken, (req: AuthenticatedRequest, res) => {
  const state = dbStore.likeComponentToggle(req.user!.id, req.params.id);
  res.json({ liked: state.liked, likesCount: state.likes.length });
});


// ==========================================
// 3. COLLECTION CLUSTER API ENDPOINTS
// ==========================================

// GET Collections
app.get('/api/collections', optionalAuthenticate, (req: AuthenticatedRequest, res) => {
  const list = dbStore.getCollections();
  
  // Filter visibility
  const visible = list.filter(c => {
    if (c.visibility === 'public') return true;
    return req.user && c.user === req.user.id;
  });

  res.json(visible);
});

// POST Create Collection catalogued 
app.post('/api/collections', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { name, visibility } = req.body;
  if (!name) return res.status(400).json({ error: 'Cluster name descriptor is required' });

  const cat = dbStore.createCollection(name, req.user!.id, visibility || 'public');
  res.status(201).json({ message: 'Dynamic collections container deployed!', collection: cat });
});

// POST Add/Remove Component Inside Collections
app.post('/api/collections/:id/toggle', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { componentId } = req.body;
  if (!componentId) return res.status(400).json({ error: 'Please submit componentId parameter' });

  const updated = dbStore.toggleComponentInCollection(req.params.id, componentId, req.user!.id);
  if (!updated) return res.status(404).json({ error: 'Collection not found or user unauthorized' });

  res.json({ message: 'Component alignment altered inside selected collection', collection: updated });
});

// DELETE Collections
app.delete('/api/collections/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
  const success = dbStore.deleteCollection(req.params.id, req.user!.id);
  if (!success) return res.status(404).json({ error: 'Removal failed' });
  res.json({ message: 'Personal folder catalogs container unlinked successfully' });
});


// ==========================================
// 4. COMMENTS SYSTEM
// ==========================================

// GET Comments list
app.get('/api/comments/component/:compId', (req, res) => {
  const comms = dbStore.getComments(req.params.compId);
  res.json(comms);
});

// POST Add Comments thread
app.post('/api/comments/component/:compId', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Comment body characters are required' });

  const item = dbStore.addComment(req.params.compId, req.user!.id, text);
  if (!item) return res.status(404).json({ error: 'Review compilation parameters failed' });

  res.status(201).json(item);
});

// DELETE Comments
app.delete('/api/comments/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
  const success = dbStore.deleteComment(req.params.id, req.user!.id, req.user!.role);
  if (!success) {
    return res.status(403).json({ error: 'Access denied: comments index immutable' });
  }
  res.json({ message: 'Deleted comments entry successfully' });
});


// ==========================================
// 5. SOCIAL DIRECTORIES & NOTIFICATIONS
// ==========================================

// POST follow usertoggle
app.post('/api/social/follow/:userId', authenticateToken, (req: AuthenticatedRequest, res) => {
  const response = dbStore.followUserToggle(req.user!.id, req.params.userId);
  if (!response) return res.status(400).json({ error: 'Follow target operation invalid or identical user' });

  res.json({
    message: response.isFollowing ? 'Followed creator portfolio successfully.' : 'Unfollowed portfolio.',
    isFollowing: response.isFollowing,
    followersCount: response.targetFollowerCount,
    followingCount: response.followerFollowingCount
  });
});

// GET notifications queue
app.get('/api/social/notifications', authenticateToken, (req: AuthenticatedRequest, res) => {
  const notifs = dbStore.getNotifications(req.user!.id);
  res.json(notifs);
});

// POST read notifications queue
app.post('/api/social/notifications/read', authenticateToken, (req: AuthenticatedRequest, res) => {
  dbStore.markNotificationsRead(req.user!.id);
  res.json({ success: true, message: 'All unread notifications checked.' });
});


// ==========================================
// 6. CONTENT REPORT & COMMUNITY MODERATION
// ==========================================

app.post('/api/components/:id/report', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { reason } = req.body;
  if (!reason) return res.status(400).json({ error: 'Reason required for investigation file.' });

  const rep = dbStore.addReport(req.user!.id, req.params.id, reason);
  if (!rep) return res.status(404).json({ error: 'Target components missing' });

  res.status(201).json({ message: 'Submit complete. Content validation team flagged your reported asset.' });
});


// ==========================================
// 7. ADMINISTRATIVE DASHBOARDS CONTROL
// ==========================================

// GET Database and Stack Status (MERN verification)
app.get('/api/db-config', (req, res) => {
  const isMongoConfigured = !!process.env.MONGODB_URI;
  const dbState = require('mongoose').connection.readyState;
  const stateLabels = ['Offline fallback', 'Connected', 'Connecting', 'Disconnecting'];

  res.json({
    stack: 'MERN (MongoDB, Express, React, Node.js)',
    expressUsed: true,
    nodeUsed: true,
    mongoConfigured: isMongoConfigured,
    mongoStatus: isMongoConfigured ? stateLabels[dbState] || 'Active Sync' : 'Offline (Local filesystem fallback)',
    mongoUriMasked: process.env.MONGODB_URI 
      ? process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') 
      : 'None (Run locally with MONGODB_URI set to activate full MongoDB syncing)'
  });
});

// GET Live analytics Metrics
app.get('/api/admin/analytics', authenticateToken, requireAdmin, (req, res) => {
  res.json(dbStore.getAnalytics());
});

// GET List of unapproved/pending components for Admin moderation
app.get('/api/admin/pending', authenticateToken, requireAdmin, (req, res) => {
  const pending = dbStore.getComponents().filter(c => c.approved === false);
  res.json(pending);
});

// POST Approve component
app.post('/api/admin/components/:id/approve', authenticateToken, requireAdmin, (req, res) => {
  const comp = dbStore.updateComponent(req.params.id, { approved: true });
  if (!comp) return res.status(404).json({ error: 'Uiverse sandbox component not found' });
  res.json({ message: 'Component successfully approved and published!', component: comp });
});

// GET List Users
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  res.json(dbStore.getUsers());
});

// POST Ban user toggle flag
app.post('/api/admin/users/:id/ban', authenticateToken, requireAdmin, (req, res) => {
  const user = dbStore.findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Target creator profiles invalid' });

  const stateNow = !user.isBanned;
  dbStore.updateUser(req.params.id, { isBanned: stateNow });

  res.json({ message: stateNow ? 'Ban status updated block verified!' : 'Account authorization unlocked.' });
});

// GET Content Reports lists
app.get('/api/admin/reports', authenticateToken, requireAdmin, (req, res) => {
  res.json(dbStore.getReports());
});

// POST Resolve reports
app.post('/api/admin/reports/:id/resolve', authenticateToken, requireAdmin, (req, res) => {
  const succ = dbStore.resolveReport(req.params.id);
  if (!succ) return res.status(404).json({ error: 'Report id not found' });
  res.json({ message: 'Moderation query marked resolved.' });
});


// ==========================================
// 8. PRODUCTION INTEGRATIONS & VITE MIDDLEWARE
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Mounting Vite Middleware for Dynamic HMR Hot reloading...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets built inside /dist root...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Uiverse Full-Stack Engine booting on port http://localhost:${PORT}`);
  });
}

startServer();
