import React from 'react';

export const Header: React.FC = ({ children }) => {
  return <header className="toolbar toolbar-header">{children}</header>;
};

export default Header;
