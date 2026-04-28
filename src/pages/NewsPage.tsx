import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsData as initialNews } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function NewsPage() {
  const { lang, t } = useLanguage();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsList = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as any[];
      
      const filteredNews = newsList.filter(item => item.lang === lang);
      
      if (filteredNews.length > 0) {
        setNews(filteredNews);
      } else {
        setNews(initialNews[lang as 'uz' | 'ru']);
      }
      setLoading(false);
    }, (error) => {
      console.error('Firestore error in NewsPage:', error);
      setNews(initialNews[lang as 'uz' | 'ru']);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [lang]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{lang === 'uz' ? 'Orqaga' : 'Назад'}</span>
          </Link>
          <h1 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
            {lang === 'uz' ? 'Maktab Yangiliklari' : 'Новости школы'}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Hero Section for News */}
      <section className="bg-blue-600 py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              {lang === 'uz' 
                ? 'Eng so‘nggi yangiliklar va maqolalar' 
                : 'Последние новости и статьи'}
            </h2>
            <p className="text-blue-100 text-lg">
              {lang === 'uz' 
                ? 'Maktabimiz hayotidagi barcha muhim voqealar va yangilanishlardan xabardor bo‘ling.' 
                : 'Будьте в курсе всех важных событий и обновлений из жизни нашей школы.'}
            </p>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <main className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, idx) => (
            <motion.article
              key={`${item.id}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-blue-600 shadow-sm uppercase tracking-wider">
                    {lang === 'uz' ? 'Yangilik' : 'Новости'}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4 text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase">
                  <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-lg">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    <span>{lang === 'uz' ? 'Ma‘muriyat' : 'Админам'}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {item.excerpt}
                </p>
                
                <button className="flex items-center gap-2 text-blue-600 font-bold text-sm group/btn p-2 -ml-2 rounded-xl hover:bg-blue-50 transition-all">
                  {lang === 'uz' ? 'Batafsil' : 'Подробнее'}
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
