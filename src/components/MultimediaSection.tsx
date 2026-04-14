import { motion } from 'motion/react';
import { Play, Maximize2 } from 'lucide-react';
import { galleryImages } from '../data';

export default function MultimediaSection() {
  return (
    <section className="py-24 bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">Multimedia</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
              Maktab hayoti videolarda va suratlarda
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Bizning maktabda nafaqat darslar, balki turli qiziqarli tadbirlar, sport musobaqalari va ijodiy to‘garaklar ham muntazam o‘tkaziladi.
            </p>
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-500 mb-1">1200+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">O‘quvchilar</div>
              </div>
              <div className="w-px h-12 bg-gray-800" />
              <div>
                <div className="text-3xl font-bold text-blue-500 mb-1">85+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">O‘qituvchilar</div>
              </div>
              <div className="w-px h-12 bg-gray-800" />
              <div>
                <div className="text-3xl font-bold text-blue-500 mb-1">40+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Sinflar</div>
              </div>
            </div>
          </div>

          <div className="relative group cursor-pointer">
            <div className="aspect-video rounded-3xl overflow-hidden relative">
              <img
                src="https://picsum.photos/seed/school-video/1280/720"
                alt="Maktab videosi"
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
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-10">
            <h3 className="text-2xl font-bold">Fotogalereya</h3>
            <button className="text-blue-500 font-bold hover:underline">Barcha rasmlar</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.map((img, idx) => (
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
