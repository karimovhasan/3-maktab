import Header from '../components/Header';
import Footer from '../components/Footer';
import { Users, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LeadershipPage() {
  const { lang, t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8"
            >
              <Users className="w-10 h-10 text-blue-600" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold text-gray-900 mb-6"
            >
              {t('nav.leadership')}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-xl text-gray-600 font-medium leading-relaxed">
                {t('leadership.empty')}
              </p>
              <p className="text-gray-400 mt-4 text-sm">
                {t('leadership.soon')}
              </p>
              
              <a 
                href="/"
                className="mt-10 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                {t('leadership.back')}
              </a>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
