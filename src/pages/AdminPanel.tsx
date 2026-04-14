import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Newspaper, 
  Plus,
  Trash2,
  Image as ImageIcon,
  Calendar,
  Type,
  AlignLeft,
  Home,
  LogOut,
  Save,
  X
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
}

export default function AdminPanel() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNews, setNewNews] = useState({
    title: '',
    image: '',
    excerpt: ''
  });

  // Load news from localStorage on mount
  useEffect(() => {
    const savedNews = localStorage.getItem('school_news');
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    } else {
      // Initial mock data if empty
      const initialNews = [
        {
          id: '1',
          title: 'Maktabimizda "Bilimlar kuni" tadbiri bo‘lib o‘tdi',
          date: '2026-09-02',
          image: 'https://picsum.photos/seed/school1/800/600',
          excerpt: 'Yangi o‘quv yili munosabati bilan barcha o‘quvchilar va o‘qituvchilar tantanali ravishda kutib olindi.',
        }
      ];
      setNews(initialNews);
      localStorage.setItem('school_news', JSON.stringify(initialNews));
    }
  }, []);

  const saveNews = (updatedNews: NewsItem[]) => {
    setNews(updatedNews);
    localStorage.setItem('school_news', JSON.stringify(updatedNews));
    // Trigger event for other components to update
    window.dispatchEvent(new Event('news-updated'));
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    const item: NewsItem = {
      id: Date.now().toString(),
      title: newNews.title,
      date: new Date().toISOString().split('T')[0],
      image: newNews.image || `https://picsum.photos/seed/${Date.now()}/800/600`,
      excerpt: newNews.excerpt
    };
    saveNews([item, ...news]);
    setIsAdding(false);
    setNewNews({ title: '', image: '', excerpt: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Haqiqatan ham ushbu yangilikni o‘chirmoqchimisiz?')) {
      saveNews(news.filter(item => item.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="bg-blue-600 p-2 rounded-xl hover:bg-blue-700 transition-colors">
              <Home className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Admin Panel</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Yangiliklar boshqaruvi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                A
              </div>
              <span className="text-sm font-bold text-gray-700">Admin</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
              title="Chiqish"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Yangiliklar ro'yxati</h1>
                <p className="text-gray-500 text-sm mt-1">Maktab hayotidagi so'nggi voqealarni qo'shing yoki o'chiring.</p>
              </div>
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Yangi yangilik
              </button>
            </div>

            {/* Add News Form Modal */}
            <AnimatePresence>
              {isAdding && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAdding(false)}
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Yangi yangilik qo'shish</h3>
                        <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <X className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      <form onSubmit={handleAddNews} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Sarlavha</label>
                          <div className="relative">
                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                              type="text" 
                              required
                              value={newNews.title}
                              onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                              placeholder="Yangilik sarlavhasini yozing"
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Rasm URL (ixtiyoriy)</label>
                          <div className="relative">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                              type="url" 
                              value={newNews.image}
                              onChange={(e) => setNewNews({...newNews, image: e.target.value})}
                              placeholder="https://..."
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Matn</label>
                          <div className="relative">
                            <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            <textarea 
                              required
                              value={newNews.excerpt}
                              onChange={(e) => setNewNews({...newNews, excerpt: e.target.value})}
                              placeholder="Yangilik haqida batafsil ma'lumot..."
                              rows={4}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
                            />
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-4"
                        >
                          <Save className="w-5 h-5" />
                          Saqlash va chop etish
                        </button>
                      </form>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* News List */}
            <div className="space-y-4">
              {news.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-300">
                  <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Hozircha yangiliklar yo'q.</p>
                </div>
              ) : (
                news.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.id} 
                    className="bg-white p-4 rounded-[24px] border border-gray-200 flex items-center gap-6 group hover:shadow-xl hover:shadow-gray-100 transition-all"
                  >
                    <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </div>
                      <h3 className="font-bold text-gray-900 truncate mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{item.excerpt}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
      </main>
    </div>
  );
}
