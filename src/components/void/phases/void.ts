import type { TypewriterInstance, Segment } from "../types";
import { buildSegments, T1 } from "../types";
import { VOID } from "../palette";

export function createVoidSegments(visitCount: number): Segment[] {
  return [
    // 0
    {
      html: `<span>so this is it</span>`,
      pause: 3500,
      delay: T1,
    },
    // 1
    {
      html: `<span>the void</span>`,
      pause: 4000,
      delay: T1,
    },
    // 2
    {
      html: `<span>not much here</span>`,
      pause: 3000,
    },
    // 3
    {
      html: `<span>just dark water</span>`,
      pause: 4000,
      delay: T1,
    },
    // 4
    {
      html: `<span>you sat through the whole thing though</span>`,
      pause: 3500,
      prePause: 1500,
    },
    // 5
    {
      html: `<span>the countdown and everything</span>`,
      pause: 3000,
    },
    // 6
    {
      html: `<span>imagine if you took that energy</span>`,
      pause: 3000,
      prePause: 1500,
    },
    // 7
    {
      html: `<span>and pointed it at something that matters</span>`,
      pause: 3500,
      delay: T1,
    },
    // 8 — the line that lands
    {
      html: `<span>you'd be <span style="color:${VOID.red}">dangerous</span></span>`,
      pause: 4500,
      delay: T1,
      prePause: 1000,
    },
    // 9
    {
      html: `<span>seriously</span>`,
      pause: 2500,
      delay: T1,
      prePause: 1500,
    },
    // 10
    {
      html: `<span>don't waste that potential</span>`,
      pause: 3000,
    },
    // 11
    {
      html: `<span>go build something cool</span>`,
      pause: 4000,
      delay: T1,
    },
    // 12 — deflection
    {
      html: `<span>anyway</span>`,
      pause: 3000,
      delay: T1,
      prePause: 2000,
    },
    // 13 — visitor count (corruption picks up)
    {
      html: `<span>you're visitor <span style="color:${VOID.gold}">#${Math.max(visitCount, 1)}</span></span>`,
      pause: 4000,
      delay: T1,
      prePause: 1500,
    },
    // 14 — unstable
    {
      html: `<span>this void is pretty unstable though</span>`,
      pause: 3000,
      prePause: 1000,
    },
    // 15 — resigned
    {
      html: `<span>ah well</span>`,
      pause: 2500,
      delay: T1,
      prePause: 1000,
    },
    // 16 — goodbye
    {
      html: `<span>it's been nice knowing ya</span>`,
      pause: 2500,
      delay: T1,
    },
    // 17 — cut off, void wins
    {
      html: `<span>see you on the other si</span>`,
      pause: 500,
      delay: T1,
      deleteMode: "none",
    },
  ];
}

export const VOID_SEGMENT_COUNT = createVoidSegments(0).length;

export function addVoidPhase(
  tw: TypewriterInstance,
  onComplete: () => void,
  startSegment: number = 0,
  onSegmentChange?: (index: number) => void,
  visitCount: number = 0,
) {
  const segments = createVoidSegments(visitCount);
  buildSegments(tw, segments, onComplete, startSegment, 4000, onSegmentChange);
}
