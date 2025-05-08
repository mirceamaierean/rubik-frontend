import React from "react";
import { Move } from "@/utils/commands/move";
import { RMove } from "@/utils/commands/r";
import { UMove } from "@/utils/commands/u";
import { LMove } from "@/utils/commands/l";
import { FMove } from "@/utils/commands/f";
import { Algorithm } from "@/utils/commands/algorithm";
import { BMove } from "@/utils/commands/b";
import { DMove } from "@/utils/commands/d";

interface AlgorithmControlsProps {
  onAlgorithm: (move: Move) => void;
}

// Predefined algorithms
const algorithms = [
  {
    name: "R U R'",
    move: new Algorithm([new RMove(), new UMove(), new RMove(true)]),
  },
  {
    name: "F' U' F",
    move: new Algorithm([new FMove(true), new UMove(true), new FMove()]),
  },
  {
    name: "R U2 R' U' R U' R'",
    move: new Algorithm([
      new RMove(),
      new UMove(),
      new UMove(),
      new RMove(true),
      new UMove(true),
      new RMove(true),
      new UMove(),
      new RMove(true),
    ]),
  },
  {
    name: "U R U' R' U' F' U F",
    move: new Algorithm([
      new UMove(),
      new RMove(),
      new UMove(true),
      new RMove(true),
      new UMove(true),
      new FMove(true),
      new UMove(),
      new FMove(),
    ]),
  },
  {
    name: "U' L' U L U F U' F'",
    move: new Algorithm([
      new UMove(true),
      new LMove(true),
      new UMove(),
      new LMove(),
      new UMove(),
      new FMove(),
      new UMove(true),
      new FMove(true),
    ]),
  },
  {
    name: "F U R U' R' F'",
    move: new Algorithm([
      new FMove(),
      new UMove(),
      new RMove(),
      new UMove(true),
      new RMove(true),
      new FMove(true),
    ]),
  },
  {
    name: "F R U R' U' F'",
    move: new Algorithm([
      new FMove(),
      new RMove(),
      new UMove(),
      new RMove(true),
      new UMove(true),
      new FMove(true),
    ]),
  },
  {
    name: "R' D R D' R' D R D'",
    move: new Algorithm([
      new RMove(true),
      new DMove(),
      new RMove(),
      new DMove(true),
      new RMove(true),
      new DMove(),
      new RMove(),
      new DMove(true),
    ]),
  },
  {
    name: "D R' D' R D R' D' R",
    move: new Algorithm([
      new DMove(),
      new RMove(true),
      new DMove(true),
      new RMove(),
      new DMove(),
      new RMove(true),
      new DMove(true),
      new RMove(),
    ]),
  },
  {
    name: "R B' R F2 R' B R F2 R2",
    move: new Algorithm([
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
    ]),
  },
  {
    name: "R U' R U R U R U' R' U' R2",
    move: new Algorithm([
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
    ]),
  },
];

const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  onAlgorithm,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {algorithms.map((algo) => (
        <button
          key={algo.name}
          onClick={() => onAlgorithm(algo.move)}
          className="px-4 py-2 bg-cube-green text-white rounded shadow hover:bg-cube-green/80"
        >
          {algo.name}
        </button>
      ))}
    </div>
  );
};

export default AlgorithmControls;
