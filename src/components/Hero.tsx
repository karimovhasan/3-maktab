import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroSlides as initialHeroSlides } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

interface Slide {
  id: string | number;
  title: string;
  description: string;
  image: string;
  lang: string;
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const { lang, t } = useLanguage();

  useEffect(() => {
    const q = query(collection(db, 'hero_slides'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const slidesList = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Slide[];
      
      const filteredSlides = slidesList.filter(slide => slide.lang === lang);
      
      if (filteredSlides.length > 0) {
        setSlides(filteredSlides);
      } else if (slidesList.length > 0) {
        // Fallback to any available dynamic slides if current language has none
        // This addresses "uzbek images not appearing in Russian mode"
        setSlides(slidesList);
      } else {
        // Fallback to initial static slides for the CURRENT language if no dynamic slides exist at all
        setSlides(initialHeroSlides[lang as 'uz' | 'ru']);
      }
      setCurrent(0); // Reset index when slides change
    }, (error) => {
      console.error('Firestore error in Hero:', error);
      setSlides(initialHeroSlides[lang as 'uz' | 'ru']);
    });

    return () => unsubscribe();
  }, [lang]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const currentSlide = slides[current] || slides[0];

  return (
    <section id="about" className="relative h-screen w-full overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${lang}-${currentSlide.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-2xl">
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-widest mb-6"
              >
                {lang === 'uz' ? 'Xush kelibsiz!' : 'Добро пожаловать!'}
              </motion.span>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]"
              >
                {currentSlide.title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-base sm:text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed line-clamp-3 sm:line-clamp-none"
              >
                {currentSlide.description}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link 
                  to="/about" 
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
                >
                  {lang === 'uz' ? 'Batafsil ma’lumot' : 'Подробнее'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="https://t.me/Maktab_3t" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all text-center"
                >
                  {t('hero.cta')}
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-10 left-4 sm:left-10 flex gap-1.5 sm:gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1 sm:h-1.5 transition-all duration-300 rounded-full ${
              current === idx ? 'w-8 sm:w-12 bg-blue-600' : 'w-3 sm:w-4 bg-white/30'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
