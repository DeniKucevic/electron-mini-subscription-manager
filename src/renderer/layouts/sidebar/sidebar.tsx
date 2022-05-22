import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { BclNavLink } from 'renderer/components/bcl-nav-link';

const lngs = {
  en: { nativeName: 'English' },
  sr: { nativeName: 'Srpski - lat' },
  cp: { nativeName: 'Српски - ћир' },
};

export const Sidebar = () => {
  const { t } = useTranslation();
  const handleLanguageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    window.localStorage.setItem('lang', e.target.value);
    i18next.changeLanguage(e.target.value);
  };

  return (
    <div className="pane-sm sidebar">
      <nav className="nav-group">
        <h5 className="nav-group-title">{t('common:links.title')}</h5>
        <BclNavLink to="/">
          <span className="icon icon-home" />
          {t('common:links.home')}
        </BclNavLink>
        <BclNavLink to="/users">
          <span className="icon icon-users" />
          {t('common:links.users')}
        </BclNavLink>
        <BclNavLink to="/subscription-model">
          <span className="icon icon-archive" />
          {t('common:links.subscription-models')}
        </BclNavLink>
        <BclNavLink to="/about">
          <span className="icon icon-info-circled" />
          {t('common:links.about')}
        </BclNavLink>
      </nav>
      <div className="form-group" style={{ margin: '21px' }}>
        {t('common:links.language')}:
        <select
          className="form-control"
          onChange={(e) => handleLanguageSelect(e)}
        >
          {Object.keys(lngs).map((lng) => (
            <option
              key={lng}
              value={lng}
              selected={lng === i18next.language && true}
            >
              {lngs[lng as keyof typeof lngs].nativeName}
            </option>
          ))}
        </select>
      </div>
      <span className="nav-group-item">
        <button
          type="button"
          className="btn btn-default"
          onClick={() => window.electron.ipcRenderer.checkForUpdates()}
        >
          Check for updates
        </button>
      </span>
    </div>
  );
};

export default Sidebar;
