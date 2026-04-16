export const navLinks = {
  uz: [
    { name: 'Haqida', href: '#about' },
    { name: 'Yangiliklar', href: '#news' },
    { name: 'Dars jadvali', href: '#schedule' },
    { name: 'Bog‘lanish', href: '#contact' },
  ],
  ru: [
    { name: 'О школе', href: '#about' },
    { name: 'Новости', href: '#news' },
    { name: 'Расписание', href: '#schedule' },
    { name: 'Контакты', href: '#contact' },
  ]
};

export const newsData = {
  uz: [
    {
      id: 1,
      title: 'Maktabimizda "Bilimlar kuni" tadbiri bo‘lib o‘tdi',
      date: '14.04.2026',
      image: 'https://picsum.photos/seed/school1/800/600',
      excerpt: 'Yangi o‘quv yili munosabati bilan barcha o‘quvchilar va o‘qituvchilar tantanali ravishda kutib olindi.',
    },
    {
      id: 2,
      title: 'Matematika fanidan olimpiada g‘oliblari',
      date: '14.04.2026',
      image: 'https://picsum.photos/seed/math/800/600',
      excerpt: 'Shahar bosqichida maktabimiz o‘quvchilari faxrli o‘rinlarni egallashdi.',
    },
    {
      id: 3,
      title: 'Sport musobaqalari: "Sog‘lom hayot"',
      date: '14.04.2026',
      image: 'https://picsum.photos/seed/sport/800/600',
      excerpt: 'O‘quvchilar o‘rtasida futbol va voleybol bo‘yicha qizg‘in bahslar o‘tkazildi.',
    },
  ],
  ru: [
    {
      id: 1,
      title: 'В нашей школе прошло мероприятие "День знаний"',
      date: '14.04.2026',
      image: 'https://picsum.photos/seed/school1/800/600',
      excerpt: 'В связи с новым учебным годом всех учеников и учителей торжественно приветствовали.',
    },
    {
      id: 2,
      title: 'Победители олимпиады по математике',
      date: '14.04.2026',
      image: 'https://picsum.photos/seed/math/800/600',
      excerpt: 'На городском этапе ученики нашей школы заняли почетные места.',
    },
    {
      id: 3,
      title: 'Спортивные соревнования: "Здоровая жизнь"',
      date: '14.04.2026',
      image: 'https://picsum.photos/seed/sport/800/600',
      excerpt: 'Среди учеников прошли напряженные матчи по футболу и волейболу.',
    },
  ]
};

export const heroSlides = {
  uz: [
    {
      id: 1,
      title: 'Maktabning rasmiy saytiga xush kelibsiz!',
      description: 'Termiz shahar 3-umumiy o‘rta ta’lim maktabi – zamonaviy ta’lim va innovatsion yondashuv.',
      image: 'https://picsum.photos/seed/school-hero1/1920/1080',
    },
    {
      id: 2,
      title: 'Yuksalish marralar sari',
      description: 'Bizning maktabda har bir o‘quvchi o‘z iqtidorini namoyon eta oladi.',
      image: 'https://picsum.photos/seed/school-hero2/1920/1080',
    },
  ],
  ru: [
    {
      id: 1,
      title: 'Добро пожаловать на официальный сайт школы!',
      description: 'Средняя общеобразовательная школа №3 города Термеза – современное образование и инновационный подход.',
      image: 'https://picsum.photos/seed/school-hero1/1920/1080',
    },
    {
      id: 2,
      title: 'К высоким вершинам',
      description: 'В нашей школе каждый ученик может проявить свой талант.',
      image: 'https://picsum.photos/seed/school-hero2/1920/1080',
    },
  ]
};

export const galleryImages = [
  { id: 1, src: 'https://picsum.photos/seed/gal1/800/800', alt: 'Dars jarayoni' },
  { id: 2, src: 'https://picsum.photos/seed/gal2/800/800', alt: 'Sport tadbiri' },
  { id: 3, src: 'https://picsum.photos/seed/gal3/800/800', alt: 'Laboratoriya' },
  { id: 4, src: 'https://picsum.photos/seed/gal4/800/800', alt: 'San’at to‘garagi' },
  { id: 5, src: 'https://picsum.photos/seed/gal5/800/800', alt: 'Kutubxona' },
  { id: 6, src: 'https://picsum.photos/seed/gal6/800/800', alt: 'Maktab hovlisi' },
];

import { Calendar, Image as ImageIcon, MessageSquare, BookOpen, Users, Trophy, Newspaper } from 'lucide-react';

export const featuresData = {
  uz: [
    {
      title: 'Dars jadvali',
      description: 'Sinflar bo‘yicha haftalik dars jadvallari bilan tanishing.',
      icon: Calendar,
      color: 'bg-blue-500',
      href: '#schedule'
    },
    {
      title: 'Fotogalereya',
      description: 'Maktab hayotidan yorqin lahzalar va tadbirlar suratlari.',
      icon: ImageIcon,
      color: 'bg-purple-500',
      href: '#gallery'
    },
    {
      title: 'Yangiliklar',
      description: 'Maktab hayotidagi so‘nggi yangiliklar va xabarlar.',
      icon: Newspaper,
      color: 'bg-emerald-500',
      href: '#news'
    },
    {
      title: 'Elektron kutubxona',
      description: 'O‘quvchilar uchun foydali kitoblar va resurslar bazasi.',
      icon: BookOpen,
      color: 'bg-orange-500',
    },
    {
      title: 'Rahbariyat',
      description: 'Maktab ma’muriyati va o‘qituvchilar jamoasi haqida ma’lumot.',
      icon: Users,
      color: 'bg-indigo-500',
      href: '/leadership'
    },
    {
      title: 'Yutuqlarimiz',
      description: 'O‘quvchilarimizning fan va sport sohasidagi muvaffaqiyatlari.',
      icon: Trophy,
      color: 'bg-amber-500',
      href: '#news'
    },
  ],
  ru: [
    {
      title: 'Расписание',
      description: 'Ознакомьтесь с еженедельным расписанием уроков по классам.',
      icon: Calendar,
      color: 'bg-blue-500',
      href: '#schedule'
    },
    {
      title: 'Фотогалерея',
      description: 'Яркие моменты из школьной жизни и фотографии мероприятий.',
      icon: ImageIcon,
      color: 'bg-purple-500',
      href: '#gallery'
    },
    {
      title: 'Новости',
      description: 'Последние новости и сообщения из жизни школы.',
      icon: Newspaper,
      color: 'bg-emerald-500',
      href: '#news'
    },
    {
      title: 'Электронная библиотека',
      description: 'База полезных книг и ресурсов для учащихся.',
      icon: BookOpen,
      color: 'bg-orange-500',
    },
    {
      title: 'Руководство',
      description: 'Информация об администрации школы и педагогическом коллективе.',
      icon: Users,
      color: 'bg-indigo-500',
      href: '/leadership'
    },
    {
      title: 'Наши достижения',
      description: 'Успехи наших учеников в области науки и спорта.',
      icon: Trophy,
      color: 'bg-amber-500',
      href: '#news'
    },
  ]
};
