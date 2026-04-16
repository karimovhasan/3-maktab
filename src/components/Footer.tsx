import { GraduationCap, MapPin, Phone, Mail, Facebook, Instagram, Send, ArrowUp, Github } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const { lang, t } = useLanguage();

  return (
    <footer id="contact" className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-bold text-xl text-gray-900">
                {lang === 'uz' ? 'Termiz shahar 3-maktab' : 'Школа №3 города Термеза'}
              </h2>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              {lang === 'uz' 
                ? 'Bizning maqsadimiz – o‘quvchilarga sifatli ta’lim berish va ularni barkamol shaxs sifatida voyaga yetkazish.'
                : 'Наша цель – дать учащимся качественное образование и воспитать их как гармонично развитых личностей.'}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                <Send className="w-5 h-5" />
              </a>
              <a href="https://github.com/karimovhasan/3-maktab" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">{t('footer.links')}</h3>
            <ul className="space-y-4">
              <li><a href="#about" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">{t('nav.about')}</a></li>
              <li><a href="#news" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">{t('nav.news')}</a></li>
              <li><a href="#schedule" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">{t('nav.schedule')}</a></li>
              <li><a href="#gallery" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">{lang === 'uz' ? 'Fotogalereya' : 'Фотогалерея'}</a></li>
              <li><a href="#contact" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">{t('nav.contact')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h3 className="font-bold text-gray-900 mb-6">{t('footer.contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-gray-500 text-sm">
                  {lang === 'uz' ? 'Termiz shahri, Barkamol Avlod ko\'chasi' : 'город Термез, улица Баркамол Авлод'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-gray-500 text-sm">+998 (76) 221-23-45</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-gray-500 text-sm">info@termiz3maktab.uz</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Map */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">
              {lang === 'uz' ? 'Xaritada joylashuv' : 'Расположение на карте'}
            </h3>
            <div className="rounded-2xl overflow-hidden h-48 bg-gray-100 relative shadow-inner border border-gray-100">
              <iframe
                src="https://www.google.com/maps?q=37.225465,67.2718227&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={lang === 'uz' ? 'Termiz shahar 3-maktab xaritasi' : 'Карта школы №3 города Термеза'}
              ></iframe>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-xs">
            © 2026 {lang === 'uz' ? 'Termiz shahar 3-umumiy o‘rta ta’lim maktabi' : 'Средняя общеобразовательная школа №3 города Термеза'}. {t('footer.rights')}
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-600 transition-all uppercase tracking-widest"
          >
            {lang === 'uz' ? 'Yuqoriga qaytish' : 'Вернуться наверх'}
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
