import i18next from 'i18next'
import en from './locales/en'
import es from './locales/es'

class TranslationService {
  constructor() {
    i18next.init({
      lng: navigator.language.includes('es') ? 'es' : 'en',
      debug: false,
      resources: {
        en: {
          translation: en
        },
        es: {
          translation: es
        }
      }
    })
  }

  t(key, opts) {
    return i18next.t(key, opts)
  }
}

export default new TranslationService()
