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
      formData.append("images", file, file.name || `face${idx + 1}.jpg`);
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

export const getFastestSolution = async (cubeString: string) => {
  const response = await fetch(`/api/kociemba?cubeString=${cubeString}`);
  const { solution } = await response.json();

  console.log(solution);
  // solution returns a string of moves, separate by spaces
  // each move is a single character, followed by a number
  const moves = solution.split(" ");
  moves.pop();
  console.log(moves);
  const algorithm = new Algorithm([]);
  for (const move of moves) {
    const moveArray = await generateMove(move[0], parseInt(move[1]));
    algorithm.addMoves(moveArray);
  }

  return algorithm;
};
