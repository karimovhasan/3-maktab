import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { newsData as initialNews } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

interface NewsItem {
  id: string | number;
  title: string;
  date: string;
  image: string;
  excerpt: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const { lang, t } = useLanguage();

  useEffect(() => {
    const q = query(collection(db, 'news'));
    
    const unsubscribeNews = onSnapshot(q, (snapshot) => {
      const newsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsItem[];
      
      if (newsList.length > 0) {
        // Sort by createdAt desc in memory
        newsList.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });
        setNews(newsList);
      } else {
        setNews(initialNews['uz']);
      }
    }, (error) => {
      console.error('Firestore error in NewsSection:', error);
      setNews(initialNews['uz']);
    });

    return () => {
      unsubscribeNews();
    };
  }, []);

  return (
    <section id="news" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">
              {lang === 'uz' ? 'Yangiliklar' : 'Новости'}
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              {lang === 'uz' ? 'So‘nggi xabarlar va tadbirlar' : 'Последние новости va tadbirlar'}
            </h2>
          </div>
          <button className="hidden lg:flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
            {lang === 'uz' ? 'Barchasini ko‘rish' : 'Посмотреть все'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {news.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group relative"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-lg flex items-center gap-2 text-xs font-bold text-gray-700">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  {item.date}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {item.excerpt}
                </p>
                <button 
                  onClick={() => setSelectedNews(item)}
                  className="flex items-center gap-2 text-sm font-bold text-blue-600 group/btn"
                >
                  {t('news.more')}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <button className="lg:hidden w-full mt-8 py-4 bg-white border border-gray-200 rounded-xl text-blue-600 font-bold">
          {lang === 'uz' ? 'Barchasini ko‘rish' : 'Посмотреть все'}
        </button>
      </div>

      {/* News Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNews(null)}
              className="absolute inset-0 bg-gray-900/60"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedNews(null)}
                className="absolute top-6 right-6 p-2 bg-white/20 text-white hover:bg-white/40 rounded-full transition-all z-10"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              
              <div className="h-64 sm:h-80 w-full shrink-0">
                <img src={selectedNews.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              <div className="p-8 overflow-y-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                  <Calendar className="w-4 h-4" />
                  {selectedNews.date}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                  {selectedNews.title}
                </h2>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedNews.excerpt}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
