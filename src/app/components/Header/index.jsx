import { NavLink } from 'react-router-dom';

export default class Header extends React.Component {
  render() {
    return(
      <header className="header">
        <nav>
          <ul>
            <li><NavLink exact activeClassName="current" to='/'>Home</NavLink></li>
            <li><NavLink activeClassName="current" to='/roster'>Roster</NavLink></li>
          </ul>
        </nav>
      </header>
    )
  }
}
