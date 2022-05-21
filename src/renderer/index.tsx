import { createRoot } from 'react-dom/client';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import common_sr from '../translations/sr/common.json';
import common_en from '../translations/en/common.json';
import common_ср from '../translations/sr-cir/common.json';

import { App } from './App';

export type ValidI18nKey = keyof typeof common_en;

export type TranslateFunction = (
  message: ValidI18nKey,
  params?: { [key: string]: string | number }
) => string;

export const defaultNS = 'ns1';
export const resources = {
  en: {
    common: common_en,
  },
  sr: {
    common: common_sr,
  },
  cp: {
    common: common_ср,
  },
} as const;

i18next.use(initReactI18next).init({
  lng: window.localStorage.getItem('lang') || 'en',
  ns: ['ns1'],
  defaultNS,
  resources,
});

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <I18nextProvider i18n={i18next}>
    <App />
  </I18nextProvider>
);
