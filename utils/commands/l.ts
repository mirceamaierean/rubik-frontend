import { RubiksCube } from "@/utils/rubiksCube";
import { Move } from "./move";

export class LMove extends Move {
  constructor(public prime: boolean = false) {
    super(prime);
  }

  execute(cube: RubiksCube) {
    const u = [cube.faces.U[0][0], cube.faces.U[1][0], cube.faces.U[2][0]];
    const f = [cube.faces.F[0][0], cube.faces.F[1][0], cube.faces.F[2][0]];
    const d = [cube.faces.D[0][0], cube.faces.D[1][0], cube.faces.D[2][0]];
    const b = [cube.faces.B[0][2], cube.faces.B[1][2], cube.faces.B[2][2]];
    if (!this.prime) {
      cube.faces.U[0][0] = b[2];
      cube.faces.U[1][0] = b[1];
      cube.faces.U[2][0] = b[0];

      cube.faces.F[0][0] = u[0];
      cube.faces.F[1][0] = u[1];
      cube.faces.F[2][0] = u[2];

      cube.faces.D[0][0] = f[0];
      cube.faces.D[1][0] = f[1];
      cube.faces.D[2][0] = f[2];

      cube.faces.B[0][2] = d[2];
      cube.faces.B[1][2] = d[1];
      cube.faces.B[2][2] = d[0];

      const oldL = cube.faces.L.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.L[j][2 - i] = oldL[i][j];
        }
      }
    } else {
      cube.faces.U[0][0] = f[0];
      cube.faces.U[1][0] = f[1];
      cube.faces.U[2][0] = f[2];

      cube.faces.F[0][0] = d[0];
      cube.faces.F[1][0] = d[1];
      cube.faces.F[2][0] = d[2];

      cube.faces.D[0][0] = b[2];
      cube.faces.D[1][0] = b[1];
      cube.faces.D[2][0] = b[0];

      cube.faces.B[0][2] = u[2];
      cube.faces.B[1][2] = u[1];
      cube.faces.B[2][2] = u[0];

      const oldL = cube.faces.L.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.L[2 - j][i] = oldL[i][j];
        }
      }
    }
  }

  undo(cube: RubiksCube) {}
}
