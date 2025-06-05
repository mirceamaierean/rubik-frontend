"use client";
import { useAlgorithmStore } from "@/stores/algorithmStore";

interface AlgorithmDisplayProps {
  title?: string;
}

export default function AlgorithmDisplay({
  title = "Algorithm",
}: AlgorithmDisplayProps) {
  const { currentAlgorithm: algorithm } = useAlgorithmStore();

  if (!algorithm) return null;

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg border">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <div className="bg-white p-3 rounded border font-mono text-lg">
        {algorithm.toString() || "No moves"}
      </div>
      <div className="mt-2 text-sm text-gray-600">
        Total moves: {algorithm.length}
      </div>
    </div>
  );
}
