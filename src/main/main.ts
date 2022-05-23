/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'v8-compile-cache';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { db } from '../db/db.config';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let lang: null | string = null;

const getUpdateNotAvailableMessage = () => {
  switch (lang) {
    case 'en':
      return {
        title: 'Macaw Update',
        message: 'You are running latest version 🥳',
        buttons: ['Ok'],
      };
    case 'sr':
      return {
        title: 'Macaw Ažuriranje',
        message: 'Pokrećete najnoviju verziju 🥳',
        buttons: ['U redu'],
      };
    case 'cp':
      return {
        title: 'Macaw Aжурирање',
        message: 'Покрећете најновију верзију 🥳',
        buttons: ['У реду'],
      };

    default:
      return {
        title: 'Macaw Update',
        message: 'You are running latest version 🥳',
        buttons: ['Ok'],
      };
  }
};

const getUpdateAvailableMessage = () => {
  switch (lang) {
    case 'en':
      return {
        title: 'Macaw Update',
        detail: 'A new version is being downloaded.',
        buttons: ['Ok'],
      };
    case 'sr':
      return {
        title: 'Macaw Ažuriranje',
        detail: 'Nova verzija se preuzima.',
        buttons: ['U redu'],
      };
    case 'cp':
      return {
        title: 'Macaw Aжурирање',
        detail: 'Нова верзија се преузима.',
        buttons: ['У реду'],
      };

    default:
      return {
        title: 'Macaw Update',
        detail: 'A new version is being downloaded.',
        buttons: ['Ok'],
      };
  }
};

const getUpdateDownloaded = () => {
  switch (lang) {
    case 'en':
      return {
        title: 'Macaw Update',
        detail:
          'A new version has been downloaded. Restart the application to apply the updates.',
        buttons: ['Restart', 'Later'],
      };
    case 'sr':
      return {
        title: 'Macaw Ažuriranje',
        detail:
          'Nova verzija je preuzeta. Ponovo pokrenite aplikaciju da biste primenili ažuriranja.',
        buttons: ['Ponovo pokrenuti', 'Restartuj kasnije'],
      };
    case 'cp':
      return {
        title: 'Macaw Aжурирање',
        detail:
          'Нова верзија је преузета. Поново покрените апликацију да бисте применили ажурирања.',
        buttons: ['Поново покренути', 'Рестартуј касније'],
      };

    default:
      return {
        title: 'Macaw Update',
        detail:
          'A new version has been downloaded. Restart the application to apply the updates.',
        buttons: ['Restart', 'Later'],
      };
  }
};

ipcMain.on('ipc-test', async (event, _arg) => {
  const version = app.getVersion();
  event.reply('ipc-example', version);
});

ipcMain.on('updates-check', async (_event, arg) => {
  lang = arg;
  autoUpdater.checkForUpdatesAndNotify();
});

require('./controllers/home.controller');
require('./controllers/user.controller');
require('./controllers/subscription.controller');

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    db.close();
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

autoUpdater.on('update-not-available', (_event, releaseNotes, releaseName) => {
  const translations = getUpdateNotAvailableMessage();
  const dialogOpts = {
    type: 'info',
    buttons: translations.buttons,
    title: translations.title,
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: translations.message,
  };
  if (mainWindow) {
    dialog.showMessageBox(mainWindow, dialogOpts);
  }
});

autoUpdater.on('update-available', (_event, releaseNotes, releaseName) => {
  const translations = getUpdateAvailableMessage();
  const dialogOpts = {
    type: 'info',
    buttons: translations.buttons,
    title: translations.title,
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: translations.detail,
  };
  if (mainWindow) {
    dialog.showMessageBox(mainWindow, dialogOpts);
  }
});

autoUpdater.on('error', (error) => {
  dialog.showErrorBox(
    'Error: ',
    error == null ? 'unknown' : (error.stack || error).toString()
  );
});

autoUpdater.on('update-downloaded', (_event, releaseNotes, releaseName) => {
  const translations = getUpdateDownloaded();
  const dialogOpts = {
    type: 'info',
    buttons: translations.buttons,
    title: translations.title,
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: translations.detail,
  };
  dialog
    .showMessageBox(dialogOpts)
    .then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    })
    .catch((err) => {
      if (mainWindow) dialog.showErrorBox('error updating', err);
    });
});
