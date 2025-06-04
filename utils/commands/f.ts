import { RubiksCube } from "@/utils/rubiksCube";
import { Move } from "./move";

export class FMove extends Move {
  constructor(public prime: boolean = false) {
    super(prime);
  }

  execute(cube: RubiksCube) {
    if (!this.prime) {
      const u = cube.faces.U[2];
      const r = [cube.faces.R[2][0], cube.faces.R[1][0], cube.faces.R[0][0]];
      const l = [cube.faces.L[2][2], cube.faces.L[1][2], cube.faces.L[0][2]];
      const d = cube.faces.D[0];

      cube.faces.U[2] = l;

      cube.faces.R[0][0] = u[0];
      cube.faces.R[1][0] = u[1];
      cube.faces.R[2][0] = u[2];

      cube.faces.D[0] = r;

      cube.faces.L[0][2] = d[0];
      cube.faces.L[1][2] = d[1];
      cube.faces.L[2][2] = d[2];

      const oldF = cube.faces.F.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.F[j][2 - i] = oldF[i][j];
        }
      }
    } else {
      const u = cube.faces.U[2];
      const r = [cube.faces.R[0][0], cube.faces.R[1][0], cube.faces.R[2][0]];
      const l = [cube.faces.L[0][2], cube.faces.L[1][2], cube.faces.L[2][2]];
      const d = cube.faces.D[0];

      cube.faces.U[2] = r;

      cube.faces.R[0][0] = d[2];
      cube.faces.R[1][0] = d[1];
      cube.faces.R[2][0] = d[0];

      cube.faces.D[0] = l;

      cube.faces.L[0][2] = u[2];
      cube.faces.L[1][2] = u[1];
      cube.faces.L[2][2] = u[0];

      const oldF = cube.faces.F.map((row) => [...row]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cube.faces.F[2 - j][i] = oldF[i][j];
        }
      }
    }
  }

  isOpposite(move: Move): boolean {
    return move instanceof FMove && this.prime !== move.prime;
  }

  isSame(move: Move): boolean {
    return move instanceof FMove && this.prime === move.prime;
  }
}
