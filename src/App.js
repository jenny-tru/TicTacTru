import React from 'react';
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import './App.css';
// https://xstate.js.org/docs/packages/xstate-react/
// 🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩

const tttMachine = createMachine(
  {
    initial: 'x',
    context: {
      board: Array(9).fill(null)
    },
    states: {
      x: {
        on: {
          PLAY: {
            target: 'o',
            actions: assign({
              board: (context, event) => {
                // context = { board: [ ... ] }
                // event = { type: 'PLAY', cell: 5 }
                // return the updated `board`
                return context.board.map((cell, index) => {
                  if (index === event.cell) {
                    return 'x';
                  }

                  // otherwise...
                  return cell;
                })
              }
            })
          }
        }
      },
      o: {
        on: {
          PLAY: {
            target: 'x',
            actions: assign({
              board: (context, event) => {
                // context = { board: [ ... ] }
                // event = { type: 'PLAY', cell: 5 }
                // return the updated `board`
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
      }
    }
  })

function App() {
  const [state, send] = useMachine(tttMachine);

  console.log(state.context);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Tic-Tac-Jen 🍩
        </p>

        <h2>
          {/* Make this say "X's turn" or "O's turn" */}
          {state.value.toUpperCase()} 's Turn
        </h2>

        <div className='board'>
          {state.context.board.map((played, i) => {
            // whenever a button is pressed, send "PLAY"
            return <button
              className="cell"
              key={i}
              onClick={() => {
                // { type: "PLAY", cell: 2 }
                send({ type: 'PLAY', cell: i })

              }}>
              {/* the 5th item in state.context.board */}
              {state.context.board[i]}
            </button>
          })}
        </div>

      </header>
    </div>
  );
}

export default App;
