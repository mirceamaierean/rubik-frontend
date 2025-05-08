import { RubiksCube } from "@/utils/rubiksCube";
import { Move } from "./move";

export class YMove extends Move {
  constructor(public prime: boolean = false) {
    super(prime);
  }

  execute(cube: RubiksCube) {
    const f = cube.faces.F;
    const r = cube.faces.R;
    const b = cube.faces.B;
    const l = cube.faces.L;
    if (!this.prime) {
      cube.faces.F = r;
      cube.faces.R = b;
      cube.faces.B = l;
      cube.faces.L = f;

      const oldU = cube.faces.U.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.U[j][2 - i] = oldU[i][j];
        }
      }

      const oldD = cube.faces.D.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.D[2 - j][i] = oldD[i][j];
        }
      }
    } else {
      cube.faces.F = l;
      cube.faces.R = f;
      cube.faces.B = r;
      cube.faces.L = b;

      const oldU = cube.faces.U.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.U[2 - j][i] = oldU[i][j];
        }
      }

      const oldD = cube.faces.D.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.D[j][2 - i] = oldD[i][j];
        }
      }
    }
  }
}
