import { Position } from '../constants';
import type { Padding } from '../types';

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
