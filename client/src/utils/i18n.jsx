import translationEN from "../locales/en/en.json";
import translationFR from "./locales/fr/translation.json";
import translationTA from "../locales/ta/ta.json"; // <-- new

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      ta: { translation: translationTA }, // <-- add ta here
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
