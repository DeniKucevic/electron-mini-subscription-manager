import React from 'react';

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

import './about.css';

export const About: React.FC = () => {
  return (
    <div className="about-container">
      <h1 id="macaw">Macaw</h1>
      <p>
        <strong>Software Name: Macaw - minimal subscription-manager</strong>
      </p>
      <p>
        <strong>Software Version: 1.0.0</strong>
      </p>
      <p>
        **Technical Information: Built with **
        <a href="https://electron-react-boilerplate.js.org/">
          <strong>electron-react-boilerplate</strong>
        </a>
      </p>
      <p>**Software Summary **🧠</p>
      <p>
        This software is intended for keeping subscription records. The focus of
        the macaw is to solve the problem of record-keeping for a small business
        that does not need a complete solution but a simple record-keeping app.
        Wholly open-source and free.
      </p>
      <p>**How-To Guide **🔍</p>
      <p>To run the app locally download the repo, install the dependencies:</p>
      <pre>
        <code className="language-bash">
          <div>npm install</div>
        </code>
      </pre>
      <p>for development:</p>
      <pre>
        <code className="language-bash">
          <div>npm run start</div>
        </code>
      </pre>
      <p>
        If you want to package the app (build the installer &quot;.exe&quot;):
      </p>
      <pre>
        <code className="language-bash">
          <div>npm run build</div>
        </code>
      </pre>
      <p>This will output the installer to the release folder.</p>
      <hr />
      <p>**Tutorials **🙋🏼‍♂️</p>
      <h3 id="layout-of-the-app">
        <strong>Layout of the app</strong>:
      </h3>
      <p>
        <img src={layout} alt="Screenshot 2022-05-20 230001.png" />
      </p>
      <p>
        On the left is navigation with links to pages, and the content will be
        on the right.
      </p>
      <h3 id="navigation">
        <strong>Navigation</strong>:
      </h3>
      <p>
        <img src={navigation} alt="" />
      </p>
      <p>
        Here you can navigate between pages and select the language of the app.
      </p>
      <h3 id="home-page">
        <strong>Home page</strong>:
      </h3>
      <p>
        <img src={homePage} alt="" />
      </p>
      <p>
        The pie chart will show the ratio of expired and active subscriptions.
        The bottom table is showing subscriptions that are 3 days or less to
        expire sorted by most recent to expire. If there is no data this page
        will be blank.
      </p>
      <hr />
      <h3 id="users-page">
        <strong>Users page:</strong>
      </h3>
      <p>
        <img src={userPage} alt="" />
      </p>
      <p>This is a table of all users.</p>
      <p>
        The table can be sorted in ascending or descending order by clicking on
        the header items.
      </p>
      <p>
        In the top left corner is a search input that allows the table to be
        searched with a name or last name.
      </p>
      <p>
        The table shows basic information and the status of the subscription:
      </p>
      <ul>
        <li>RED: expired;</li>
        <li>YELLOW: 3 or fewer days until expiring;</li>
        <li>GREEN: active</li>
      </ul>
      <p>On the right are quick actions:</p>
      <ul>
        <li>
          PLUS: If there are subscription models it will add the first one in
          the list, if there are none subscription models it will add a one
          month from the date the subscription is set to expire;
        </li>
        <li>
          TRASH CAN: This will delete a user PERMANENTLY with all data. This
          action will trigger a confirm dialog:
        </li>
      </ul>
      <p>
        <img src={dialog} alt="" />
      </p>
      <p>
        In the top right corder is &quot;add new user&quot; button wich will
        open a modal to fill out the data of the new user:
      </p>
      <p>
        <img src={addUserModal} alt="" />
      </p>
      <p>
        First name and last name fields are only ones that are required. Note is
        a general field that can be used to insert and text or number.
      </p>
      <p>
        &quot;Subscription&quot; select will get data from subscription models
        page and fill in the dropdown:
      </p>
      <p>
        <img src={subscriptionDropdown} alt="" />
      </p>
      <p>
        This drop down will only apply first time. Idea is to create a standard
        one that will be added by default when plus in the actions column of the
        users table is pressed and add models here for give aways or coupons or
        grace periods. If t he user wants some other subscription the used view
        can be used.
      </p>
      <p>
        Clicking on the user will open a more detailed modal with the option to
        edit fields and insert custom subscriptions:
      </p>
      <p>
        <img src={userModal} alt="User modal" />
      </p>
      <h3 id="subscription-models">
        <strong>Subscription models</strong>:
      </h3>
      <p>
        <img src={modelsTable} alt="Subscription models" />
      </p>
      <p>This is a table of all subscription models.</p>
      <p>
        The table can be sorted in ascending or descending order by clicking on
        the header items.
      </p>
      <p>The table shows information about subscription models.</p>
      <p>On the right are quick actions:</p>
      <ul>
        <li>
          TRASH CAN: This will delete a user PERMANENTLY with all data. This
          action will trigger a confirm dialog:
        </li>
      </ul>
      <p>
        Subscription model consists of name (should be as descriptive as
        possible), value wich is a number that is tied to modifier that can be
        day, month, or year.
      </p>
      <p>
        New models are created by clicking the &quot;Insert new model&quot;
        button in the top right:
      </p>
      <p>
        <img src={modelsModal} alt="subscription model modal" />
      </p>
      <p>
        To create a new subscription that will last a week for example first we
        would insert new name:
      </p>
      <ul>
        <li>
          &quot;Week sub&quot; (name can not be duplicate and will throw a error
          if you try to insert a subscription with same name)
        </li>
        <li>
          Then we would select a value - 7 (value is a number that can not be
          less then 1).
        </li>
        <li>After that select modifier - days</li>
      </ul>
      <p>
        That will give us a subscription named &quot;Week sub&quot; that will
        last for 7 days (a week).
      </p>
      <p>
        !! <strong>IMPORTANT:</strong> !! maximum amount of subscription models
        to add is 6. After that the button to add new one will not be
        functional. This is made to prevent making too much of the models.
      </p>
      <hr />
      <ul>
        <li>**Error message: **</li>
      </ul>
      <p>
        <img src={error} alt="error message" />
      </p>
      <p>
        If you see this message something went wrong. If you have trouble
        figuring it out this would be a SQL error shown so try searching on the
        internet. If you still have trouble you can try emailing me:
        <a href="mailto:denikucevic@gmail.com">denikucevic@gmail.com</a>.
      </p>
      <p>**Customer Support **💭</p>
      <p>
        If you have trouble with software, question, want some feature built in
        for you, something changed or want to support me you can contact me on
        <strong>email</strong>:
        <a href="mailto:denikucevic@gmail.com">denikucevic@gmail.com</a>
      </p>
      <p>
        or try on linkedin:
        <a href="https://www.linkedin.com/in/denis-kucevic/">denikucevic</a>
      </p>
      <p>
        If you are looking for the **souce code **you can find in on my github:
        <a href="https://github.com/DeniKucevic/electron-mini-subscription-manager">
          DeniKucevic
        </a>
      </p>
      <p>**Additional Comments **🔔</p>
      <p>
        This app is created for my friend to help him manage his gym. I tried to
        best of my skills to make it as simple as possible for use and general
        enough for different use cases.
      </p>
      <p>
        If you want to improve on this feel free to create a pull request and I
        will add you to the contributors on the github and here.
      </p>
      <p>
        <strong>Contributors:</strong>
      </p>
      <p>
        <strong>Jón Agnar Stefánsson (JonnXor):</strong>
      </p>
      <ul>
        <li>
          Helped keeping me sane, structuring the project and solving bugs. My
          work colleague and a friend of mine. Very skilled Computer scientist /
          programmer.
        </li>
        <li>📍 Iceland</li>
        <li>
          🌐 <a href="https://jonnxor.is">https://jonnxor.is</a>
        </li>
        <li>
          <a href="mailto:JonnXor@gmail.com">JonnXor@gmail.com</a>
        </li>
      </ul>
      <hr />
    </div>
  );
};

export default About;
