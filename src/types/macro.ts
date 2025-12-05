/**
 * Macro types and action definitions
 */

import type { CellAddress, CellRange, CellValue } from './cell';

export type MacroTrigger =
  | { type: 'manual' }
  | { type: 'cell-change'; cell: CellAddress }
  | { type: 'value-condition'; cell: CellAddress; condition: string }
  | { type: 'time-based'; schedule: string };

export type MacroAction =
  | { type: 'set-cell'; address: CellAddress; value: string }
  | { type: 'set-range'; range: CellRange; values: CellValue[][] }
  | { type: 'show-alert'; message: string }
  | { type: 'run-formula'; formula: string; target: CellAddress };

export interface Macro {
  id: string;
  name: string;
  description: string;
  trigger: MacroTrigger;
  actions: MacroAction[];
  code: string; // Generated JavaScript code
  enabled: boolean;
}
