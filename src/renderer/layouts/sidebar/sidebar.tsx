import { BclNavLink } from 'renderer/components/bcl-nav-link';

export const Sidebar = () => {
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
        <BclNavLink to="/About">
          <span className="icon icon-info-circled" />
          About
        </BclNavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
