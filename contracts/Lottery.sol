pragma solidity ^0.4.17;

contract Lottery {
  address public manager;
  address[] public players;
  address public lastWinner;
  
  function Lottery() public {
    manager = msg.sender;
  }
  
  function enter() public payable {
    require(msg.value > .01 ether);
      
    players.push(msg.sender);
  }
  
  function random() private view returns (uint) {
    return uint(keccak256(block.difficulty,now, players));
  }
  
  function pickWinner() public restricted {
    require(players.length > 0);
    uint index = random() % players.length;
    lastWinner = players[index];    
    players[index].transfer(this.balance);
    players = new address[](0);
  }
  
  modifier restricted() {
    require(msg.sender == manager);
    _;
  }
  
  function getPlayers() public view returns (address[]) {
    return players;
  }
  
  function getLastWinner() public view returns (address) {
    return lastWinner;
  }
}