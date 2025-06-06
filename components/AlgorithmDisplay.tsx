"use client";
import { Algorithm } from "@/utils/commands/algorithm";

interface AlgorithmHistoryEntry {
  algorithm: Algorithm;
  description?: string;
  timestamp: number;
}

interface AlgorithmDisplayProps {
  currentAlgorithm: Algorithm | null;
  algorithmHistory: Algorithm[];
  onClearHistory: () => void;
  currentDescription?: string;
  algorithmHistoryEntries?: AlgorithmHistoryEntry[];
}

export default function AlgorithmDisplay({
  currentAlgorithm,
  algorithmHistory,
  onClearHistory,
  currentDescription,
  algorithmHistoryEntries = [],
}: AlgorithmDisplayProps) {
  // Use the detailed history entries if available, otherwise fall back to basic algorithms
  const historyToDisplay =
    algorithmHistoryEntries.length > 0
      ? algorithmHistoryEntries
      : algorithmHistory.map((alg) => ({
          algorithm: alg,
          timestamp: 0,
          description: undefined,
        }));

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white rounded-lg shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">🧩</span>
          Algorithms
        </h2>
      </div>

      {/* Current Algorithm Section */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Current
        </h3>
        {currentAlgorithm ? (
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
            {/* Show description of targeted piece */}
            {currentDescription && (
              <div className="mb-3 p-2 bg-blue-900/50 border border-blue-600/50 rounded text-xs text-blue-200">
                <div className="flex items-center mb-1">
                  <span className="mr-1">🎯</span>
                  <span className="font-semibold">Target Piece:</span>
                </div>
                <div className="text-blue-100">{currentDescription}</div>
              </div>
            )}

            <div className="font-mono text-sm text-green-400 mb-2 break-all leading-relaxed">
              {currentAlgorithm.toString() || "No moves"}
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
              {currentAlgorithm.length} moves
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 border border-dashed border-gray-600 rounded-lg p-3 text-gray-400 text-center">
            <div className="text-2xl mb-1">⏳</div>
            <div className="text-xs">No algorithm yet</div>
          </div>
        )}
      </div>

      {/* Algorithm History Section */}
      <div className="flex-1 flex flex-col p-4 min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-200 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            History
            {historyToDisplay.length > 0 && (
              <span className="ml-2 bg-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                {historyToDisplay.length}
              </span>
            )}
          </h3>
          {historyToDisplay.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200 flex items-center"
            >
              <span className="mr-1">🗑️</span>
              Clear
            </button>
          )}
        </div>

        {historyToDisplay.length > 0 ? (
          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {historyToDisplay.map((entry, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-600 rounded-lg p-2 hover:bg-gray-750 transition-colors duration-200 shadow-sm"
              >
                {/* Show description if available */}
                {entry.description && (
                  <div className="mb-2 p-1.5 bg-blue-900/30 border border-blue-600/30 rounded text-xs text-blue-200">
                    <div className="flex items-center">
                      <span className="mr-1">🎯</span>
                      <span className="text-blue-100 text-xs">
                        {entry.description}
                      </span>
                    </div>
                  </div>
                )}

                <div className="font-mono text-xs text-gray-200 mb-1 break-all leading-relaxed">
                  {entry.algorithm.toString() || "No moves"}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-400">
                    <span className="w-1 h-1 bg-gray-500 rounded-full mr-1"></span>
                    {entry.algorithm.length} moves
                  </div>
                  <div className="text-xs text-gray-500">
                    #{historyToDisplay.length - index}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-dashed border-gray-600 rounded-lg p-8 text-gray-400 text-center w-full">
              <div className="text-4xl mb-4">📝</div>
              <div className="text-sm mb-2">No algorithms in history</div>
              <div className="text-xs text-gray-500">
                Generated algorithms will appear here
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
