"use client";
import { useState } from "react";
import CubeViewer from "@/components/CubeViewer";
import { RubiksCube } from "@/utils/rubiksCube";

export default function CubePage() {
  const [cubeFaces, setCubeFaces] = useState(RubiksCube.solved().faces);
  const cubeKey = JSON.stringify(cubeFaces);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#151e29]">
      <div className="w-full max-w-6xl py-12">
        <CubeViewer
          key={cubeKey}
          faces={cubeFaces}
          onCubeChange={setCubeFaces}
        />
      </div>
    </div>
  );
}
