import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import "./Modals.css";

export default class GetEditFieldModal extends Component {
  state = {
    name1: "",
    description1: "",
    location1: "",
    loading: false,
  };

  handleSubmit = async (e) => {
    var name = this.state.name1;
    var description = this.state.description1;
    var location = this.state.location1;
    if (!name) name = this.props.name;
    if (!location) location = this.props.location;
    if (!description) description = this.props.description;
    if (!name || !description || !location) {
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
          .editInfo(name, location, description)
          .send({
            from: accounts[0],
          });
        toast.success("Employee Info Updated");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loading: false });
    this.props.closeEditFieldModal();
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    return (
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
          content="Update Fields"
          as="h2"
        />
        <Modal.Content className="modal-content">
          <Form className="form-inputs">
            {!this.props.isDescription && (
              <>
                {" "}
                <Form.Field className="form-inputs">
                  <input
                    id="name1"
                    placeholder="Name"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.name1}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field className="form-inputs">
                  <input
                    id="location1"
                    placeholder="Location"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.location1}
                    onChange={this.handleChange}
                  />
                </Form.Field>{" "}
              </>
            )}
            {this.props.isDescription && (
              <Form.Field className="form-inputs">
                <textarea
                  id="description1"
                  placeholder="About"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.description1}
                  onChange={this.handleChange}
                />
              </Form.Field>
            )}
          </Form>
        </Modal.Content>
        <Modal.Actions className="modal-actions">
          <Button
            className="close-button"
            type="button"
            color="red"
            icon="times"
            content="Close"
            onClick={() => this.props.closeEditFieldModal()}
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
    );
  }
}