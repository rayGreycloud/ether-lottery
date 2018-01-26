const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  // account mnemonic
  'minor current question flash mammal suffer trim sketch adult credit joke inmate',
  // specify network 
  'https://rinkeby.infura.io/orDImgKRzwNrVCDrAk5Q'
);

const web3 = new Web3(provider);

// Using function for async/await usage
const deploy = async () => {
  const INITIAL_STRING = 'Hi there!';
  const accounts = await web3.eth.getAccounts();
  
  console.log('Attempting to deploy from account:', accounts[0]);
  
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
    .send({ gas: '1000000', from: accounts[0] });
    
  console.log('Contract deployed to:', result.options.address);
};

deploy();
// contract address
// 0xD874DD715c866E74e570b7F5e6675f605B014BA1
