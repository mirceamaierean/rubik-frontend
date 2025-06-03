import { RubiksCube } from "@/utils/rubiksCube";
import { Move } from "./move";

export class DMove extends Move {
  constructor(public prime: boolean = false) {
    super(prime);
  }

  execute(cube: RubiksCube) {
    const r = cube.faces.R[2];
    const f = cube.faces.F[2];
    const b = cube.faces.B[2];
    const l = cube.faces.L[2];
    if (!this.prime) {
      cube.faces.F[2] = l;
      cube.faces.R[2] = f;
      cube.faces.B[2] = r;
      cube.faces.L[2] = b;

      const oldD = cube.faces.D.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.D[j][2 - i] = oldD[i][j];
        }
      }
    } else {
      cube.faces.F[2] = r;
      cube.faces.R[2] = b;
      cube.faces.B[2] = l;
      cube.faces.L[2] = f;

      const oldD = cube.faces.D.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.D[2 - j][i] = oldD[i][j];
        }
      }
    }
  }
}
