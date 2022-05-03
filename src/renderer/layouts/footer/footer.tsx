import { BclTitle } from 'renderer/components/bcl-title';

export const Footer = () => {
  return (
    <footer className="toolbar toolbar-footer">
      <BclTitle>
        Developed with ❤️ by{' '}
        <a
          href="https://www.linkedin.com/in/denis-kucevic/"
          target="_blank"
          rel="noreferrer"
          style={{ cursor: 'pointer' }}
        >
          Brixi
        </a>{' '}
        &{' '}
        <a
          href="https://www.linkedin.com/in/j%C3%B3n-agnar-stef%C3%A1nsson-599622110/"
          target="_blank"
          rel="noreferrer"
          style={{ cursor: 'pointer' }}
        >
          JonnXor!
        </a>
      </BclTitle>
    </footer>
  );
};

export default Footer;
