import { motion } from 'motion/react';
import { Calendar, Image as ImageIcon, MessageSquare, BookOpen, Users, Trophy } from 'lucide-react';

const features = [
  {
    title: 'Dars jadvali',
    description: 'Sinflar bo‘yicha haftalik dars jadvallari bilan tanishing.',
    icon: Calendar,
    color: 'bg-blue-500',
  },
  {
    title: 'Fotogalereya',
    description: 'Maktab hayotidan yorqin lahzalar va tadbirlar suratlari.',
    icon: ImageIcon,
    color: 'bg-purple-500',
  },
  {
    title: 'Savol berish',
    description: 'Bizga savollaringiz bo‘lsa, onlayn tarzda murojaat qiling.',
    icon: MessageSquare,
    color: 'bg-emerald-500',
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
  },
  {
    title: 'Yutuqlarimiz',
    description: 'O‘quvchilarimizning fan va sport sohasidagi muvaffaqiyatlari.',
    icon: Trophy,
    color: 'bg-amber-500',
  },
];

export default function InteractiveButtons() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Interaktiv xizmatlar va resurslar
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Maktabimiz o‘quvchilari va ota-onalari uchun qulaylik yaratish maqsadida onlayn xizmatlarni joriy etganmiz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-${feature.color.split('-')[1]}-200 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
