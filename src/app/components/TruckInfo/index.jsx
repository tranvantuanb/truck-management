import { Switch, Route } from 'react-router-dom';
import FullTruck from './FullTruck';
import TruckDetail from './TruckDetail';
import TruckForm from './Form';

export default class TruckInfo extends React.Component {
  render() {
    return(
      <div>
        <Switch>
          <Route exact path='/roster' component={FullTruck}/>
          <Route path='/roster/new' component={TruckForm}/>
          <Route path='/roster/:id/edit' component={TruckForm}/>
          <Route path='/roster/:id' component={TruckDetail}/>
        </Switch>
      </div>
    )
  }
}
