import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'uz' | 'ru';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('uz');

  // Simple translation helper if needed for UI elements not in data.ts
  const t = (key: string) => {
    const translations: Record<Language, Record<string, string>> = {
      uz: {
        'nav.about': 'Haqida',
        'nav.news': 'Yangiliklar',
        'nav.schedule': 'Dars jadvali',
        'nav.contact': 'Bog‘lanish',
        'nav.leadership': 'Rahbariyat',
        'hero.cta': 'Biz bilan bog‘lanish',
        'news.title': 'So‘nggi yangiliklar',
        'news.more': 'Batafsil',
        'interactive.title': 'Interaktiv xizmatlar va resurslar',
        'interactive.desc': 'Maktabimiz o‘quvchilari va ota-onalari uchun qulaylik yaratish maqsadida onlayn xizmatlarni joriy etganmiz.',
        'footer.address': 'Manzil',
        'footer.links': 'Foydali havolalar',
        'footer.contact': 'Aloqa',
        'footer.rights': 'Barcha huquqlar himoyalangan.',
        'login.title': 'Tizimga kirish',
        'login.button': 'Kirish',
        'chatbot.welcome': 'Assalomu alaykum! Sizga qanday yordam bera olaman?',
        'leadership.empty': 'Bu yerda rahbariyat tomonidan ma\'lumot hali yuklanmagan.',
        'leadership.soon': 'Tez orada barcha ma\'lumotlar ushbu sahifaga joylashtiriladi.',
        'leadership.back': 'Bosh sahifaga qaytish'
      },
      ru: {
        'nav.about': 'О школе',
        'nav.news': 'Новости',
        'nav.schedule': 'Расписание',
        'nav.contact': 'Контакты',
        'nav.leadership': 'Руководство',
        'hero.cta': 'Связаться с нами',
        'news.title': 'Последние новости',
        'news.more': 'Подробнее',
        'interactive.title': 'Интерактивные услуги и ресурсы',
        'interactive.desc': 'Мы внедрили онлайн-сервисы для удобства учеников и родителей нашей школы.',
        'footer.address': 'Адрес',
        'footer.links': 'Полезные ссылки',
        'footer.contact': 'Связь',
        'footer.rights': 'Все права защищены.',
        'login.title': 'Вход в систему',
        'login.button': 'Войти',
        'chatbot.welcome': 'Здравствуйте! Чем я могу вам помочь?',
        'leadership.empty': 'Информация от руководства здесь еще не загружена.',
        'leadership.soon': 'Скоро вся информация будет размещена на этой странице.',
        'leadership.back': 'Вернуться на главную'
      }
    };
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
