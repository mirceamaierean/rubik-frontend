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

  // getTopNeighborFace(face: keyof RubiksCube["faces"]) {
  //   switch (face) {
  //     case "U":
  //       return "B";
  //     case "D":
  //       return "F";
  //     default:
  //       return "U";
  //   }
  // }

  // getBottomNeighborFace(face: keyof RubiksCube["faces"]) {
  //   switch (face) {
  //     case "U":
  //       return "F";
  //     case "D":
  //       return "B";
  //     default:
  //       return "D";
  //   }
  // }

  // getLeftNeighborFace(face: keyof RubiksCube["faces"]) {
  //   switch (face) {
  //     case "L":
  //       return "B";
  //     case "B":
  //       return "R";
  //     case "R":
  //       return "F";
  //     default:
  //       return "L";
  //   }
  // }

  // getRightNeighborFace(face: keyof RubiksCube["faces"]) {
  //   switch (face) {
  //     case "L":
  //       return "F";
  //     case "R":
  //       return "B";
  //     case "B":
  //       return "L";
  //     default:
  //       return "R";
  //   }
  // }
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
