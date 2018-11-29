import { Fragment } from 'react';

export default class TruckDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      truckInfo: {}
    }
  }

  componentDidMount() {
    const {match: {params}} = this.props;
    axios.get(`https://truck-management-api.herokuapp.com/api/v1/truck_info/${params.id}`)
      .then((response) => {
        this.setState({
          truckInfo: response.data.truck_info
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleBack = () => {
    this.props.history.push("/roster");
  };

  handleEdit = () => {
    this.props.history.push(`/roster/${this.props.match.params.id}/edit`);
  };

  handleDelete = () => {
    axios.delete(`https://truck-management-api.herokuapp.com/api/v1/truck_info/${this.props.match.params.id}`)
      .then((response) => {
        this.props.history.push("/roster");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  renderTextView(labelName, value) {
    return(
      <Fragment>
        <span className="label-input">{labelName}</span>
        <p className="text-muted">{value}</p>
      </Fragment>
    )
  }

  render() {
    let truckInfo = this.state.truckInfo

    return (
      <div className="box box-truck-form">
        <div className="box-header with-border">
          <h3 className="box-title">Truck Infomation Detail</h3>
        </div>
        <div className="box-body-form box-detail">
          <div className="wrap-input bg1 rs1">
            {this.renderTextView("Truck Plate", truckInfo.truck_plate)}
          </div>
          <div className="wrap-input bg1 rs1">
            {this.renderTextView("Driver", truckInfo.driver)}
          </div>
          <div className="wrap-input bg1">
            <span className="label-input">Cargo Type</span>
            <p>
              {
                truckInfo.cargo_type ?
                  truckInfo.cargo_type.split(/,\s*/).map((type, index) => {
                    return(
                      <span key={index} className="label label-info">{type}</span>
                    )
                  }) : null
              }
            </p>
          </div>
          <div className="wrap-input bg1 input-select rs1">
            {this.renderTextView("Truck Type", truckInfo.truck_type)}
          </div>
          <div className="wrap-input bg1 input-select rs1">
            <span className="label-input">Status</span>
            <p>
              <span className={truckInfo.status ? `label label-${truckInfo.status.toLowerCase()}` : null}>
                {truckInfo.status}
              </span>
            </p>
          </div>
          <div className="wrap-input bg1 rs2">
            {this.renderTextView("Price", truckInfo.price)}
          </div>
          <div className="wrap-input bg1 rs2">
            {this.renderTextView("Dimension (L-W-H)", truckInfo.dimension)}
          </div>
          <div className="wrap-input bg1 rs2">
            {this.renderTextView("Production Year", truckInfo.production_year)}
          </div>
          <div className="wrap-input bg1 rs1">
            {this.renderTextView("Parking Address", truckInfo.parking_address)}
          </div>
          <div className="wrap-input bg1 rs1">
            {this.renderTextView("Description", truckInfo.description)}
          </div>
        </div>
        <div className="box-footer detail-footer">
          <button
            className="btn btn-default"
            onClick={() => this.handleBack()}>
            Back
          </button>
          <button
            className="btn submit-form-btn pull-right"
            onClick={() => this.handleEdit()}>
            <span>
              Edit
            </span>
          </button>
          <button
            className="btn btn-delete"
            onClick={() => this.handleDelete()}>
            Delete
          </button>
        </div>
      </div>
  )
  }
}
