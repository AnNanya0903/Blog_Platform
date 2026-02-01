import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lumina_blog';
// In-memory storage fallback
let useDB = false;
// Mongoose Schemas and Models
const CommentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { _id: false });
// Post Schema
const PostSchema = new mongoose.Schema({
  id: { type: String, required: true, index: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
  readTime: { type: String, required: true },
  comments: { type: [CommentSchema], default: [] }
});
// Post Model
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
// Sample In-Memory Data
let posts = [
  {
    id: '1',
    title: 'The Future of Web Development',
    excerpt: 'How AI is reshaping how we build...',
    content: 'In recent years, artificial intelligence has made significant strides in various fields, including web development. From automated code generation to intelligent design tools, AI is transforming the way developers create websites and applications. This article explores the latest trends and technologies that are shaping the future of web development.',
    author: 'Alex Rivera',
    category: 'Technology',
    imageUrl: 'https://picsum.photos/id/48/800/400',
    createdAt: new Date().toISOString(),
    readTime: '5 min read',
    comments: []
  }
];
// Initialize MongoDB Connection
async function initDB() {
  console.log('Attempting to connect to MongoDB at:', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    useDB = true;
    const count = await Post.countDocuments();
    if (count === 0) {
      await Post.create(posts[0]);
    }
    console.log('MongoDB connected successfully');
  } catch (e) {
    console.error('MongoDB connection error:', e.message);
    console.warn('MongoDB not available, using in-memory storage');
  }
}

initDB();

// Routes
// Get All Postsen
app.get('/api/posts', async (req, res) => {
  if (useDB) {
    const docs = await Post.find({}).sort({ createdAt: -1 }).lean();
    return res.json(docs);
  }
  res.json(posts);
});
// Get Post by ID
app.get('/api/posts/:id', async (req, res) => {
  const id = req.params.id;
  if (useDB) {
    const doc = await Post.findOne({ id }).lean();
    if (!doc) return res.status(404).json({ message: 'Post not found' });
    return res.json(doc);
  }
  const post = posts.find(p => p.id === id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
});
// Create New Post
app.post('/api/posts', async (req, res) => {
  const { title, excerpt, content, author, category, imageUrl } = req.body;
  const newPost = {
    id: Date.now().toString(),
    title,
    excerpt,
    content,
    author,
    category,
    imageUrl,
    createdAt: new Date().toISOString(),
    readTime: `${Math.ceil(String(content).split(' ').length / 200)} min read`,
    comments: []
  };
  if (useDB) {
    const created = await Post.create(newPost);
    return res.status(201).json(created);
  }
  posts.unshift(newPost);
  res.status(201).json(newPost);
});
// Update Post
app.put('/api/posts/:id', async (req, res) => {
  const id = req.params.id;
  const { title, excerpt, content, author, category, imageUrl } = req.body;
  if (useDB) {
    const doc = await Post.findOne({ id });
    if (!doc) return res.status(404).json({ message: 'Post not found' });
    doc.title = title || doc.title;
    doc.excerpt = excerpt || doc.excerpt;
    doc.content = content || doc.content;
    doc.author = author || doc.author;
    doc.category = category || doc.category;
    doc.imageUrl = imageUrl || doc.imageUrl;
    doc.readTime = content ? `${Math.ceil(String(content).split(' ').length / 200)} min read` : doc.readTime;
    await doc.save();
    return res.json(doc);
  }
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) return res.status(404).json({ message: 'Post not found' });
  const post = posts[postIndex];
  posts[postIndex] = {
    ...post,
    title: title || post.title,
    excerpt: excerpt || post.excerpt,
    content: content || post.content,
    author: author || post.author,
    category: category || post.category,
    imageUrl: imageUrl || post.imageUrl,
    readTime: content ? `${Math.ceil(String(content).split(' ').length / 200)} min read` : post.readTime
  };
  res.json(posts[postIndex]);
});
// Delete Post
app.delete('/api/posts/:id', async (req, res) => {
  const id = req.params.id;
  if (useDB) {
    const doc = await Post.findOneAndDelete({ id });
    if (!doc) return res.status(404).json({ message: 'Post not found' });
    return res.status(204).send();
  }
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) return res.status(404).json({ message: 'Post not found' });
  posts.splice(postIndex, 1);
  res.status(204).send();
});
// Add Comment to Post
app.post('/api/posts/:id/comments', async (req, res) => {
  const { content, author } = req.body;
  const id = req.params.id;
  const newComment = {
    id: Date.now().toString(),
    content,
    author,
    createdAt: new Date().toISOString()
  };
  if (useDB) {
    const doc = await Post.findOne({ id });
    if (!doc) return res.status(404).json({ message: 'Post not found' });
    doc.comments.push(newComment);
    await doc.save();
    return res.status(201).json(newComment);
  }
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) return res.status(404).json({ message: 'Post not found' });
  posts[postIndex].comments.push(newComment);
  res.status(201).json(newComment);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
