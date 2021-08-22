import { render } from 'react-dom';

import Main from './Main';

import 'antd/dist/antd.css';
import '../styles/common.less';
import './styles.less';

const App = () => (
  <div className="router-container">
    <Main />
  </div>
);

const rootElement = document.getElementById('root');
render(<App />, rootElement);
