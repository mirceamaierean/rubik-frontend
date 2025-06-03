import { RubiksCube } from "./rubiksCube";
import { Algorithm } from "./commands/algorithm";
import { RMove } from "./commands/r";
import { BMove } from "./commands/b";
import { FMove } from "./commands/f";

describe("RubiksCube", () => {
  it("should instantiate with solved faces by default", () => {
    const cube = new RubiksCube();
    expect(cube.faces.U.flat().every((c) => c === "yellow")).toBe(true);
    expect(cube.faces.D.flat().every((c) => c === "white")).toBe(true);
    expect(cube.faces.F.flat().every((c) => c === "red")).toBe(true);
    expect(cube.faces.B.flat().every((c) => c === "orange")).toBe(true);
    expect(cube.faces.L.flat().every((c) => c === "blue")).toBe(true);
    expect(cube.faces.R.flat().every((c) => c === "green")).toBe(true);
  });

  it("should create a solved cube with static solved()", () => {
    const cube = RubiksCube.solved();
    expect(cube.faces.U.flat().every((c) => c === "yellow")).toBe(true);
    expect(cube.faces.D.flat().every((c) => c === "white")).toBe(true);
    expect(cube.faces.F.flat().every((c) => c === "red")).toBe(true);
    expect(cube.faces.B.flat().every((c) => c === "orange")).toBe(true);
    expect(cube.faces.L.flat().every((c) => c === "blue")).toBe(true);
    expect(cube.faces.R.flat().every((c) => c === "green")).toBe(true);
  });

  it("should set a face to a new color", () => {
    const cube = new RubiksCube();
    cube.setFace("U", "red");
    expect(cube.faces.U.flat().every((c) => c === "red")).toBe(true);
  });

  it("should clone the cube correctly", () => {
    const cube = new RubiksCube();
    cube.setFace("F", "blue");
    const clone = cube.clone();
    expect(clone).not.toBe(cube);
    expect(clone.faces.F.flat().every((c) => c === "blue")).toBe(true);
    // Changing the clone should not affect the original
    clone.setFace("F", "green");
    expect(clone.faces.F.flat().every((c) => c === "green")).toBe(true);
    expect(cube.faces.F.flat().every((c) => c === "blue")).toBe(true);
  });

  it("should perform the algorithm R B' R F2 R' B R F2 R2 on a solved cube", () => {
    const cube = new RubiksCube();
    const algorithm = new Algorithm([
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
    algorithm.execute(cube);
    // The cube should not be solved after this algorithm
    expect(cube.faces.U.flat().every((c) => c === "yellow")).toBe(true);
    expect(cube.faces.D.flat().every((c) => c === "white")).toBe(true);
    expect(cube.faces.F.flat().every((c) => c === "red")).toBe(false);
    expect(cube.faces.B.flat().every((c) => c === "orange")).toBe(false);
    expect(cube.faces.L.flat().every((c) => c === "blue")).toBe(false);
    expect(cube.faces.R.flat().every((c) => c === "green")).toBe(false);
  });
});
