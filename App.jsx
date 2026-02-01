import React, { useState } from 'react';
import { Home } from './pages/Home.jsx';
import { PostDetail } from './pages/PostDetail.jsx';
import { CreatePost } from './pages/CreatePost.jsx';
import { PenSquare, Layout, Menu, X } from 'lucide-react';

const VIEW = {
  HOME: 'HOME',
  POST_DETAIL: 'POST_DETAIL',
  CREATE: 'CREATE'
};

const App = () => {
  const [view, setView] = useState(VIEW.HOME);
  const [activePostId, setActivePostId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateToPost = (id) => {
    setActivePostId(id);
    setView(VIEW.POST_DETAIL);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navigateHome = () => {
    setView(VIEW.HOME);
    setActivePostId(null);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navigateToCreate = () => {
    setView(VIEW.CREATE);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={navigateHome}>
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <Layout className="w-5 h-5" />
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-slate-900">Lumina</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={navigateHome}
                className={`text-sm font-medium transition-colors ${view === VIEW.HOME ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Home
              </button>
              <button 
                onClick={navigateToCreate}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all hover:shadow-md"
              >
                <PenSquare className="w-4 h-4" />
                Write
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300 cursor-pointer hover:ring-2 hover:ring-brand-200 transition-all">
                <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-slate-900 p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
             <button 
                onClick={navigateHome}
                className={`text-lg font-medium text-left px-3 py-3 rounded-lg transition-colors ${view === VIEW.HOME ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                Home
              </button>
              <button 
                onClick={navigateToCreate}
                className="text-lg font-medium text-left px-3 py-3 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3"
              >
                <PenSquare className="w-5 h-5" /> Write a Story
              </button>
              <div className="h-px bg-slate-100 my-2"></div>
              <div className="flex items-center gap-3 px-3 py-2 text-slate-700">
                 <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                    <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">My Profile</span>
                    <span className="text-xs text-slate-500">View settings</span>
                  </div>
              </div>
          </div>
        )}
      </nav>

      <main className="flex-grow w-full">
        {view === VIEW.HOME && <Home onNavigate={navigateToPost} />}
        {view === VIEW.POST_DETAIL && activePostId && (
          <PostDetail postId={activePostId} onBack={navigateHome} />
        )}
        {view === VIEW.CREATE && (
          <CreatePost onPostCreated={navigateHome} onCancel={navigateHome} />
        )}
      </main>

      <footer className="bg-slate-900 text-white py-12 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-slate-800 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-6 h-6 bg-brand-500 rounded flex items-center justify-center">
                    <Layout className="w-4 h-4" />
                 </div>
                 <span className="text-lg font-serif font-bold">Lumina</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">A modern publishing platform for writers, thinkers, and storytellers. Built with React, Tailwind, and AI integration.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-200">Explore</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-brand-400 transition-colors">Technology</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Design</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Culture</a></li>
              </ul>
            </div>
            <div>
               <h4 className="font-bold mb-4 text-slate-200">Connect</h4>
               <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-brand-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4 text-center md:text-left">
            <p>&copy; 2024 Lumina Blog Platform. All rights reserved.</p>
            <p>Designed for Demo Purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

