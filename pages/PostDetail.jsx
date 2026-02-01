import React, { useEffect, useState, useRef } from 'react';
import { getPostById, addComment, updatePost, deletePost } from '../services/dataService.js';
import { ArrowLeft, Clock, Calendar, Share2, MessageSquare, Send, Check, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '../components/Button.jsx';

export const PostDetail = ({ postId, onBack }) => {
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const commentsSectionRef = useRef(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await getPostById(postId);
        setPost(data);
      } catch (error) {
        console.error('Failed to load post:', error);
      }
    };
    loadPost();
  }, [postId]);

  if (!post) return <div className="p-12 text-center">Post not found</div>;

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleShare = async () => {
    const shareData = { title: post.title, text: post.excerpt, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const scrollToComments = () => { commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmittingComment(true);
    try {
      const newComment = await addComment(post.id, commentText, 'Guest User');
      setPost(prev => prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : null);
      setCommentText('');
      setIsSubmittingComment(false);
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment');
      setIsSubmittingComment(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      imageUrl: post.imageUrl
    });
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const updatedPost = await updatePost(post.id, editFormData);
      setPost(updatedPost);
      setIsEditing(false);
      setIsSaving(false);
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post');
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post.id);
        onBack();
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post');
      }
    }
  };

  return (
    <article className="bg-white min-h-screen pb-20">
      <div className="relative h-[50vh] md:h-[60vh] min-h-[350px]">
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-slate-900/10"></div>
        <div className="absolute top-4 left-4 z-20">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20 backdrop-blur-md bg-black/20 border border-white/10">
            <ArrowLeft className="w-5 h-5 mr-2" /> <span className="hidden sm:inline font-medium">Back</span>
          </Button>
        </div>
        <div className="absolute inset-0 flex flex-col justify-end max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
          <div className="flex gap-3 mb-4">
            <span className="px-3 py-1 bg-brand-500 text-white text-xs font-bold uppercase tracking-wider rounded shadow-lg">{post.category}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-sm">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90 text-sm font-medium">
             <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                <img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} className="w-6 h-6 rounded-full border border-white/50" alt={post.author} />
                <span>{post.author}</span>
             </div>
             <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 opacity-80" />{formattedDate}</div>
             <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 opacity-80" />{post.readTime}</div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {isEditing ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Edit Post</h2>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleSaveEdit} isLoading={isSaving}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
                <textarea
                  value={editFormData.excerpt}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                <textarea
                  value={editFormData.content}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={12}
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={editFormData.author}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3"
                  >
                    <option>Technology</option>
                    <option>Design</option>
                    <option>Travel</option>
                    <option>Lifestyle</option>
                    <option>Food</option>
                    <option>Business</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editFormData.imageUrl}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="prose prose-lg prose-slate prose-headings:font-serif prose-headings:font-bold prose-a:text-brand-600 hover:prose-a:text-brand-500 mx-auto">
            {post.content.split('\n').map((paragraph, idx) => {
               if (paragraph.startsWith('## ')) return <h2 key={idx} className="text-2xl md:text-3xl mt-8 mb-4">{paragraph.replace('## ', '')}</h2>
               if (paragraph.startsWith('### ')) return <h3 key={idx} className="text-xl md:text-2xl mt-6 mb-3">{paragraph.replace('### ', '')}</h3>
               if (paragraph.trim() === '') return <br key={idx} />;
               return <p key={idx} className="leading-relaxed mb-4">{paragraph}</p>;
            })}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
               <Button variant="outline" className={`justify-center ${copied ? 'bg-green-50 text-green-600 border-green-200' : ''}`} onClick={handleShare}>
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied Link' : 'Share'}
               </Button>
               <Button variant="outline" className="justify-center text-slate-600" onClick={scrollToComments}>
                  <MessageSquare className="w-4 h-4 mr-2" /> Comment
               </Button>
               <Button variant="outline" className="justify-center text-blue-600" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" /> Edit
               </Button>
               <Button variant="outline" className="justify-center text-red-600" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
               </Button>
            </div>
            <div className="text-slate-500 text-sm italic text-center sm:text-right">Posted in {post.category}</div>
        </div>

        <div ref={commentsSectionRef} className="mt-16 pt-10 border-t border-slate-200">
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-8">Comments ({post.comments?.length || 0})</h3>
          <div className="space-y-6 mb-10">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 md:gap-4">
                  <img src={`https://ui-avatars.com/api/?name=${comment.author}&background=f1f5f9&color=64748b`} alt={comment.author} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-200 flex-shrink-0" />
                  <div className="flex-grow bg-slate-50 p-4 rounded-xl rounded-tl-none">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                      <span className="font-semibold text-slate-900 text-sm md:text-base">{comment.author}</span>
                      <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic text-center py-8 bg-slate-50 rounded-xl">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="relative">
            <div className="mb-4">
              <label htmlFor="comment" className="sr-only">Add a comment</label>
              <textarea id="comment" rows={4} className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-4" placeholder="What are your thoughts?" value={commentText} onChange={(e) => setCommentText(e.target.value)} required />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={!commentText.trim()} isLoading={isSubmittingComment} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800">
                <Send className="w-4 h-4 mr-2" /> Post Comment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </article>
  );
};

