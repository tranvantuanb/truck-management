import { Link } from 'react-router-dom';
import Pagination from '../../Util/Pagination';
import compareValue from '../../Util/Sort';
import { MdUnfoldMore } from 'react-icons/md';

export default class FullTruck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalTruck: [],
      query: "",
      currentListTruck: [],
      filteredList: [],
      isSorted: false,
    }
  };

  componentDidMount() {
    axios.get("https://truck-management-api.herokuapp.com/api/v1/truck_info")
      .then((response) => {
        this.setState({
          totalTruck: response.data.truck_info,
          filteredList: response.data.truck_info
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onPageChanged = (currentListTruck) => {
    this.setState({ currentListTruck: currentListTruck });
  };

  handleDetail = (truckID) => {
    this.props.history.push(`/roster/${truckID}`);
  };

  handleCreate = () => {
    this.props.history.push("/roster/new");
  };

  handleEdit = (e, truckID) => {
    this.props.history.push(`/roster/${truckID}/edit`);
    e.stopPropagation();
  };

  handleDelete = (e, truck, index) => {
    let deleteIndex = this.state.totalTruck.findIndex(t => t.id == truck.id);
    axios.delete(`https://truck-management-api.herokuapp.com/api/v1/truck_info/${truck.id}`)
      .then((response) => {
        this.state.totalTruck.splice(deleteIndex, 1);
        this.setState({
          totalTruck: this.state.totalTruck,
          filteredList: this.state.totalTruck
        });
      })
      .catch((error) => {
        console.log(error);
      });
    e.stopPropagation();
  };

  handleChangeText = (event) => {
    this.state.query = event.target.value;
    this.setState({query: this.state.query});
  };

  onKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.handleSearch();
    }
  };

  handleSearch = () => {
    let query = this.state.query.toLowerCase();
    let totalTruck = this.state.totalTruck;

    let filteredList = totalTruck.filter((truck) => {
      return truck.truck_plate.toLowerCase().indexOf(query) > -1 ||
        truck.cargo_type.toLowerCase().indexOf(query) > -1 ||
        (truck.driver ? truck.driver.toLowerCase().indexOf(query) > -1 : false) ||
        (truck.truck_type ? truck.truck_type.toLowerCase().indexOf(query) > -1 : false) ||
        (truck.parking_address ? truck.parking_address.toLowerCase().indexOf(query) > -1 : false) ||
        (truck.description ? truck.description.toLowerCase().indexOf(query) > -1 : false)
    });

    this.setState({filteredList: filteredList});
  };

  handleSort = (property) => {
    let totalTruck = this.state.totalTruck.sort(compareValue(property, this.state.isSorted ? "desc" : "asc"));
    this.setState({
      totalTruck: totalTruck,
      filteredList: totalTruck,
      isSorted: !this.state.isSorted
    });
  }

  render() {
    let listTruck = this.state.currentListTruck;
    let filteredList = this.state.filteredList;

    return (
      <div>
        <div className="box box-info">
          <div className="box-header with-border">
            <h3 className="box-title">Truck Roster</h3>
            <div className="group-btn pull-right">
              <button
                className="btn btn-create-new"
                onClick={() => this.handleCreate()}>
                <span>
                  Create New
                </span>
              </button>
              <div className="search-field">
                <button className="btn-search" onClick={() => this.handleSearch()}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5
                      16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59
                      4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99
                      5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                  </svg>
                </button>
                <input
                  className="search-input"
                  type="text"
                  placeholder="search"
                  value={this.state.query}
                  onKeyDown={this.onKeyDown}
                  onChange={this.handleChangeText}
                />
              </div>
            </div>
          </div>
          <div className="box-body">
            {
              filteredList.length ?
                <div className="table-responsive">
                  <table className="table no-margin">
                    <thead>
                      <tr>
                        <th
                          className="sort"
                          onClick={() => this.handleSort("truck_plate")}
                        >
                          Truck plate <MdUnfoldMore className="sort-icon"/>
                        </th>
                        <th className="sort" onClick={() => this.handleSort("driver")}>
                          Driver <MdUnfoldMore className="sort-icon"/>
                        </th>
                        <th className="sort" onClick={() => this.handleSort("truck_type")}>
                          Truck type <MdUnfoldMore className="sort-icon"/>
                        </th>
                        <th className="sort" onClick={() => this.handleSort("parking_address")}>
                          Parking address <MdUnfoldMore className="sort-icon"/>
                        </th>
                        <th className="sort" onClick={() => this.handleSort("status")}>
                          Status <MdUnfoldMore className="sort-icon"/>
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        listTruck.map((truck, index) => {
                          return(
                            <tr key={truck.id} onClick={() => this.handleDetail(truck.id)}>
                              <td>{truck.truck_plate}</td>
                              <td>{truck.driver}</td>
                              <td>{truck.truck_type}</td>
                              <td>{truck.parking_address}</td>
                              <td><span className={`label label-${truck.status.toLowerCase()}`}>{truck.status}</span></td>
                              <td>
                                <button
                                  className="btn btn-default"
                                  onClick={(event) => this.handleEdit(event, truck.id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={(event) => this.handleDelete(event, truck, index)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              : <div className="no-record">No items found</div>
            }
          </div>
          <div className="box-footer clear-fix">
            {
              this.state.filteredList.length > 0 ?
                <Pagination
                  items={this.state.filteredList}
                  onPageChanged={this.onPageChanged}
                  isSorted={this.state.isSorted}
                />
              : null
            }
          </div>
        </div>
      </div>
    )
  }
}
