import React, { Component } from "react";
import { Button, Card, Form, Input, Message } from "semantic-ui-react";
import "./EndorsePage.css";
import Admin from "../../abis/Admin.json";
import Employee from "../../abis/Employee.json";
import Skills from "../../abis/Skills.json";
import { toast } from "react-toastify";
import ScanQR from "../../components/ScanQR";

export default class EndorseSkil extends Component {
  state = {
    employee_address_skill: "",
    skill_name: "",
    skill_score: "",
    skill_review: "",
    skillError: "",
    skillLoading: false,
    scanQR: false,
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSkillEndorse = async (e) => {
    e.preventDefault();
    this.setState({ skillLoading: true, skillError: "" });
    const { employee_address_skill, skill_name, skill_score, skill_review } =
      this.state;
    if (
      !employee_address_skill ||
      !skill_name ||
      !(skill_score >= 1 && skill_score <= 100) ||
      !skill_review
    ) {
      toast.error("Please enter all the fields.");
      return;
    }
    e.preventDefault();
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const SkillData = await Skills.networks[networkId];
    const accounts = await web3.eth.getAccounts();
    if (AdminData && SkillData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const skills = await new web3.eth.Contract(Skills.abi, SkillData.address);
      const employeeContractAddress = await admin?.methods
        ?.getEmployeeContractByAddress(employee_address_skill)
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );

      try {
        await EmployeeContract.methods
          .endorseSkill(skill_name, skill_score, skill_review)
          .send({
            from: accounts[0],
          });
        await skills?.methods
          ?.addEmployeeToSkill(skill_name, employee_address_skill)
          .send({ from: accounts[0] });
        toast.success("Skill Endorsed successfully!!");
      } catch (err) {
        this.setState({ skillError: err.message });
      }
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({
      skillLoading: false,
      skill_name: "",
      skill_review: "",
      skill_score: "",
      employee_address_skill: "",
    });
  };

  closeScanQRModal = () => {
    this.setState({ scanQR: false });
  };

  handleAddAddress = (res) => {
    this.setState({ employee_address_skill: res });
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
                <h2 className="card-heading">Endorse Skill</h2>
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
                        id="employee_address_skill"
                        placeholder="Employee Address"
                        autoComplete="off"
                        autoCorrect="off"
                        value={this.state.employee_address_skill}
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
                      id="skill_name"
                      placeholder="Skill Name"
                      autoComplete="off"
                      autoCorrect="off"
                      value={this.state.skill_name}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                  <Form.Field className="form-inputs">
                    <input
                      id="skill_score"
                      placeholder="Skill Level (1-100)"
                      autoComplete="off"
                      autoCorrect="off"
                      type="number"
                      min="1"
                      max="100"
                      value={this.state.skill_score}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                  <Form.Field className="form-inputs">
                    <textarea
                      id="skill_review"
                      placeholder="Review"
                      autoComplete="off"
                      autoCorrect="off"
                      value={this.state.skill_review}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
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