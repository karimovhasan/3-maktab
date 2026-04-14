import { GraduationCap, MapPin, Phone, Mail, Facebook, Instagram, Send, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-bold text-xl text-gray-900">Termiz shahar 3-maktab</h2>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Bizning maqsadimiz – o‘quvchilarga sifatli ta’lim berish va ularni barkamol shaxs sifatida voyaga yetkazish.
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
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Tezkor havolalar</h3>
            <ul className="space-y-4">
              <li><a href="#about" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Maktab haqida</a></li>
              <li><a href="#news" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Yangiliklar</a></li>
              <li><a href="#schedule" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Dars jadvali</a></li>
              <li><a href="#gallery" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Fotogalereya</a></li>
              <li><a href="#contact" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Bog‘lanish</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h3 className="font-bold text-gray-900 mb-6">Bog‘lanish</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-gray-500 text-sm">Termiz shahri, Navoiy ko‘chasi, 12-uy</span>
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
            <h3 className="font-bold text-gray-900 mb-6">Xaritada joylashuv</h3>
            <div className="rounded-2xl overflow-hidden h-40 bg-gray-100 relative">
              <img
                src="https://picsum.photos/seed/map/400/300"
                alt="Map placeholder"
                className="w-full h-full object-cover grayscale opacity-50"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-gray-700 shadow-sm border border-white/50">
                  Xaritani ochish
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-xs">
            © 2026 Termiz shahar 3-umumiy o‘rta ta’lim maktabi. Barcha huquqlar himoyalangan.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-600 transition-all uppercase tracking-widest"
          >
            Yuqoriga qaytish
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
