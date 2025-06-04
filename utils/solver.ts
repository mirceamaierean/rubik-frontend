import { RubiksCube } from "./rubiksCube";
import { whiteEdges, whiteCorners, middleEdges } from "./constants";
import { Algorithm } from "./commands/algorithm";
import { YMove } from "./commands/y";
import { FMove } from "./commands/f";
import { UMove } from "./commands/u";
import { RMove } from "./commands/r";
import { LMove } from "./commands/l";

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
      console.log(algorithm);
      return algorithm;
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

  return algorithm;
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
    algorithm.addMove(new UMove(true));
    algorithm.addMove(new YMove());
    algorithm.addMove(new UMove(true));
    algorithm.addMove(new LMove(true));
    algorithm.addMove(new UMove());
    algorithm.addMove(new LMove());
    algorithm.addMove(new UMove());
    algorithm.addMove(new FMove());
    algorithm.addMove(new UMove(true));
    algorithm.addMove(new FMove(true));
  } else {
    algorithm.addMove(new UMove());
    algorithm.addMove(new RMove());
    algorithm.addMove(new UMove(true));
    algorithm.addMove(new RMove(true));
    algorithm.addMove(new UMove(true));
    algorithm.addMove(new FMove(true));
    algorithm.addMove(new UMove());
    algorithm.addMove(new FMove());
  }
  algorithm.addMove(new YMove());
  return algorithm;
}
