import React, { Component } from "react";
import { Table, Header, Image, Grid } from "semantic-ui-react";
import ChatBody from "../../components/ChatBody";
import Nochats from "../../components/NoChats";
import "./Organization.css";
import { db } from "../../firebase/firebase";
import Admin from "../../abis/Admin.json";
import { toast } from "react-toastify";

export default class NotificationsOrg extends Component {
  colour = ["b6e498", "61dafb", "764abc", "83cd29", "00d1b2"];
  state = {
    curr: {},
    conversations: [],
    admin: "",
  };

  componentDidMount = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    await db
      .collection("users")
      .doc(accounts[0])
      .collection("activechats")
      .onSnapshot((snapshot) =>
        this.setState({ conversations: snapshot.docs.map((doc) => doc.data()) })
      );
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const owner = await admin?.methods?.owner().call();
      this.setState({
        admin: owner,
      });
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
  };

  genImg = (name) => {
    return `https://ui-avatars.com/api/?background=${
      this.colour[Math.floor(Math.random() * 5)]
    }&color=fff&name=${name}`;
  };

  setCurr = (data) => {
    const curr = {
      ...data,
      avatar: this.genImg(data.name),
    };
    this.setState({ curr });
  };

  render() {
    return (
      <div className="notifications">
        <Grid style={{ height: "100%", width: "100%" }}>
          <Grid.Row>
            <Grid.Column width={6} style={{ borderRight: "1px solid #c5c6c7" }}>
              <div className="sidechat-container">
                <Table basic="very" celled collapsing>
                  <Table.Header>
                    <Table.Row className="header-row">
                      <Table.HeaderCell className="notification-sidechat">
                        Coversations
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <div
                    style={{
                      maxHeight: "70vh",
                      overflow: "auto",
                      overflowX: "clip",
                      paddingRight: "7px",
                    }}
                  >
                    <Table.Body className="sidechat-body">
                      {this.state?.conversations?.map((data) => {
                        return (
                          <Table.Row
                            className="row-cell-container"
                            onClick={() => this.setCurr(data)}
                            key={data.ethAddress}
                          >
                            <Table.Cell className="header-row-cell">
                              <Header
                                as="h4"
                                image
                                className="notification-sidechat"
                              >
                                <Image
                                  src={this.genImg(data.name)}
                                  rounded
                                  size="mini"
                                />
                                <Header.Content>
                                  {data.name}
                                  <Header.Subheader className="notification-sidechat-subheading">
                                    <small
                                      style={{
                                        wordBreak: "break-word",
                                        fontSize: "11px",
                                      }}
                                    >
                                      <em>{data.ethAddress}</em>
                                    </small>
                                  </Header.Subheader>
                                </Header.Content>
                              </Header>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </div>
                </Table>
              </div>
            </Grid.Column>
            <Grid.Column width={10}>
              {this.state.curr.ethAddress ? (
                <ChatBody
                  name={this.state.curr.name}
                  ethAddress={this.state.curr.ethAddress}
                  avatar={this.state.curr.avatar}
                  key={this.state.curr.ethAddress}
                  isEndorsementReq={
                    this.state.curr.ethAddress !== this.state.admin
                  }
                  org
                />
              ) : (
                <Nochats />
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}