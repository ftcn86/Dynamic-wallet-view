
"use client"

import { useLanguage } from '@/contexts/LanguageContext';
import en from '@/../locales/en.json';
import es from '@/../locales/es.json';
import fr from '@/../locales/fr.json';
import ru from '@/../locales/ru.json';
import pt from '@/../locales/pt.json';
import ja from '@/../locales/ja.json';
import zh from '@/../locales/zh.json';
import { useCallback } from 'react';
import type { LegalSection } from '@/data/schemas';

const translations = {
  en,
  es,
  fr,
  ru,
  pt,
  ja,
  zh,
};

// Helper to get nested values.
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function useTranslation() {
  const { language } = useLanguage();

  const getRawTranslation = useCallback((key: string): any => {
    const langFile = translations[language] || translations.en;
    let value = getNestedValue(langFile, key);

    if (value === undefined) {
      console.warn(`Translation key "${key}" not found for language "${language}". Falling back to English.`);
      const englishLangFile = translations.en;
      value = getNestedValue(englishLangFile, key);
      if (value === undefined) {
        console.error(`Translation key "${key}" not found in English either.`);
        return undefined;
      }
    }
    return value;
  }, [language]);

  // Specifically for fetching arrays of LegalSection, providing type safety
  const getLegalSections = useCallback((key: string): LegalSection[] => {
    const rawValue = getRawTranslation(key);
    if (Array.isArray(rawValue) && rawValue.every(item => typeof item === 'object' && 'title' in item && 'content' in item)) {
      return rawValue as LegalSection[];
    }
    console.warn(`Translation key "${key}" did not return a valid LegalSection[] for language "${language}". Returning empty array.`);
    return [];
  }, [getRawTranslation, language]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let translation = getRawTranslation(key);

    if (typeof translation !== 'string') {
      console.warn(`Translation for key "${key}" is not a string or not found. Using key as fallback for string replacement.`);
      translation = key; // Fallback to key for string operations
    }

    if (params) {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'); // Added \\s* to allow for spaces within {{ }}
        translation = translation!.replace(regex, String(params[paramKey]));
      });
    }
    return translation!;
  }, [getRawTranslation]);

  return { t, currentLanguage: language, getRawTranslation, getLegalSections };
}
