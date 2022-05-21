import React from 'react';
import { useTranslation } from 'react-i18next';

// IMAGES
import addUserModal from '../../../../assets/images/add-user-modal.png';
import dialog from '../../../../assets/images/dialog.png';
import error from '../../../../assets/images/error.png';
import homePage from '../../../../assets/images/home-page.png';
import navigation from '../../../../assets/images/image.png';
import modelsModal from '../../../../assets/images/models-modal.png';
import layout from '../../../../assets/images/layout.png';
import subscriptionDropdown from '../../../../assets/images/subscription-dropdown.png';
import userModal from '../../../../assets/images/user-modal.png';
import userPage from '../../../../assets/images/users-table.png';
import modelsTable from '../../../../assets/images/models-table.png';
import titleImg from '../../../../assets/images/titleimg.png';
import subDelete from '../../../../assets/images/sub-delete.png';

import './about.css';

export const About: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <img src={titleImg} alt="" />
      <div className="content-container">
        <hr />
        <h1 id="macaw">Macaw</h1>
        <p>
          <strong>{t('common:about.title-p1')}</strong>
        </p>
        <p>
          <strong>{t('common:about.title-p2')}: 1.0.0</strong>
        </p>
        <p>
          <strong>{t('common:about.title-p3')}</strong>
          <a
            href="https://electron-react-boilerplate.js.org/"
            target="_blank"
            rel="noreferrer"
          >
            <strong>electron-react-boilerplate</strong>
          </a>
        </p>
        <h2 id="contents">{t('common:about.contents')}</h2>
        <ul>
          <li>
            <a href="#macaw">Macaw</a>
            <ul>
              <li>
                <a href="#contents">{t('common:about.contents')}</a>
              </li>
              <li>
                <a href="#tutorials">
                  <strong>{t('common:about.tutorials')}</strong>🙋🏼‍♂️
                </a>
                <ul>
                  <li>
                    <a href="#layout-of-the-app">
                      <strong>{t('common:about.layout-of-the-app')}</strong>:
                    </a>
                  </li>
                  <li>
                    <a href="#navigation">
                      <strong>{t('common:about.navigation')}</strong>:
                    </a>
                  </li>
                  <li>
                    <a href="#home-page">
                      <strong>{t('common:about.home-page')}</strong>:
                    </a>
                  </li>
                  <li>
                    <a href="#users-page">
                      <strong>{t('common:about.users-page')}</strong>
                    </a>
                  </li>
                  <li>
                    <a href="#subscription-models">
                      <strong>{t('common:about.subscription-models')}</strong>:
                    </a>
                  </li>
                  <li>
                    <a href="#error-message">
                      <strong>{t('common:about.error-message')}</strong>
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#customer-support">
                  <strong>{t('common:about.customer-support')}</strong>💭
                </a>
              </li>
              <li>
                <a href="#additional-comments">
                  <strong>{t('common:about.additional-comments')}</strong>🔔
                </a>
              </li>
              <li>
                <a href="#contributors">
                  <strong>{t('common:about.contributors')}:</strong>
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <p>
          <strong>{t('common:about.software-summary')}</strong>🧠
        </p>
        <p>{t('common:about.software-summary-p1')}</p>
        <hr />
        <h2 id="tutorials">
          <strong>{t('common:about.tutorials')}</strong>🙋🏼‍♂️
        </h2>
        <h3 id="layout-of-the-app">
          <strong>{t('common:about.layout-of-the-app')}</strong>:
        </h3>
        <p>
          <img src={layout} alt="" />
        </p>
        <p>{t('common:about.layout-of-the-app-p1')}</p>
        <h3 id="navigation">
          <strong>{t('common:about.navigation')}</strong>:
        </h3>
        <p>
          <img src={navigation} alt="" />
        </p>
        <p>{t('common:about.navigation-p1')}</p>
        <h3 id="home-page">
          <strong>{t('common:about.home-page')}</strong>:
        </h3>
        <p>
          <img src={homePage} alt="" />
        </p>
        <p>{t('common:about.home-page-p1')}</p>
        <hr />
        <h3 id="users-page">
          <strong>{t('common:about.users-page')}</strong>
        </h3>
        <p>
          <img src={userPage} alt="" />
        </p>
        <p>{t('common:about.users-page-p1')}</p>
        <p>{t('common:about.users-page-p2')}</p>
        <p>{t('common:about.users-page-p3')}</p>
        <p>{t('common:about.users-page-p4')} </p>
        <ul>
          <li>{t('common:about.users-page-p5')}</li>
          <li>{t('common:about.users-page-p6')}</li>
          <li>{t('common:about.users-page-p7')}</li>
        </ul>
        <p>{t('common:about.users-page-p8')}</p>
        <ul>
          <li>{t('common:about.users-page-p9')}</li>
          <li>{t('common:about.users-page-p10')}</li>
        </ul>
        <p>
          <img src={dialog} alt="" />
        </p>
        <p>{t('common:about.users-page-p11')}</p>
        <p>
          <img src={addUserModal} alt="" />
        </p>
        <p>{t('common:about.users-page-p12')} </p>
        <p>{t('common:about.users-page-p13')}</p>
        <p>
          <img src={subscriptionDropdown} alt="" />
        </p>
        <p>{t('common:about.users-page-p14')}</p>
        <p>{t('common:about.users-page-p15')}</p>
        <p>
          <img src={userModal} alt="" />
        </p>
        <h3 id="subscription-models">
          <strong>{t('common:about.subscription-models')}</strong>:
        </h3>
        <p>
          <img src={modelsTable} alt="" />
        </p>
        <p>{t('common:about.subscription-models-p1')}</p>
        <p>{t('common:about.subscription-models-p2')}</p>
        <p>{t('common:about.subscription-models-p3')}</p>
        <p>{t('common:about.subscription-models-p4')}</p>
        <ul>
          <li>{t('common:about.subscription-models-p5')}</li>
        </ul>
        <img src={subDelete} alt="" />
        <p>{t('common:about.subscription-models-p6')} </p>
        <p>{t('common:about.subscription-models-p7')}</p>
        <p>
          <img src={modelsModal} alt="" />
        </p>
        <p>{t('common:about.subscription-models-p8')}</p>
        <ul>
          <li>{t('common:about.subscription-models-p9')}</li>
          <li>{t('common:about.subscription-models-p10')}</li>
          <li>{t('common:about.subscription-models-p11')}</li>
        </ul>
        <p>{t('common:about.subscription-models-p12')}</p>
        <p>
          !! <strong>{t('common:about.important')}</strong>
          !! {t('common:about.important-p1')}
        </p>
        <hr />
        <h3 id="error-message">
          <strong>{t('common:about.error-message')}</strong>
        </h3>
        <p>
          <img src={error} alt="" />
        </p>
        <p>
          {t('common:about.error-message-p1')}{' '}
          <a href="mailto:denikucevic@gmail.com">denikucevic@gmail.com</a>.
        </p>
        <h2 id="customer-support">
          <strong>{t('common:about.customer-support')}</strong>💭
        </h2>
        <p>
          {t('common:about.customer-support-p1')}{' '}
          <a href="mailto:denikucevic@gmail.com">denikucevic@gmail.com</a>
        </p>
        <p>
          {t('common:about.customer-support-p2')}{' '}
          <a
            href="https://www.linkedin.com/in/denis-kucevic/"
            target="_blank"
            rel="noreferrer"
          >
            denikucevic
          </a>
        </p>
        <p>
          {t('common:about.customer-support-p3')}{' '}
          <a
            href="https://github.com/DeniKucevic/electron-mini-subscription-manager"
            target="_blank"
            rel="noreferrer"
          >
            DeniKucevic
          </a>
        </p>
        <h2 id="additional-comments">
          <strong>{t('common:about.additional-comments')}</strong>🔔
        </h2>
        <p>{t('common:about.additional-comments-p1')}</p>
        <p>{t('common:about.additional-comments-p2')}</p>
        <h2 id="contributors">
          <strong>{t('common:about.contributors')}</strong>
        </h2>
        <p>
          <strong>Jón Agnar Stefánsson (JonnXor):</strong>
        </p>
        <ul>
          <li>{t('common:about.about-contributor-jon')}</li>
          <li>📍 {t('common:about.iceland')}</li>
          <li>
            🌐{' '}
            <a href="https://jonnxor.is" target="_blank" rel="noreferrer">
              https://jonnxor.is
            </a>
          </li>
          <li>
            <a href="mailto:JonnXor@gmail.com">JonnXor@gmail.com</a>
          </li>
        </ul>
        <hr />
      </div>
    </div>
  );
};

export default About;
