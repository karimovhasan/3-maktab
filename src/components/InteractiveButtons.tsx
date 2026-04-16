import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { featuresData } from '../data';
import { useLanguage } from '../context/LanguageContext';

export default function InteractiveButtons() {
  const { lang, t } = useLanguage();

  const handleFeatureClick = (title: string) => {
    if (title === 'Savol berish' || title === 'Задать вопрос') {
      window.dispatchEvent(new Event('open-chatbot'));
    }
  };

  return (
    <section id="schedule" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('interactive.title')}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t('interactive.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuresData[lang].map((feature, idx) => {
            const isExternal = feature.href?.startsWith('/');
            const isAnchor = feature.href?.startsWith('#');
            
            const Content = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => !feature.href && handleFeatureClick(feature.title)}
                className="p-8 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group h-full"
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
            );

            if (isExternal) {
              return (
                <Link key={feature.title} to={feature.href!} className="block h-full">
                  {Content}
                </Link>
              );
            }

            if (isAnchor) {
              return (
                <a key={feature.title} href={feature.href} className="block h-full">
                  {Content}
                </a>
              );
            }

            return <div key={feature.title}>{Content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
