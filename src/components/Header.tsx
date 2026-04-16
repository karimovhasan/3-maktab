import React, { useState, useEffect } from 'react';
import { Menu, X, GraduationCap, Calendar, Newspaper, MessageCircle, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { navLinks } from '../data';
import LoginModal from './LoginModal';
import { auth, logout } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const checkAuth = () => {
      const isLocalAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';
      if (isLocalAdmin) {
        setUser({ displayName: 'Admin', email: 'admin@maktab3.uz' } as any);
      } else {
        setUser(auth.currentUser);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      checkAuth();
    });

    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('auth-change', checkAuth);
      unsubscribe();
    };
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking logout
    try {
      await logout();
      window.dispatchEvent(new Event('auth-change'));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo & Name */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className={`font-bold leading-tight transition-all ${
                  scrolled ? 'text-gray-900 text-base sm:text-lg' : 'text-white text-lg sm:text-xl'
                }`}>
                  Termiz 3-maktab
                </h1>
                {!scrolled && (
                  <p className="text-white/80 text-[10px] sm:text-xs font-medium tracking-wide hidden xs:block">
                    Bilim bilan kelajak sari!
                  </p>
                )}
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks[lang].map((link) => {
                const isInternal = link.href.startsWith('/');
                return isInternal ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      scrolled ? 'text-gray-600' : 'text-white/90'
                    }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      scrolled ? 'text-gray-600' : 'text-white/90'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
              <div className="flex items-center gap-3 ml-4">
                <div className="flex items-center bg-gray-100/50 rounded-xl p-1 mr-2">
                  <button
                    onClick={() => setLang('uz')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      lang === 'uz' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-blue-600'
                    }`}
                  >
                    UZ
                  </button>
                  <button
                    onClick={() => setLang('ru')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      lang === 'ru' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-blue-600'
                    }`}
                  >
                    RU
                  </button>
                </div>
                
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link 
                      to="/admin"
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors group"
                    >
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
                      ) : (
                        <User className="w-4 h-4 text-blue-600" />
                      )}
                      <span className="text-xs font-bold text-blue-700 max-w-[100px] truncate group-hover:text-blue-800">
                        {user.displayName || user.email}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
                      title="Chiqish"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      scrolled 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' 
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Kirish
                  </button>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-4">
              {!user && (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className={`p-2 rounded-xl ${scrolled ? 'bg-blue-50 text-blue-600' : 'bg-white/10 text-white'}`}
                >
                  <User className="w-6 h-6" />
                </button>
              )}
              {user && (
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-xl ${scrolled ? 'bg-red-50 text-red-600' : 'bg-white/10 text-white'}`}
                >
                  <LogOut className="w-6 h-6" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-md ${scrolled ? 'text-gray-900' : 'text-white'}`}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {/* Admin Profile Link on Mobile */}
                {user && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-4 mb-2 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {user.displayName?.[0] || 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{user.displayName || 'Admin'}</p>
                      <p className="text-[10px] font-medium opacity-70 uppercase tracking-wider">Admin Panelga o'tish</p>
                    </div>
                  </Link>
                )}

                {navLinks[lang].map((link) => {
                  const isInternal = link.href.startsWith('/');
                  return isInternal ? (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg"
                    >
                      {link.name}
                    </a>
                  );
                })}

                {!user && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsLoginOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-4 text-base font-bold text-blue-600 bg-blue-50 rounded-xl mt-2"
                  >
                    <User className="w-5 h-5" />
                    {lang === 'uz' ? 'Tizimga kirish' : 'Войти в систему'}
                  </button>
                )}

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="col-span-3 flex items-center justify-between p-3 rounded-xl bg-gray-50 mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Til / Язык</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setLang('uz')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          lang === 'uz' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                      >
                        O'zbekcha
                      </button>
                      <button
                        onClick={() => setLang('ru')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          lang === 'ru' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                      >
                        Русский
                      </button>
                    </div>
                  </div>
                  <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-600">
                    <Calendar className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Jadval</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-600">
                    <Newspaper className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Xabarlar</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      window.dispatchEvent(new Event('open-chatbot'));
                    }}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-600"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Savol</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
