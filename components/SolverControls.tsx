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
  SolverResult,
  HighlightedCubelet,
} from "@/utils/solver";

interface SolverControlsProps {
  cube: RubiksCube;
  onExecuteCommand: (command: Move) => void;
  onAlgorithmGenerated: (
    algorithm: Algorithm | null,
    highlightedCubelets?: HighlightedCubelet[],
    description?: string,
  ) => void;
}

export default function SolverControls({
  cube,
  onExecuteCommand,
  onAlgorithmGenerated,
}: SolverControlsProps) {
  const handleSolverResult = (result: SolverResult) => {
    if (result.algorithm && result.algorithm.length > 0) {
      onAlgorithmGenerated(
        result.algorithm,
        result.highlightedCubelets,
        result.description,
      );
      onExecuteCommand(result.algorithm);
    }
  };

  const handleSolveWhiteCross = () => {
    const result = solveWhiteCross(cube);
    handleSolverResult(result);
  };

  const handleInsertWhiteCorners = () => {
    const result = insertWhiteCorners(cube);
    handleSolverResult(result);
  };

  const handleSolveMiddleEdge = () => {
    const result = solveMiddleEdge(cube);
    handleSolverResult(result);
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
    <div className="grid grid-cols-4 gap-3 mt-4 max-w-4xl">
      <button
        onClick={handleSolveWhiteCross}
        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 text-sm"
      >
        Solve White Cross
      </button>
      <button
        onClick={handleInsertWhiteCorners}
        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 text-sm"
      >
        Insert White Corners
      </button>
      <button
        onClick={handleSolveMiddleEdge}
        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 text-sm"
      >
        Solve Middle Edge
      </button>
      <button
        onClick={handleMakeTopCross}
        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 text-sm"
      >
        Make Top Cross
      </button>
      <button
        onClick={handleSolveTopCorners}
        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 text-sm"
      >
        Solve Top Corners
      </button>
      <button
        onClick={handlePermuteTopCorners}
        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 text-sm"
      >
        Permute Top Corners
      </button>
      <button
        onClick={handleSolveLastLayer}
        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 text-sm"
      >
        Solve Last Layer
      </button>
    </div>
  );
}
