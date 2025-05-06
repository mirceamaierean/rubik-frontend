"use client";
import { useState } from "react";
import { RubiksCube, getCubeColorClass } from "@/utils/rubiksCube";
import { RMove } from "@/utils/commands/r";
import { LMove } from "@/utils/commands/l";
import { Move } from "@/utils/commands/move";
import { FMove } from "@/utils/commands/f";
import { BMove } from "@/utils/commands/b";
import { UMove } from "@/utils/commands/u";
import { DMove } from "@/utils/commands/d";
import { YMove } from "@/utils/commands/y";
import { XMove } from "@/utils/commands/x";
import AlgorithmControls from "./AlgorithmControls";
const GRID_SIZE = 9;
const GRID_COLS = 12;

function getNetCell(cube: RubiksCube, row: number, col: number): string | null {
  if (row >= 0 && row < 3 && col >= 3 && col < 6) {
    return cube.faces.U[row][col - 3];
  }

  if (row >= 3 && row < 6 && col >= 0 && col < 3) {
    return cube.faces.L[row - 3][col];
  }

  if (row >= 3 && row < 6 && col >= 3 && col < 6) {
    return cube.faces.F[row - 3][col - 3];
  }

  if (row >= 3 && row < 6 && col >= 6 && col < 9) {
    return cube.faces.R[row - 3][col - 6];
  }

  if (row >= 3 && row < 6 && col >= 9 && col < 12) {
    return cube.faces.B[row - 3][col - 9];
  }

  if (row >= 6 && row < 9 && col >= 3 && col < 6) {
    return cube.faces.D[row - 6][col - 3];
  }

  return null;
}

export default function CubeViewer() {
  const initialCube = RubiksCube.solved();
  const [cube, setCube] = useState(() => initialCube.clone());
  const [undoStack, setUndoStack] = useState<Move[]>([]);
  const [redoStack, setRedoStack] = useState<Move[]>([]);

  const applyMoves = (moves: Move[]) => {
    const newCube = initialCube.clone();
    moves.forEach((move) => move.execute(newCube));
    return newCube;
  };

  const executeCommand = (command: Move) => {
    const newUndoStack = [...undoStack, command];
    const newCube = applyMoves(newUndoStack);
    setUndoStack(newUndoStack);
    setRedoStack([]);
    setCube(newCube);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const newUndoStack = undoStack.slice(0, -1);
    const undoneMove = undoStack[undoStack.length - 1];
    setUndoStack(newUndoStack);
    setRedoStack((prev) => [...prev, undoneMove]);
    setCube(applyMoves(newUndoStack));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const redoMove = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    const newUndoStack = [...undoStack, redoMove];
    setUndoStack(newUndoStack);
    setRedoStack(newRedoStack);
    setCube(applyMoves(newUndoStack));
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center py-8">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, 2.5rem)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 2.5rem)`,
          gap: "2px",
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_COLS }).map((_, idx) => {
          const row = Math.floor(idx / GRID_COLS);
          const col = idx % GRID_COLS;
          const color = getNetCell(cube, row, col);
          return color ? (
            <div
              key={idx}
              className={`border border-black ${getCubeColorClass(
                color,
              )} rounded-md`}
            />
          ) : (
            <div key={idx} />
          );
        })}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleUndo}
          className="px-4 py-2 bg-gray-400 text-white rounded shadow hover:bg-gray-500 disabled:opacity-50"
          disabled={undoStack.length === 0}
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          className="px-4 py-2 bg-gray-400 text-white rounded shadow hover:bg-gray-500 disabled:opacity-50"
          disabled={redoStack.length === 0}
        >
          Redo
        </button>
      </div>
      <div>
        <div className="flex gap-2">
          <button
            onClick={() => executeCommand(new LMove())}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            L Move
          </button>
          <button
            onClick={() => executeCommand(new RMove())}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            R Move
          </button>
          <button
            onClick={() => executeCommand(new FMove())}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            F Move
          </button>
          <button
            onClick={() => executeCommand(new BMove())}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            B Move
          </button>
          <button
            onClick={() => executeCommand(new UMove())}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            U Move
          </button>
          <button
            onClick={() => executeCommand(new DMove())}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            D Move
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => executeCommand(new LMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            L&apos; Move
          </button>
          <button
            onClick={() => executeCommand(new RMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            R&apos; Move
          </button>
          <button
            onClick={() => executeCommand(new FMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            F&apos; Move
          </button>
          <button
            onClick={() => executeCommand(new BMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            B&apos; Move
          </button>
          <button
            onClick={() => executeCommand(new UMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            U&apos; Move
          </button>
          <button
            onClick={() => executeCommand(new DMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            D&apos; Move
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => executeCommand(new YMove(false))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            Y Move
          </button>
          <button
            onClick={() => executeCommand(new XMove(false))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            X Move
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => executeCommand(new YMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            Y&apos; Move
          </button>

          <button
            onClick={() => executeCommand(new XMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            X&apos; Move
          </button>
        </div>
      </div>
      <AlgorithmControls onAlgorithm={executeCommand} />
    </div>
  );
}
