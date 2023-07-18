// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract Skills {
  mapping(string => address[]) skillmap;
  string[] skill;

  function addEmployeeToSkill(string memory _name, address _employee) public {
    if (skillmap[_name].length == 0) {
      skill.push(_name);
    }
    skillmap[_name].push(_employee);
  }

  function getSkillLength() public view returns (uint256) {
    return skill.length;
  }

  function getSkillsByIndex(uint256 index) public view returns (string memory) {
    return skill[index];
  }

  function getTotalEmployeeInSkillByIndex(uint256 index)
    public
    view
    returns (uint256)
  {
    return skillmap[skill[index]].length;
  }

  function getTotalEmployeeInSkillByName(string memory _name)
    public
    view
    returns (uint256)
  {
    return skillmap[_name].length;
  }

  function getEmployeeInSkillByIndex(uint256 skill_index, uint256 emp_index)
    public
    view
    returns (address)
  {
    return skillmap[skill[skill_index]][emp_index];
  }

  function getEmployeeBySkillName(string memory _name, uint256 emp_index)
    public
    view
    returns (address)
  {
    return skillmap[_name][emp_index];
  }
}