import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import NewsSection from './components/NewsSection';
import InteractiveButtons from './components/InteractiveButtons';
import MultimediaSection from './components/MultimediaSection';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AdminPanel from './pages/AdminPanel';
import LeadershipPage from './pages/LeadershipPage';
import { LanguageProvider } from './context/LanguageContext';

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <InteractiveButtons />
        <NewsSection />
        <MultimediaSection />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/leadership" element={<LeadershipPage />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}
