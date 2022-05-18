import i18next from 'i18next';
import { BclNavLink } from 'renderer/components/bcl-nav-link';

export const Sidebar = () => {
  const handleLanguageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18next.changeLanguage(e.target.value);
  };
  return (
    <div className="pane-sm sidebar">
      <nav className="nav-group">
        <h5 className="nav-group-title">Hyper Links</h5>
        <BclNavLink to="/">
          <span className="icon icon-home" />
          Home
        </BclNavLink>
        <BclNavLink to="/users">
          <span className="icon icon-users" />
          Users
        </BclNavLink>
        <BclNavLink to="/subscription-model">
          <span className="icon icon-archive" />
          Subscription models
        </BclNavLink>
        <BclNavLink to="/about">
          <span className="icon icon-info-circled" />
          About
        </BclNavLink>
      </nav>
      <select
        className="form-control"
        onChange={(e) => handleLanguageSelect(e)}
      >
        {Object.keys(i18next.services.resourceStore.data).map((language) => (
          <option key={language}>{language}</option>
        ))}
      </select>
    </div>
  );
};

export default Sidebar;
