import { useLanguage } from './LanguageProvider';

const ExampleComponent = () => {
  const { t, isLoading } = useLanguage();
  
  if (isLoading) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('hero.greeting')} {t('hero.name')}</h1>
      <p className="text-lg">{t('hero.title')}</p>
      <p>{t('hero.description')}</p>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold">{t('about.title')}</h2>
        <p>{t('about.paragraph1')}</p>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{t('contact.title')}</h3>
        <p>{t('contact.conversationText')}</p>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          {t('footer.copyright').replace('{year}', String(new Date().getFullYear()))}
        </p>
      </div>
    </div>
  );
};

export default ExampleComponent;