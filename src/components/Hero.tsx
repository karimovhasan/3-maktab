import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { heroSlides } from '../data';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const { lang, t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === heroSlides[lang].length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [lang]);

  return (
    <section id="about" className="relative h-screen w-full overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${lang}-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={heroSlides[lang][current].image}
              alt={heroSlides[lang][current].title}
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
                {heroSlides[lang][current].title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-base sm:text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed line-clamp-3 sm:line-clamp-none"
              >
                {heroSlides[lang][current].description}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group">
                  {lang === 'uz' ? 'Batafsil ma’lumot' : 'Подробнее'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all">
                  {t('hero.cta')}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-10 left-4 sm:left-10 flex gap-1.5 sm:gap-2 z-20">
        {heroSlides[lang].map((_, idx) => (
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
