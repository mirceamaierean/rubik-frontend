"use client";
import { useState, useRef } from "react";
import { RubiksCube, getCubeColorClass } from "@/utils/rubiksCube";
import { CubeColor } from "@/types/rubiksCube";
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

const COLORS = ["white", "yellow", "red", "orange", "blue", "green"];

function getFaceCell(
  row: number,
  col: number
): {
  face: keyof RubiksCube["faces"];
  faceRow: number;
  faceCol: number;
} | null {
  if (row >= 0 && row < 3 && col >= 3 && col < 6)
    return { face: "U", faceRow: row, faceCol: col - 3 };
  if (row >= 3 && row < 6 && col >= 0 && col < 3)
    return { face: "L", faceRow: row - 3, faceCol: col };
  if (row >= 3 && row < 6 && col >= 3 && col < 6)
    return { face: "F", faceRow: row - 3, faceCol: col - 3 };
  if (row >= 3 && row < 6 && col >= 6 && col < 9)
    return { face: "R", faceRow: row - 3, faceCol: col - 6 };
  if (row >= 3 && row < 6 && col >= 9 && col < 12)
    return { face: "B", faceRow: row - 3, faceCol: col - 9 };
  if (row >= 6 && row < 9 && col >= 3 && col < 6)
    return { face: "D", faceRow: row - 6, faceCol: col - 3 };
  return null;
}

export default function CubeViewer({
  faces,
  onCubeChange,
}: {
  faces: RubiksCube["faces"];
  onCubeChange?: (faces: RubiksCube["faces"]) => void;
}) {
  const [cube, setCube] = useState(() => new RubiksCube(faces));
  const [undoStack, setUndoStack] = useState<Move[]>([]);
  const [redoStack, setRedoStack] = useState<Move[]>([]);
  const [selectedCell, setSelectedCell] = useState<{
    face: keyof RubiksCube["faces"];
    faceRow: number;
    faceCol: number;
    x: number;
    y: number;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const applyMoves = (moves: Move[]) => {
    const newCube = cube.clone();
    moves.forEach((move) => move.execute(newCube));
    return newCube;
  };

  const executeCommand = (command: Move) => {
    const newCube = cube.clone();
    command.execute(newCube);
    setCube(newCube);
    setUndoStack([...undoStack, command]);
    setRedoStack([]);
    if (onCubeChange) onCubeChange(newCube.faces);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const newUndoStack = undoStack.slice(0, -1);
    const undoneMove = undoStack[undoStack.length - 1];
    setUndoStack(newUndoStack);
    setRedoStack((prev) => [...prev, undoneMove]);
    const newCube = applyMoves(newUndoStack);
    setCube(newCube);
    if (onCubeChange) onCubeChange(newCube.faces);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const redoMove = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    const newUndoStack = [...undoStack, redoMove];
    setUndoStack(newUndoStack);
    setRedoStack(newRedoStack);
    const newCube = applyMoves(newUndoStack);
    setCube(newCube);
    if (onCubeChange) onCubeChange(newCube.faces);
  };

  const handleCellClick = (row: number, col: number) => {
    const cell = getFaceCell(row, col);
    if (cell && gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      const cellSize = 40; // 2.5rem * 16px = 40px
      const x = col * cellSize + rect.left + window.scrollX;
      const y = row * cellSize + rect.top + window.scrollY;
      setSelectedCell({ ...cell, x, y });
    }
  };

  const handleColorSelect = (color: string) => {
    if (selectedCell) {
      const { face, faceRow, faceCol } = selectedCell;
      const newCube = cube.clone();
      newCube.faces[face][faceRow][faceCol] = color as CubeColor;
      setCube(newCube);
      setSelectedCell(null);
      if (onCubeChange) onCubeChange(newCube.faces);
    }
  };

  // Ensure getNetCell uses the current cube state
  function getNetCellCurrent(row: number, col: number): string | null {
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

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center py-8">
      <div
        ref={gridRef}
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
          const color = getNetCellCurrent(row, col);
          return color ? (
            <div
              key={idx}
              className={`border border-black ${getCubeColorClass(
                color
              )} rounded-md cursor-pointer`}
              onClick={() => handleCellClick(row, col)}
            />
          ) : (
            <div key={idx} />
          );
        })}
      </div>
      {selectedCell && (
        <div
          style={{
            position: "absolute",
            left: selectedCell.x,
            top: selectedCell.y - 50, // popup above the cell
            zIndex: 1000,
          }}
        >
          <div className="bg-white p-2 rounded shadow flex gap-2 border border-gray-300">
            {COLORS.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 ${getCubeColorClass(
                  color
                )}`}
                onClick={() => handleColorSelect(color)}
                aria-label={color}
              />
            ))}
          </div>
        </div>
      )}
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
            L
          </button>
          <button
            onClick={() => executeCommand(new RMove())}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            R
          </button>
          <button
            onClick={() => executeCommand(new FMove())}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            F
          </button>
          <button
            onClick={() => executeCommand(new BMove())}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            B
          </button>
          <button
            onClick={() => executeCommand(new UMove())}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            U
          </button>
          <button
            onClick={() => executeCommand(new DMove())}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            D
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => executeCommand(new LMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            L&apos;
          </button>
          <button
            onClick={() => executeCommand(new RMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            R&apos;
          </button>
          <button
            onClick={() => executeCommand(new FMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            F&apos;
          </button>
          <button
            onClick={() => executeCommand(new BMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            B&apos;
          </button>
          <button
            onClick={() => executeCommand(new UMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            U&apos;
          </button>
          <button
            onClick={() => executeCommand(new DMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            D&apos;
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => executeCommand(new YMove(false))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            Y
          </button>
          <button
            onClick={() => executeCommand(new XMove(false))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            X
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => executeCommand(new YMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            Y&apos;
          </button>

          <button
            onClick={() => executeCommand(new XMove(true))}
            className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
          >
            X&apos;
          </button>
        </div>
      </div>
      <AlgorithmControls onAlgorithm={executeCommand} />
    </div>
  );
}
