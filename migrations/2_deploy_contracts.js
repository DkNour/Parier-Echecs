const PredictionChess = artifacts.require('PredictionChess');

const Side = {
  Wesley: 0,
  Magnus: 1
};

module.exports = async function (deployer, _network, addresses) {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;
  await deployer.deploy(PredictionChess, oracle);
  const predictionChess = await PredictionChess.deployed();
  await predictionChess.placeBet(
    Side.Wesley, 
    {from: gambler1, value: web3.utils.toWei('1')}
  );
  await predictionChess.placeBet(
    Side.Wesley, 
    {from: gambler2, value: web3.utils.toWei('1')}
  );
  await predictionChess.placeBet(
    Side.Wesley, 
    {from: gambler3, value: web3.utils.toWei('2')}
  );
  await predictionChess.placeBet(
    Side.Magnus, 
    {from: gambler4, value: web3.utils.toWei('1')}
  );
};