import i18next from 'i18next';
// import {getLocales} from 'react-native-localize';
import en from './en';
import vn from './vn';

const DEFAULT_LANG = 'vn';
i18next.init({
  interpolation: {
    // React already does escaping
    escapeValue: false,
  },
  lng: getLanguage(),
  fallbackLng: DEFAULT_LANG,
  // Using simple hardcoded resources for simple example
  resources: {
    en: {
      translation: en,
    },
    vn: {
      translation: vn,
    },
  },
});

export function getLanguage() {
  // const lan = getLocales();
  // try {
    // const primaryLocate = lan[1];
    // return primaryLocate.languageCode;
    // return 'vn';
  // } catch (error) {
    return DEFAULT_LANG;
  // }
}

export default i18next;
