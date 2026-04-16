import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Maximize2 } from 'lucide-react';
import { galleryImages as initialGallery } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function MultimediaSection() {
  const { lang, t } = useLanguage();
  const [gallery, setGallery] = useState(initialGallery);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const galleryList = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as any[];
      
      if (galleryList.length > 0) {
        setGallery(galleryList);
      } else {
        setGallery(initialGallery);
      }
    }, (error) => {
      console.error('Firestore error in MultimediaSection:', error);
      setGallery(initialGallery);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="gallery" className="py-24 bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">Multimedia</span>
            <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 leading-tight">
              {lang === 'uz' ? 'Maktab hayoti videolarda va suratlarda' : 'Школьная жизнь в видео и фотографиях'}
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              {lang === 'uz' 
                ? 'Bizning maktabda nafaqat darslar, balki turli qiziqarli tadbirlar, sport musobaqalari va ijodiy to‘garaklar ham muntazam o‘tkaziladi.'
                : 'В нашей школе регулярно проводятся не только уроки, но и различные интересные мероприятия, спортивные соревнования и творческие кружки.'}
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-8">
              <div className="flex-1 min-w-[80px]">
                <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1">1200+</div>
                <div className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-wider">
                  {lang === 'uz' ? 'O‘quvchilar' : 'Ученики'}
                </div>
              </div>
              <div className="hidden xs:block w-px h-12 bg-gray-800" />
              <div className="flex-1 min-w-[80px]">
                <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1">85+</div>
                <div className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-wider">
                  {lang === 'uz' ? 'O‘qituvchilar' : 'Учителя'}
                </div>
              </div>
              <div className="hidden xs:block w-px h-12 bg-gray-800" />
              <div className="flex-1 min-w-[80px]">
                <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1">40+</div>
                <div className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-wider">
                  {lang === 'uz' ? 'Sinflar' : 'Классы'}
                </div>
              </div>
            </div>
          </div>

          <div className="relative group cursor-pointer">
            <div className="aspect-video rounded-3xl overflow-hidden relative">
              <img
                src="https://picsum.photos/seed/school-video/1280/720"
                alt={lang === 'uz' ? 'Maktab videosi' : 'Видео школы'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/50 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-current" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600/20 rounded-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-10">
            <h3 className="text-2xl font-bold">{lang === 'uz' ? 'Fotogalereya' : 'Фотогалерея'}</h3>
            <button className="text-blue-500 font-bold hover:underline">
              {lang === 'uz' ? 'Barcha rasmlar' : 'Все фотографии'}
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {gallery.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/40 transition-colors flex items-center justify-center">
                  <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
