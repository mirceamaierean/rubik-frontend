import { create } from "zustand";
import { Algorithm } from "@/utils/commands/algorithm";

interface AlgorithmState {
  currentAlgorithm: Algorithm | null;
  is3D: boolean;
  setCurrentAlgorithm: (algorithm: Algorithm | null) => void;
  clearAlgorithm: () => void;
  setIs3D: (is3D: boolean) => void;
  toggleView: () => void;
}

export const useAlgorithmStore = create<AlgorithmState>((set, get) => ({
  currentAlgorithm: null,
  is3D: false,
  setCurrentAlgorithm: (algorithm) => {
    set({ currentAlgorithm: algorithm });
  },
  clearAlgorithm: () => {
    set({ currentAlgorithm: null });
  },
  setIs3D: (is3D) => {
    set({ is3D });
  },
  toggleView: () => {
    const currentIs3D = get().is3D;
    set({ is3D: !currentIs3D });
  },
}));
