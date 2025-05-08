import { RubiksCube } from "@/utils/rubiksCube";
import { Move } from "./move";

export class UMove extends Move {
  constructor(public prime: boolean = false) {
    super(prime);
  }

  execute(cube: RubiksCube) {
    const r = cube.faces.R[0];
    const f = cube.faces.F[0];
    const b = cube.faces.B[0];
    const l = cube.faces.L[0];
    if (!this.prime) {
      cube.faces.F[0] = r;
      cube.faces.R[0] = b;
      cube.faces.B[0] = l;
      cube.faces.L[0] = f;

      const oldU = cube.faces.U.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.U[j][2 - i] = oldU[i][j];
        }
      }
    } else {
      cube.faces.F[0] = l;
      cube.faces.R[0] = f;
      cube.faces.B[0] = r;
      cube.faces.L[0] = b;

      const oldU = cube.faces.U.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.U[2 - j][i] = oldU[i][j];
        }
      }
    }
  }

  // Optionally implement undo for R'
  undo(cube: RubiksCube) {}
}
