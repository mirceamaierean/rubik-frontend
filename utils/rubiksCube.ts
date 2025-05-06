import { CubeColor, Face } from "@/types/rubiksCube";

export class RubiksCube {
  faces: {
    U: Face;
    D: Face;
    F: Face;
    B: Face;
    L: Face;
    R: Face;
  };

  constructor(faces?: Partial<RubiksCube["faces"]>) {
    this.faces = {
      U: RubiksCube.createFace("yellow"),
      D: RubiksCube.createFace("white"),
      F: RubiksCube.createFace("red"),
      B: RubiksCube.createFace("orange"),
      L: RubiksCube.createFace("blue"),
      R: RubiksCube.createFace("green"),
      ...faces,
    };
  }

  static createFace(color: CubeColor): Face {
    return Array(3)
      .fill(null)
      .map(() => Array(3).fill(color));
  }

  static solved(): RubiksCube {
    return new RubiksCube();
  }

  setFace(face: keyof RubiksCube["faces"], color: CubeColor) {
    this.faces[face] = RubiksCube.createFace(color);
  }

  clone(): RubiksCube {
    return new RubiksCube(this.faces);
  }
}

export function getCubeColorClass(color: string) {
  switch (color) {
    case "white":
      return "bg-white";
    case "yellow":
      return "bg-yellow-300";
    case "red":
      return "bg-red-600";
    case "orange":
      return "bg-orange-500";
    case "blue":
      return "bg-blue-700";
    case "green":
      return "bg-green-600";
    default:
      return "bg-gray-200";
  }
}
