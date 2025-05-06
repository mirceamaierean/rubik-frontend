import { RubiksCube } from "@/utils/rubiksCube";
import { Move } from "./move";

export class BMove extends Move {
  constructor(public prime: boolean = false) {
    super(prime);
  }

  execute(cube: RubiksCube) {
    if (!this.prime) {
      const u = cube.faces.U[0];
      const r = [cube.faces.R[0][2], cube.faces.R[1][2], cube.faces.R[2][2]];
      const l = [cube.faces.L[0][0], cube.faces.L[1][0], cube.faces.L[2][0]];
      const d = cube.faces.D[2];

      cube.faces.U[0] = r;

      cube.faces.L[0][0] = u[2];
      cube.faces.L[1][0] = u[1];
      cube.faces.L[2][0] = u[0];

      cube.faces.D[2] = l;

      cube.faces.R[0][2] = d[2];
      cube.faces.R[1][2] = d[1];
      cube.faces.R[2][2] = d[0];

      const oldB = cube.faces.B.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.B[j][2 - i] = oldB[i][j];
        }
      }
    } else {
      const u = cube.faces.U[0];
      const r = [cube.faces.R[2][2], cube.faces.R[1][2], cube.faces.R[0][2]];
      const l = [cube.faces.L[2][0], cube.faces.L[1][0], cube.faces.L[0][0]];
      const d = cube.faces.D[2];

      cube.faces.U[0] = l;

      cube.faces.R[0][2] = u[0];
      cube.faces.R[1][2] = u[1];
      cube.faces.R[2][2] = u[2];

      cube.faces.D[2] = r;

      cube.faces.L[2][0] = d[2];
      cube.faces.L[1][0] = d[1];
      cube.faces.L[0][0] = d[0];

      const oldB = cube.faces.B.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.B[2 - j][i] = oldB[i][j];
        }
      }
    }
  }
}
