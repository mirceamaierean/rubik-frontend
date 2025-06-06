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

  paintFace(face: keyof RubiksCube["faces"], color: CubeColor) {
    this.faces[face] = RubiksCube.createFace(color);
  }

  setFace(face: keyof RubiksCube["faces"], faceData: Face) {
    this.faces[face] = faceData;
  }

  findFaceWithCenterColor(color: CubeColor): keyof RubiksCube["faces"] {
    if (this.faces.U[1][1] === color) {
      return "U";
    }
    if (this.faces.D[1][1] === color) {
      return "D";
    }
    if (this.faces.F[1][1] === color) {
      return "F";
    }
    if (this.faces.B[1][1] === color) {
      return "B";
    }
    if (this.faces.L[1][1] === color) {
      return "L";
    }
    return "R";
  }

  clone(): RubiksCube {
    const clonedFaces = {
      U: this.faces.U.map((row) => [...row]),
      D: this.faces.D.map((row) => [...row]),
      F: this.faces.F.map((row) => [...row]),
      B: this.faces.B.map((row) => [...row]),
      L: this.faces.L.map((row) => [...row]),
      R: this.faces.R.map((row) => [...row]),
    };
    return new RubiksCube(clonedFaces);
  }

  getFaceForKociemba(face: Face, colorMap: Record<CubeColor, string>): string {
    return face
      .map((row) => row.map((color) => colorMap[color]).join(""))
      .join("");
  }

  getKociembaRepresentation(): string {
    // A cube is defined by its cube definition string.
    // A solved cube has the string 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'.
    const colorMap = {
      yellow: "U",
      white: "D",
      red: "F",
      orange: "B",
      green: "R",
      blue: "L",
    };

    let kociembaRepresentation = "";
    kociembaRepresentation += this.getFaceForKociemba(this.faces.U, colorMap);
    kociembaRepresentation += this.getFaceForKociemba(this.faces.R, colorMap);
    kociembaRepresentation += this.getFaceForKociemba(this.faces.F, colorMap);
    kociembaRepresentation += this.getFaceForKociemba(this.faces.D, colorMap);
    kociembaRepresentation += this.getFaceForKociemba(this.faces.L, colorMap);
    kociembaRepresentation += this.getFaceForKociemba(this.faces.B, colorMap);

    return kociembaRepresentation;
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
