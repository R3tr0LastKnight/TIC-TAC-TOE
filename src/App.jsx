import React from "react";
import "./App.css";
import Board from "./Board";
import Square from "./Square";
import { useState } from "react";
import { useEffect } from "react";
import blueBg from "./Assets/blue.mp4";
import sound from "./Assets/kb.mp3";

const defaultSquares = () => new Array(9).fill(null);

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const quipsL = [
  "竜神の剣を喰らえ",
  "Bow Before me!!!",
  "THY SHALL COWERR!!!",
  "DONT GET IN MY WAY!",
  "I am the HUNTER!!",
  "You are POWERLESS!",
  "Surrender To my WILL!!",
];
const quipsW = [
  "Ahhhhhhhhhhhhhhhhhhhhhhhhh",
  "LMAO DED",
  "VICTORY ROYALE",
  "I'll BE BAck....X-X",
  "Yamete Kudasai!",
  "THE CHAMPION IS HERE",
  "FATALITY",
];
const quipsT = [
  "Finally a Worthy Opponent!!",
  "Thy shall RESET!",
  "The Hunt is ON",
  "No Pain No Gain",
  "Time 4 The Reconing",
  "Our Fight Will BE LEGENDARY",
  "REMATCH!!!",
];

function App() {
  const [squares, setSquares] = useState(defaultSquares());
  const [winner, setWinner] = useState(null);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [aiPoints, setAiPoints] = useState(0);
  const [end, setEnd] = useState(false);

  const handleSquareClick = (index) => {
    const isPlayerTurn =
      squares.filter((square) => square !== null).length % 2 === 0;
    if (!end) {
      if (isPlayerTurn) {
        let newSquares = squares;
        newSquares[index] = "x";
        setSquares([...newSquares]);
      }
    }
  };

  const resetTheBoard = () => {
    setWinner(null);
    setSquares(defaultSquares());
    setEnd(false);
  };

  useEffect(() => {
    const isComputerTurn =
      squares.filter((square) => square !== null).length % 2 === 1;
    const linesThatAre = (a, b, c) => {
      return lines.filter((squareIndexes) => {
        const squareValues = squareIndexes.map((index) => squares[index]);
        return (
          JSON.stringify([a, b, c].sort()) ===
          JSON.stringify(squareValues.sort())
        );
      });
    };
    const emptyIndexes = squares.map((square, index) =>
      square === null ? index : null
    );
    const playerWon = linesThatAre("x", "x", "x").length > 0;
    const computerWon = linesThatAre("o", "o", "o").length > 0;
    if (playerWon) {
      setEnd(true);
      setWinner("x");
      setPlayerPoints(playerPoints + 1);
      return;
    }
    if (computerWon) {
      setEnd(true);
      setWinner("o");
      setAiPoints(aiPoints + 1);
    }
    if (emptyIndexes.filter((index) => squares[index] === null).length === 0) {
      setEnd(true);
      setWinner("s");
    }

    const putComputerAt = (index) => {
      let newSquares = squares;
      newSquares[index] = "o";
      setSquares([...newSquares]);
    };
    if (!end) {
      if (isComputerTurn) {
        const winningLines = linesThatAre("o", "o", null);
        if (winningLines.length > 0) {
          const winIndex = winningLines[0].filter(
            (index) => squares[index] === null
          )[0];
          putComputerAt(winIndex);
          return;
        }

        const linesToBlock = linesThatAre("x", "x", null);
        if (linesToBlock.length > 0) {
          const blockIndex = linesToBlock[0].filter(
            (index) => squares[index] === null
          )[0];
          putComputerAt(blockIndex);
          return;
        }

        const linesToContinue = linesThatAre("0", null, null);
        if (linesToContinue.length > 0) {
          const continueIndex = linesToContinue[0].filter(
            (index) => squares[index] === null
          )[0];
          putComputerAt(continueIndex);
          return;
        }

        const randomIndex =
          emptyIndexes[Math.ceil(Math.random() * emptyIndexes.length)];
        putComputerAt(randomIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squares]);

  return (
    <div className="overseer">
      <video src={blueBg} autoPlay loop muted></video>
      <main>
        <h1>TIC TAC TOE</h1>
        <p>can u beat this rogue AI ?</p>
        <Board>
          {squares.map((square, index) => (
            <Square
              x={square === "x" ? 1 : 0}
              o={square === "o" ? 1 : 0}
              onClick={() => handleSquareClick(index)}
            />
          ))}
        </Board>

        <div className="util">
          <button className="reset" onClick={() => resetTheBoard()}>
            RESET
          </button>
          <audio controls loop src={sound}></audio>
          <div className="points">
            <div>P1 : {playerPoints}</div>
            <div>AI : {aiPoints}</div>
          </div>
        </div>

        {!!winner && winner === "x" && (
          <div className="result green">
            <div className="">You Won </div>
            <div>〈^✪ᆺ✪^〉</div>
            <div className="sus">
              {quipsW[Math.floor(Math.random() * quipsW.length)]}
            </div>
          </div>
        )}
        {!!winner && winner === "o" && (
          <div className="result red">
            <div className="">You Lost </div>
            <div>ฅ(ﾐ⎚ﻌ⎚ﾐ)∫</div>
            <div className="sus">
              {quipsL[Math.floor(Math.random() * quipsL.length)]}
            </div>
          </div>
        )}
        {!!winner && winner === "s" && (
          <div className="result gray">
            <div className="">Its a Tie </div>
            <div>¯\_(ツ)_/¯</div>
            <div className="sus">
              {quipsT[Math.floor(Math.random() * quipsT.length)]}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
