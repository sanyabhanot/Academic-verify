import React, { Component } from "react";
import Employee from "../abis/Employee.json";
import Admin from "../abis/Admin.json";
import { toast } from "react-toastify";
import { Dimmer, Loader } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

class SearchEmp extends Component {
  state = {
    employeedata: {},
    loading: false,
    employeeContractAddress: "",
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    const empAddress = this.props.emp;
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const employeeContractAddress = await admin.methods
        ?.getEmployeeContractByAddress(empAddress)
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );
      const employeedata = await EmployeeContract.methods
        .getEmployeeInfo()
        .call();
      const newEmployedata = {
        ethAddress: employeedata[0],
        name: employeedata[1],
        location: employeedata[2],
        description: employeedata[3],
        overallEndorsement: employeedata[4],
        endorsecount: employeedata[5],
      };
      this.setState({ employeedata: newEmployedata, employeeContractAddress });
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loading: false });
  };

  toRoute = () => {
    this.props.history.push(
      `/getemployee/${this.state.employeeContractAddress}`
    );
    window.location.reload(false);
  };

  render() {
    return this.state.loading ? (
      <Dimmer active={this.state.loading} inverted>
        <Loader inverted content="Fetching..." />
      </Dimmer>
    ) : (
      <div
        key={this.state.employeeContractAddress}
        className="search-ele"
        onClick={this.toRoute}
      >
        <div>
          <span>{this.state?.employeedata?.name}</span>
          <span>{this.state?.employeedata?.location}</span>
        </div>
        <small>{this.state?.employeedata?.ethAddress}</small>
        <br />
        <small>{this.state?.employeedata?.description}</small>
      </div>
    );
  }
}

export default withRouter(SearchEmp);