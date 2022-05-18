import { createRoot } from 'react-dom/client';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import common_sr from '../translations/sr/common.json';
import common_en from '../translations/en/common.json';

import { App } from './App';

export type ValidI18nKey = keyof typeof common_en;

export type TranslateFunction = (
  message: ValidI18nKey,
  params?: { [key: string]: string | number }
) => string;

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: 'en', // language to use
  resources: {
    en: {
      common: common_en, // 'common' is our custom namespace
    },
    sr: {
      common: common_sr,
    },
  },
});

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <I18nextProvider i18n={i18next}>
    <App />
  </I18nextProvider>
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-test', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.myPing();
