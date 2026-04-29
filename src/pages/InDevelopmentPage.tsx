import { motion } from 'motion/react';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function InDevelopmentPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-8"
        >
          <Construction className="w-12 h-12" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6"
        >
          {lang === 'uz' ? 'Hali maʼlumot yuklanmadi' : 'Информация еще не загружена'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 max-w-2xl mb-10"
        >
          {lang === 'uz' 
            ? 'Bu bo‘limga hali ma’lumotlar yuklanmagan. Tezp orada barcha kerakli ma’lumotlar paydo bo‘ladi. Sabringiz uchun rahmat!' 
            : 'В этот раздел еще не загружена информация. Скоро все необходимые данные появятся. Спасибо за терпение!'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
          >
            <ArrowLeft className="w-5 h-5" />
            {lang === 'uz' ? 'Bosh sahifaga qaytish' : 'Вернуться на главную'}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
