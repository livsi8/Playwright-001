export interface ElementStyleSnapshot {
  backgroundColor: string;
  color: string;
  fontFamily: string;
  fontSize: string;
  width: number;
  height: number;
  opacity?: string;
}

export interface ElementBoxSnapshot {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface HoverSnapshot {
  before: ElementStyleSnapshot;
  after: ElementStyleSnapshot;
}

export interface PopupSummary {
  url: string;
  text: string;
}

export interface DialogSummary {
  type: string;
  message: string;
  defaultValue: string;
}

export interface FrameScrollMetrics {
  iframeClientWidth: number;
  iframeClientHeight: number;
  docScrollWidth: number;
  docClientWidth: number;
  docScrollHeight: number;
  docClientHeight: number;
  bodyScrollWidth: number;
  bodyClientWidth: number;
  bodyScrollHeight: number;
  bodyClientHeight: number;
  scrollX: number;
  scrollY: number;
  hasHorizontalOverflow: boolean;
  hasVerticalOverflow: boolean;
}

export interface FrameScrollResult {
  beforeX: number;
  beforeY: number;
  afterX: number;
  afterY: number;
}

export function calculateGap(first: ElementBoxSnapshot, second: ElementBoxSnapshot): number {
  const horizontalGap = Math.max(0, second.left - first.right, first.left - second.right);
  const verticalGap = Math.max(0, second.top - first.bottom, first.top - second.bottom);

  return Math.max(horizontalGap, verticalGap);
}
