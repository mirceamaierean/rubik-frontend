"use client";
import { useEffect, useState } from "react";
import CubeViewer from "@/components/CubeViewer";
import { RubiksCube } from "@/utils/rubiksCube";
import React from "react";
import { convertScrambleToAlgorithm, getCube } from "@/services/CubeService";

export default function CubeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  const [cubeData, setCubeData] = useState<{
    description?: string;
    scramble: string;
  } | null>(null);
  const cube = RubiksCube.solved();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cubeFaces, setCubeFaces] = useState<RubiksCube["faces"] | null>(null);
  const [is3D, setIs3D] = useState<boolean>(false);

  useEffect(() => {
    const fetchCube = async () => {
      setLoading(true);
      setError(null);
      try {
        const cube = await getCube(unwrappedParams.id);
        const algorithm = await convertScrambleToAlgorithm(cube.scramble);
        console.log(algorithm.toString());
        const newCube = RubiksCube.solved();
        algorithm.execute(newCube);
        setCubeData(cube);
        setCubeFaces(newCube.faces);
      } catch {
        setError("Could not load cube.");
      } finally {
        setLoading(false);
      }
    };
    fetchCube();
  }, [unwrappedParams.id]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }
  if (error || !cubeData) {
    return (
      <div className="p-8 text-center text-red-500">
        {error || "Cube not found."}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4">Cube Details</h1>
      <div className="mb-2 text-gray-700">
        <span className="font-semibold">Description:</span>{" "}
        {cubeData.description || (
          <span className="italic text-gray-400">No description</span>
        )}
      </div>
      <div className="mb-4 text-gray-700">
        <span className="font-semibold">Scramble:</span>{" "}
        <span className="font-mono text-blue-700">{cubeData.scramble}</span>
      </div>
      {cubeFaces && (
        <CubeViewer
          faces={cubeFaces}
          onCubeChange={() => {}}
          is3D={is3D}
          onToggleView={() => setIs3D((v) => !v)}
        />
      )}
      {/* Optionally, you can add AlgorithmDisplay or other components here */}
    </div>
  );
}
