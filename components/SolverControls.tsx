"use client";
import { RubiksCube } from "@/utils/rubiksCube";
import { Move } from "@/utils/commands/move";
import { Algorithm } from "@/utils/commands/algorithm";
import {
  solveWhiteCross,
  insertWhiteCorners,
  solveMiddleEdge,
  makeTopCross,
  solveTopCorners,
  permuteTopEdges,
  permuteTopCorners,
} from "@/utils/solver";

interface SolverControlsProps {
  cube: RubiksCube;
  onExecuteCommand: (command: Move) => void;
  onAlgorithmGenerated: (algorithm: Algorithm | null) => void;
}

export default function SolverControls({
  cube,
  onExecuteCommand,
  onAlgorithmGenerated,
}: SolverControlsProps) {
  const handleSolveWhiteCross = () => {
    const algorithm = solveWhiteCross(cube);
    if (algorithm) {
      onAlgorithmGenerated(algorithm);
      onExecuteCommand(algorithm);
    }
  };

  const handleInsertWhiteCorners = () => {
    const algorithm = insertWhiteCorners(cube);
    if (algorithm) {
      onAlgorithmGenerated(algorithm);
      onExecuteCommand(algorithm);
    }
  };

  const handleSolveMiddleEdge = () => {
    const algorithm = solveMiddleEdge(cube);
    if (algorithm) {
      onAlgorithmGenerated(algorithm);
      onExecuteCommand(algorithm);
    }
  };

  const handleMakeTopCross = () => {
    const algorithm = makeTopCross(cube);
    if (algorithm) {
      onAlgorithmGenerated(algorithm);
      onExecuteCommand(algorithm);
    }
  };

  const handleSolveTopCorners = () => {
    const algorithm = solveTopCorners(cube);
    if (algorithm) {
      onAlgorithmGenerated(algorithm);
      onExecuteCommand(algorithm);
    }
  };

  const handlePermuteTopCorners = () => {
    const algorithm = permuteTopCorners(cube);
    if (algorithm) {
      onAlgorithmGenerated(algorithm);
      onExecuteCommand(algorithm);
    }
  };

  const handleSolveLastLayer = () => {
    const algorithm = permuteTopEdges(cube);
    if (algorithm) {
      onAlgorithmGenerated(algorithm);
      onExecuteCommand(algorithm);
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={handleSolveWhiteCross}
        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
      >
        Solve White Cross
      </button>
      <button
        onClick={handleInsertWhiteCorners}
        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
      >
        Insert White Corners
      </button>
      <button
        onClick={handleSolveMiddleEdge}
        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
      >
        Solve Middle Edge
      </button>
      <button
        onClick={handleMakeTopCross}
        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
      >
        Make Top Cross
      </button>
      <button
        onClick={handleSolveTopCorners}
        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
      >
        Solve Top Corners
      </button>
      <button
        onClick={handlePermuteTopCorners}
        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
      >
        Permute Top Corners
      </button>
      <button
        onClick={handleSolveLastLayer}
        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
      >
        Solve Last Layer
      </button>
    </div>
  );
}
