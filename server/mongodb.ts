import mongoose, { Schema } from 'mongoose';
import dotenv from 'dotenv';
import { 
  UserDocument, 
  ComponentDocument, 
  CollectionDocument, 
  CommentDocument, 
  NotificationDocument, 
  ReportDocument 
} from './store';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

export const isMongoConfigured = !!MONGODB_URI;

let mongoConnection: typeof mongoose | null = null;

export async function connectMongo() {
  if (!MONGODB_URI) {
    return null;
  }
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  try {
    console.log("Connecting to MongoDB database at:", MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    const conn = await mongoose.connect(MONGODB_URI);
    console.log("MERN STACK SUCCESS: Connected to MongoDB Database");
    return conn;
  } catch (err) {
    console.error("MERN STACK ERROR: MongoDB connection failed:", err);
    return null;
  }
}

// 1. User Mongoose Schema
const UserSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  followers: [{ type: String }],
  following: [{ type: String }],
  savedComponents: [{ type: String }],
  collections: [{ type: String }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: String, default: () => new Date().toISOString() },
  isBanned: { type: Boolean, default: false }
});

// 2. Component Mongoose Schema
const ComponentSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true, index: true },
  tags: [{ type: String }],
  thumbnail: { type: String, default: '' },
  htmlCode: { type: String, default: '' },
  cssCode: { type: String, default: '' },
  jsCode: { type: String, default: '' },
  reactCode: { type: String, default: '' },
  tailwindCode: { type: String, default: '' },
  author: {
    id: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String, default: '' }
  },
  likes: [{ type: String }],
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  approved: { type: Boolean, default: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

// 3. Collection Mongoose Schema
const CollectionSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  user: { type: String, required: true, index: true },
  components: [{ type: String }],
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

// 4. Comment Mongoose Schema
const CommentSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  user: {
    id: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String, default: '' }
  },
  component: { type: String, required: true, index: true },
  text: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

// 5. Notification Mongoose Schema
const NotificationSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  recipient: { type: String, required: true, index: true },
  sender: {
    id: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String, default: '' }
  },
  type: { type: String, enum: ['like', 'comment', 'follow', 'save'], required: true },
  componentId: { type: String },
  componentTitle: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
  read: { type: Boolean, default: false }
});

// 6. Report Mongoose Schema
const ReportSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  reporter: {
    id: { type: String, required: true },
    username: { type: String, required: true }
  },
  componentId: { type: String, required: true },
  componentTitle: { type: String, required: true },
  reason: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' }
});

// 7. Site Views Statistics Mongoose Schema
const SiteStatsSchema = new Schema({
  key: { type: String, required: true, unique: true, default: 'site_metric' },
  siteViews: { type: Number, default: 0 }
});

// Compile Models
export const MongoUser = mongoose.models.User || mongoose.model<any>('User', UserSchema);
export const MongoComponent = mongoose.models.Component || mongoose.model<any>('Component', ComponentSchema);
export const MongoCollection = mongoose.models.Collection || mongoose.model<any>('Collection', CollectionSchema);
export const MongoComment = mongoose.models.Comment || mongoose.model<any>('Comment', CommentSchema);
export const MongoNotification = mongoose.models.Notification || mongoose.model<any>('Notification', NotificationSchema);
export const MongoReport = mongoose.models.Report || mongoose.model<any>('Report', ReportSchema);
export const MongoSiteStats = mongoose.models.SiteStats || mongoose.model<any>('SiteStats', SiteStatsSchema);

// Synchronize database logic:
// Takes a disk store instance and loads all initial seed data into MongoDB if MongoDB is empty.
export async function syncLocalSeedToMongo(diskData: {
  users: UserDocument[];
  components: ComponentDocument[];
  collections: CollectionDocument[];
  comments: CommentDocument[];
  notifications: NotificationDocument[];
  reports: ReportDocument[];
  siteViews: number;
}) {
  await connectMongo();
  if (!mongoConnection) return;

  try {
    const userCount = await MongoUser.countDocuments();
    if (userCount === 0 && diskData.users.length > 0) {
      console.log("Seeding MongoDB Users from local database...");
      await MongoUser.insertMany(diskData.users);
    }

    const componentCount = await MongoComponent.countDocuments();
    if (componentCount === 0 && diskData.components.length > 0) {
      console.log("Seeding MongoDB Components from local database...");
      await MongoComponent.insertMany(diskData.components);
    }

    const collectionCount = await MongoCollection.countDocuments();
    if (collectionCount === 0 && diskData.collections.length > 0) {
      console.log("Seeding MongoDB Collections from local database...");
      await MongoCollection.insertMany(diskData.collections);
    }

    const commentCount = await MongoComment.countDocuments();
    if (commentCount === 0 && diskData.comments.length > 0) {
      console.log("Seeding MongoDB Comments from local database...");
      await MongoComment.insertMany(diskData.comments);
    }

    const statsConfig = await MongoSiteStats.findOne({ key: 'site_metric' });
    if (!statsConfig) {
      await MongoSiteStats.create({ key: 'site_metric', siteViews: diskData.siteViews || 120 });
    }
    
    console.log("MERN STACK SUCCESS: Seed Sync of MongoDB completed.");
  } catch (err) {
    console.error("MERN STACK WARNING: Error syncing seed data:", err);
  }
}
