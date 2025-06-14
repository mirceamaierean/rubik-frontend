"use client";
import { useState, useRef } from "react";
import { RubiksCube, getCubeColorClass } from "@/utils/rubiksCube";
import { CubeColor } from "@/types/rubiksCube";
import Cube3D from "./Cube3D";
import ColorDialog, { charToColor, colorToChar } from "./ColorDialog";
import { HighlightedCubelet } from "@/utils/solver";
import ViewToggle from "./ViewToggle";

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
  is3D,
  onToggleView,
  highlightedCubelets = [],
}: {
  faces: RubiksCube["faces"];
  onCubeChange?: (faces: RubiksCube["faces"]) => void;
  is3D: boolean;
  onToggleView: () => void;
  highlightedCubelets?: HighlightedCubelet[];
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

  const gridRef = useRef<HTMLDivElement>(null);

  // Helper function to check if a cubelet should be highlighted
  const isCubeletHighlighted = (
    face: keyof RubiksCube["faces"],
    row: number,
    col: number,
  ): boolean => {
    return highlightedCubelets.some(
      (cubelet) =>
        cubelet.face === face && cubelet.row === row && cubelet.col === col,
    );
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

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <ViewToggle is3D={is3D} onToggle={onToggleView} />

      {is3D ? (
        <div className="w-96 h-96 flex items-center justify-center overflow-hidden rounded-lg border border-gray-600">
          <Cube3D faces={cube.faces} onFaceClick={handle3DFaceClick} />
        </div>
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
            const cell = getFaceCell(row, col);

            // Check if this cubelet should be highlighted
            const isHighlighted = cell
              ? isCubeletHighlighted(cell.face, cell.faceRow, cell.faceCol)
              : false;

            return color ? (
              <div
                key={idx}
                className={`border border-black ${getCubeColorClass(
                  color,
                )} rounded-md cursor-pointer relative ${
                  isHighlighted
                    ? "ring-4 ring-yellow-400 ring-opacity-80 shadow-lg shadow-yellow-400/50 animate-pulse"
                    : ""
                }`}
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
    </div>
  );
}
