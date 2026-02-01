import { generateBlogContent } from './services/aiService.js';
// API Base URL
const API_BASE = '/api';
// Fetch All Posts
async function apiGetPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  if (!res.ok) throw new Error('Failed to load posts');
  return res.json();
}
// Fetch Post by ID
async function apiGetPostById(id) {
  const res = await fetch(`${API_BASE}/posts/${id}`);
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}
// Create New Post
async function apiCreatePost(post) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

async function apiUpdatePost(id, post) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
}

async function apiDeletePost(id) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete post');
}
// Add Comment to Post
async function apiAddComment(postId, content, author) {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, author })
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}
// Application State
const state = {
  view: 'HOME',
  postId: null,
  mobileMenuOpen: false,
  posts: null,
  currentPost: null,
  editingPost: null,
  searchQuery: '',
  selectedCategory: null
};
// Main App Container
const app = document.getElementById('app');
// Navigation Function
async function navigateTo(view, id = null) {
  state.view = view;
  state.postId = id;
  state.mobileMenuOpen = false;
  window.scrollTo(0, 0);

  try {
    if (view === 'HOME') {
      state.posts = await apiGetPosts();
    } else if (view === 'DETAIL' && id) {
      state.currentPost = await apiGetPostById(id);
    }
  } catch (e) {
    console.error(e);
  }

  render();
}

async function navigateToEdit(id) {
  const post = await apiGetPostById(id);
  state.editingPost = post;
  await navigateTo('CREATE');
}
// UI Components
const Navbar = () => `
  <nav class="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center gap-2 cursor-pointer" onclick="window.navigateHome()">
          <div class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <i data-lucide="layout" class="w-5 h-5"></i>
          </div>
          <span class="text-xl font-serif font-bold tracking-tight text-slate-900">Lumina</span>
        </div>
        <div class="hidden md:flex items-center gap-6">
          <button onclick="window.navigateHome()" class="text-sm font-medium transition-colors ${state.view === 'HOME' ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'}">Home</button>
          <button onclick="window.navigateCreate()" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all hover:shadow-md">
            <i data-lucide="pen-square" class="w-4 h-4"></i> Write
          </button>
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
            <input type="text" placeholder="Search posts..." oninput="window.handleSearch(event)" value="${state.searchQuery}" class="pl-10 pr-4 py-2 border border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
          </div>
          <div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
            <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="Profile" class="w-full h-full object-cover"/>
          </div>
        </div>
        <div class="flex items-center md:hidden">
          <button onclick="window.toggleMobileMenu()" class="text-slate-600 hover:text-slate-900 p-2">
            <i data-lucide="${state.mobileMenuOpen ? 'x' : 'menu'}" class="w-6 h-6"></i>
          </button>
        </div>
      </div>
    </div>
    ${state.mobileMenuOpen ? `
      <div class="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl px-4 py-6 flex flex-col gap-4">
         <button onclick="window.navigateHome()" class="text-lg font-medium text-left px-3 py-3 rounded-lg transition-colors ${state.view === 'HOME' ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'}">Home</button>
         <button onclick="window.navigateCreate()" class="text-lg font-medium text-left px-3 py-3 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3">
           <i data-lucide="pen-square" class="w-5 h-5"></i> Write a Story
         </button>
         <div class="px-3">
           <input type="text" placeholder="Search posts..." oninput="window.handleSearch(event)" value="${state.searchQuery}" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
         </div>
      </div>
    ` : ''}
  </nav>
`;
// Footer Component
const Footer = () => `
  <footer class="bg-slate-900 text-white py-12 mt-auto border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-slate-800 pb-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
             <div class="w-6 h-6 bg-brand-500 rounded flex items-center justify-center"><i data-lucide="layout" class="w-4 h-4"></i></div>
             <span class="text-lg font-serif font-bold">Lumina</span>
          </div>
          <p class="text-slate-400 text-sm leading-relaxed max-w-sm">A modern publishing platform built with Vanilla JS and Express architecture.</p>
        </div>
        <div>
          <h4 class="font-bold mb-4 text-slate-200">Explore</h4>
          <ul class="space-y-2 text-slate-400 text-sm">
            <li><a onclick="window.selectCategory('Technology')" class="cursor-pointer ${state.selectedCategory === 'Technology' ? 'text-brand-400' : 'hover:text-brand-400'}">Technology</a></li>
            <li><a onclick="window.selectCategory('Design')" class="cursor-pointer ${state.selectedCategory === 'Design' ? 'text-brand-400' : 'hover:text-brand-400'}">Design</a></li>
            <li><a onclick="window.selectCategory('Travel')" class="cursor-pointer ${state.selectedCategory === 'Travel' ? 'text-brand-400' : 'hover:text-brand-400'}">Travel</a></li>
            <li><a onclick="window.selectCategory('Lifestyle')" class="cursor-pointer ${state.selectedCategory === 'Lifestyle' ? 'text-brand-400' : 'hover:text-brand-400'}">Lifestyle</a></li>
          </ul>
        </div>
        <div>
            <h4 class="font-bold mb-4 text-slate-200">Connect</h4>
            <ul class="space-y-2 text-slate-400 text-sm">
             <li><a href="https://github.com" target="_blank" class="hover:text-brand-400">GitHub</a></li>
             <li><a href="https://twitter.com" target="_blank" class="hover:text-brand-400">Twitter</a></li>
             <li><a href="https://linkedin.com" target="_blank" class="hover:text-brand-400">LinkedIn</a></li>
           </ul>
        </div>
      </div>
      <div class="text-xs text-slate-500 text-center md:text-left">&copy; 2024 Lumina Blog.</div>
    </div>
  </footer>
`;
// Post Card Component
const PostCard = (post, isFeatured = false) => {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  if (isFeatured) {
    return `
      <div onclick="window.navigateDetail('${post.id}')" class="group relative grid md:grid-cols-2 cursor-pointer rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ring-1 ring-slate-900/5 mb-12">
        <div class="relative h-64 md:h-full overflow-hidden">
          <div class="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
          <img src="${post.imageUrl}" class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
        </div>
        <div class="p-6 md:p-10 lg:p-12 flex flex-col justify-center relative">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold tracking-wider uppercase rounded-full">${post.category}</span>
          </div>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-6 group-hover:text-brand-600 transition-colors leading-tight">${post.title}</h2>
          <p class="text-slate-600 text-lg mb-8 line-clamp-3 leading-relaxed">${post.excerpt}</p>
          <div class="flex items-center text-slate-500 text-sm gap-6 mt-auto font-medium">
            <div class="flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4"></i> ${date}</div>
            <div class="flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4"></i> ${post.readTime}</div>
          </div>
        </div>
      </div>
    `;
  }
  return `
    <div onclick="window.navigateDetail('${post.id}')" class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full border border-slate-100/50">
      <div class="relative h-56 overflow-hidden">
        <div class="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-300 z-10"></div>
        <img src="${post.imageUrl}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
        <div class="absolute top-4 left-4 z-20">
          <span class="px-3 py-1 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold tracking-wide rounded-lg shadow-sm">${post.category}</span>
        </div>
      </div>
      <div class="p-6 md:p-8 flex flex-col flex-grow">
        <h3 class="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">${post.title}</h3>
        <p class="text-slate-600 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">${post.excerpt}</p>
        <div class="flex items-center justify-between text-slate-500 text-xs mt-auto pt-6 border-t border-slate-100">
          <div class="flex items-center gap-2.5">
             <img src="https://ui-avatars.com/api/?name=${post.author}&background=f1f5f9&color=64748b" class="w-8 h-8 rounded-full border border-slate-200" />
             <span class="font-medium text-slate-700">${post.author}</span>
          </div>
          <div class="flex items-center text-brand-600 font-semibold group-hover:translate-x-1 transition-transform">
            Read <i data-lucide="arrow-right" class="w-4 h-4 ml-1.5"></i>
          </div>
        </div>
      </div>
    </div>
  `;
};
// Home Page Component
const HomePage = () => {
  const posts = state.posts || [];
  if (!state.posts) {
    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center text-slate-500">Loading contents...</div>
      </div>
    `;
  }
  const searchFiltered = state.searchQuery ? posts.filter(p => p.title.toLowerCase().includes(state.searchQuery.toLowerCase()) || p.content.toLowerCase().includes(state.searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(state.searchQuery.toLowerCase())) : posts;
  const filteredPosts = state.selectedCategory ? searchFiltered.filter(p => p.category === state.selectedCategory) : searchFiltered;
  if (filteredPosts.length === 0 && (state.searchQuery || state.selectedCategory)) {
    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center text-slate-500">
          <p>No posts found${state.searchQuery ? ` for "${state.searchQuery}"` : ''}${state.selectedCategory ? ` in ${state.selectedCategory}` : ''}</p>
          <button onclick="state.searchQuery = ''; state.selectedCategory = null; render();" class="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg">Clear filters</button>
        </div>
      </div>
    `;
  }
  const featured = filteredPosts[0];
  const others = filteredPosts.slice(1);
  const title = state.searchQuery ? `Search results for "${state.searchQuery}"` : state.selectedCategory ? `${state.selectedCategory} Posts` : 'Lumina <span class="text-brand-600">Insights</span>';
  const subtitle = state.searchQuery ? `Found ${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''}` : state.selectedCategory ? `Discover ${state.selectedCategory.toLowerCase()} stories` : 'Discover stories, thinking, and expertise from writers on any topic.';
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
          ${title}
        </h1>
        <p class="text-slate-600 text-lg max-w-2xl mt-4">${subtitle}</p>
      </div>
      ${PostCard(featured, true)}
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        ${others.map(p => PostCard(p)).join('')}
      </div>
    </div>
  `;
};
// Post Detail Page Component
const PostDetailPage = (id) => {
  if (!id) return `<div class="p-12 text-center">Post not found</div>`;
  const post = state.currentPost;
  if (!post) return `<div class="p-12 text-center">Loading post...</div>`;
  const date = new Date(post.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const commentsHtml = (post.comments || []).map(c => `
    <div class="flex gap-4 mb-6">
      <img src="https://ui-avatars.com/api/?name=${c.author}&background=f1f5f9&color=64748b" class="w-10 h-10 rounded-full border border-slate-200" />
      <div class="bg-slate-50 p-4 rounded-xl flex-grow">
        <div class="flex justify-between mb-2"><span class="font-bold">${c.author}</span><span class="text-xs text-slate-500">${new Date(c.createdAt).toLocaleDateString()}</span></div>
        <p class="text-slate-700 text-sm">${c.content}</p>
      </div>
    </div>
  `).join('');

  return `
    <article class="bg-white min-h-screen pb-20">
      <div class="relative h-[60vh]">
        <img src="${post.imageUrl}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
        <div class="absolute top-4 left-4 z-20">
             <button onclick="window.navigateHome()" class="text-white hover:bg-white/20 backdrop-blur-md bg-black/20 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2">
                <i data-lucide="arrow-left" class="w-4 h-4"></i> Back
             </button>
        </div>
        <div class="absolute inset-0 flex flex-col justify-end max-w-4xl mx-auto px-4 pb-12">
           <span class="px-3 py-1 bg-brand-500 text-white text-xs font-bold uppercase tracking-wider rounded w-max mb-4">${post.category}</span>
           <h1 class="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">${post.title}</h1>
           <div class="flex items-center gap-6 text-white/90 text-sm">
              <span class="flex items-center gap-2"><img src="https://ui-avatars.com/api/?name=${post.author}" class="w-6 h-6 rounded-full"/> ${post.author}</span>
              <span class="flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4"></i> ${date}</span>
              <span class="flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4"></i> ${post.readTime}</span>
           </div>
        </div>
      </div>
      <div class="max-w-3xl mx-auto px-4 py-12">
        <div class="prose prose-lg prose-slate mx-auto">
          ${post.content.split('\n').map(p => {
             if(p.startsWith('## ')) return `<h2 class="text-3xl mt-8 mb-4 font-serif font-bold">${p.replace('## ', '')}</h2>`;
             if(p.startsWith('### ')) return `<h3 class="text-2xl mt-6 mb-3 font-serif font-bold">${p.replace('### ', '')}</h3>`;
             return p ? `<p class="mb-4 leading-relaxed">${p}</p>` : '<br/>';
          }).join('')}
        </div>
        <div class="mt-12 pt-8 border-t border-slate-200 flex gap-4">
          <button onclick="window.sharePost()" class="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
            <i data-lucide="share-2" class="w-4 h-4"></i> Share
          </button>
          <button onclick="window.editPost('${post.id}')" class="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
            <i data-lucide="edit" class="w-4 h-4"></i> Edit
          </button>
          <button onclick="window.deletePost('${post.id}')" class="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
            <i data-lucide="trash-2" class="w-4 h-4"></i> Delete
          </button>
        </div>
        <div id="comments-section" class="mt-16">
          <h3 class="text-2xl font-serif font-bold mb-8">Comments (${(post.comments || []).length})</h3>
          <div id="comments-list">${commentsHtml}</div>
          <form onsubmit="window.handleComment(event, '${post.id}')" class="mt-8">
            <textarea name="comment" rows="4" class="w-full rounded-xl border-slate-300 shadow-sm p-4" placeholder="Write a comment..." required></textarea>
            <div class="flex justify-end mt-4">
              <button type="submit" class="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2">
                <i data-lucide="send" class="w-4 h-4"></i> Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </article>
  `;
};
// Create Post Page Component
const CreatePostPage = () => `
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-serif font-bold text-slate-900">${state.editingPost ? 'Edit Story' : 'Create New Story'}</h1>
      <div class="flex gap-3">
        <button onclick="window.cancelEdit()" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
        <button onclick="document.getElementById('create-form').dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}))" class="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2">
          <i data-lucide="save" class="w-4 h-4"></i> ${state.editingPost ? 'Update' : 'Publish'}
        </button>
      </div>
    </div>
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center">
        <div class="flex items-center gap-3 text-indigo-900">
           <i data-lucide="wand-2" class="w-5 h-5"></i>
           <span class="text-sm font-semibold">AI Assistant Available</span>
        </div>
        <button onclick="window.openAiModal()" class="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">Magic Draft</button>
      </div>
      <form id="create-form" onsubmit="window.handleCreate(event)" class="p-8 space-y-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">Title</label>
          <input type="text" name="title" value="${state.editingPost ? state.editingPost.title : ''}" class="w-full text-4xl font-serif font-bold border-none p-0 focus:ring-0 placeholder-slate-300" placeholder="Enter title..." required />
        </div>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Category</label>
            <select name="category" value="${state.editingPost ? state.editingPost.category : ''}" class="w-full rounded-lg border-slate-300 py-2">
               <option>Technology</option><option>Design</option><option>Travel</option><option>Lifestyle</option>
            </select>
          </div>
          <div class="space-y-2">
             <label class="block text-sm font-medium text-slate-700">Author</label>
             <input type="text" name="author" value="${state.editingPost ? state.editingPost.author : 'Guest User'}" class="w-full rounded-lg border-slate-300 py-2" />
          </div>
        </div>
        <div class="space-y-2">
           <label class="block text-sm font-medium text-slate-700">Image URL</label>
           <input type="text" name="imageUrl" value="${state.editingPost ? state.editingPost.imageUrl : 'https://picsum.photos/1200/600'}" class="w-full rounded-lg border-slate-300 py-2 text-sm" />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">Excerpt</label>
          <textarea name="excerpt" rows="2" class="w-full rounded-lg border-slate-300" placeholder="Short summary..." required>${state.editingPost ? state.editingPost.excerpt : ''}</textarea>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">Content</label>
          <textarea name="content" rows="12" class="w-full rounded-lg border-slate-300 font-mono text-sm" placeholder="Write your story..." required>${state.editingPost ? state.editingPost.content : ''}</textarea>
        </div>
      </form>
    </div>
    <div id="ai-modal" class="hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
         <h3 class="text-xl font-bold mb-4 flex items-center gap-2"><i data-lucide="wand-2" class="w-5 h-5"></i> AI Writer</h3>
         <p class="text-sm text-slate-600 mb-4">Enter a topic and let Express + Gemini generate it.</p>
         <textarea id="ai-prompt" class="w-full border-slate-300 rounded-lg mb-4" rows="3" placeholder="e.g. The history of coffee..."></textarea>
         <div class="flex justify-end gap-2">
           <button onclick="document.getElementById('ai-modal').classList.add('hidden')" class="px-4 py-2 text-slate-600">Cancel</button>
           <button onclick="window.generateContent()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Generate</button>
         </div>
      </div>
    </div>
  </div>
`;
// Global Event Handlers
window.navigateHome = async () => { await navigateTo('HOME'); };
window.navigateDetail = async (id) => { await navigateTo('DETAIL', id); };
window.navigateCreate = async () => { await navigateTo('CREATE'); };
window.toggleMobileMenu = () => { state.mobileMenuOpen = !state.mobileMenuOpen; render(); };
// Form Handlers
window.handleCreate = async (e) => {
  e.preventDefault();
  const target = e.target;
  const formData = new FormData(target);
  const data = {};
  formData.forEach((value, key) => { data[key] = value.toString(); });
  if (state.editingPost) {
    await apiUpdatePost(state.editingPost.id, data);
    state.editingPost = null;
    await navigateTo('HOME');
  } else {
    await apiCreatePost(data);
    await navigateTo('HOME');
  }
};
// Comment Handler
window.handleComment = async (e, postId) => {
  e.preventDefault();
  const form = e.target;
  const commentInput = form.elements.namedItem('comment');
  const content = commentInput.value;
  await apiAddComment(postId, content, 'Guest User');
  await navigateTo('DETAIL', postId);
};
// Share Post Handler
window.sharePost = () => { navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!'); };
window.openAiModal = () => { const modal = document.getElementById('ai-modal'); if (modal) modal.classList.remove('hidden'); };
window.editPost = async (id) => { await navigateToEdit(id); };
window.cancelEdit = () => { state.editingPost = null; navigateTo('HOME'); };
window.deletePost = async (id) => {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      await apiDeletePost(id);
      alert('Post deleted successfully');
      navigateTo('HOME');
    } catch (e) {
      alert('Failed to delete post');
    }
  }
};
window.shareOnTwitter = (url, title) => { window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank'); };
window.shareOnFacebook = (url) => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'); };
window.shareOnLinkedIn = (url) => { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank'); };
window.handleSearch = (e) => { state.searchQuery = e.target.value; render(); };
window.selectCategory = (category) => { state.selectedCategory = state.selectedCategory === category ? null : category; navigateTo('HOME'); };

window.generateContent = async () => {
  const promptInput = document.getElementById('ai-prompt');
  if (!promptInput) return;
  const prompt = promptInput.value;
  const btn = document.querySelector('#ai-modal button:last-child');
  if (!btn) return;
  const originalText = btn.innerText;
  btn.innerText = 'Generating...';
  btn.disabled = true;
  try {
    const result = await generateBlogContent(prompt, 'Engaging');
    const form = document.getElementById('create-form');
    if (form) {
      const titleInput = form.elements.namedItem('title');
      const excerptInput = form.elements.namedItem('excerpt');
      const contentInput = form.elements.namedItem('content');
      if (titleInput) titleInput.value = result.title;
      if (excerptInput) excerptInput.value = result.excerpt;
      if (contentInput) contentInput.value = result.content;
    }
    const modal = document.getElementById('ai-modal');
    if (modal) modal.classList.add('hidden');
  } catch(e) {
    alert('Error generating content');
  } finally {
    btn.innerText = originalText;
    btn.disabled = false;
  }
};

function render() {
  let content = '';
  switch (state.view) {
    case 'HOME': content = HomePage(); break;
    case 'DETAIL': content = PostDetailPage(state.postId); break;
    case 'CREATE': content = CreatePostPage(); break;
  }
  if (app) {
    app.innerHTML = `
        ${Navbar()}
        <main class="flex-grow w-full">
        ${content}
        </main>
        ${Footer()}
    `;
  }
  if (window.lucide) window.lucide.createIcons();
}

navigateTo('HOME');

