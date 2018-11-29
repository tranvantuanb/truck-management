import AutoComplete from '../../Util/AutoComplete';
import { Fragment } from 'react';

export default class TruckForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      truckInfo: {
        truck_plate: null,
        cargo_type: null,
        driver: null,
        truck_type: "5 ton",
        price: null,
        dimension: null,
        parking_address: null,
        production_year: null,
        status: "New",
        description: null,
      },
      errors: {},
      driverSuggestions: [],
      // cargoTypeSuggestions: []
    }
    this.cargoTypeSuggestions = ["Vegestable", "Computer", "Electronic", "Kid toys", "Fruits",
      "Paper", "Clothes", "Cosmetics", "Book", "Candy"];
    this.truckType = ["5 ton", "10 ton", "20 ton"];
    this.paramsID = null;
  };

  componentDidMount() {
    const {match: {params}} = this.props;
    this.paramsID = params.id;
    axios.get("https://truck-management-api.herokuapp.com/api/v1/truck_info")
      .then((response) => {
        this.setState({
          driverSuggestions: this.getDriverSuggestions(response.data.truck_info),
          // cargoTypeSuggestions: this.getCargoTypeSuggestions(response.data.truck_info)
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    if (this.paramsID){
      axios.get(`https://truck-management-api.herokuapp.com/api/v1/truck_info/${this.paramsID}`)
        .then((response) => {
          this.setState({
            truckInfo: response.data.truck_info
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  getDriverSuggestions = (data) => {
    let driverSuggestions = [];

    data.map((truck) => {
      if (truck.driver) {
        driverSuggestions.push(truck.driver);
      }
    });

    return driverSuggestions;
  };

  getCargoTypeSuggestions = (data) => {
    let cargoTypeSuggestions = [];

    data.map((truck) => {
      if (truck.cargo_type) {
        cargoTypeSuggestions.push(truck.cargo_type);
      }
    });

    return cargoTypeSuggestions;
  }

  handleChangeText = (event) => {
    this.state.truckInfo[event.target.name] = event.target.value;
    this.setState({truckInfo: this.state.truckInfo});
  };

  handleChangeSelection = (event) => {
    this.state.truckInfo[event.target.name] = event.target.value;
    this.setState({truckInfo: this.state.truckInfo});
  };

  getValidation = (truckInfo) => {
    let errors = {};
    let requiredFields = ["truck_plate", "cargo_type", "price", "status"];
    const plateRegex = /^[1-9][0-9][A-Z]{1,2}-\d{4,5}$/;
    let cargoTypes = this.refs.cargoType.getInputValue();
    if (cargoTypes.split(",").length > 10) {
      errors["cargo_type"] = "Maximum 10 types";
    }

    requiredFields.map((field) => {
      if (!truckInfo[field]) {
        errors[field] = "Can't be empty";
      }
    })

    if (truckInfo.truck_plate && !truckInfo.truck_plate.match(plateRegex)) {
      errors["truck_plate"] = "Incorrect format";
    }

    return errors;
  }

  handleSubmit = () => {
    let truckInfo = this.state.truckInfo;
    truckInfo["driver"] = this.refs.driver.getInputValue();
    truckInfo["cargo_type"] = this.refs.cargoType.getInputValue();
    let errors = this.getValidation(truckInfo);

    if (JSON.stringify(errors) != "{}") {
      this.setState({
        errors: errors
      });

      return
    }

    if (this.paramsID) {
      axios.put(`https://truck-management-api.herokuapp.com/api/v1/truck_info/${this.paramsID}`, {
        truck_info: truckInfo})
        .then((response) => {
          this.props.history.replace(`/roster/${this.paramsID}`);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios.post("https://truck-management-api.herokuapp.com/api/v1/truck_info", truckInfo)
        .then((response) => {
          this.props.history.replace("/roster");
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  handleCancel = () => {
    this.props.history.replace("/roster");
  };

  renderTextInput1(fieldName, required = false, placeholder = "") {
    let truckFieldName = fieldName.replace(/\s+/g, '_').toLowerCase();

    return(
      <div>
        <span className="label-input">
          {fieldName == "Dimension" ? "Dimension (L-W-H)" : fieldName} {required ? "*" : ""}
        </span>
        <input
          className="input"
          type="text"
          name={truckFieldName}
          placeholder={placeholder}
          onChange={this.handleChangeText}
          value={this.state.truckInfo[truckFieldName] || ''}/>
        {this.state.errors[truckFieldName] ?
          <span className="error">{this.state.errors[truckFieldName]}</span> : null}
      </div>
    )
  };

  renderTextAreaInput(fieldName, placeholder = "", maxLength = 200) {
    let truckFieldName = fieldName.replace(/\s+/g, '_').toLowerCase();
    let field = this.state.truckInfo[truckFieldName];
    return(
      <Fragment>
        <span className="label-input">{fieldName}</span>
        <textarea
          className="input"
          name={truckFieldName}
          placeholder={placeholder}
          onChange={this.handleChangeText}
          maxLength={maxLength}
          value={field || ''}>
        </textarea>
        <div className="text-count">
          {field ? field.length : 0}/{maxLength} characters remaining
        </div>
      </Fragment>
    )
  };

  render() {
    let truckType = this.truckType;
    let status = ["New", "In-use", "Stopped"];
    let cargoTypeSuggestions = this.cargoTypeSuggestions;
    let driverSuggestions = this.state.driverSuggestions;

    return(
      <div className="box box-truck-form">
        <div className="box-header with-border">
          <h3 className="box-title">{this.paramsID  ? "Edit" : "New"} Truck Infomation</h3>
        </div>
        <div className="box-body-form">
          <div className="wrap-input rs1 bg1" data-validate="Please Type Your Name">
            {this.renderTextInput1("Truck Plate", "required", "Enter Truck Plate")}
          </div>
          <div className="wrap-input rs1 bg1">
            <AutoComplete
              fieldName="Driver"
              placeholder="Enter driver name"
              errors={this.state.errors}
              value={this.state.truckInfo.driver}
              ref="driver"
              suggestions={driverSuggestions}
            />
          </div>
          <div className="wrap-input bg1">
            <AutoComplete
              fieldName="Cargo Type"
              placeholder="Enter cargo type. Maximum 10 types"
              required={true}
              errors={this.state.errors}
              value={this.state.truckInfo.cargo_type}
              multiple={true}
              ref="cargoType"
              suggestions={cargoTypeSuggestions}
            />
          </div>
          <div className="wrap-input input-select bg1 rs1">
            <span className="label-input">Truck Type</span>
            <select
              name="truck_type"
              className="select-truck-type"
              value={this.state.truckInfo["truck_type"]}
              onChange={this.handleChangeSelection}
            >
              <option className="input" value={""}>Choose type</option>
              {truckType.map((type, index) => {
                return(<option key={index} className="input" value={type}>{type}</option>)
              })}
            </select>
          </div>
          <div className="wrap-input input-select bg1 rs1">
            <span className="label-input">Status *</span>
            <select
              name="status"
              className="select-truck-type"
              value={this.state.truckInfo["status"]}
              onChange={this.handleChangeSelection}>
                {status.map((st) => {
                  return(<option key={st} className="input" value={st}>{st}</option>)
                })}
            </select>
          </div>
          <div className="wrap-input bg1 rs2">
            {this.renderTextInput1("Price", "required", "Enter Price")}
          </div>
          <div className="wrap-input bg1 rs2">
            {this.renderTextInput1("Dimension", false, "Enter dimension: L-W-H")}
          </div>
          <div className="wrap-input bg1 rs2">
            {this.renderTextInput1("Production Year", false, "Enter Production Year")}
          </div>
          <div className="wrap-input bg0 rs1">
            {this.renderTextAreaInput("Parking Address", "Enter Parking Address", 500)}
          </div>
          <div className="wrap-input bg0 rs1">
            {this.renderTextAreaInput("Description", "Enter Description", 200)}
          </div>
        </div>
        <div className="box-footer">
          <button
            className="btn btn-default"
            onClick={() => this.handleCancel()}>
            Cancel
          </button>
          <button
            className="btn submit-form-btn pull-right"
            onClick={() => this.handleSubmit()}>
            <span>
              Submit
            </span>
          </button>
        </div>
      </div>
    )
  }
}
