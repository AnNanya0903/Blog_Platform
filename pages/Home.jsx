import React, { useEffect, useState } from 'react';
import { getPosts, deletePost } from '../services/dataService.js';
import { PostCard } from '../components/PostCard.jsx';

export const Home = ({ onNavigate }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to load posts:', error);
      }
    };
    loadPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        const data = await getPosts(); // Refresh posts
        setPosts(data);
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post');
      }
    }
  };

  if (posts.length === 0) return <div className="p-8 text-center text-slate-500">Loading contents...</div>;

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
          Lumina <span className="text-brand-600">Insights</span>
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
      </div>

      <section className="mb-16">
        <PostCard post={featuredPost} onClick={onNavigate} onDelete={handleDelete} featured={true} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Recent Articles</h2>
          <div className="h-px bg-slate-200 flex-grow ml-6"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <PostCard key={post.id} post={post} onClick={onNavigate} onDelete={handleDelete} />
          ))}
        </div>
      </section>
    </div>
  );
};

