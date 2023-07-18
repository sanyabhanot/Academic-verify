import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Input, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import OrgEnd from "../abis/OrganizationEndorser.json";
import "./Modals.css";
import ScanQR from "./ScanQR";

export default class GetEmployeeModal extends Component {
  state = {
    employee_address: "",
    loading: false,
    scanQR: false,
  };
  handleSubmit = async (e) => {
    const { employee_address } = this.state;
    if (!employee_address) {
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
      const orgContractAddress = await admin?.methods
        ?.getOrganizationContractByAddress(accounts[0])
        .call();
      const orgContract = await new web3.eth.Contract(
        OrgEnd.abi,
        orgContractAddress
      );
      try {
        await orgContract.methods.addEmployees(employee_address).send({
          from: accounts[0],
        });
        toast.success("Employee Added Successfully!!");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loading: false });
    this.props.closeEmployeeModal();
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  };

  closeScanQRModal = () => {
    this.setState({ scanQR: false });
  };

  handleAddAddress = (res) => {
    this.setState({ employee_address: res });
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
            content="Enter Employee Address"
            as="h2"
          />
          <Modal.Content className="modal-content">
            <Form className="form-inputs">
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
            </Form>
          </Modal.Content>
          <Modal.Actions className="modal-actions">
            <Button
              className="close-button"
              type="button"
              color="red"
              icon="times"
              content="Close"
              onClick={() => this.props.closeEmployeeModal()}
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