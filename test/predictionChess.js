const PredictionChess = artifacts.require('PredictionChess.sol');
  
const Side = {
  Wesley: 0,
  Magnus: 1
};

contract('PredictionChess', addresses => {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

  it('should work', async () => {
    const predictionChess = await PredictionChess.new(oracle);
    
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
      {from: gambler4, value: web3.utils.toWei('4')}
    );

    await predictionChess.reportResult(
      Side.Wesley, 
      Side.Magnus, 
      {from: oracle}
    );

    const balancesBefore = (await Promise.all( 
      [gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => web3.utils.toBN(balance));
    await Promise.all(
      [gambler1, gambler2, gambler3].map(gambler => (
        predictionChess.withdrawGain({from: gambler})
      ))
    );
    const balancesAfter = (await Promise.all( 
      [gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => web3.utils.toBN(balance));

    //gambler 1, 2, 3 should have respectively 2, 2 and 4 extra ether
    //but we also have to take into consideration gas spent when calling
    //withdrawGain(). We can ignore this problem by just comparing
    //the first 3 digits of balances
    assert(balancesAfter[0].sub(balancesBefore[0]).toString().slice(0, 3) === '199');
    assert(balancesAfter[1].sub(balancesBefore[1]).toString().slice(0, 3) === '199');
    assert(balancesAfter[2].sub(balancesBefore[2]).toString().slice(0, 3) === '399');
    assert(balancesAfter[3].sub(balancesBefore[3]).isZero());
  });
});