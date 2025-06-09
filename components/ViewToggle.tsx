interface ViewToggleProps {
  is3D: boolean;
  onToggle: () => void;
}

export default function ViewToggle({ is3D, onToggle }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className={`text-sm font-medium transition-colors ${
          !is3D ? "text-blue-600" : "text-gray-400"
        }`}
      >
        2D
      </span>

      <button
        onClick={onToggle}
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700"
        role="switch"
        aria-checked={is3D}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-lg ${
            is3D ? "translate-x-6" : "translate-x-1"
          }`}
        />
        <span className="sr-only">Toggle view mode</span>
      </button>

      <span
        className={`text-sm font-medium transition-colors ${
          is3D ? "text-blue-600" : "text-gray-400"
        }`}
      >
        3D
      </span>

      {/* Optional: Add icons */}
      <div className="flex items-center gap-2 ml-2">
        <div
          className={`p-1 rounded transition-colors ${
            !is3D ? "bg-blue-100 text-blue-600" : "text-gray-400"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
        </div>
        <div
          className={`p-1 rounded transition-colors ${
            is3D ? "bg-blue-100 text-blue-600" : "text-gray-400"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
