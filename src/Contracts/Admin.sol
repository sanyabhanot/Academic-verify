// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "./Employee.sol";
import "./OrganizationEndorser.sol";

contract Admin {
  address public owner;

  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  mapping(address => address) registeredEmployeesmap;
  mapping(address => address) registeredOrganizationmap;
  address[] registeredEmployees;
  address[] registeredOrganization;

  function registerUser(
    address EthAddress,
    string memory Name,
    string memory Location,
    string memory Description,
    uint256 Role
  ) public onlyOwner {
    if (Role == 1) {
      Employee newEmployee = new Employee(
        owner,
        EthAddress,
        Name,
        Location,
        Description
      );
      registeredEmployeesmap[EthAddress] = address(newEmployee);
      registeredEmployees.push(EthAddress);
    } else {
      OrganizationEndorser newOrganizationEndorser = new OrganizationEndorser(
        owner,
        EthAddress,
        Name,
        Location,
        Description
      );
      registeredOrganizationmap[EthAddress] = address(newOrganizationEndorser);
      registeredOrganization.push(EthAddress);
    }
  }

  /****************************************************************USER SECTION**************************************************/

  function isEmployee(address _employeeAddress) public view returns (bool) {
    return registeredEmployeesmap[_employeeAddress] != address(0x0);
  }

  function isOrganizationEndorser(address _organizationEndorser)
    public
    view
    returns (bool)
  {
    return registeredOrganizationmap[_organizationEndorser] != address(0x0);
  }

  function employeeCount() public view returns (uint256) {
    return registeredEmployees.length;
  }

  function getEmployeeContractByAddress(address _employee)
    public
    view
    returns (address)
  {
    return registeredEmployeesmap[_employee];
  }

  function getEmployeeContractByIndex(uint256 index)
    public
    view
    returns (address)
  {
    return getEmployeeContractByAddress(registeredEmployees[index]);
  }

  function OrganizationEndorserCount() public view returns (uint256) {
    return registeredOrganization.length;
  }

  function getOrganizationContractByAddress(address _organization)
    public
    view
    returns (address)
  {
    return registeredOrganizationmap[_organization];
  }

  function getOrganizationContractByIndex(uint256 index)
    public
    view
    returns (address)
  {
    return getOrganizationContractByAddress(registeredOrganization[index]);
  }
}