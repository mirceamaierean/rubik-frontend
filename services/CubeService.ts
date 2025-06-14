import { DMove } from "@/utils/commands/d";
import { LMove } from "@/utils/commands/l";
import { RMove } from "@/utils/commands/r";
import { FMove } from "@/utils/commands/f";
import { BMove } from "@/utils/commands/b";
import { UMove } from "@/utils/commands/u";
import { Move } from "@/utils/commands/move";
import { Algorithm } from "@/utils/commands/algorithm";

export const detectColors = async (images: File[]) => {
  const formData = new FormData();
  images.forEach((file, idx) => {
    if (file) {
      // rename the file to face1.jpg, face2.jpg, etc.
      const newFileName = `face${idx + 1}.jpg`;
      formData.append("images", file, newFileName);
    }
  });

  const response = await fetch("/api/detection", {
    method: "POST",
    body: formData,
  });
  const { results } = await response.json();

  return [
    results[0].grid,
    results[1].grid,
    results[2].grid,
    results[3].grid,
    results[4].grid,
    results[5].grid,
  ];
};

const generateMove = async (charFace: string, direction: number) => {
  let move: Move;
  switch (charFace) {
    case "U":
      move = new UMove(direction === 3);
      break;
    case "D":
      move = new DMove(direction === 3);
      break;
    case "L":
      move = new LMove(direction === 3);
      break;
    case "R":
      move = new RMove(direction === 3);
      break;
    case "F":
      move = new FMove(direction === 3);
      break;
    default:
      move = new BMove(direction === 3);
      break;
  }

  const arrayOfMoves: Move[] = [];

  arrayOfMoves.push(move);

  if (direction === 2) {
    arrayOfMoves.push(move);
  }

  console.log(arrayOfMoves);

  return arrayOfMoves;
};

export const getKociemba = async (cubeString: string) => {
  const response = await fetch(`/api/kociemba?cubeString=${cubeString}`);
  const { solution } = await response.json();
  return solution;
};

export const convertToAlgorithm = async (
  moves: string[],
  reverse: boolean = false,
) => {
  console.log("Converting moves to algorithm:", moves);
  const algorithm = new Algorithm([]);
  for (const move of moves) {
    let direction = 2;
    if (move[1] == "1") {
      if (reverse) {
        direction = 3;
      } else {
        direction = 1;
      }
    } else if (move[1] == "3") {
      if (reverse) {
        direction = 1;
      } else {
        direction = 3;
      }
    }
    const moveArray = await generateMove(move[0], direction);
    algorithm.addMoves(moveArray);
  }
  return algorithm;
};

export const getFastestSolution = async (cubeString: string) => {
  const solution = await getKociemba(cubeString);

  // solution returns a string of moves, separate by spaces
  // each move is a single character, followed by a number
  const moves = solution.split(" ");
  // remove the last move, which is the corresponding code from the prunning table
  moves.pop();

  return convertToAlgorithm(moves);
};

export const sendToRobot = async (cubeString: string) => {
  const fastestSolution = await getKociemba(cubeString);
  // split fastestSolution into an array, separated by spaces
  const moves = fastestSolution.toString().split(" ");
  for (let i = 0; i < moves.length; i++) {
    if (moves[i][1] === "1") {
      moves[i][1].replace("1", "3");
    } else if (moves[i][1] === "3") {
      moves[i][1].replace("3", "1");
    }
  }
  // reverse the moves
  moves.reverse();

  // create a new string of moves, separated by spaces
  const movesString = moves.join(" ");

  try {
    await fetch("/api/robot", {
      method: "POST",
      body: JSON.stringify({ algorithm: movesString }),
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const solveByRobot = async (cubeString: string) => {
  const fastestSolution = await getKociemba(cubeString);

  try {
    await fetch("/api/robot", {
      method: "POST",
      body: JSON.stringify({ algorithm: fastestSolution }),
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const saveCube = async (cubeString: string, description: string) => {
  // Get the Kociemba solution
  const solution = await getKociemba(cubeString);

  console.log(solution);

  // Split and reverse the moves (excluding the last pruning code)
  const moves = solution.split(" ");
  moves.pop();
  moves.reverse();

  const scramble = (await convertToAlgorithm(moves, true)).toString();

  // // Save to the database
  const response = await fetch("/api/cube", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description,
      scramble,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save cube");
  }

  return await response.json();
};

export const getCubes = async () => {
  const response = await fetch("/api/cube");
  const data = await response.json();
  return data;
};

export const getCube = async (id: string) => {
  const response = await fetch(`/api/cube/${id}`);
  const data = await response.json();
  return data;
};

export const convertScrambleToAlgorithm = async (scramble: string) => {
  const moves = scramble.split(" ");
  const algorithm = new Algorithm([]);
  for (const move of moves) {
    let direction = 2;
    if (move.length === 1) {
      direction = 1;
    } else if (move[1] === "'") {
      direction = 3;
    }
    const moveArray = await generateMove(move[0], direction);
    algorithm.addMoves(moveArray);
  }
  return algorithm;
};

export const deleteCube = async (id: string) => {
  const response = await fetch(`/api/cube/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete cube");
  }
  return await response.json();
};
