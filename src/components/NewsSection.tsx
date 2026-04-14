import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { newsData as initialNews } from '../data';

interface NewsItem {
  id: string | number;
  title: string;
  date: string;
  image: string;
  excerpt: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);

  const loadNews = () => {
    const savedNews = localStorage.getItem('school_news');
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    } else {
      setNews(initialNews);
      localStorage.setItem('school_news', JSON.stringify(initialNews));
    }
  };

  useEffect(() => {
    loadNews();
    
    // Listen for updates from Admin Panel
    window.addEventListener('news-updated', loadNews);
    return () => window.removeEventListener('news-updated', loadNews);
  }, []);

  return (
    <section id="news" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">Yangiliklar</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">So‘nggi xabarlar va tadbirlar</h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
            Barchasini ko‘rish
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-2 text-xs font-bold text-gray-700">
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
                <button className="flex items-center gap-2 text-sm font-bold text-blue-600 group/btn">
                  Batafsil
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <button className="md:hidden w-full mt-8 py-4 bg-white border border-gray-200 rounded-xl text-blue-600 font-bold">
          Barchasini ko‘rish
        </button>
      </div>
    </section>
  );
}
