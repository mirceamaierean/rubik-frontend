"use client";
import { useState } from "react";
import CubeViewer from "@/components/CubeViewer";
import PhotoUploadForm from "@/components/ImageUpload";
import { RubiksCube } from "@/utils/rubiksCube";

export default function CubePage() {
  const [cubeFaces, setCubeFaces] = useState(RubiksCube.solved().faces);
  // Use a key that changes when cubeFaces changes, to force CubeViewer to reset
  const cubeKey = JSON.stringify(cubeFaces);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#151e29]">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-8 py-12">
        <div className="flex-1 flex justify-center">
          <CubeViewer key={cubeKey} faces={cubeFaces} />
        </div>
        <div className="flex-1 flex justify-center">
          <PhotoUploadForm onCubeDetected={setCubeFaces} />
        </div>
      </div>
    </div>
  );
}
