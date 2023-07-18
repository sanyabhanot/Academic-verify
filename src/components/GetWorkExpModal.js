import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Input, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import "./Modals.css";
import ScanQR from "./ScanQR";

export default class GetWorkExpModal extends Component {
  state = {
    role: "",
    organization: "",
    startdate: "",
    enddate: "",
    description: "",
    loading: false,
    scanQR: false,
  };

  handleSubmit = async (e) => {
    const { role, organization, startdate, enddate, description } = this.state;
    if (!role | !organization || !startdate || !enddate || !description) {
      toast.error("Please enter all the fields.");
      return;
    }
    this.setState({ loading: true });
    e.preventDefault();
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const accounts = await web3.eth.getAccounts();
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const employeeContractAddress = await admin?.methods
        ?.getEmployeeContractByAddress(accounts[0])
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );
      try {
        await EmployeeContract.methods
          .addWorkExp(role, organization, startdate, enddate, description)
          .send({
            from: accounts[0],
          });
        toast.success("Certification saved successfullyy!!");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loading: false });
    this.props.closeCertificationModal();
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  };

  closeScanQRModal = () => {
    this.setState({ scanQR: false });
  };

  handleAddAddress = (res) => {
    this.setState({ organization: res });
  };

  render() {
    return (
      <>
        <ScanQR
          isOpen={this.state.scanQR}
          closeScanQRModal={this.closeScanQRModal}
          handleAddAddress={this.handleAddAddress}
        />
        <Modal
          as={Form}
          onSubmit={(e) => this.handleSubmit(e)}
          open={this.props.isOpen}
          size="tiny"
          className="modal-des"
        >
          <Header
            className="modal-heading"
            icon="pencil"
            content="Enter Work Experience Details"
            as="h2"
          />
          <Modal.Content className="modal-content">
            <Form className="form-inputs">
              <Form.Field className="form-inputs">
                <input
                  id="role"
                  placeholder="Job Title"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.role}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <Input action>
                  <input
                    id="organization"
                    placeholder="Organization"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.organization}
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
                <input
                  id="startdate"
                  placeholder="Start Date"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.startdate}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="enddate"
                  placeholder="End Date"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.enddate}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="description"
                  placeholder="Description"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions className="modal-actions">
            <Button
              className="close-button"
              type="button"
              color="red"
              icon="times"
              content="Close"
              onClick={() => this.props.closeCertificationModal()}
            />
            <Button
              className="button-css"
              type="submit"
              color="green"
              icon="save"
              content="Save"
              loading={this.state.loading}
            />
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}