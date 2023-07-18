import React, { Component } from "react";
import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Message,
} from "semantic-ui-react";
import "./EndorsePage.css";
import Admin from "../../abis/Admin.json";
import Employee from "../../abis/Employee.json";
import { toast } from "react-toastify";
import ScanQR from "../../components/ScanQR";

export default class Endorse extends Component {
  state = {
    employee_address: "",
    section: "",
    skillLoading: false,
    certification_name: "",
    scanQR: false,
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSkillEndorse = async (e) => {
    e.preventDefault();
    this.setState({ skillLoading: true, skillError: "" });
    const { employee_address, section, certification_name } = this.state;
    if (!employee_address || !section) {
      toast.error("Please enter all the fields.");
      return;
    }
    if (section === "3" && !certification_name) {
      toast.error("Please enter all the fields.");
      return;
    }
    e.preventDefault();
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const accounts = await web3.eth.getAccounts();
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const employeeContractAddress = await admin?.methods
        ?.getEmployeeContractByAddress(employee_address)
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );
      // console.log(employeeContractAddress, EmployeeContract);
      try {
        if (section === 1) {
          await EmployeeContract?.methods
            ?.endorseEducation()
            .send({ from: accounts[0] });
        } else if (section === 2) {
          await EmployeeContract?.methods
            ?.endorseWorkExp()
            .send({ from: accounts[0] });
        } else {
          console.log(certification_name);
          await EmployeeContract?.methods
            ?.endorseCertification(certification_name)
            .send({ from: accounts[0] });
        }
        toast.success("Endorsed successfully!!");
      } catch (err) {
        this.setState({ skillError: err.message });
      }
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({
      skillLoading: false,
      section: "",
      employee_address: "",
    });
  };

  closeScanQRModal = () => {
    this.setState({ scanQR: false });
  };

  handleAddAddress = (res) => {
    this.setState({ employee_address: res });
  };

  roleOptions = [
    {
      key: "0",
      text: "No-Role-Selected",
      value: "0",
    },
    {
      key: "1",
      text: "Endorse Education",
      value: "1",
    },
    {
      key: "2",
      text: "Endorse Work Experience",
      value: "2",
    },
    {
      key: "3",
      text: "Endorse Certification",
      value: "3",
    },
  ];

  handleDropdownSelect = (e, data) => {
    this.setState({ section: data.value });
  };

  render() {
    return (
      <>
        <ScanQR
          isOpen={this.state.scanQR}
          closeScanQRModal={this.closeScanQRModal}
          handleAddAddress={this.handleAddAddress}
        />
        <div className="endorse-section">
          <Card className="card-style">
            <Card.Content>
              <Card.Header>
                <h2 className="card-heading">Endorse Section</h2>
              </Card.Header>
              <br />
              <div>
                <Form
                  className="form-inputs"
                  onSubmit={this.handleSkillEndorse}
                  error={!!this.state.skillError}
                >
                  <Form.Field className="form-inputs">
                    <Input action>
                      <input
                        id="employee_address"
                        placeholder="Employee Address"
                        autoComplete="off"
                        autoCorrect="off"
                        value={this.state.employee_address}
                        onChange={this.handleChange}
                      />
                      <Button
                        type="button"
                        content="QR"
                        icon="qrcode"
                        onClick={() => this.setState({ scanQR: true })}
                      />
                    </Input>
                  </Form.Field>
                  <Form.Field className="form-inputs">
                    <Dropdown
                      placeholder="Select Role"
                      fluid
                      selection
                      options={this.roleOptions}
                      onChange={this.handleDropdownSelect}
                    />
                  </Form.Field>
                  {this.state.section === "3" && (
                    <Form.Field className="form-inputs">
                      <input
                        id="certification_name"
                        placeholder="Certification Name"
                        autoComplete="off"
                        autoCorrect="off"
                        value={this.state.certification_name}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                  )}
                  <br />
                  <Message
                    error
                    header="Oops!!"
                    content={this.state.skillError}
                  />
                  <br />
                  <Button
                    className="button-css"
                    type="submit"
                    icon="save"
                    content="Endorse"
                    floated="right"
                    loading={this.state.skillLoading}
                  />
                </Form>
              </div>
            </Card.Content>
          </Card>
        </div>
      </>
    );
  }
}