import React from 'react';
import { Clock, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from './Button.jsx';

export const PostCard = ({ post, onClick, onDelete, featured = false }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  if (featured) {
    return (
      <div 
        onClick={() => onClick(post.id)}
        className="group relative grid md:grid-cols-2 cursor-pointer rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ring-1 ring-slate-900/5 mb-12"
      >
        <div className="relative h-64 md:h-full overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
          <img
            src={post.imageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          {onDelete && (
            <div className="absolute top-4 right-4 z-20">
              <Button
                variant="ghost"
                className="text-white hover:text-red-400 hover:bg-black/50 backdrop-blur-md px-3 py-2 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(post.id);
                }}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </div>
          )}
        </div>
        <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold tracking-wider uppercase rounded-full">
              {post.category}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-6 group-hover:text-brand-600 transition-colors leading-tight">
            {post.title}
          </h2>
          <p className="text-slate-600 text-lg mb-8 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex items-center text-slate-500 text-sm gap-6 mt-auto font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(post.id)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full border border-slate-100/50"
    >
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-300 z-10" />
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold tracking-wide rounded-lg shadow-sm">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>
        <p className="text-slate-600 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-slate-500 text-xs mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
             <img src={`https://ui-avatars.com/api/?name=${post.author}&background=f1f5f9&color=64748b`} alt={post.author} className="w-8 h-8 rounded-full border border-slate-200" />
             <span className="font-medium text-slate-700">{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            {onDelete && (
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(post.id);
                }}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            )}
            <div className="flex items-center text-brand-600 font-semibold group-hover:translate-x-1 transition-transform">
              Read Article <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

