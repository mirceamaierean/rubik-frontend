export type CubeColor =
  | "red"
  | "orange"
  | "blue"
  | "green"
  | "yellow"
  | "white";
export type Face = CubeColor[][]; // 3x3 array

export interface RubiksCube {
  faces: {
    U: Face; // Up
    D: Face; // Down
    F: Face; // Front
    B: Face; // Back
    L: Face; // Left
    R: Face; // Right
  };
}
