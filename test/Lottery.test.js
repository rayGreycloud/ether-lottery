const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });
    
  lottery.setProvider(provider);
});

describe('Lottery Contract', () => {
  it('should initially deploy contract', () => {
    // lottery should have address if deployed   
    assert.ok(lottery.options.address);
  });
  
  it('should allow one account to enter', async () => {
    // Account enters lottery
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });
    // Get players array
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });
    // First account should be first player
    assert.equal(accounts[0], players[0]);
    // Players array should have 1 item
    assert.equal(1, players.length);
  });
  
  it('should allow multiple accounts to enter', async () => {
    // Accounts enter lottery
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether')
    });
    
    // Get players array
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });
    // Players array should contain accounts
    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    // Players array should have 2 items
    assert.equal(3, players.length);
  });
  
  it('should allow entry with required amount of ether', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
      });
    } catch (err) {
      assert(false);
      return;
    }
    assert(true);
  });
  
  it('should not allow entry with less than required amount of ether', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 200
      });
    } catch (err) {
      assert(true);
      return;
    }
    assert(false);
  });
});
