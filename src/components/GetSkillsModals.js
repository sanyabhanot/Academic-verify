import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import "./Modals.css";

export default class GetSkillsModal extends Component {
  state = {
    name: "",
    experience: "",
    loading: false,
  };

  handleSubmit = async (e) => {
    this.setState({ loading: true });
    const { name, experience } = this.state;
    if (!name || !experience) {
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
        ?.getEmployeeContractByAddress(accounts[0])
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );
      try {
        await EmployeeContract.methods.addSkill(name, experience).send({
          from: accounts[0],
        });
        toast.success("Skill saved successfully!!");
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
          content="Enter Skill Details"
          as="h2"
        />
        <Modal.Content className="modal-content">
          <Form className="form-inputs">
            <Form.Field className="form-inputs">
              <input
                id="name"
                placeholder="Skill Name"
                autoComplete="off"
                autoCorrect="off"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="experience"
                placeholder="Experience"
                autoComplete="off"
                autoCorrect="off"
                value={this.state.experience}
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
    );
  }
}