"use client";
import { RubiksCube, getCubeColorClass } from "@/utils/rubiksCube";

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

interface ColorDialogProps {
  isOpen: boolean;
  selectedFace: keyof RubiksCube["faces"] | null;
  tempCubeState: RubiksCube["faces"] | null;
  inputValues: { [key: string]: string };
  onInputChange: (
    face: keyof RubiksCube["faces"],
    row: number,
    col: number,
    value: string,
  ) => void;
  onApply: () => void;
  onClose: () => void;
}

export default function ColorDialog({
  isOpen,
  selectedFace,
  tempCubeState,
  inputValues,
  onInputChange,
  onApply,
  onClose,
}: ColorDialogProps) {
  if (!isOpen || !selectedFace || !tempCubeState) return null;

  // Get current input value for display
  const getInputValue = (
    face: keyof RubiksCube["faces"],
    row: number,
    col: number,
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">
          Edit {getFaceName(selectedFace)} Face
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Type characters to change colors: <strong>R</strong>-Red,{" "}
          <strong>Y</strong>-Yellow, <strong>B</strong>-Blue, <strong>G</strong>
          -Green, <strong>W</strong>-White, <strong>O</strong>-Orange
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
                      onInputChange(selectedFace, row, col, value);
                    }}
                    className={`w-12 h-12 text-center text-lg font-bold border-2 border-gray-400 ${getCubeColorClass(
                      color,
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
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export { charToColor, colorToChar };
