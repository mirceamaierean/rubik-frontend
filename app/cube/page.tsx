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
import { getFastestSolution } from "@/services/CubeService";
import { HighlightedCubelet } from "@/utils/solver";
import { Face } from "@/types/rubiksCube";

interface AlgorithmHistoryEntry {
  algorithm: Algorithm;
  description?: string;
  timestamp: number;
}

export default function CubePage() {
  const [cubeFaces, setCubeFaces] = useState(RubiksCube.solved().faces);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<Algorithm | null>(
    null
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
    description?: string
  ) => {
    setHighlightedCubelets(highlightedCubelets || []);
    setCurrentDescription(description || "");

    // Set the current algorithm to display it in the "Current Algorithm" section
    setCurrentAlgorithm(algorithm);

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

    // order of photos is: Front, Right, Back, Left, Up, Down
    // so we need to set the faces in the order of the photos
    const faceOrder = ["F", "R", "B", "L", "U", "D"];
    for (const faceName of faceOrder) {
      console.log(faceName, faces[faceOrder.indexOf(faceName)] as Face);
      newCube.setFace(
        faceName as keyof RubiksCube["faces"],
        faces[faceOrder.indexOf(faceName)] as Face
      );
    }

    console.log(newCube);

    setCubeFaces(newCube.faces);
  };

  const handleFastestSolution = async () => {
    const algorithm = await getFastestSolution(
      cube.getKociembaRepresentation()
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
        <div className="mb-8 flex justify-center">
          <div className="flex flex-wrap gap-4 p-4 bg-[#1e2937] rounded-2xl shadow-xl border border-gray-700/50">
            <button
              onClick={resetCube}
              className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/25 hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset Cube
            </button>

            <button
              onClick={() => setShowImageUpload(true)}
              className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Upload Images
            </button>

            <button
              onClick={handleFastestSolution}
              className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Fastest Solution
            </button>
          </div>
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
                (entry) => entry.algorithm
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
