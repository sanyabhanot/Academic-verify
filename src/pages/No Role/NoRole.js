import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Card, Dropdown, Form, Message } from "semantic-ui-react";
import "./NoRole.css";
import { messageAdmin } from "../../firebase/api.js";

class NoRole extends Component {
  state = {
    name: "",
    location: "",
    description: "",
    role: 0,
    loading: false,
    errorMessage: "",
    message: "",
  };

  roleOptions = [
    {
      key: "0",
      text: "No-Role-Selected",
      value: "0",
    },
    {
      key: "1",
      text: "Employee",
      value: "1",
    },
    {
      key: "2",
      text: "OrganizationEndorser",
      value: "2",
    },
  ];

  handleDropdownSelect = (e, data) => {
    this.setState({ role: data.value });
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const info = {
      name: this.state.name,
      description: this.state.description,
      role: this.state.role,
      location: this.state.location,
    };
    await messageAdmin(info, this.state.message);
    this.setState({
      name: "",
      description: "",
      role: "0",
      location: "",
      message: "",
      loading: false,
      address: "",
    });
  };

  render() {
    return (
      <div className="norole">
        <Card className="card-style">
          <Card.Content>
            <Card.Header centered="true">
              <h2 className="card-heading">Message Admin</h2>
              <small className="norole-heading-subtext">
                Message admin to get added on the blockchain
              </small>
            </Card.Header>
            <hr className="horizontal-line"></hr>
            <br></br>
            <Form error={!!this.state.errorMessage}>
              <Form.Field className="form-inputs-admin">
                <input
                  id="name"
                  placeholder="Your Name"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <br />
              <Form.Field className="form-inputs-admin">
                <input
                  id="location"
                  placeholder="Your Location"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.location}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <br />
              <Form.Field className="form-inputs-admin">
                <input
                  id="description"
                  placeholder="Brief Description"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <br />
              <Form.Field className="form-inputs-admin">
                <Dropdown
                  placeholder="Desired Role"
                  fluid
                  selection
                  options={this.roleOptions}
                  onChange={this.handleDropdownSelect}
                />
              </Form.Field>
              <br />
              <Form.Field className="form-inputs-admin">
                <textarea
                  id="message"
                  rows="4"
                  placeholder="Short Message for Admin"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.message}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <br />
              <Message
                error
                header="Oops!!"
                content={this.state.errorMessage}
              />
              <br />
              <div className="button-holder">
                <Button
                  className="button-css-admin"
                  type="submit"
                  onClick={this.handleSubmit}
                  loading={this.state.loading}
                >
                  Send
                </Button>
              </div>
            </Form>
          </Card.Content>
        </Card>
        <br />
      </div>
    );
  }
}

export default withRouter(NoRole);