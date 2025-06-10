
"use client"

import { useLanguage } from '@/contexts/LanguageContext';
import en from '@/../locales/en.json';
import es from '@/../locales/es.json';
import { useCallback } from 'react';

const translations = {
  en,
  es,
};

// Helper to get nested values. Example: t('dashboard.title')
function getNestedValue(obj: any, path: string): any { // Return type changed to any
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}


export function useTranslation() {
  const { language } = useLanguage();

  const getRawTranslation = useCallback((key: string): any => {
    const langFile = translations[language] || translations.en;
    let value = getNestedValue(langFile, key);

    if (value === undefined) {
      console.warn(`Translation key "${key}" not found for language "${language}". Falling back to English.`);
      value = getNestedValue(translations.en, key);
      if (value === undefined) {
        console.error(`Translation key "${key}" not found in English either.`);
        // For arrays/objects, returning an empty array or object might be safer than the key
        // For now, if it's truly not found, it will return undefined from getNestedValue,
        // and components should handle this (e.g. || [] for arrays)
        return undefined;
      }
    }
    return value;
  }, [language]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let translation = getRawTranslation(key);

    if (typeof translation !== 'string') {
      console.warn(`Translation for key "${key}" is not a string or not found. Using key as fallback for string replacement.`);
      // Fallback to key for string operations if it's not a string (e.g. array/object or undefined)
      translation = key;
    }
    
    if (params) {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`{{${paramKey}}}`, 'g');
        translation = translation!.replace(regex, String(params[paramKey]));
      });
    }
    return translation!;
  }, [language, getRawTranslation]);

  return { t, currentLanguage: language, getRawTranslation };
}
