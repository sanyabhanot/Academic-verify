import React, { Component } from "react";
import { toast } from "react-toastify";
import Admin from "../../abis/Admin.json";
import LoadComp from "../../components/LoadComp";
import OrgEndCard from "../../components/OrgEndCard";

export default class AllOrganizationEndorser extends Component {
  state = {
    orgends: [],
    loadcomp: false,
  };

  componentDidMount = async () => {
    this.setState({ loadcomp: true });
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const orgendCount = await admin?.methods
        .OrganizationEndorserCount()
        .call();
      const orgends = await Promise.all(
        Array(parseInt(orgendCount))
          .fill()
          .map((ele, index) =>
            admin.methods.getOrganizationContractByIndex(index).call()
          )
      );
      this.setState({ orgends });
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loadcomp: false });
  };

  render() {
    return this.state.loadcomp ? (
      <LoadComp />
    ) : (
      <div className="admin">
        <h2 className="card-heading">All Registered Organization-Endorser</h2>
        <br />
        {this.state.orgends?.map((orgend, index) => (
          <OrgEndCard key={index} OrgEndContractAddress={orgend} />
        ))}
        <br />
      </div>
    );
  }
}