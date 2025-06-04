import { RubiksCube } from "./rubiksCube";
import { whiteEdges, whiteCorners, middleEdges } from "./constants";
import { Algorithm } from "./commands/algorithm";
import { YMove } from "./commands/y";
import { FMove } from "./commands/f";
import { UMove } from "./commands/u";
import { RMove } from "./commands/r";
import { LMove } from "./commands/l";
import { DMove } from "./commands/d";
import { BMove } from "./commands/b";

export function solveWhiteCross(cube: RubiksCube) {
  const frontColor = cube.faces.F[1][1];

  for (const edge of whiteEdges) {
    const color1 = cube.faces[edge.face1][edge.iFace1][edge.jFace1];
    const color2 = cube.faces[edge.face2][edge.iFace2][edge.jFace2];

    if (color1 === frontColor && color2 === "white") {
      const algorithm = edge.algorithm
        ? edge.algorithm.clone()
        : new Algorithm([]);
      algorithm.addMove(new YMove());
      console.log("solve white cross", algorithm);
      return algorithm.clean();
    }
  }
}

export function checkColor(colors: string[], color: string) {
  return colors.includes(color);
}

function bringWhiteCorner(cube: RubiksCube) {
  const frontColor = cube.faces.F[1][1];
  // check if somehow the corner is already in place
  if (cube.faces.D[0][2] === "white" && cube.faces.F[2][2] === frontColor) {
    return null;
  }

  const rightColor = cube.faces.R[1][1];
  console.log(frontColor, rightColor);

  for (const corner of whiteCorners) {
    const colors = [
      cube.faces[corner.face1][corner.iFace1][corner.jFace1],
      cube.faces[corner.face2][corner.iFace2][corner.jFace2],
      cube.faces[corner.face3][corner.iFace3][corner.jFace3],
    ];
    if (
      checkColor(colors, "white") &&
      checkColor(colors, frontColor) &&
      checkColor(colors, rightColor)
    ) {
      console.log(corner);
      // Clone the algorithm to avoid modifying the original
      if (corner.algorithm) {
        return corner.algorithm.clone();
      }
      return new Algorithm([]);
    }
  }
}

export function insertWhiteCorners(cube: RubiksCube) {
  let algorithm = bringWhiteCorner(cube);
  if (algorithm) {
    const newCube = cube.clone();
    algorithm?.execute(newCube);

    if (newCube.faces.F[0][2] === "white") {
      algorithm.addMove(new FMove(true));
      algorithm.addMove(new UMove(true));
      algorithm.addMove(new FMove());
    } else if (newCube.faces.R[0][0] === "white") {
      algorithm.addMove(new RMove());
      algorithm.addMove(new UMove());
      algorithm.addMove(new RMove(true));
    } else {
      algorithm.addMove(new RMove());
      algorithm.addMove(new UMove());
      algorithm.addMove(new UMove());
      algorithm.addMove(new RMove(true));
      algorithm.addMove(new UMove(true));
      algorithm.addMove(new RMove());
      algorithm.addMove(new UMove());
      algorithm.addMove(new RMove(true));
    }
  } else algorithm = new Algorithm([]);

  algorithm.addMove(new YMove());
  return algorithm.clean();
}

export function bringMiddleEdge(cube: RubiksCube) {
  const frontColor = cube.faces.F[1][1];
  const rightColor = cube.faces.R[1][1];

  for (const edge of middleEdges) {
    const colors = [
      cube.faces[edge.face1][edge.iFace1][edge.jFace1],
      cube.faces[edge.face2][edge.iFace2][edge.jFace2],
    ];
    if (checkColor(colors, frontColor) && checkColor(colors, rightColor)) {
      console.log(edge);
      return edge.algorithm ? edge.algorithm.clone() : new Algorithm([]);
    }
  }
  return new Algorithm([]);
}

export function solveMiddleEdge(cube: RubiksCube) {
  const frontColor = cube.faces.F[1][1];
  const rightColor = cube.faces.R[1][1];

  if (frontColor === cube.faces.F[1][2] && rightColor === cube.faces.R[1][0])
    return new Algorithm([new YMove()]);

  const algorithm = bringMiddleEdge(cube);
  const newCube = cube.clone();
  algorithm.execute(newCube);

  if (newCube.faces.F[0][1] === rightColor) {
    algorithm.addMoves([
      new UMove(true),
      new YMove(),
      new UMove(true),
      new LMove(true),
      new UMove(),
      new LMove(),
      new UMove(),
      new FMove(),
      new UMove(true),
      new FMove(true),
    ]);
    return algorithm.clean();
  }
  algorithm.addMoves([
    new UMove(),
    new RMove(),
    new UMove(true),
    new RMove(true),
    new UMove(true),
    new FMove(true),
    new UMove(),
    new FMove(),
    new YMove(),
  ]);

  return algorithm.clean();
}

export function makeTopCross(cube: RubiksCube) {
  const algorithm = new Algorithm([]);

  const topColor = cube.faces.U[1][1];

  if (
    cube.faces.U[0][1] !== topColor &&
    cube.faces.U[1][0] !== topColor &&
    cube.faces.U[1][2] !== topColor &&
    cube.faces.U[2][1] !== topColor
  ) {
    algorithm.addMove(new FMove());
    algorithm.addMove(new RMove());
    algorithm.addMove(new UMove());
    algorithm.addMove(new RMove(true));
    algorithm.addMove(new UMove(true));
    algorithm.addMove(new FMove(true));
  }

  const newCube = cube.clone();
  algorithm.execute(newCube);

  // check if cross is made
  if (
    newCube.faces.U[0][1] === topColor &&
    newCube.faces.U[1][0] === topColor &&
    newCube.faces.U[1][2] === topColor &&
    newCube.faces.U[2][1] === topColor
  ) {
    return algorithm;
  }

  let rotate = new Algorithm([]);
  // check inverted line
  if (
    newCube.faces.U[0][1] === topColor &&
    newCube.faces.U[2][1] === topColor
  ) {
    algorithm.addMove(new UMove());
    rotate = new Algorithm([new UMove()]);
    rotate.execute(newCube);
  }

  if (
    newCube.faces.U[1][0] === topColor &&
    newCube.faces.U[1][2] === topColor
  ) {
    algorithm.addMove(new FMove());
    algorithm.addMove(new RMove());
    algorithm.addMove(new UMove());
    algorithm.addMove(new RMove(true));
    algorithm.addMove(new UMove(true));
    algorithm.addMove(new FMove(true));
  }

  if (
    newCube.faces.U[0][1] === topColor &&
    newCube.faces.U[1][2] === topColor
  ) {
    rotate = new Algorithm([new UMove(true)]);
    algorithm.addMove(new UMove(true));
    rotate.execute(newCube);
  }

  if (
    newCube.faces.U[2][1] === topColor &&
    newCube.faces.U[1][2] === topColor
  ) {
    rotate = new Algorithm([new UMove()]);
    algorithm.addMove(new UMove());
    rotate.execute(newCube);
  }

  if (
    newCube.faces.U[2][1] === topColor &&
    newCube.faces.U[1][0] === topColor
  ) {
    rotate = new Algorithm([new UMove()]);
    algorithm.addMove(new UMove());
    rotate.execute(newCube);
  }

  if (
    newCube.faces.U[0][1] === topColor &&
    newCube.faces.U[1][0] === topColor
  ) {
    algorithm.addMove(new FMove());
    algorithm.addMove(new UMove());
    algorithm.addMove(new RMove());
    algorithm.addMove(new UMove(true));
    algorithm.addMove(new RMove(true));
    algorithm.addMove(new FMove(true));
  }
  return algorithm.clean();
}

export function solveTopCorners(cube: RubiksCube) {
  const algorithm = new Algorithm([]);

  const topColor = cube.faces.U[1][1];

  if (topColor === cube.faces.F[0][2]) {
    algorithm.addMoves([
      new RMove(true),
      new DMove(),
      new RMove(),
      new DMove(true),
      new RMove(true),
      new DMove(),
      new RMove(),
      new DMove(true),
    ]);
  } else if (topColor === cube.faces.R[0][0]) {
    algorithm.addMoves([
      new DMove(),
      new RMove(true),
      new DMove(true),
      new RMove(),
      new DMove(),
      new RMove(true),
      new DMove(true),
      new RMove(),
    ]);
  }

  algorithm.addMove(new UMove());
  return algorithm.clean();
}

export function permuteTopCorners(cube: RubiksCube) {
  const twoSameCorners = [];
  if (cube.faces.F[0][0] === cube.faces.F[0][2]) {
    twoSameCorners.push("F");
  }
  if (cube.faces.R[0][0] === cube.faces.R[0][2]) {
    twoSameCorners.push("R");
  }
  if (cube.faces.L[0][0] === cube.faces.L[0][2]) {
    twoSameCorners.push("L");
  }
  if (cube.faces.B[0][0] === cube.faces.B[0][2]) {
    twoSameCorners.push("B");
  }

  if (twoSameCorners.length > 1) return new Algorithm([]);

  const algorithm = new Algorithm([]);

  if (twoSameCorners.length === 1) {
    if (twoSameCorners[0] === "R") algorithm.addMove(new UMove());
    else if (twoSameCorners[0] === "L") algorithm.addMove(new UMove(true));
    else if (twoSameCorners[0] === "B")
      algorithm.addMoves([new UMove(), new UMove()]);
  }

  algorithm.addMoves([
    new RMove(),
    new BMove(true),
    new RMove(),
    new FMove(),
    new FMove(),
    new RMove(true),
    new BMove(),
    new RMove(),
    new FMove(),
    new FMove(),
    new RMove(),
    new RMove(),
  ]);
  return algorithm.clean();
}

export function permuteTopEdges(cube: RubiksCube) {
  const algorithm = new Algorithm([]);

  if (cube.faces.F[0][0] === cube.faces.F[0][1]) {
    algorithm.addMoves([new UMove(), new UMove()]);
  } else if (cube.faces.R[0][0] === cube.faces.R[0][1]) {
    algorithm.addMoves([new UMove(true)]);
  } else if (cube.faces.L[0][0] === cube.faces.L[0][1]) {
    algorithm.addMoves([new UMove()]);
  }

  algorithm.addMoves([
    new RMove(),
    new UMove(true),
    new RMove(),
    new UMove(),
    new RMove(),
    new UMove(),
    new RMove(),
    new UMove(true),
    new RMove(true),
    new UMove(true),
    new RMove(true),
    new RMove(true),
  ]);

  return algorithm.clean();
}
