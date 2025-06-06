"use client";
import { useState } from "react";
import CubeViewer from "@/components/CubeViewer";
import AlgorithmDisplay from "@/components/AlgorithmDisplay";
import SolverControls from "@/components/SolverControls";
import ManualMoveControls from "@/components/ManualMoveControls";

import ImageUploadModal from "@/components/ImageUploadModal";
import { RubiksCube } from "@/utils/rubiksCube";
import { Algorithm } from "@/utils/commands/algorithm";
import { Move } from "@/utils/commands/move";
import { CubeColor, Face } from "@/types/rubiksCube";
import { getFastestSolution } from "@/services/CubeService";
import { HighlightedCubelet } from "@/utils/solver";

interface AlgorithmHistoryEntry {
  algorithm: Algorithm;
  description?: string;
  timestamp: number;
}

export default function CubePage() {
  const [cubeFaces, setCubeFaces] = useState(RubiksCube.solved().faces);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<Algorithm | null>(
    null,
  );
  const [algorithmHistory, setAlgorithmHistory] = useState<
    AlgorithmHistoryEntry[]
  >([]);
  const [is3D, setIs3D] = useState(false);
  const [highlightedCubelets, setHighlightedCubelets] = useState<
    HighlightedCubelet[]
  >([]);
  const [currentDescription, setCurrentDescription] = useState<string>("");
  const cubeKey = JSON.stringify(cubeFaces);

  // Create cube instance for passing to controls
  const cube = new RubiksCube(cubeFaces);

  const handleAlgorithmGenerated = (
    algorithm: Algorithm | null,
    highlightedCubelets?: HighlightedCubelet[],
    description?: string,
  ) => {
    setHighlightedCubelets(highlightedCubelets || []);
    setCurrentDescription(description || "");

    if (algorithm && algorithm.length > 0) {
      const historyEntry: AlgorithmHistoryEntry = {
        algorithm,
        description,
        timestamp: Date.now(),
      };
      setAlgorithmHistory((prev) => [historyEntry, ...prev]);
    }
  };

  const executeCommand = (command: Move) => {
    const newCube = cube.clone();
    command.execute(newCube);
    setCubeFaces(newCube.faces);

    // Clear highlighting after executing a command
    setHighlightedCubelets([]);
    setCurrentDescription("");
  };

  const handleCubeDetected = (faces: Array<Array<Array<string>>>) => {
    const newCube = new RubiksCube();

    for (const face of faces) {
      const centerColor = face[1][1];
      const faceName = cube.findFaceWithCenterColor(centerColor as CubeColor);

      newCube.setFace(faceName, face as Face);
    }

    setCubeFaces(newCube.faces);
  };

  const handleFastestSolution = async () => {
    const algorithm = await getFastestSolution(
      cube.getKociembaRepresentation(),
    );
    setCurrentAlgorithm(algorithm);
    executeCommand(algorithm);
  };

  const resetCube = () => {
    const solvedCube = RubiksCube.solved();
    setCubeFaces(solvedCube.faces);
    setCurrentAlgorithm(null);
    setAlgorithmHistory([]);
    setHighlightedCubelets([]);
    setCurrentDescription("");
  };

  const toggleView = () => {
    setIs3D(!is3D);
  };

  const clearAlgorithmHistory = () => {
    setAlgorithmHistory([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#151e29]">
      <div className="w-full max-w-7xl py-12 px-4">
        <div className="mb-4 text-center">
          <button
            onClick={resetCube}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reset Cube
          </button>
          <button
            onClick={() => setShowImageUpload(true)}
            className="ml-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Upload Images
          </button>
          <button
            onClick={handleFastestSolution}
            className="ml-2 px-4 py-2 bg-green-800 text-white rounded hover:bg-green-900"
          >
            Fastest Solution
          </button>
        </div>

        {/* Main content area with cube and algorithm display side by side */}
        <div className="flex gap-8 items-start">
          {/* Left side - Cube viewer and controls */}
          <div className="flex-1">
            <CubeViewer
              key={cubeKey}
              faces={cubeFaces}
              onCubeChange={setCubeFaces}
              is3D={is3D}
              onToggleView={toggleView}
              highlightedCubelets={highlightedCubelets}
            />

            {/* Control components below cube */}
            <div className="mt-6 space-y-4">
              <SolverControls
                cube={cube}
                onExecuteCommand={executeCommand}
                onAlgorithmGenerated={handleAlgorithmGenerated}
              />

              <ManualMoveControls onExecuteCommand={executeCommand} />
            </div>
          </div>

          {/* Right side - Algorithm display - made much taller */}
          <div className="w-96 h-[700px]">
            <AlgorithmDisplay
              currentAlgorithm={currentAlgorithm}
              algorithmHistory={algorithmHistory.map(
                (entry) => entry.algorithm,
              )}
              onClearHistory={clearAlgorithmHistory}
              currentDescription={currentDescription}
              algorithmHistoryEntries={algorithmHistory}
            />
          </div>
        </div>

        {/* Image upload modal */}
        <ImageUploadModal
          isOpen={showImageUpload}
          onClose={() => setShowImageUpload(false)}
          onCubeDetected={handleCubeDetected}
        />
      </div>
    </div>
  );
}
