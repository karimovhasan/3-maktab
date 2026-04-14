import React, { useState, useEffect } from 'react';
import { Menu, X, GraduationCap, Calendar, Newspaper, MessageCircle, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { navLinks } from '../data';
import LoginModal from './LoginModal';
import { auth, logout } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const checkAuth = () => {
      const isLocalAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';
      const firebaseUser = auth.currentUser;
      
      if (isLocalAdmin) {
        setUser({ displayName: 'Admin', email: 'admin@maktab3.uz' } as any);
      } else {
        setUser(firebaseUser);
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
      localStorage.removeItem('isAdminLoggedIn');
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
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo & Name */}
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`font-bold leading-tight ${scrolled ? 'text-gray-900 text-lg' : 'text-white text-xl'}`}>
                  Termiz shahar 3-maktab
                </h1>
                {!scrolled && (
                  <p className="text-white/80 text-xs font-medium tracking-wide">
                    Bilim bilan kelajak sari!
                  </p>
                )}
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    scrolled ? 'text-gray-600' : 'text-white/90'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex items-center gap-3 ml-4">
                <button className="p-2 rounded-full bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                  <Calendar className="w-5 h-5" />
                </button>
                
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
                        : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Kirish
                  </button>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
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
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-600">
                    <Calendar className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Jadval</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-600">
                    <Newspaper className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Xabarlar</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-600">
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
