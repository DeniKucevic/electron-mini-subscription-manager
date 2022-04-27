import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

export const BclNavLink: React.FC<NavLinkProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <NavLink
      className={(navData) =>
        `nav-group-item ${className} ${navData.isActive ? 'active' : ''}`
      }
      {...props}
    >
      {children}
    </NavLink>
  );
};

export default BclNavLink;
