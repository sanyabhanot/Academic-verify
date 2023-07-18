import React, { Component } from "react";
import Organization from "../../abis/OrganizationEndorser.json";
import Admin from "../../abis/Admin.json";
import { toast } from "react-toastify";
import OrgEndCard from "../../components/OrgEndCard";
import EmployeeCard from "../../components/EmployeeCard";
import "./Organization.css";
import GetEmployeeModal from "../../components/GetEmployeeModal";
import LoadComp from "../../components/LoadComp";

export default class OrganizationEndorser extends Component {
  state = {
    orgcontractAddress: "",
    employees: [],
    employeemodal: false,
    loadcomp: false,
  };

  componentDidMount = async () => {
    this.setState({ loadcomp: true });
    await this.getEmployees();
    this.setState({ loadcomp: false });
  };

  getEmployees = async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const accounts = await web3.eth.getAccounts();
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const orgContractAddress = await admin?.methods
        ?.getOrganizationContractByAddress(accounts[0])
        .call();
      const orgContract = await new web3.eth.Contract(
        Organization.abi,
        orgContractAddress
      );

      const employeeCount = await orgContract?.methods?.totalEmployees().call();

      const employees = await Promise.all(
        Array(parseInt(employeeCount))
          .fill()
          .map(async (ele, index) => {
            const employee = await orgContract?.methods
              ?.getEmployeeByIndex(index)
              .call();
            return admin.methods.getEmployeeContractByAddress(employee).call();
          })
      );
      // console.log("emp", employees);

      this.setState({ orgContractAddress, employees });
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
  };

  closeEmployeeModal = () => {
    this.setState({ employeemodal: false });
    this.getEmployees();
  };

  render() {
    return this.state.loadcomp ? (
      <LoadComp />
    ) : (
      <div>
        <GetEmployeeModal
          isOpen={this.state.employeemodal}
          closeEmployeeModal={this.closeEmployeeModal}
        />
        {this.state.orgContractAddress && (
          <OrgEndCard OrgEndContractAddress={this.state.orgContractAddress} />
        )}
        <br />
        <div>
          <div
            style={{ width: "68%", marginLeft: "auto", marginRight: "auto" }}
          >
            <span
              className="add-employee"
              onClick={(e) =>
                this.setState({
                  employeemodal: !this.state.employeemodal,
                })
              }
            >
              <span class="fas fa-plus">&nbsp;Add Employee</span>
            </span>
            <h2 className="org-card-heading">Employees in the organization</h2>
          </div>
          <br />
          {this.state.employees?.map((employee, index) => (
            <EmployeeCard key={index} employeeContractAddress={employee} />
          ))}
        </div>
        <br />
      </div>
    );
  }
}