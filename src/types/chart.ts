/**
 * Chart types and configurations
 */

import type { CellRange } from './cell';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter';
  dataRange: CellRange;
  xAxis?: CellRange;
  yAxis?: CellRange;
  title?: string;
  labels?: string[];
}

export interface Chart {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'scatter';
  dataRange: CellRange;
  config: ChartConfig;
  position: Position;
  size: Size;
}
