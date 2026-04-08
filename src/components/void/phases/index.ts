import type { Phase } from "../types";
import { addVoidPhase, VOID_SEGMENT_COUNT } from "./void";

export { addVoidPhase };

export const PHASE_SEGMENT_COUNTS: Record<Phase, number> = {
  void: VOID_SEGMENT_COUNT,
};
