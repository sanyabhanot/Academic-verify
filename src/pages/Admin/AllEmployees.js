import React, { Component } from "react";
import { toast } from "react-toastify";
import EmployeeCard from "../../components/EmployeeCard";
import "./Admin.css";
import Admin from "../../abis/Admin.json";
import LoadComp from "../../components/LoadComp";

export default class AllEmployees extends Component {
  state = {
    employees: [],
    loadcomp: false,
  };

  componentDidMount = async () => {
    this.setState({ loadcomp: true });
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const employeeCount = await admin?.methods.employeeCount().call();

      const employees = await Promise.all(
        Array(parseInt(employeeCount))
          .fill()
          .map((ele, index) =>
            admin.methods.getEmployeeContractByIndex(index).call()
          )
      );
      this.setState({ employees });
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loadcomp: false });
  };

  render() {
    return this.state.loadcomp ? (
      <LoadComp />
    ) : (
      <div className="admin">
        <h2 className="card-heading">All Registered Employees</h2>
        <br />
        {this.state.employees?.map((employee, index) => (
          <EmployeeCard key={index} employeeContractAddress={employee} />
        ))}
        <br />
      </div>
    );
  }
}