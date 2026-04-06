export const SITE_NAME = 'ImageCmp';

export interface Gallery {
  title: string;
  /** Source names, length >= 2 */
  sources: string[];
  /** Scene names, length >= 1 */
  scenes: string[];
  /** urls[sceneIndex][sourceIndex] */
  urls: string[][];
}

export type CompareMode = 'clicker' | 'slider';

export type ScaleMode =
  | '1:1'
  | 'fit-largest-height'
  | 'fit-largest-width'
  | 'fit-canvas-height'
  | 'fit-canvas-width'
  | 'fill-canvas-height'
  | 'fill-canvas-width';

export type Alignment =
  | 'center'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type ImageRenderingMode = 'auto' | 'crisp-edges' | 'pixelated';

export type SliderOrientation = 'vertical' | 'horizontal';

/** Labels for scale mode dropdown */
export const SCALE_MODE_LABELS: Record<ScaleMode, string> = {
  '1:1': '1:1 (Native)',
  'fit-largest-height': 'Fit Largest Height',
  'fit-largest-width': 'Fit Largest Width',
  'fit-canvas-height': 'Fit Canvas Height',
  'fit-canvas-width': 'Fit Canvas Width',
  'fill-canvas-height': 'Fill Canvas Height',
  'fill-canvas-width': 'Fill Canvas Width',
};

export const ALIGNMENT_LABELS: Record<Alignment, string> = {
  center: 'Center',
  left: 'Left',
  right: 'Right',
  top: 'Top',
  bottom: 'Bottom',
  'top-left': 'Top-Left',
  'top-right': 'Top-Right',
  'bottom-left': 'Bottom-Left',
  'bottom-right': 'Bottom-Right',
};

export const IMAGE_RENDERING_LABELS: Record<ImageRenderingMode, string> = {
  auto: 'Smooth',
  'crisp-edges': 'Crisp Edges',
  pixelated: 'Pixelated',
};
