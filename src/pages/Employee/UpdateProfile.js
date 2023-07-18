import React, { Component } from "react";
import { toast } from "react-toastify";
import { Card, Grid } from "semantic-ui-react";
import Admin from "../../abis/Admin.json";
import Employee from "../../abis/Employee.json";
import LineChart from "../../components/LineChart";
import SkillCard from "../../components/SkillCard";
import "./Employee.css";
import "./UpdateProfile.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import GetCertificationModal from "../../components/GetCertificationModal";
import GetWorkExpModal from "../../components/GetWorkExpModal";
import GetSkillsModal from "../../components/GetSkillsModals";
import GetEducationModal from "../../components/GetEducationModal";
import GetEditFieldModal from "../../components/GetEditFieldModal";
import LoadComp from "../../components/LoadComp";
import CodeforcesGraph from "../../components/CodeforcesGraph";
import {
  reqCertiEndorsementFunc,
  reqEducationEndorsementFunc,
  reqWorkexpEndorsementFunc,
} from "../../firebase/api";

export default class UpdateProfile extends Component {
  state = {
    employeedata: {},
    overallEndorsement: [],
    skills: [],
    certifications: [],
    workExps: [],
    educations: [],
    colour: ["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"],
    readmore: false,
    certificationModal: false,
    workexpModal: false,
    skillmodal: false,
    educationmodal: false,
    editFieldModal: false,
    isDescription: false,
    loadcomp: false,
    EmployeeContract: {},
  };

  componentDidMount = async () => {
    this.setState({ loadcomp: true });
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
      this.setState({ EmployeeContract });
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
      const endorseCount = newEmployedata.endorsecount;
      const overallEndorsement = await Promise.all(
        Array(parseInt(endorseCount))
          .fill()
          .map((ele, index) =>
            EmployeeContract?.methods?.overallEndorsement(index).call()
          )
      );
      console.log(overallEndorsement);
      this.setState({ employeedata: newEmployedata, overallEndorsement });
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loadcomp: false });
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
        visible: certi[6],
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
        visible: certi[4],
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
        visible: work[6],
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

  closeCertificationModal = () => {
    this.setState({ certificationModal: false });
    this.getCertifications(this.state.EmployeeContract);
  };

  closeWorkExpModal = () => {
    this.setState({ workexpModal: false });
    this.getWorkExp(this.state.EmployeeContract);
  };

  closeSkillModal = () => {
    this.setState({ skillmodal: false });
    this.getSkills(this.state.EmployeeContract);
  };

  closeEducationModal = () => {
    this.setState({ educationmodal: false });
    this.getEducation(this.state.EmployeeContract);
  };

  closeEditFieldModal = () => {
    this.setState({ editFieldModal: false });
  };

  certificationVisibility = async (name) => {
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
        ?.deleteCertification(name)
        .send({ from: accounts[0] });
      toast.success("Certification visibility changed successfully!!");
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.getCertifications(this.state.EmployeeContract);
  };

  workExpVisibility = async (org) => {
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
        ?.deleteWorkExp(org)
        .send({ from: accounts[0] });
      toast.success("Work Exp. visibility changed successfully!!");
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.getWorkExp(this.state.EmployeeContract);
  };

  reqEducationEndorsement = async (education) => {
    reqEducationEndorsementFunc(education);
  };

  reqCertiEndorsement = async (certi) => {
    reqCertiEndorsementFunc(certi);
  };

  reqWorkexpEndorsement = async (workExp) => {
    reqWorkexpEndorsementFunc(workExp);
  };

  render() {
    return this.state.loadcomp ? (
      <LoadComp />
    ) : (
      <div>
        <GetCertificationModal
          isOpen={this.state.certificationModal}
          closeCertificationModal={this.closeCertificationModal}
        />
        <GetWorkExpModal
          isOpen={this.state.workexpModal}
          closeCertificationModal={this.closeWorkExpModal}
        />
        <GetSkillsModal
          isOpen={this.state.skillmodal}
          closeCertificationModal={this.closeSkillModal}
        />
        <GetEducationModal
          isOpen={this.state.educationmodal}
          closeCertificationModal={this.closeEducationModal}
        />

        <GetEditFieldModal
          isOpen={this.state.editFieldModal}
          closeEditFieldModal={this.closeEditFieldModal}
          name={this.state.employeedata?.name}
          location={this.state.employeedata?.location}
          description={this.state.employeedata?.description}
          isDescription={this.state.isDescription}
        />

        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              <Card className="personal-info">
                <Card.Content>
                  <Card.Header>
                    <div className="edit-heading">
                      <span>{this.state.employeedata?.name}</span>
                      <span
                        className="add-button"
                        onClick={(e) =>
                          this.setState({
                            editFieldModal: !this.state.editFieldModal,
                            isDescription: false,
                          })
                        }
                      >
                        <i class="fas fa-pencil-alt"></i>
                      </span>
                    </div>
                    <small
                      style={{ wordBreak: "break-word", color: "#c5c6c7" }}
                    >
                      {this.state.employeedata?.ethAddress}
                    </small>
                  </Card.Header>
                  <br />
                  <div>
                    <p>
                      <em>Location: </em>
                      <span style={{ color: "#c5c6c7" }}>
                        {this.state.employeedata?.location}
                      </span>
                    </p>
                  </div>
                  <br />
                  <div>
                    <p>
                      <em>Overall Endorsement Rating:</em>
                    </p>
                    <LineChart
                      overallEndorsement={this.state.overallEndorsement}
                    />
                  </div>
                </Card.Content>
              </Card>
              <Card className="employee-des">
                <Card.Content>
                  <Card.Header>
                    <div className="edit-heading">
                      <span>About</span>
                      <span
                        className="add-button"
                        onClick={(e) =>
                          this.setState({
                            editFieldModal: !this.state.editFieldModal,
                            isDescription: true,
                          })
                        }
                      >
                        <i class="fas fa-pencil-alt"></i>
                      </span>
                    </div>
                  </Card.Header>
                  <div>
                    <p style={{ color: "#c5c6c7" }}>
                      {this.state.employeedata?.description}
                    </p>
                  </div>
                  <br />
                  <div>
                    <span
                      className="add-button"
                      onClick={(e) =>
                        this.setState({
                          educationmodal: !this.state.educationmodal,
                        })
                      }
                    >
                      <i class="fas fa-plus"></i>
                    </span>

                    <Card.Header
                      style={{ fontSize: "19px", fontWeight: "600" }}
                    >
                      Education
                    </Card.Header>
                    <br />
                    <div className="education">
                      {this.state.educations?.map((education, index) => (
                        <div className="education-design" key={index}>
                          <div
                            style={{ paddingRight: "50px", color: "#c5c6c7" }}
                          >
                            <p>{education.description}</p>
                            <small style={{ wordBreak: "break-word" }}>
                              {education.institute}
                            </small>
                          </div>
                          <div>
                            <small style={{ color: "#c5c6c7" }}>
                              <em>
                                {education.startdate} - {education.enddate}
                              </em>
                            </small>
                            <p
                              style={{
                                color: education.endorsed
                                  ? "#00d1b2"
                                  : "yellow",
                                opacity: "0.7",
                              }}
                            >
                              {education.endorsed ? (
                                "Endorsed"
                              ) : (
                                <div
                                  className="endorsement-req-button"
                                  onClick={() =>
                                    this.reqEducationEndorsement(education)
                                  }
                                >
                                  Request Endorsement
                                </div>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card.Content>
              </Card>
              <Card className="employee-des">
                <Card.Content>
                  <Card.Header>Competetive Platform Ratings</Card.Header>
                  <CodeforcesGraph />
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={10}>
              <Card className="employee-des">
                <Card.Content>
                  <span
                    className="add-button"
                    onClick={(e) =>
                      this.setState({
                        certificationModal: !this.state.certificationModal,
                      })
                    }
                  >
                    <i class="fas fa-plus"></i>
                  </span>
                  <Card.Header>Certifications</Card.Header>
                  <br />
                  <br />
                  <div>
                    {this.state.certifications?.map((certi, index) => (
                      <div key={index} className="certification-container">
                        <div style={{ color: "#c5c6c7" }}>
                          <p>
                            {certi.name}
                            <span
                              className="delete-button-visiblility"
                              onClick={(e) =>
                                this.certificationVisibility(certi.name)
                              }
                            >
                              {!certi.visible ? (
                                <i class="fas fa-eye-slash"></i>
                              ) : (
                                <i class="fas fa-eye"></i>
                              )}
                            </span>
                          </p>
                          <small style={{ wordBreak: "break-word" }}>
                            {certi.organization}
                          </small>
                          <p
                            style={{
                              color: certi.endorsed ? "#00d1b2" : "yellow",
                              opacity: "0.7",
                            }}
                          >
                            {certi.endorsed ? (
                              "Endorsed"
                            ) : (
                              <div
                                className="endorsement-req-button"
                                onClick={() => this.reqCertiEndorsement(certi)}
                              >
                                Request Endorsement
                              </div>
                            )}
                          </p>
                        </div>
                        <div>
                          <div style={{ width: "100px" }}>
                            <CircularProgressbar
                              value={certi.score}
                              text={`Score - ${certi.score}%`}
                              strokeWidth="5"
                              styles={buildStyles({
                                strokeLinecap: "round",
                                textSize: "12px",
                                pathTransitionDuration: 1,
                                pathColor: `rgba(255,255,255, ${
                                  certi.score / 100
                                })`,
                                textColor: "#c5c6c7",
                                trailColor: "#393b3fa6",
                                backgroundColor: "#c5c6c7",
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
              <Card className="employee-des">
                <Card.Content>
                  <span
                    className="add-button"
                    onClick={(e) =>
                      this.setState({
                        workexpModal: !this.state.workexpModal,
                      })
                    }
                  >
                    <i class="fas fa-plus"></i>
                  </span>
                  <Card.Header>Work Experiences</Card.Header>
                  <br />
                  <div className="education">
                    {this.state.workExps?.map((workExp, index) => (
                      <div className="education-design" key={index}>
                        <div style={{ color: "#c5c6c7" }}>
                          <p>
                            {workExp.role}
                            <span
                              className="delete-button-visiblility"
                              onClick={(e) =>
                                this.workExpVisibility(workExp.organization)
                              }
                            >
                              {!workExp.visible ? (
                                <i class="fas fa-eye-slash"></i>
                              ) : (
                                <i class="fas fa-eye"></i>
                              )}
                            </span>
                          </p>
                          <small style={{ wordBreak: "break-word" }}>
                            {workExp.organization}
                          </small>
                        </div>
                        <div>
                          <small style={{ color: "#c5c6c7" }}>
                            <em>
                              {workExp.startdate} - {workExp.enddate}
                            </em>
                          </small>
                          <p
                            style={{
                              color: workExp.endorsed ? "#00d1b2" : "yellow",
                              opacity: "0.7",
                            }}
                          >
                            {workExp.endorsed ? (
                              "Endorsed"
                            ) : (
                              <div
                                className="endorsement-req-button"
                                onClick={() =>
                                  this.reqWorkexpEndorsement(workExp)
                                }
                              >
                                Request Endorsement
                              </div>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
              <Card className="employee-des">
                <Card.Content>
                  <span
                    className="add-button"
                    onClick={(e) =>
                      this.setState({
                        skillmodal: !this.state.skillmodal,
                      })
                    }
                  >
                    <i class="fas fa-plus"></i>
                  </span>
                  <Card.Header>Skills</Card.Header>
                  <br />
                  <br />
                  <div className="skill-height-container">
                    {this.state.skills?.map((skill, index) => (
                      <div>
                        <SkillCard skill={skill} key={index} update />
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}