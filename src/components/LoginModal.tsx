import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Loader2, AlertCircle, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import { signInWithEmail, signUpWithEmail } from '../firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { lang, t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedLogin = login.trim();
    if (!trimmedLogin || !password) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Map "Admin" to a specific email for Firebase Auth
      const loginLower = trimmedLogin.toLowerCase();
      const email = loginLower === 'admin' ? 'admin@maktab3.uz' : (trimmedLogin.includes('@') ? trimmedLogin : `${loginLower}@maktab3.uz`);
      
      try {
        await signInWithEmail(email, password);
      } catch (signInErr: any) {
        // Handle "operation-not-allowed" error specifically
        if (signInErr.code === 'auth/operation-not-allowed') {
          // If Firebase is not configured, fallback to local login for the hardcoded admin
          if (loginLower === 'admin' && password === 'admin1') {
            localStorage.setItem('isAdminLoggedIn', 'true');
            window.dispatchEvent(new Event('auth-change'));
            onClose();
            return;
          }
          
          setError(lang === 'uz' 
            ? 'Xatolik: Firebase-da login/parol funksiyasi yoqilmagan. Iltimos, quyidagi havolaga kirib uni yoqing: https://console.firebase.google.com/project/gen-lang-client-0334523506/authentication/providers' 
            : 'Ошибка: В Firebase не включен вход по логину/паролю. Пожалуйста, перейдите по ссылке и включите его: https://console.firebase.google.com/project/gen-lang-client-0334523506/authentication/providers');
          return;
        }

        // If it's the first time and it's the admin account, try to create it
        if (loginLower === 'admin' && (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential' || signInErr.code === 'auth/invalid-email')) {
          try {
            await signUpWithEmail(email, password);
          } catch (signUpErr) {
            // If signup also fails, throw original error
            throw signInErr;
          }
        } else {
          throw signInErr;
        }
      }
      
      window.dispatchEvent(new Event('auth-change'));
      onClose();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(lang === 'uz' 
        ? 'Login yoki parol noto‘g‘ri. Iltimos, qaytadan tekshirib ko‘ring.' 
        : 'Логин или пароль неверны. Пожалуйста, проверьте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                  <Lock className="w-3 h-3" />
                  {lang === 'uz' ? 'Xavfsiz kirish' : 'Безопасный вход'}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                  Admin Panel
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {lang === 'uz' 
                    ? 'Tizimga kirish uchun login va parolingizni kiriting.' 
                    : 'Введите логин и пароль для входа в систему.'}
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="font-medium">{error}</p>
                </motion.div>
              )}

              <form className="space-y-5" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Login</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      placeholder={lang === 'uz' ? 'Masalan: Admin' : 'Например: Admin'}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">
                    {lang === 'uz' ? 'Parol' : 'Пароль'}
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group mt-6 disabled:opacity-50 disabled:scale-100"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {lang === 'uz' ? 'Tizimga kirish' : 'Войти в систему'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
                {lang === 'uz' ? 'Faqat vakolatli xodimlar uchun' : 'Только для уполномоченного персонала'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
