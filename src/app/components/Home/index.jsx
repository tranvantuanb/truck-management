import truckImage from '../../images/truck.jpg';
import line from '../../images/line.jpg';

export default class Home extends React.Component {
  render() {
    return(
      <div className="home-page">
        <img src={truckImage} className="back-ground-img" />
        <div className="topic">
          <h2 className="title"> Trucking </h2>
          <img src={line} className="line-img" />
          <p className="free-text">
            Amazing Trucking & Logistic Management System
          </p>
        </div>
      </div>
    )
  }
}
