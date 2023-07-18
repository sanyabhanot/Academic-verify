import React, { Component } from "react";
import { Card, CardContent } from "semantic-ui-react";
import Employee from "../abis/Employee.json";
import Admin from "../abis/Admin.json";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { toast } from "react-toastify";
import "./SkillCard.css";

export default class SkillCard extends Component {
  state = {
    colour: ["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"],
  };

  removeSkill = async (name) => {
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
      await EmployeeContract?.methods
        ?.deleteSkill(name)
        .send({ from: accounts[0] });
      toast.success("Skill deleted successfully!!");
      window.location.reload(false);
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
  };

  render() {
    const skill = this.props.skill;
    return (
      <Card className="skill-des">
        {this.props.update && (
          <span
            className="delete-button-skill"
            onClick={(e) => this.removeSkill(skill.name)}
          >
            {!skill.visible ? (
              <i class="fas fa-eye-slash"></i>
            ) : (
              <i class="fas fa-eye"></i>
            )}
          </span>
        )}
        <CardContent>
          <div className="skillcard_container">
            <div>
              <Card.Header style={{ fontSize: "18px", fontWeight: "600" }}>
                {skill.name}
                <br />
                <small style={{ color: "#c5c6c7" }}>{skill.experience}</small>
              </Card.Header>

              <br />
              {skill.endorsed ? (
                <div>
                  <div>
                    <em>Endorsed By:</em>
                    <p>
                      <small
                        style={{ wordBreak: "break-word", color: "#c5c6c7" }}
                      >
                        {skill.endorser_address}
                      </small>
                    </p>
                  </div>
                  <br />
                  <div>
                    <em>Review: </em>
                    <p>
                      <small style={{ color: "#c5c6c7" }}>{skill.review}</small>
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ color: "yellow" }}>Not Yet Endorsed</p>
                </div>
              )}
            </div>
            <div>
              <div style={{ width: "100px" }}>
                <CircularProgressbar
                  value={skill.overall_percentage}
                  text={`Acquired - ${skill.overall_percentage}%`}
                  strokeWidth="5"
                  styles={buildStyles({
                    strokeLinecap: "round",
                    textSize: "12px",
                    pathTransitionDuration: 1,
                    pathColor: `${
                      this.state.colour[Math.floor(Math.random() * 5)]
                    }`,
                    textColor: "#c5c6c7",
                    trailColor: "#393b3fa6",
                    backgroundColor: "#c5c6c7",
                  })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}