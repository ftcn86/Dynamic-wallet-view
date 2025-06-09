"use client"

import { useLanguage } from '@/contexts/LanguageContext';
import en from '@/../locales/en.json';
import es from '@/../locales/es.json';

const translations = {
  en,
  es,
};

type TranslationKeys = keyof typeof en; // Assuming 'en' has all keys

// Helper to get nested values. Example: t('dashboard.title')
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}


export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langFile = translations[language] || translations.en;
    let translation = getNestedValue(langFile, key);

    if (translation === undefined) {
      console.warn(`Translation key "${key}" not found for language "${language}". Falling back to English.`);
      translation = getNestedValue(translations.en, key);
      if (translation === undefined) {
        console.error(`Translation key "${key}" not found in English either.`);
        return key; // Return key itself if not found anywhere
      }
    }
    
    if (params) {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`{{${paramKey}}}`, 'g');
        translation = translation!.replace(regex, String(params[paramKey]));
      });
    }
    return translation!;
  };

  return { t, currentLanguage: language };
}
