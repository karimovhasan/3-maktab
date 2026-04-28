import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Users, GraduationCap, Languages, Book, Building2, Microchip, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
  const { lang } = useLanguage();

  const content = {
    uz: {
      title: "3-sonli umumta’lim maktabi (Termiz shahri)",
      description: "Surxondaryo viloyati Termiz shahrida joylashgan 3-sonli umumta’lim maktabi zamonaviy ta’lim talablari asosida faoliyat yurituvchi yirik ta’lim muassasalaridan biridir. Maktab shahar markazida joylashgan bo‘lib, o‘quvchilar uchun qulay va zamonaviy sharoitlar yaratilgan.",
      stats: [
        { icon: MapPin, label: "Manzil", value: "Termiz shahri, Shodlik MFY, Barkamol avlod ko‘chasi, 9-uy" },
        { icon: Users, label: "O‘quvchilar soni", value: "2116 nafar" },
        { icon: Building2, label: "Sig‘imi", value: "1040 o‘rin" },
        { icon: Languages, label: "Ta’lim tillari", value: "O‘zbek va rus" },
        { icon: GraduationCap, label: "O‘qitish shakli", value: "2 smenali" },
        { icon: Users, label: "Direktor", value: "Xolmamatova Gulnora Turdibayevna" },
      ],
      education: {
        title: "Ta’lim jarayoni",
        desc: "Maktabda jami 62 ta sinf mavjud bo‘lib, shundan 45 tasi o‘zbek va 17 tasi rus tilida ta’lim beradi. Ta’lim sifati barqaror bo‘lib, maktab past ko‘rsatkichli muassasalar ro‘yxatiga kirmagan."
      },
      staff: {
        title: "Pedagoglar jamoasi",
        desc: "Maktabda 123 nafar o‘qituvchi faoliyat yuritadi. Ularning aksariyati oliy ma’lumotga ega bo‘lib, 32 nafari milliy va xalqaro sertifikatlarga ega."
      },
      infrastructure: {
        title: "Moddiy-texnik baza",
        items: [
          "Fizika, kimyo va biologiya fan xonalari",
          "2 ta kompyuter sinfi (30 ta kompyuter, internetga ulangan)",
          "Sport zallari va faollar zali",
          "Kutubxona va oshxona"
        ]
      },
      innovation: {
        title: "Inklyuziv ta’lim va innovatsiyalar",
        desc: "“Ishonch-2030” loyihasi doirasida (UNICEF hamkorligida) maktabda keng ko‘lamli ishlar amalga oshirildi:",
        items: [
          "Hudud inklyuziv ta’limga moslashtirildi (panduslar, maxsus yo‘laklar)",
          "Inklyuziv sinf va STEM xonasi tashkil etildi",
          "Zamonaviy texnologiyalar bilan jihozlandi"
        ]
      },
      conclusion: "3-sonli umumta’lim maktabi sifatli ta’lim, tajribali pedagoglar va zamonaviy infratuzilma uyg‘unligini ta’minlab, o‘quvchilarning har tomonlama rivojlanishiga xizmat qilmoqda."
    },
    ru: {
      title: "Общеобразовательная школа №3 (город Термез)",
      description: "Общеобразовательная школа №3, расположенная в городе Термез Сурхандарьинской области, является одним из крупнейших образовательных учреждений, работающих на основе современных требований образования. Школа расположена в центре города, для учащихся созданы комфортные и современные условия.",
      stats: [
        { icon: MapPin, label: "Адрес", value: "г. Термез, МСГ Шодлик, ул. Баркамол авлод, 9" },
        { icon: Users, label: "Количество учащихся", value: "2116 человек" },
        { icon: Building2, label: "Вместимость", value: "1040 мест" },
        { icon: Languages, label: "Языки обучения", value: "Узбекский и русский" },
        { icon: GraduationCap, label: "Форма обучения", value: "2 смены" },
        { icon: Users, label: "Директор", value: "Холмаматова Гульнора Турдибаевна" },
      ],
      education: {
        title: "Учебный процесс",
        desc: "В школе всего 62 класса, из них 45 обучаются на узбекском и 17 на русском языке. Качество образования стабильное, школа не входит в список учреждений с низкими показателями."
      },
      staff: {
        title: "Педагогический коллектив",
        desc: "В школе работает 123 учителя. Большинство из них имеют высшее образование, 32 имеют национальные и международные сертификаты."
      },
      infrastructure: {
        title: "Материально-техническая база",
        items: [
          "Кабинеты физики, химии и биологии",
          "2 компьютерных класса (30 компьютеров, подключенных к интернету)",
          "Спортивные и актовые залы",
          "Библиотека и столовая"
        ]
      },
      innovation: {
        title: "Инклюзивное образование и инновации",
        desc: "В рамках проекта «Ишонч-2030» (совместно с ЮНИСЕФ) в школе проведена масштабная работа:",
        items: [
          "Территория адаптирована для инклюзивного образования (пандусы, специальные дорожки)",
          "Создан инклюзивный класс и кабинет STEM",
          "Оснащено современными технологиями"
        ]
      },
      conclusion: "Общеобразовательная школа №3, обеспечивая гармонию качественного образования, опытных педагогов и современной инфраструктуры, служит всестороннему развитию учащихся."
    }
  };

  const currentContent = content[lang as 'uz' | 'ru'];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{lang === 'uz' ? 'Orqaga' : 'Назад'}</span>
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6">
              {lang === 'uz' ? 'Maktab haqida' : 'О школе'}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">
              {currentContent.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed font-medium">
              {currentContent.description}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {currentContent.stats.map((stat, idx) => (
              <motion.div
                key={`${stat.label}-${idx}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-gray-900 font-bold leading-snug">{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Details Sections */}
          <div className="space-y-20">
            {/* Education */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Book className="w-8 h-8 text-blue-600" />
                  {currentContent.education.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {currentContent.education.desc}
                </p>
              </div>
            </motion.section>

            {/* Staff */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  {currentContent.staff.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {currentContent.staff.desc}
                </p>
              </div>
            </motion.section>

            {/* Infrastructure */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-[3rem] p-8 md:p-16 text-white"
            >
              <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-400" />
                {currentContent.infrastructure.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {currentContent.infrastructure.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="font-medium text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Innovation */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Microchip className="w-8 h-8 text-blue-600" />
                {currentContent.innovation.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {currentContent.innovation.desc}
              </p>
              <div className="grid gap-4">
                {currentContent.innovation.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl text-blue-700 font-bold">
                    <Trophy className="w-5 h-5 text-blue-500" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Conclusion */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-12 bg-blue-600 rounded-[3rem] text-center text-white"
            >
              <p className="text-2xl font-bold leading-relaxed mb-8 italic">
                "{currentContent.conclusion}"
              </p>
              <div className="inline-flex flex-col items-center">
                <div className="text-lg font-black uppercase tracking-widest">{currentContent.stats[5].value}</div>
                <div className="text-sm text-blue-200 font-bold">{currentContent.stats[5].label}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
