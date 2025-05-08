import { RubiksCube } from "@/utils/rubiksCube";
import { Move } from "./move";

export class XMove extends Move {
  constructor(public prime: boolean = false) {
    super(prime);
  }

  execute(cube: RubiksCube) {
    const f = cube.faces.F;
    const u = cube.faces.U;
    const b = cube.faces.B;
    const d = cube.faces.D;

    if (!this.prime) {
      cube.faces.F = d;
      cube.faces.D = b;
      cube.faces.B = u;
      cube.faces.U = f;

      const oldR = cube.faces.R.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.R[j][2 - i] = oldR[i][j];
        }
      }

      const oldL = cube.faces.L.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.L[2 - j][i] = oldL[i][j];
        }
      }
    } else {
      cube.faces.F = u;
      cube.faces.D = f;
      cube.faces.B = d;
      cube.faces.U = b;

      const oldR = cube.faces.R.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.R[2 - j][i] = oldR[i][j];
        }
      }

      const oldL = cube.faces.L.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.L[j][2 - i] = oldL[i][j];
        }
      }
    }
  }
}
