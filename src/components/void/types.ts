export interface TypewriterInstance {
  typeString: (str: string) => TypewriterInstance;
  pasteString: (str: string, node?: HTMLElement | null) => TypewriterInstance;
  pauseFor: (ms: number) => TypewriterInstance;
  deleteAll: (speed?: number | "natural") => TypewriterInstance;
  deleteChars: (amount: number) => TypewriterInstance;
  changeDelay: (delay: number | "natural") => TypewriterInstance;
  changeDeleteSpeed: (speed: number | "natural") => TypewriterInstance;
  callFunction: (cb: () => void) => TypewriterInstance;
  start: () => TypewriterInstance;
}

export type Phase = "void";

export const PHASE_ORDER: Phase[] = ["void"];

export const T1 = 55;
export const T2 = 35;
export const DELETE_SPEED = 15;

export interface Segment {
  html: string;
  pause: number;
  method?: "type" | "paste";
  delay?: number;
  prePause?: number;
  deleteMode?: "all" | "none";
  deleteSpeed?: number;
}

export type PhaseBuilder = (
  tw: TypewriterInstance,
  onComplete: () => void,
  startSegment?: number,
  onSegmentChange?: (index: number) => void,
) => void;

export function buildSegments(
  tw: TypewriterInstance,
  segments: Segment[],
  onComplete: () => void,
  startSegment: number = 0,
  initialPause: number = 0,
  onSegmentChange?: (index: number) => void,
) {
  if (startSegment === 0 && initialPause > 0) {
    tw.pauseFor(initialPause);
  }

  for (let i = startSegment; i < segments.length; i++) {
    const seg = segments[i];
    const idx = i;

    tw.callFunction(() => onSegmentChange?.(idx));

    if (seg.prePause && seg.prePause > 0) {
      tw.pauseFor(seg.prePause);
    }

    if (seg.delay !== undefined) {
      tw.changeDelay(seg.delay);
    }

    if (seg.method === "paste") {
      tw.pasteString(seg.html, null);
    } else {
      tw.typeString(seg.html);
    }

    tw.pauseFor(seg.pause);

    if (seg.delay !== undefined) {
      tw.changeDelay(T2);
    }

    const mode = seg.deleteMode ?? "all";
    if (mode === "all") {
      tw.deleteAll(seg.deleteSpeed ?? DELETE_SPEED);
    }
  }

  tw.callFunction(onComplete);
}
