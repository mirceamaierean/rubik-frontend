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

// Add character to color mapping
const charToColor: { [key: string]: string } = {
  r: "red",
  y: "yellow",
  b: "blue",
  g: "green",
  w: "white",
  o: "orange",
};

// Add reverse mapping from color to character
const colorToChar: { [key: string]: string } = {
  red: "r",
  yellow: "y",
  blue: "b",
  green: "g",
  white: "w",
  orange: "o",
};

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
  const [showColorDialog, setShowColorDialog] = useState(false);
  const [tempCubeState, setTempCubeState] = useState<
    RubiksCube["faces"] | null
  >(null);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [selectedFace, setSelectedFace] = useState<
    keyof RubiksCube["faces"] | null
  >(null);
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
    if (cell) {
      const cubeState = JSON.parse(JSON.stringify(cube.faces)); // Deep copy
      setTempCubeState(cubeState);
      setSelectedFace(cell.face);
      setShowColorDialog(true);

      // Initialize input values for the selected face only
      const newInputValues: { [key: string]: string } = {};
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const key = `${cell.face}-${i}-${j}`;
          const color = cubeState[cell.face][i][j];
          newInputValues[key] = colorToChar[color] || "";
        }
      }
      setInputValues(newInputValues);
    }
  };

  const handleInputChange = (
    face: keyof RubiksCube["faces"],
    row: number,
    col: number,
    value: string
  ) => {
    const key = `${face}-${row}-${col}`;
    const char = value.toLowerCase().slice(-1); // Take only the last character

    // Update input value regardless
    setInputValues((prev) => ({ ...prev, [key]: char }));

    // Only update cube state if it's a valid color character
    if (charToColor[char] && tempCubeState) {
      const newTempState = JSON.parse(JSON.stringify(tempCubeState));
      newTempState[face][row][col] = charToColor[char] as CubeColor;
      setTempCubeState(newTempState);
    }
  };

  const handleApplyChanges = () => {
    if (tempCubeState) {
      const newCube = new RubiksCube(tempCubeState);
      setCube(newCube);
      if (onCubeChange) onCubeChange(newCube.faces);
    }
    setShowColorDialog(false);
    setTempCubeState(null);
    setInputValues({});
    setSelectedFace(null);
  };

  const handleDialogClose = () => {
    setShowColorDialog(false);
    setTempCubeState(null);
    setInputValues({});
    setSelectedFace(null);
  };

  // Get current input value for display
  const getInputValue = (
    face: keyof RubiksCube["faces"],
    row: number,
    col: number
  ): string => {
    const key = `${face}-${row}-${col}`;
    return inputValues[key] || "";
  };

  // Get face name for display
  const getFaceName = (face: keyof RubiksCube["faces"]): string => {
    const faceNames = {
      U: "Up (Top)",
      D: "Down (Bottom)",
      F: "Front",
      B: "Back",
      L: "Left",
      R: "Right",
    };
    return faceNames[face] || face;
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

      {/* Color Selection Dialog */}
      {showColorDialog && tempCubeState && selectedFace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">
              Edit {getFaceName(selectedFace)} Face
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Type characters to change colors: <strong>R</strong>-Red,{" "}
              <strong>Y</strong>-Yellow, <strong>B</strong>-Blue,{" "}
              <strong>G</strong>-Green, <strong>W</strong>-White,{" "}
              <strong>O</strong>-Orange
            </p>

            {/* Single face representation */}
            <div className="flex justify-center mb-6">
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: "repeat(3, 3rem)",
                  gridTemplateRows: "repeat(3, 3rem)",
                }}
              >
                {Array.from({ length: 9 }).map((_, idx) => {
                  const row = Math.floor(idx / 3);
                  const col = idx % 3;
                  const currentChar = getInputValue(selectedFace, row, col);
                  const color = tempCubeState[selectedFace][row][col];

                  return (
                    <div key={idx} className="relative">
                      <input
                        type="text"
                        value={currentChar}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleInputChange(selectedFace, row, col, value);
                        }}
                        className={`w-12 h-12 text-center text-lg font-bold border-2 border-gray-400 ${getCubeColorClass(
                          color
                        )} rounded`}
                        maxLength={1}
                        style={{
                          color:
                            color === "white" || color === "yellow"
                              ? "#000"
                              : "#fff",
                          textShadow:
                            color === "white" || color === "yellow"
                              ? "none"
                              : "1px 1px 1px rgba(0,0,0,0.8)",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={handleDialogClose}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyChanges}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Apply Changes
              </button>
            </div>
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
