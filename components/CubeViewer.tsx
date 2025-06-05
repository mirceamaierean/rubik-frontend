"use client";
import { useState, useRef } from "react";
import { RubiksCube, getCubeColorClass } from "@/utils/rubiksCube";
import { CubeColor, Face } from "@/types/rubiksCube";
import { Move } from "@/utils/commands/move";
import AlgorithmControls from "./AlgorithmControls";
import Cube3D from "./Cube3D";
import ColorDialog, { charToColor, colorToChar } from "./ColorDialog";
import SolverControls from "./SolverControls";
import ManualMoveControls from "./ManualMoveControls";
import AlgorithmDisplay from "./AlgorithmDisplay";
import ImageUploadModal from "./ImageUploadModal";
import { Algorithm } from "@/utils/commands/algorithm";
import { useAlgorithmStore } from "@/stores/algorithmStore";

const GRID_SIZE = 9;
const GRID_COLS = 12;

function getFaceCell(
  row: number,
  col: number,
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

  const [showColorDialog, setShowColorDialog] = useState(false);
  const [tempCubeState, setTempCubeState] = useState<
    RubiksCube["faces"] | null
  >(null);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [selectedFace, setSelectedFace] = useState<
    keyof RubiksCube["faces"] | null
  >(null);

  // Use Zustand store for algorithm and view state
  const {
    currentAlgorithm,
    setCurrentAlgorithm,
    clearAlgorithm,
    is3D,
    toggleView,
  } = useAlgorithmStore();

  const [showImageUpload, setShowImageUpload] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const resetCube = () => {
    const solvedCube = RubiksCube.solved();
    setCube(solvedCube);
    clearAlgorithm();
    if (onCubeChange) onCubeChange(solvedCube.faces);
  };

  const executeCommand = (command: Move) => {
    const newCube = cube.clone();
    command.execute(newCube);
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

  const handle3DFaceClick = (face: keyof RubiksCube["faces"]) => {
    const cubeState = JSON.parse(JSON.stringify(cube.faces)); // Deep copy
    setTempCubeState(cubeState);
    setSelectedFace(face);
    setShowColorDialog(true);

    // Initialize input values for the selected face only
    const newInputValues: { [key: string]: string } = {};
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const key = `${face}-${i}-${j}`;
        const color = cubeState[face][i][j];
        newInputValues[key] = colorToChar[color] || "";
      }
    }
    setInputValues(newInputValues);
  };

  const handleInputChange = (
    face: keyof RubiksCube["faces"],
    row: number,
    col: number,
    value: string,
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

  const handleCubeDetected = (faces: Array<Array<Array<string>>>) => {
    const newCube = new RubiksCube();

    for (const face of faces) {
      const centerColor = face[1][1];
      const faceName = cube.findFaceWithCenterColor(centerColor as CubeColor);

      newCube.setFace(faceName, face as Face);
    }

    setCube(newCube);
    if (onCubeChange) onCubeChange(newCube.faces);
  };

  const handleAlgorithmGenerated = (algorithm: Algorithm | null) => {
    setCurrentAlgorithm(algorithm);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center py-8">
      <div className="mb-4">
        <button
          onClick={toggleView}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Switch to {is3D ? "2D" : "3D"} View
        </button>
        <button
          onClick={resetCube}
          className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset Cube
        </button>
        <button
          onClick={() => setShowImageUpload(true)}
          className="ml-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Upload Images
        </button>
      </div>

      {is3D ? (
        <Cube3D faces={cube.faces} onFaceClick={handle3DFaceClick} />
      ) : (
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
                  color,
                )} rounded-md cursor-pointer`}
                onClick={() => handleCellClick(row, col)}
              />
            ) : (
              <div key={idx} />
            );
          })}
        </div>
      )}

      <ColorDialog
        isOpen={showColorDialog}
        selectedFace={selectedFace}
        tempCubeState={tempCubeState}
        inputValues={inputValues}
        onInputChange={handleInputChange}
        onApply={handleApplyChanges}
        onClose={handleDialogClose}
      />

      <SolverControls
        cube={cube}
        onExecuteCommand={executeCommand}
        onAlgorithmGenerated={handleAlgorithmGenerated}
      />

      <ManualMoveControls onExecuteCommand={executeCommand} />

      <AlgorithmControls onAlgorithm={executeCommand} />

      <AlgorithmDisplay title="Generated Algorithm" />

      <ImageUploadModal
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onCubeDetected={handleCubeDetected}
      />
    </div>
  );
}
