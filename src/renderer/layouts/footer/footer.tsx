import React from 'react';
import { BclFooter } from 'renderer/components/bcl-footer';

export const Footer: React.FC = ({ children }) => {
  return <BclFooter>{children}</BclFooter>;
};

export default Footer;
