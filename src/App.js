import React from 'react';
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import { inspect } from '@xstate/inspect';


import './App.css';
// https://xstate.js.org/docs/packages/xstate-react/
// 🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩

inspect({
  iframe: false
});

const checkCell = (context, event) => {
  // event === { type: 'PLAY', cell: 2 } event.type, event.cell 
  // context.board = [null, null, 'x', 'o', 'x', null, ...]
  // make sure the cell is free
  if (context.board[event.cell] === null) {
    return true;
  }
  else {
    window.alert("Tile is in use. Please select another tile.");
    return false;
  }
}

// start by making a function called "checkWinner"
// starts off like the one above (checkCell)
// we need a list of rows... and columns... and diagonals
// for each one of those "lines", check if all of them have Xs, or all of them have Os
function getWinner(context) {
  const lines = [
    // rows before hoes
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //diagonals
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let line of lines) {
    // check if they're all 'x'
    if (line.every(cell => {
      return context.board[cell] === 'x'
    })) {
      return 'x'
    }
    if (line.every(cell => {
      return context.board[cell] === 'o'
    })) {
      return 'o'
    }
  }

  return false;
}

const lies = [false, false, 0, false, null];

lies.every(lie => {
  return !lie;
}) // => true

function checkDraw(context) {
  // it's a draw if there is no winner...
  // AND if every single cell is filled (not null)
  if (getWinner(context) === false && context.board.every(cell => {
    return cell != null;
  })) {
    return true;
  } else {
    return false;
  }

}

const emptyBoard = Array(9).fill(null);

const tttMachine = createMachine(
  {
    initial: 'x',
    context: {
      board: emptyBoard
    },

    states: {
      x: {
        always: [{
          cond: getWinner,
          target: 'winner'
        }, {
          cond: checkDraw,
          target: 'draw'
        }],
        on: {
          PLAY: {
            target: 'o',
            cond: checkCell,
            actions: assign({
              board: (context, event) => {
                // context = { board: [ ... ] }
                // event = { type: 'PLAY', cell: 5 }
                // return the updated `board`
                return context.board.map((cell, index) => {
                  if (index === event.cell) {
                    return 'x';

                  }
                  return cell;
                })
              }
            })
          }
        }
      },
      o: {
        always: [{
          cond: getWinner,
          target: 'winner'
        }, {
          cond: checkDraw,
          target: 'draw'
        }],
        on: {
          PLAY: {
            target: 'x',
            cond: checkCell,
            actions: assign({
              board: (context, event) => {
                return context.board.map((cell, index) => {
                  if (index === event.cell) {
                    return 'o';
                  }
                  // otherwise...
                  return cell;
                })
              }
            })
          }
        }
      },
      winner: {
        entry: (context, event) => {
          const winner = getWinner(context) // gives either 'x', 'o'
          alert(`Winner Winner Chicken Dinner ${winner}`)
        },
        on: {
          RESET: {
            target: 'x',
            actions: assign({
              board: emptyBoard
            })
          }
        }
      },
      draw: {
        entry: (context, event) => {
          alert(`Looooosers`)
        },
        on: {
          RESET: {
            target: 'x',
            actions: assign({
              board: emptyBoard
            })
          }
        }
      }
    }
  })

function App() {
  const [state, send] = useMachine(tttMachine, { devTools: true });

  console.log(state.context);

  return (
    <div className="App" >
      <header className="App-header">
        <p>
          Tic-Tac-Jen 🍩
          <button onClick={() => {
            send({ type: 'RESET' })
          }}>New 🍩 Game </button>
        </p>
        <h2>
          {state.value.toUpperCase()} 's Turn
        </h2>
        <div className='board'>
          {state.context.board.map((played, i) => {
            return <button
              className="cell"
              key={i}
              onClick={() => {
                send({ type: 'PLAY', cell: i })
              }}>
              {state.context.board[i]}
            </button>
          })}
        </div>
      </header>
    </div >
  );
}

export default App;
