var MichalPolakToken = artifacts.require('./MichalPolakToken.sol')

module.exports = function (deployer) {
  deployer.deploy(MichalPolakToken)
}
