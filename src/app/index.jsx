import {render} from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import TruckInfo from './components/TruckInfo';
import Header from './components/Header';
import './styles/index.scss';

const App = () => (
  <div>
    <Header />
    <Main />
  </div>
)

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/roster' component={TruckInfo}/>
    </Switch>
  </main>
)

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>), document.getElementById('app'));
