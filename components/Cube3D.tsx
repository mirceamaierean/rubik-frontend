"use client";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RubiksCube } from "@/utils/rubiksCube";

// Individual cubelet component
function Cubelet({
  position,
  colors,
  onFaceClick,
}: {
  position: [number, number, number];
  colors: { [key: string]: string };
  onFaceClick: (face: keyof RubiksCube["faces"]) => void;
}) {
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();

    // Get the face that was clicked based on the face index
    const faceIndex = event.faceIndex;
    if (faceIndex === undefined || faceIndex === null) return;

    const materialIndex = Math.floor(faceIndex / 2);

    const [x, y, z] = position;

    let clickedFace: keyof RubiksCube["faces"] | null = null;

    switch (materialIndex) {
      case 0: // Right face
        if (x === 1) clickedFace = "R";
        break;
      case 1: // Left face
        if (x === -1) clickedFace = "L";
        break;
      case 2: // Top face
        if (y === 1) clickedFace = "U";
        break;
      case 3: // Bottom face
        if (y === -1) clickedFace = "D";
        break;
      case 4: // Front face
        if (z === 1) clickedFace = "F";
        break;
      case 5: // Back face
        if (z === -1) clickedFace = "B";
        break;
    }

    if (clickedFace) {
      onFaceClick(clickedFace);
    }
  };

  return (
    <mesh position={position} onClick={handleClick}>
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      {/* Right face */}
      <meshStandardMaterial
        attach="material-0"
        color={colors.right || "#000000"}
      />
      {/* Left face */}
      <meshStandardMaterial
        attach="material-1"
        color={colors.left || "#000000"}
      />
      {/* Top face */}
      <meshStandardMaterial
        attach="material-2"
        color={colors.top || "#000000"}
      />
      {/* Bottom face */}
      <meshStandardMaterial
        attach="material-3"
        color={colors.bottom || "#000000"}
      />
      {/* Front face */}
      <meshStandardMaterial
        attach="material-4"
        color={colors.front || "#000000"}
      />
      {/* Back face */}
      <meshStandardMaterial
        attach="material-5"
        color={colors.back || "#000000"}
      />
    </mesh>
  );
}

// Function to get the colors for a cubelet at a specific 3D position
function getCubeletColors(
  x: number,
  y: number,
  z: number,
  faces: RubiksCube["faces"],
): { [key: string]: string } {
  const colors: { [key: string]: string } = {};

  // Each face array represents what you see when looking straight at that face
  // Fix mirroring by adjusting coordinate mapping

  // Front face (z = 1) - looking straight at it
  if (z === 1) {
    const row = 1 - y; // y=1 (top) -> row=0, y=-1 (bottom) -> row=2
    const col = 1 + x; // x=-1 (left) -> col=0, x=1 (right) -> col=2
    colors.front = faces.F[row][col];
  }

  // Back face (z = -1) - looking straight at it (from behind)
  if (z === -1) {
    const row = 1 - y; // y=1 (top) -> row=0, y=-1 (bottom) -> row=2
    const col = 1 - x; // Flip horizontally: x=1 (right from behind) -> col=0, x=-1 (left from behind) -> col=2
    colors.back = faces.B[row][col];
  }

  // Right face (x = 1) - looking straight at it (from the right side)
  if (x === 1) {
    const row = 1 - y; // y=1 (top) -> row=0, y=-1 (bottom) -> row=2
    const col = 1 - z; // Flip z mapping to fix mirroring
    colors.right = faces.R[row][col];
  }

  // Left face (x = -1) - looking straight at it (from the left side)
  if (x === -1) {
    const row = 1 - y; // y=1 (top) -> row=0, y=-1 (bottom) -> row=2
    const col = 1 + z; // Flip z mapping to fix mirroring
    colors.left = faces.L[row][col];
  }

  // Top face (y = 1) - looking down at it
  if (y === 1) {
    const row = 1 + z; // Flip z mapping to fix mirroring
    const col = 1 + x; // x=-1 (left when looking down) -> col=0, x=1 (right when looking down) -> col=2
    colors.top = faces.U[row][col];
  }

  // Bottom face (y = -1) - looking up at it
  if (y === -1) {
    const row = 1 - z; // Flip z mapping to fix mirroring
    const col = 1 + x; // x=-1 (left when looking up) -> col=0, x=1 (right when looking up) -> col=2
    colors.bottom = faces.D[row][col];
  }

  return colors;
}

// Function to convert color names to hex values
function getColorHex(colorName: string): string {
  const colorMap: { [key: string]: string } = {
    white: "#ffffff",
    yellow: "#ffff00",
    red: "#ff0000",
    orange: "#ff8000",
    blue: "#0000ff",
    green: "#00ff00",
  };
  return colorMap[colorName] || "#000000";
}

export default function Cube3D({
  faces,
  onFaceClick,
}: {
  faces: RubiksCube["faces"];
  onFaceClick?: (face: keyof RubiksCube["faces"]) => void;
}) {
  // Generate 27 cubelets in a 3x3x3 configuration
  const cubelets = [];

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const position: [number, number, number] = [x, y, z];
        const colors = getCubeletColors(x, y, z, faces);

        // Convert color names to hex values
        const hexColors: { [key: string]: string } = {};
        Object.keys(colors).forEach((key) => {
          hexColors[key] = getColorHex(colors[key]);
        });

        cubelets.push(
          <Cubelet
            key={`${x}-${y}-${z}`}
            position={position}
            colors={hexColors}
            onFaceClick={onFaceClick || (() => {})}
          />,
        );
      }
    }
  }

  return (
    <div className="w-full h-[600px]">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Camera controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          screenSpacePanning={false}
          minDistance={3}
          maxDistance={20}
          maxPolarAngle={Math.PI}
        />

        {/* Render all cubelets */}
        {cubelets}
      </Canvas>
    </div>
  );
}
