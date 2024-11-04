import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Languages } from 'lucide-react';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'uk' : 'en')}
      className="button-secondary"
    >
      <Languages className="w-4 h-4" />
      <span>{language.toUpperCase()}</span>
    </button>
  );
};

export default LanguageToggle;