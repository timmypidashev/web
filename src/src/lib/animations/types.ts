export interface AnimationEngine {
  id: string;
  name: string;

  init(
    width: number,
    height: number,
    palette: [number, number, number][],
    bgColor: string
  ): void;

  update(deltaTime: number): void;

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void;

  handleResize(width: number, height: number): void;

  handleMouseMove(x: number, y: number, isDown: boolean): void;

  handleMouseDown(x: number, y: number): void;

  handleMouseUp(): void;

  handleMouseLeave(): void;

  updatePalette(palette: [number, number, number][], bgColor: string): void;

  cleanup(): void;
}
