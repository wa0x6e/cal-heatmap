import { Position } from '../constant';
import type { Padding } from '../options/Options';

export function isHorizontal(position: string): boolean {
  return position === 'left' || position === 'right';
}

export function isVertical(position: string): boolean {
  return position === 'top' || position === 'bottom';
}

export function horizontalPadding(padding: Padding): number {
  return padding[Position.LEFT] + padding[Position.RIGHT];
}

export function verticalPadding(padding: Padding): number {
  return padding[Position.TOP] + padding[Position.BOTTOM];
}
