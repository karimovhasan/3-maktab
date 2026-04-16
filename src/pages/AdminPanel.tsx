import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Newspaper, 
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Calendar,
  Type,
  AlignLeft,
  Home,
  LogOut,
  Save,
  X,
  Languages,
  Images
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { newsData as initialNews, galleryImages as initialGallery } from '../data';
import { db, auth, logout as firebaseLogout } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

interface NewsItem {
  id: string | number;
  title: string;
  date: string;
  image: string;
  excerpt: string;
}

interface GalleryItem {
  id: string | number;
  src: string;
  alt: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'news' | 'gallery'>('news');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const { lang, setLang } = useLanguage();
  
  const [newNews, setNewNews] = useState({
    title: '',
    image: '',
    excerpt: '',
    date: new Date().toLocaleDateString('ru-RU')
  });

  const [newGallery, setNewGallery] = useState({
    src: '',
    alt: ''
  });

  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string | number, type: 'news' | 'gallery' } | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleImportExamples = async () => {
    if (!fbUser || (fbUser.email?.toLowerCase() !== 'hasankarimov023@gmail.com' && fbUser.email?.toLowerCase() !== 'admin@maktab3.uz')) {
      setNotification({
        message: lang === 'uz' ? 'Xatolik: Sizda ma’lumotlarni import qilish huquqi yo‘q.' : 'Ошибка: У вас нет прав на импорт данных.',
        type: 'error'
      });
      return;
    }

    setIsImporting(true);
    try {
      // Import News
      const newsToImport = initialNews[lang as 'uz' | 'ru'];
      for (const item of newsToImport) {
        await addDoc(collection(db, 'news'), {
          title: item.title,
          date: item.date,
          image: item.image,
          excerpt: item.excerpt,
          createdAt: serverTimestamp()
        });
      }

      // Import Gallery
      for (const item of initialGallery) {
        await addDoc(collection(db, 'gallery'), {
          src: item.src,
          alt: item.alt,
          createdAt: serverTimestamp()
        });
      }

      setNotification({
        message: lang === 'uz' ? 'Namunaviy ma’lumotlar muvaffaqiyatli yuklandi!' : 'Образцовые данные успешно загружены!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error importing examples:', error);
      setNotification({
        message: lang === 'uz' ? 'Xatolik: Ma’lumotlarni yuklab bo‘lmadi.' : 'Ошибка: Не удалось загрузить данные.',
        type: 'error'
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'news' | 'gallery' | 'edit' = 'news') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'edit' && editingItem) {
          setEditingItem({ ...editingItem, image: result });
        } else if (type === 'gallery') {
          setNewGallery({ ...newGallery, src: result });
        } else {
          setNewNews({ ...newNews, image: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Load news and gallery from Firestore
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFbUser(user);
      } else if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        // Use a stable check to avoid infinite loops
        setFbUser(prev => {
          if (prev?.email === 'admin@maktab3.uz') return prev;
          return { email: 'admin@maktab3.uz', displayName: 'Admin' } as any;
        });
      } else {
        setFbUser(null);
      }
    });

    // Real-time News
    const newsQuery = query(collection(db, 'news'));
    const unsubscribeNews = onSnapshot(newsQuery, (snapshot) => {
      const newsList = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as NewsItem[];
      
      // Sort by createdAt desc in memory to handle missing fields gracefully
      newsList.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      
      setNews(newsList);
    }, (error) => {
      console.error('Error fetching news:', error);
    });

    // Real-time Gallery
    const galleryQuery = query(collection(db, 'gallery'));
    const unsubscribeGallery = onSnapshot(galleryQuery, (snapshot) => {
      const galleryList = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as GalleryItem[];
      
      // Sort by createdAt desc in memory
      galleryList.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      
      setGallery(galleryList);
    }, (error) => {
      console.error('Error fetching gallery:', error);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeNews();
      unsubscribeGallery();
    };
  }, [lang]); // Removed fbUser from dependencies to prevent loop

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbUser || (fbUser.email?.toLowerCase() !== 'hasankarimov023@gmail.com' && fbUser.email?.toLowerCase() !== 'admin@maktab3.uz')) {
      setNotification({
        message: lang === 'uz' ? 'Xatolik: Sizda yangilik qo‘shish huquqi yo‘q.' : 'Ошибка: У вас нет прав na dobavlenie novostey.',
        type: 'error'
      });
      return;
    }
    setIsSaving(true);
    try {
      const newsData = {
        title: newNews.title,
        date: newNews.date || new Date().toLocaleDateString('ru-RU'),
        image: newNews.image || `https://picsum.photos/seed/${Date.now()}/800/600`,
        excerpt: newNews.excerpt,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'news'), newsData);
      setIsAdding(false);
      setNewNews({ title: '', image: '', excerpt: '', date: new Date().toLocaleDateString('ru-RU') });
      setNotification({
        message: lang === 'uz' ? 'Yangilik saqlandi.' : 'Новость сохранена.',
        type: 'success'
      });
    } catch (error: any) {
      console.error('Error adding news:', error);
      setNotification({
        message: lang === 'uz' ? 'Xatolik: Yangilikni saqlab bo‘lmadi.' : 'Ошибка: Не удалось сохранить новость.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.src) return;
    if (!fbUser || (fbUser.email?.toLowerCase() !== 'hasankarimov023@gmail.com' && fbUser.email?.toLowerCase() !== 'admin@maktab3.uz')) {
      setNotification({
        message: lang === 'uz' ? 'Xatolik: Sizda rasm qo‘shish huquqi yo‘q.' : 'Ошибка: У вас нет прав на добавление фото.',
        type: 'error'
      });
      return;
    }
    setIsSaving(true);
    try {
      const galleryData = {
        src: newGallery.src,
        alt: newGallery.alt || 'Maktab hayoti',
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'gallery'), galleryData);
      setIsAddingGallery(false);
      setNewGallery({ src: '', alt: '' });
      setNotification({
        message: lang === 'uz' ? 'Rasm saqlandi.' : 'Фото сохранено.',
        type: 'success'
      });
    } catch (error: any) {
      console.error('Error adding gallery:', error);
      setNotification({
        message: lang === 'uz' ? 'Xatolik: Rasmni saqlab bo‘lmadi.' : 'Ошибка: Не удалось сохранить фото.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);
    try {
      const newsRef = doc(db, 'news', editingItem.id.toString());
      await updateDoc(newsRef, {
        title: editingItem.title,
        date: editingItem.date,
        image: editingItem.image,
        excerpt: editingItem.excerpt
      });
      setEditingItem(null);
      setNotification({
        message: lang === 'uz' ? 'Yangilik yangilandi.' : 'Новость обновлена.',
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating news:', error);
      setNotification({
        message: lang === 'uz' ? 'Xatolik: Yangilashda xatolik yuz berdi.' : 'Ошибка при обновлении.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNews = (id: string | number) => {
    setItemToDelete({ id, type: 'news' });
  };

  const handleDeleteGallery = (id: string | number) => {
    setItemToDelete({ id, type: 'gallery' });
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const { id, type } = itemToDelete;

    if (!fbUser || (fbUser.email?.toLowerCase() !== 'hasankarimov023@gmail.com' && fbUser.email?.toLowerCase() !== 'admin@maktab3.uz')) {
      setNotification({
        message: lang === 'uz' ? `Xatolik: Sizda ${type === 'news' ? 'yangilikni' : 'rasmni'} o‘chirish huquqi yo‘q.` : `Ошибка: У вас нет прав на удаление ${type === 'news' ? 'новости' : 'фото'}.`,
        type: 'error'
      });
      setItemToDelete(null);
      return;
    }

    try {
      await deleteDoc(doc(db, type, id.toString()));
      setNotification({
        message: lang === 'uz' ? `${type === 'news' ? 'Yangilik' : 'Rasm'} muvaffaqiyatli o‘chirildi.` : `${type === 'news' ? 'Новость' : 'Фото'} успешно удалена.`,
        type: 'success'
      });
    } catch (error: any) {
      console.error(`Error deleting ${type}:`, error);
      setNotification({
        message: lang === 'uz' ? `Xatolik: O‘chirib bo‘lmadi.` : `Ошибка: Не удалось удалить.`,
        type: 'error'
      });
    } finally {
      setItemToDelete(null);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('isAdminLoggedIn');
    try {
      await firebaseLogout();
    } catch (error) {
      console.error('Firebase logout error:', error);
    }
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top Header */}
      <header className="h-16 sm:h-20 bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="bg-blue-600 p-1.5 sm:p-2 rounded-xl hover:bg-blue-700 transition-colors">
              <Home className="w-4 h-4 sm:w-5 h-5 text-white" />
            </Link>
            <div>
              <h2 className="font-bold text-gray-900 text-sm sm:text-lg">Admin Panel</h2>
              <div className="flex items-center gap-2">
                <p className="text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  {lang === 'uz' ? 'Boshqaruv' : 'Управление'}
                </p>
                {fbUser ? (
                  <span className="flex items-center gap-1 text-[8px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-full">
                    <div className="w-1 h-1 bg-green-600 rounded-full animate-pulse" />
                    {fbUser.email?.toLowerCase() === 'hasankarimov023@gmail.com' || fbUser.email?.toLowerCase() === 'admin@maktab3.uz' ? 'ADMIN' : fbUser.email}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[8px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded-full">
                    <div className="w-1 h-1 bg-amber-600 rounded-full" />
                    LOCAL
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex bg-gray-100 p-1 rounded-xl sm:rounded-2xl">
              <button onClick={() => setLang('uz')} className={`px-3 py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all ${lang === 'uz' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>UZ</button>
              <button onClick={() => setLang('ru')} className={`px-3 py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all ${lang === 'ru' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>RU</button>
            </div>

            <button onClick={handleLogout} className="p-2 sm:p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl sm:rounded-2xl transition-all"><LogOut className="w-4 h-4 sm:w-5 h-5" /></button>

          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 flex gap-8">
          <button 
            onClick={() => setActiveTab('news')}
            className={`py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'news' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              {lang === 'uz' ? 'Yangiliklar' : 'Новости'}
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'gallery' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <Images className="w-4 h-4" />
              {lang === 'uz' ? 'Fotogalereya' : 'Фотогалерея'}
            </div>
          </button>
        </div>
      </div>

      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'news' ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{lang === 'uz' ? "Yangiliklar ro'yxati" : "Список новостей"}</h1>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">{lang === 'uz' ? "Maktab hayotidagi so'nggi voqealarni boshqaring." : "Управляйте последними событиями в жизни школы."}</p>
                </div>
                <button onClick={() => setIsAdding(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 w-full sm:w-auto"><Plus className="w-5 h-5" />{lang === 'uz' ? 'Yangi yangilik' : 'Новая новость'}</button>
              </div>

              <div className="space-y-4">
                {news.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-gray-300 px-6">
                    <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-gray-900 font-bold mb-2">
                      {lang === 'uz' ? "Hozircha bazada yangiliklar yo'q" : "В базе пока нет новостей"}
                    </h3>
                    <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
                      {lang === 'uz' 
                        ? "Asosiy sahifadagi yangiliklar namunaviy (test) ma'lumotlardir. Ularni tahrirlash uchun avval bazaga yuklab olishingiz kerak." 
                        : "Новости на главной странице являются образцовыми (тестовыми). Чтобы редактировать их, сначала нужно загрузить их в базу."}
                    </p>
                    <button 
                      onClick={handleImportExamples}
                      disabled={isImporting}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-2xl font-bold text-sm hover:bg-amber-600 transition-all shadow-lg shadow-amber-100 disabled:opacity-50"
                    >
                      {isImporting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {lang === 'uz' ? "Namunaviy yangiliklarni bazaga yuklash" : "Загрузить образцовые новости в базу"}
                    </button>
                  </div>
                ) : (
                  news.map((item) => (
                    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={item.id} className="bg-white p-4 rounded-[24px] border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group hover:shadow-xl hover:shadow-gray-100 transition-all">
                      <div className="w-full sm:w-24 h-48 sm:h-24 rounded-2xl bg-gray-100 overflow-hidden shrink-0"><img src={item.image} alt="" className="w-full h-full object-cover" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1"><Calendar className="w-3 h-3" />{item.date}</div>
                        <h3 className="font-bold text-gray-900 truncate mb-1">{item.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{item.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-3 sm:pt-0">
                        <button onClick={() => setEditingItem(item)} className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 className="w-5 h-5" /></button>
                        <button onClick={() => handleDeleteNews(item.id)} className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{lang === 'uz' ? "Fotogalereya" : "Фотогалерея"}</h1>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">{lang === 'uz' ? "Maktab hayotidan lavhalarni boshqaring." : "Управляйте кадрами из школьной жизни."}</p>
                </div>
                <button onClick={() => setIsAddingGallery(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 w-full sm:w-auto"><Plus className="w-5 h-5" />{lang === 'uz' ? 'Rasm qo\'shish' : 'Добавить фото'}</button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {gallery.map((item) => (
                  <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} key={item.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                    <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => handleDeleteGallery(item.id)} className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all transform scale-90 group-hover:scale-100"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold text-gray-900">{lang === 'uz' ? "Yangi yangilik qo'shish" : "Добавить новую новость"}</h3><button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button></div>
                <form onSubmit={handleAddNews} className="space-y-4">
                  <div className="space-y-2"><label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">{lang === 'uz' ? 'Sarlavha' : 'Заголовок'}</label><div className="relative"><Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" required value={newNews.title} onChange={(e) => setNewNews({...newNews, title: e.target.value})} placeholder={lang === 'uz' ? "Yangilik sarlavhasini yozing" : "Введите заголовок новости"} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" /></div></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">{lang === 'uz' ? 'Rasm yuklash' : 'Загрузить фото'}</label><div className="relative"><label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all overflow-hidden">{newNews.image ? <img src={newNews.image} alt="Preview" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center pt-5 pb-6"><ImageIcon className="w-8 h-8 text-gray-400 mb-2" /><p className="text-xs text-gray-500 font-medium">{lang === 'uz' ? "Rasm tanlash uchun bosing" : "Нажмите, чтобы выбрать фото"}</p></div>}<input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'news')} className="hidden" /></label></div></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">{lang === 'uz' ? 'Sana' : 'Дата'}</label><div className="relative"><Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" required value={newNews.date} onChange={(e) => setNewNews({...newNews, date: e.target.value})} placeholder="DD.MM.YYYY" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" /></div></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">{lang === 'uz' ? 'Matn' : 'Текст'}</label><div className="relative"><AlignLeft className="absolute left-4 top-4 w-5 h-5 text-gray-400" /><textarea required value={newNews.excerpt} onChange={(e) => setNewNews({...newNews, excerpt: e.target.value})} placeholder={lang === 'uz' ? "Yangilik haqida batafsil ma'lumot..." : "Подробная информация о новости..."} rows={4} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none" /></div></div>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {lang === 'uz' ? 'Saqlash va chop etish' : 'Сохранить и опубликовать'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {isAddingGallery && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingGallery(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold text-gray-900">{lang === 'uz' ? "Rasm qo'shish" : "Добавить фото"}</h3><button onClick={() => setIsAddingGallery(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button></div>
                <form onSubmit={handleAddGallery} className="space-y-4">
                  <div className="space-y-2"><label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">{lang === 'uz' ? 'Rasm yuklash' : 'Загрузить фото'}</label><div className="relative"><label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all overflow-hidden">{newGallery.src ? <img src={newGallery.src} alt="Preview" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center pt-5 pb-6"><ImageIcon className="w-8 h-8 text-gray-400 mb-2" /><p className="text-xs text-gray-500 font-medium">{lang === 'uz' ? "Rasm tanlash uchun bosing" : "Нажмите, чтобы выбрать фото"}</p></div>}<input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'gallery')} className="hidden" /></label></div></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">{lang === 'uz' ? 'Tavsif' : 'Описание'}</label><div className="relative"><Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={newGallery.alt} onChange={(e) => setNewGallery({...newGallery, alt: e.target.value})} placeholder={lang === 'uz' ? "Rasm tavsifi..." : "Описание фото..."} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" /></div></div>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {lang === 'uz' ? 'Saqlash' : 'Сохранить'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {editingItem && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingItem(null)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold text-gray-900">{lang === 'uz' ? 'Yangilikni tahrirlash' : 'Редактировать новость'}</h3><button onClick={() => setEditingItem(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button></div>
                <form onSubmit={handleUpdateNews} className="space-y-4">
                  <div className="space-y-2"><label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">{lang === 'uz' ? 'Sarlavha' : 'Заголовок'}</label><div className="relative"><Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" required value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} placeholder={lang === 'uz' ? "Yangilik sarlavhasini yozing" : "Введите заголовок новости"} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" /></div></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">{lang === 'uz' ? 'Rasm yuklash' : 'Загрузить фото'}</label><div className="relative"><label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all overflow-hidden">{editingItem.image ? <img src={editingItem.image} alt="Preview" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center pt-5 pb-6"><ImageIcon className="w-8 h-8 text-gray-400 mb-2" /><p className="text-xs text-gray-500 font-medium">{lang === 'uz' ? "Rasm tanlash uchun bosing" : "Нажмите, чтобы выбрать фото"}</p></div>}<input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'edit')} className="hidden" /></label></div></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">{lang === 'uz' ? 'Sana' : 'Дата'}</label><div className="relative"><Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" required value={editingItem.date} onChange={(e) => setEditingItem({...editingItem, date: e.target.value})} placeholder="DD.MM.YYYY" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" /></div></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">{lang === 'uz' ? 'Matn' : 'Текст'}</label><div className="relative"><AlignLeft className="absolute left-4 top-4 w-5 h-5 text-gray-400" /><textarea required value={editingItem.excerpt} onChange={(e) => setEditingItem({...editingItem, excerpt: e.target.value})} placeholder={lang === 'uz' ? "Yangilik haqida batafsil ma'lumot..." : "Подробная информация о новости..."} rows={4} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none" /></div></div>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {lang === 'uz' ? "O'zgarishlarni saqlash" : "Сохранить изменения"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {itemToDelete && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setItemToDelete(null)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {lang === 'uz' ? "O'chirishni tasdiqlang" : "Подтвердите удаление"}
              </h3>
              <p className="text-gray-500 text-sm mb-8">
                {lang === 'uz' 
                  ? "Haqiqatan ham ushbu ma'lumotni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi." 
                  : "Вы действительно хотите удалить эти данные? Это действие невозможно отменить."}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setItemToDelete(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                  {lang === 'uz' ? "Bekor qilish" : "Отмена"}
                </button>
                <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200">
                  {lang === 'uz' ? "O'chirish" : "Удалить"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }} 
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[400] px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-sm ${notification.type === 'success' ? 'bg-green-600 text-white fill-green-600' : 'bg-red-600 text-white'}`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
