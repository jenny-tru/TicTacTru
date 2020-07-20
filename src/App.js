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
    </div>
  );
}

export default App;
