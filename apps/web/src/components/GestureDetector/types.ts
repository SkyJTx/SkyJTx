import { JSX } from "solid-js";

export enum HitTestBehavior {
  deferToChild = "deferToChild",
  opaque = "opaque",
  translucent = "translucent",
}

export interface Offset {
  dx: number;
  dy: number;
  x: number;
  y: number;
}

export interface Velocity {
  pixelsPerSecond: Offset;
}

export interface TapDownDetails {
  globalPosition: Offset;
  localPosition: Offset;
}

export interface TapUpDetails {
  globalPosition: Offset;
  localPosition: Offset;
}

export interface LongPressStartDetails {
  globalPosition: Offset;
  localPosition: Offset;
}

export interface LongPressMoveUpdateDetails {
  globalPosition: Offset;
  localPosition: Offset;
}

export interface LongPressEndDetails {
  globalPosition: Offset;
  localPosition: Offset;
  velocity: Velocity;
}

export interface DragDownDetails {
  globalPosition: Offset;
  localPosition: Offset;
}

export interface DragStartDetails {
  globalPosition: Offset;
  localPosition: Offset;
}

export interface DragUpdateDetails {
  globalPosition: Offset;
  localPosition: Offset;
  delta: Offset;
  primaryDelta?: number;
}

export interface DragEndDetails {
  velocity: Velocity;
  primaryVelocity?: number;
}

export interface ScaleStartDetails {
  focalPoint: Offset;
  localFocalPoint: Offset;
}

export interface ScaleUpdateDetails {
  focalPoint: Offset;
  localFocalPoint: Offset;
  scale: number;
  rotation: number;
  horizontalScale: number;
  verticalScale: number;
}

export interface ScaleEndDetails {
  velocity: Velocity;
}

export interface GestureDetectorProps {
  behavior?: HitTestBehavior;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;

  // Tap
  onTapDown?: (details: TapDownDetails) => void;
  onTapUp?: (details: TapUpDetails) => void;
  onTap?: () => void;
  onTapCancel?: () => void;
  onSecondaryTap?: () => void;
  onSecondaryTapDown?: (details: TapDownDetails) => void;
  onSecondaryTapUp?: (details: TapUpDetails) => void;
  onSecondaryTapCancel?: () => void;
  onTertiaryTapDown?: (details: TapDownDetails) => void;
  onTertiaryTapUp?: (details: TapUpDetails) => void;

  // Double Tap
  onDoubleTapDown?: (details: TapDownDetails) => void;
  onDoubleTap?: () => void;
  onDoubleTapCancel?: () => void;

  // Long Press
  onLongPressDown?: (details: TapDownDetails) => void;
  onLongPressCancel?: () => void;
  onLongPress?: () => void;
  onLongPressStart?: (details: LongPressStartDetails) => void;
  onLongPressMoveUpdate?: (details: LongPressMoveUpdateDetails) => void;
  onLongPressEnd?: (details: LongPressEndDetails) => void;
  onLongPressUp?: () => void;
  onSecondaryLongPress?: () => void;
  onSecondaryLongPressStart?: (details: LongPressStartDetails) => void;
  onSecondaryLongPressMoveUpdate?: (details: LongPressMoveUpdateDetails) => void;
  onSecondaryLongPressEnd?: (details: LongPressEndDetails) => void;
  onSecondaryLongPressUp?: () => void;

  // Vertical Drag
  onVerticalDragDown?: (details: DragDownDetails) => void;
  onVerticalDragStart?: (details: DragStartDetails) => void;
  onVerticalDragUpdate?: (details: DragUpdateDetails) => void;
  onVerticalDragEnd?: (details: DragEndDetails) => void;
  onVerticalDragCancel?: () => void;

  // Horizontal Drag
  onHorizontalDragDown?: (details: DragDownDetails) => void;
  onHorizontalDragStart?: (details: DragStartDetails) => void;
  onHorizontalDragUpdate?: (details: DragUpdateDetails) => void;
  onHorizontalDragEnd?: (details: DragEndDetails) => void;
  onHorizontalDragCancel?: () => void;

  // Pan
  onPanDown?: (details: DragDownDetails) => void;
  onPanStart?: (details: DragStartDetails) => void;
  onPanUpdate?: (details: DragUpdateDetails) => void;
  onPanEnd?: (details: DragEndDetails) => void;
  onPanCancel?: () => void;

  // Scale
  onScaleStart?: (details: ScaleStartDetails) => void;
  onScaleUpdate?: (details: ScaleUpdateDetails) => void;
  onScaleEnd?: (details: ScaleEndDetails) => void;
}
