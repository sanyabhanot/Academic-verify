import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Card } from "semantic-ui-react";
import Employee from "../abis/Employee.json";
import "./EmployeeCard.css";
import LoadComp from "./LoadComp";

class EmployeeCard extends Component {
  state = {
    employeedata: {},
    skills: [],
    certifications: [],
    workExps: [],
    educations: [],
    colour: ["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"],
    readmore: false,
    loadcomp: false,
  };

  componentDidMount = async () => {
    const web3 = window.web3;
    const EmployeeContract = await new web3.eth.Contract(
      Employee.abi,
      this.props.employeeContractAddress
    );
    this.getSkills(EmployeeContract);
    this.getCertifications(EmployeeContract);
    this.getWorkExp(EmployeeContract);
    this.getEducation(EmployeeContract);
    const employeedata = await EmployeeContract.methods
      .getEmployeeInfo()
      .call();
    const newEmployedata = {
      ethAddress: employeedata[0],
      name: employeedata[1],
      location: employeedata[2],
      description: employeedata[3],
      overallEndorsement: employeedata[4],
      endorsecount: employeedata[5],
    };
    this.setState({ employeedata: newEmployedata });
  };

  getSkills = async (EmployeeContract) => {
    const skillCount = await EmployeeContract?.methods?.getSkillCount().call();
    const skills = await Promise.all(
      Array(parseInt(skillCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getSkillByIndex(index).call()
        )
    );

    var newskills = [];
    skills.forEach((certi) => {
      newskills.push({
        name: certi[0],
        overall_percentage: certi[1],
        experience: certi[2],
        endorsed: certi[3],
        endorser_address: certi[4],
        review: certi[5],
      });
      return;
    });

    this.setState({ skills: newskills });
  };

  getCertifications = async (EmployeeContract) => {
    const certiCount = await EmployeeContract?.methods
      ?.getCertificationCount()
      .call();
    const certifications = await Promise.all(
      Array(parseInt(certiCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getCertificationByIndex(index).call()
        )
    );
    var newcertifications = [];
    certifications.forEach((certi) => {
      newcertifications.push({
        name: certi[0],
        organization: certi[1],
        score: certi[2],
        endorsed: certi[3],
      });
      return;
    });
    this.setState({ certifications: newcertifications });
  };

  getWorkExp = async (EmployeeContract) => {
    const workExpCount = await EmployeeContract?.methods
      ?.getWorkExpCount()
      .call();
    const workExps = await Promise.all(
      Array(parseInt(workExpCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getWorkExpByIndex(index).call()
        )
    );

    var newworkExps = [];
    workExps.forEach((work) => {
      newworkExps.push({
        role: work[0],
        organization: work[1],
        startdate: work[2],
        enddate: work[3],
        endorsed: work[4],
        description: work[5],
      });
      return;
    });

    this.setState({ workExps: newworkExps });
  };

  getEducation = async (EmployeeContract) => {
    const educationCount = await EmployeeContract?.methods
      ?.getEducationCount()
      .call();
    const educations = await Promise.all(
      Array(parseInt(educationCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getEducationByIndex(index).call()
        )
    );
    var neweducation = [];
    educations.forEach((certi) => {
      neweducation.push({
        institute: certi[0],
        startdate: certi[1],
        enddate: certi[2],
        endorsed: certi[3],
        description: certi[4],
      });
      return;
    });
    this.setState({ educations: neweducation });
  };

  toEmployee = () => {
    this.props.history.push(
      `/getemployee/${this.props.employeeContractAddress}`
    );
  };

  render() {
    return this.state.loadcomp ? (
      <LoadComp />
    ) : (
      <Card className="employee-card">
        <Card.Content>
          <Card.Header onClick={this.toEmployee} style={{ cursor: "pointer" }}>
            <span>{this.state.employeedata?.name}</span>
            <small>{this.state.employeedata.ethAddress}</small>
          </Card.Header>
          <br></br>
          <div>
            <p>
              <em>Location : </em>
              <span style={{ color: "#c5c6c7" }}>
                {this.state.employeedata?.location}
              </span>
            </p>
          </div>
          <br />
          <div>
            <em>Description :</em>
            <p style={{ color: "#c5c6c7" }}>
              {this.state.employeedata?.description}
            </p>
          </div>
          <br />
          <div>
            <em>Skills:</em>
            <div className="skill-holder">
              {this.state.skills?.map((skill, index) => (
                <div
                  className="skill-design"
                  style={{
                    color: "#c5c6c7",
                    border: `1px solid ${this.state.colour[index % 5]}`,
                  }}
                >
                  <p>{skill.name}</p>
                </div>
              ))}
            </div>
          </div>
          <br />
          {this.state.readmore ? (
            <div>
              <div>
                <em>Education:</em>
                <div className="education">
                  {this.state.educations?.map((education, index) => (
                    <div
                      className="education-design"
                      style={{ color: "#c5c6c7" }}
                    >
                      <div>
                        <p>{education.description}</p>
                        <small>{education.institute}</small>
                      </div>
                      <div>
                        <small>
                          <em>
                            {education.startdate} - {education.enddate}
                          </em>
                        </small>
                        <p
                          style={{
                            color: education.endorsed ? "#00d1b2" : "yellow",
                            opacity: "0.7",
                          }}
                        >
                          {education.endorsed ? "Endorsed" : "Not Yet Endorsed"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <br />
              <div>
                <em>Certifications:</em>
                <div className="certifications">
                  {this.state.certifications?.map((certification, index) => (
                    <div
                      className="certification-design"
                      style={{ color: "#c5c6c7" }}
                    >
                      <div>
                        <p>{certification.name}</p>
                        <small>{certification.organization}</small>
                      </div>
                      <div>
                        <p>
                          <em>Score: {certification.score}</em>
                        </p>
                        <p
                          style={{
                            color: certification.endorsed
                              ? "#00d1b2"
                              : "yellow",
                            opacity: "0.7",
                          }}
                        >
                          {certification.endorsed
                            ? "Endorsed"
                            : "Not Yet Endorsed"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <br />
              <div>
                <em>Work Experience:</em>
                <div className="workexp">
                  {this.state.workExps?.map((work, index) => (
                    <div
                      className="workexp-design"
                      style={{ color: "#c5c6c7" }}
                    >
                      <div>
                        <p>{work.role}</p>
                        <small>{work.organization}</small>
                      </div>
                      <div>
                        <p>
                          <em>
                            <small>
                              {work.startdate} - {work.enddate}
                            </small>
                          </em>
                        </p>
                        <p
                          style={{
                            color: work.endorsed ? "#00d1b2" : "yellow",
                            opacity: "0.7",
                          }}
                        >
                          {work.endorsed ? "Endorsed" : "Not Yet Endorsed"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="readopenclose"
                onClick={() => this.setState({ readmore: false })}
              >
                <p>Hide</p>
              </div>
            </div>
          ) : (
            <div
              className="readopenclose"
              onClick={() => this.setState({ readmore: true })}
            >
              <p>...Read More</p>
            </div>
          )}
        </Card.Content>
      </Card>
    );
  }
}

export default withRouter(EmployeeCard);