import React, { useState } from 'react';
import { createPost } from '../services/dataService.js';
import { generateBlogContent } from '../services/aiService.js';
import { Button } from '../components/Button.jsx';
import { Wand2, Save, Image as ImageIcon, AlignLeft } from 'lucide-react';

export const CreatePost = ({ onPostCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Current User',
    category: 'General',
    imageUrl: 'https://picsum.photos/1200/600',
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createPost(formData);
      setIsSaving(false);
      onPostCreated();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post');
      setIsSaving(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const result = await generateBlogContent(aiPrompt, 'Professional but engaging');
      setFormData(prev => ({
        ...prev,
        title: result.title,
        excerpt: result.excerpt,
        content: result.content
      }));
      setShowAiModal(false);
    } catch (error) {
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Create New Story</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="ghost" onClick={onCancel} className="flex-1 sm:flex-none justify-center">Cancel</Button>
          <Button onClick={handleSave} isLoading={isSaving} className="flex-1 sm:flex-none justify-center">
            <Save className="w-4 h-4 mr-2" /> Publish
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 border-b border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
           <div className="flex items-center gap-3 text-indigo-900">
             <div className="p-2 bg-white rounded-lg shadow-sm">
                <Wand2 className="w-5 h-5 text-indigo-600" />
             </div>
             <div>
                <p className="font-semibold text-sm">Need inspiration?</p>
                <p className="text-xs text-indigo-700">Use Gemini AI to draft your post.</p>
             </div>
           </div>
           <Button 
             variant="primary" 
             className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-sm py-1.5 justify-center"
             onClick={() => setShowAiModal(true)}
           >
             Magic Draft
           </Button>
        </div>

        <form onSubmit={handleSave} className="p-4 md:p-8 space-y-6 md:space-y-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full text-2xl md:text-4xl font-serif font-bold placeholder-slate-300 border-none focus:ring-0 p-0 text-slate-900 break-words"
              placeholder="Enter your title..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
             <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2.5"
                >
                  <option>Technology</option>
                  <option>Design</option>
                  <option>Travel</option>
                  <option>Lifestyle</option>
                  <option>Food</option>
                  <option>Business</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Author Name</label>
                <input 
                  type="text" 
                  name="author" 
                  value={formData.author} 
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2.5"
                />
             </div>
          </div>

          <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Cover Image URL
             </label>
             <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm text-slate-600 py-2.5"
              placeholder="https://..."
            />
            {formData.imageUrl && (
              <div className="mt-2 h-32 md:h-40 w-full rounded-lg overflow-hidden bg-slate-100">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={3}
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
              placeholder="A short summary of your post..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <AlignLeft className="w-4 h-4" /> Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={12}
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 font-mono text-sm leading-relaxed"
              placeholder="Write your story here... (Markdown supported)"
              required
            />
          </div>

        </form>
      </div>

      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center gap-3 mb-4 text-indigo-900">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <Wand2 className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold">AI Writing Assistant</h3>
            </div>
            <p className="text-slate-600 mb-6 text-sm md:text-base">Describe what you want to write about, and let Gemini generate a draft for you.</p>
            
            <textarea
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mb-6"
              rows={4}
              placeholder="e.g., The benefits of morning meditation for productivity..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowAiModal(false)} className="order-2 sm:order-1">Cancel</Button>
              <Button 
                onClick={handleAiGenerate} 
                disabled={!aiPrompt} 
                isLoading={isGenerating}
                className="bg-indigo-600 hover:bg-indigo-700 order-1 sm:order-2"
              >
                Generate Draft
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

