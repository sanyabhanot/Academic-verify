const Admin = artifacts.require("Admin");
const Skills = artifacts.require("Skills");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Admin);
  const admin = await Admin.deployed();
  await deployer.deploy(Skills);
  const skills = await Skills.deployed();
  console.log(admin.address, skills.address);
};