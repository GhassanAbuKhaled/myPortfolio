import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

// Define available languages
export type Language = 'en' | 'de';

// Type for translations
type TranslationsType = Record<string, any>;

// Create context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  isLoading: true,
});

// Hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Props for the provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Initialize language from localStorage or default to 'de'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'en' || savedLanguage === 'de') 
      ? savedLanguage as Language 
      : 'de';
  });
  
  const [translations, setTranslations] = useState<Record<Language, TranslationsType>>({
    en: {},
    de: {}
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        // Load all translations at once
        const [enTranslations, deTranslations] = await Promise.all([
          import('../locales/en.json'),
          import('../locales/de.json'),
        ]);
        
        setTranslations({
          en: enTranslations,
          de: deTranslations,
        });
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTranslations();
  }, []);

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    
    // Set RTL direction for Arabic
    // document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Function to get translated text
  const t = (key: string): string => {
    if (isLoading) return key;
    
    // Handle nested keys like 'nav.home'
    const keys = key.split('.');
    let result: any = translations[language];
    
    // Navigate through nested objects
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        // Fallback to English or key itself
        result = getFallbackTranslation(key);
        break;
      }
    }
    
    return typeof result === 'string' ? result : key;
  };
  
  // Helper function to get fallback translation
  const getFallbackTranslation = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations.en;
    
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        return key;
      }
    }
    
    return typeof result === 'string' ? result : key;
  };

  const contextValue = useMemo(() => ({ 
    language, 
    setLanguage, 
    t,
    isLoading 
  }), [language, isLoading]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};