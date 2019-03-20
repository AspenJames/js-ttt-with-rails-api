/*===== Initialize state =====*/
let td;
let ID;
let messageContainer;
let gamesDiv;
let turn;
// Set winning combinations
const WINCOMBOS = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ]
/*===== initialize state =====*/



/*===== Initialize board =====*/
document.addEventListener('DOMContentLoaded', function() {
  turn = 0;
  td = document.getElementsByTagName('td');
  messageContainer = document.getElementById('message');
  gamesDiv = document.getElementById('games');
  attachEventListeners();
})
/*===== initialize board =====*/



/*===== Event listeners =====*/
function attachEventListeners() {
  // Add click listener to each square
  for(el of td) {
    el.addEventListener('click', function() {
      if (this.innerText === '' && !checkWinner()) {
        doTurn(this);
      }
    });
  };

  // "Save Game" click listener
  document.getElementById('save').addEventListener('click', e => {
    e.stopPropagation();
    saveGame();
  });

  // "Show Previous Games" click listener
  document.getElementById('previous').addEventListener('click', e => {
    e.stopPropagation();
    fetch('http://localhost:3000/games').then(resp => resp.json())
      .then(json => {
        let button;
        let buttonCount = document.querySelectorAll('#games button').length;
        let gameCount = json["data"].length;

        // Only append games not currently listed
        for(let i = buttonCount; i < gameCount;  i++) {
          let gameId = json["data"][i]["id"];
          // TODO: 
          // Create li
          // Create button
          // Attach click event listener to button
          // Append to DOM
        }
      });
  })

  document.getElementById('clear').addEventListener('click', e =>  {
    e.stopPropagation();
    resetBoard();
  })
}
/*===== event listeners =====*/



/*===== API calls =====*/
function fetchGame(e) {
  e.stopPropagation();
  ID = e.target.dataset['id'];
  // TODO:
  // fetch `/games/${ID}`
  // then resetBoard with returned state
}

function saveGame() {
  let stateArr = [];
  for(el of td) {
    //TODO: fill state array with board data
  }

  if (typeof ID === 'undefined') {
    // TODO:
    // post to '/games' with params "state"
    // set ID with return data id
    // append saved game button to DOM
  } else {
    // TODO:
    // patch '/games/${ID}' with params "state"
  }
}
/*===== api calls =====*/



/*===== Board interaction =====*/
function setMessage(message) {
  messageContainer.innerText = message;
}

function doTurn(el) {
  updateState(el);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (checkGameOver()) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function updateState(el) {
  el.innerText = player();
}

function resetBoard(state) {
  if (typeof state === 'undefined') {
    state = Array(9).fill('');
    ID = null;
  }
  turn = 0;
  for(i in td) {
    // TODO: Set board with state array
    // this makes sure our turn variable
    // holds the proper amount
    (state[i] !== '') && turn++;
  }
  messageContainer.innerText = '';
}
/*===== board interaction =====*/



/*===== Helper functions =====*/
function checkWinner() {
  let won = false;

  for(combo of WINCOMBOS) {
    if (valuesMatch(combo)) {
      console.log('winner')
      won = true;
      setMessage(`Player ${td[combo[0]].innerText} won!`);
      break;
    }
    return won;
  }
}

function valuesMatch(combo) {
  return td[combo[0]].innerText !== '' && td[combo[0]].innerText === td[combo[1]].innerText && td[combo[1]].innerText === td[combo[2]].innerText;
  //return combo.every(function(value, index) {
    //console.log("td[value + index].innerText", td[value + index].innerText);
    //console.log("player()", player());
    //return td[value + index].innerText === player()
  //});
}

function player() {
  return turn % 2 === 0 ? 'X' : 'O';
}

function checkGameOver() {
  for(el of td) {
    if (el.innerText === '') {
      return false;
    }
  }
  return true;
}
/*===== helper functions =====*/
