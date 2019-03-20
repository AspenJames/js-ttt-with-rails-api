let td;
let ID;
let messageContainer;
let gamesDiv;
const WINCOMBOS = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ]
let turn = 0;

document.addEventListener('DOMContentLoaded', function() {
  td = document.getElementsByTagName('td');
  messageContainer = document.getElementById('message');
  gamesDiv = document.getElementById('games');
  attachEventListeners();
})

function attachEventListeners() {
  for(el of td) {
    el.addEventListener('click', function() {
      if (this.innerText === '' && !checkWinner()) {
        doTurn(this);
      }
    });
  };

  document.getElementById('save').addEventListener('click', e => {
    e.stopPropagation();
    saveGame();
  });

  document.getElementById('previous').addEventListener('click', e => {
    e.stopPropagation();
    fetch('http://localhost:3000/games').then(resp => resp.json())
      .then(json => {
        let button;
        let buttonCount = document.querySelectorAll('#games button').length;
        let gameCount = json["data"].length;

        for(let i = buttonCount; i < gameCount;  i++) {
          let gameId = json["data"][i]["id"];
          let li = document.createElement('li');
          button = document.createElement('button');
          button.setAttribute('data-id', gameId);
          button.innerText = gameId;
          button.addEventListener('click', fetchGame);
          li.appendChild(button);
          gamesDiv.appendChild(li);
        }
      });
  })

  document.getElementById('clear').addEventListener('click', e =>  {
    e.stopPropagation();
    resetBoard();
  })
}

function fetchGame(e) {
  e.stopPropagation();
  ID = e.target.dataset['id'];
  fetch(`http://localhost:3000/games/${ID}`).then(resp => resp.json())
    .then(json => resetBoard(json["data"]["attributes"]["state"]));
}

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

function setMessage(message) {
  messageContainer.innerText = message;
}

function valuesMatch(combo) {
  return td[combo[0]].innerText !== '' && td[combo[0]].innerText === td[combo[1]].innerText && td[combo[1]].innerText === td[combo[2]].innerText;
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

function player() {
  return turn % 2 === 0 ? 'X' : 'O';
}

function resetBoard(state) {
  if (typeof state === 'undefined') {
    state = Array(9).fill('');
    turn = 0;
    ID = null;
  }
  turn = 0;
  for(i in td) {
    td[i].innerText = state[i];
    (state[i] !== '') && turn++;
  }
  messageContainer.innerText = '';
}

function checkGameOver() {
  for(el of td) {
    if (el.innerText === '') {
      return false;
    }
  }
  return true;
}

function saveGame() {
  let stateArr = [];
  for(el of td) {
    stateArr.push(el.innerText);
  }
  let state = { state: stateArr };

  if (typeof ID === 'undefined') {
    // post to '/games' with body of {"state": stateArr}
    // set ID with return data id
    fetch('http://localhost:3000/games', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(state)
    }).then(resp => resp.json())
      .then(json => {
        ID = json["data"]["id"];
        let li = document.createElement('li');
        button = document.createElement('button');
        button.setAttribute('data-id', ID);
        button.innerText = ID;
        button.addEventListener('click', fetchGame);
        li.appendChild(button);
        gamesDiv.appendChild(button);
      });
  } else {
    // patch '/games/${ID}' with body {"state": stateArr}
    fetch(`http://localhost:3000/games/${ID}`, {
      headers:  {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "PATCH",
      body: JSON.stringify(state)
    }).then(resp => resp.json())
      .then(json =>  {
        console.log(json);
      });
  }
}