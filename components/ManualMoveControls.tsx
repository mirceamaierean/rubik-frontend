"use client";
import { Move } from "@/utils/commands/move";
import { RMove } from "@/utils/commands/r";
import { LMove } from "@/utils/commands/l";
import { FMove } from "@/utils/commands/f";
import { BMove } from "@/utils/commands/b";
import { UMove } from "@/utils/commands/u";
import { DMove } from "@/utils/commands/d";
import { YMove } from "@/utils/commands/y";
import { XMove } from "@/utils/commands/x";

interface ManualMoveControlsProps {
  onExecuteCommand: (command: Move) => void;
}

interface MoveConfig {
  label: string;
  moveClass: new (prime: boolean) => Move;
  prime: boolean;
}

const moveConfigs: MoveConfig[][] = [
  // Regular moves
  [
    { label: "L", moveClass: LMove, prime: false },
    { label: "R", moveClass: RMove, prime: false },
    { label: "F", moveClass: FMove, prime: false },
    { label: "B", moveClass: BMove, prime: false },
    { label: "U", moveClass: UMove, prime: false },
    { label: "D", moveClass: DMove, prime: false },
    { label: "Y", moveClass: YMove, prime: false },
    { label: "X", moveClass: XMove, prime: false },
  ],
  // Prime moves
  [
    { label: "L'", moveClass: LMove, prime: true },
    { label: "R'", moveClass: RMove, prime: true },
    { label: "F'", moveClass: FMove, prime: true },
    { label: "B'", moveClass: BMove, prime: true },
    { label: "U'", moveClass: UMove, prime: true },
    { label: "D'", moveClass: DMove, prime: true },
    { label: "Y'", moveClass: YMove, prime: true },
    { label: "X'", moveClass: XMove, prime: true },
  ],
];

export default function ManualMoveControls({
  onExecuteCommand,
}: ManualMoveControlsProps) {
  const createButton = (config: MoveConfig, index: number) => (
    <button
      key={`${config.label}-${index}`}
      onClick={() => onExecuteCommand(new config.moveClass(config.prime))}
      className="mt-8 px-4 py-2 bg-cube-blue text-white rounded shadow hover:bg-cube-blue/80"
    >
      {config.label}
    </button>
  );

  return (
    <div>
      {moveConfigs.map((rowConfigs, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {rowConfigs.map((config, configIndex) =>
            createButton(config, configIndex),
          )}
        </div>
      ))}
    </div>
  );
}
