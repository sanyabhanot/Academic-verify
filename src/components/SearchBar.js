import _ from "lodash";
import React, { Component } from "react";
import { toast } from "react-toastify";
import { Search } from "semantic-ui-react";
import Skills from "../abis/Skills.json";
import SearchEmp from "./SearchEmp";
import "./Search.css";

var source = [];

const initialState = { isLoading: false, results: [], value: "" };

export default class SearchBar extends Component {
  state = initialState;

  componentDidMount = async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const skillData = await Skills.networks[networkId];

    if (skillData) {
      const skills = await new web3.eth.Contract(Skills.abi, skillData.address);
      const skillLength = await skills?.methods?.getSkillLength().call();
      const allSkills = await Promise.all(
        Array(parseInt(skillLength))
          .fill()
          .map((ele, index) => skills.methods?.getSkillsByIndex(index).call())
      );

      allSkills.forEach(async (skillname) => {
        const currSkillLen = await skills.methods
          ?.getTotalEmployeeInSkillByName(skillname)
          .call();
        const allEmp = await Promise.all(
          Array(parseInt(currSkillLen))
            .fill()
            .map((ele, index) =>
              skills.methods?.getEmployeeBySkillName(skillname, index).call()
            )
        );
        allEmp.forEach((emp, index) =>
          source.push({
            title: skillname,
            description: <SearchEmp emp={emp} key={index} />,
          })
        );
      });
    } else {
      toast.error("Skill contract does not exist on this network!!");
    }
  };

  handleResultSelect = (e, { result }) =>
    this.setState({ value: result.title });

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState);

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = (result) => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch),
      });
    }, 300);
  };

  searchOptions = [
    { key: "1", text: "Employee", value: "1" },
    {
      key: "2",
      text: "Skill",
      value: "2",
    },
  ];
  render() {
    const { isLoading, value, results } = this.state;
    return (
      <>
        <Search
          fluid
          aligned="center"
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 500, {
            leading: true,
          })}
          results={results}
          value={value}
          style={{
            minWidth: "300px",
          }}
          className="searchbar"
        />
      </>
    );
  }
}