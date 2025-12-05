import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { CellAddress, CellValue, Chart } from '../types';
import { DraggableChart } from './DraggableChart';

interface SpreadsheetGridProps {
  darkMode: boolean;
  aiActive: boolean;
  aiGeneratingCells: Set<CellAddress>;
  selectedCell: CellAddress | null;
  selectedRange: { start: CellAddress; end: CellAddress } | null;
  highlightedCells: Set<CellAddress>;
  cellData: Map<CellAddress, { raw: string; display: CellValue; error: string | null }>;
  onCellSelect: (address: CellAddress | null) => void;
  onCellRangeSelect: (range: { start: CellAddress; end: CellAddress } | null) => void;
  onCellChange: (address: CellAddress, value: string) => void;
  charts: Chart[];
  onChartUpdate: (id: string, updates: Partial<Chart>) => void;
  onChartDelete: (id: string) => void;
}

export function SpreadsheetGrid({
  darkMode,
  aiActive: _aiActive,
  aiGeneratingCells,
  selectedCell,
  selectedRange,
  highlightedCells,
  cellData,
  onCellSelect,
  onCellRangeSelect,
  onCellChange,
  charts,
  onChartUpdate,
  onChartDelete,
}: SpreadsheetGridProps) {
  const [editingCell, setEditingCell] = useState<CellAddress | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<CellAddress | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
  const rows = Array.from({ length: 50 }, (_, i) => i + 1);

  // Focus input when editing
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  // Handle click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
        if (editingCell) {
          commitEdit();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingCell, editValue]);

  const commitEdit = useCallback(() => {
    if (editingCell) {
      onCellChange(editingCell, editValue);
      setEditingCell(null);
      setEditValue('');
    }
  }, [editingCell, editValue, onCellChange]);

  const handleCellClick = useCallback((col: string, row: number, e: React.MouseEvent) => {
    const cellId = `${col}${row}` as CellAddress;
    
    if (editingCell && editingCell !== cellId) {
      commitEdit();
    }
    
    onCellSelect(cellId);
    setSelectionStart(cellId);
    
    // Start range selection if shift is held
    if (e.shiftKey && selectedCell) {
      onCellRangeSelect({ start: selectedCell, end: cellId });
    }
  }, [editingCell, selectedCell, onCellSelect, onCellRangeSelect, commitEdit]);

  const handleCellDoubleClick = useCallback((col: string, row: number) => {
    const cellId = `${col}${row}` as CellAddress;
    const cellInfo = cellData.get(cellId);
    
    setEditingCell(cellId);
    setEditValue(cellInfo?.raw || '');
    onCellSelect(cellId);
  }, [cellData, onCellSelect]);

  const handleCellMouseDown = useCallback((col: string, row: number) => {
    setIsSelecting(true);
    setSelectionStart(`${col}${row}` as CellAddress);
  }, []);

  const handleCellMouseEnter = useCallback((col: string, row: number) => {
    if (isSelecting && selectionStart) {
      const cellId = `${col}${row}` as CellAddress;
      onCellRangeSelect({ start: selectionStart, end: cellId });
    }
  }, [isSelecting, selectionStart, onCellRangeSelect]);

  const handleCellMouseUp = useCallback(() => {
    setIsSelecting(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!editingCell && selectedCell) {
      // Navigate with arrow keys
      const match = selectedCell.match(/^([A-Z]+)(\d+)$/);
      if (!match) return;
      
      const [, colStr, rowStr] = match;
      const colIndex = columns.indexOf(colStr);
      const rowNum = parseInt(rowStr);
      
      let newCol = colStr;
      let newRow = rowNum;
      
      switch (e.key) {
        case 'ArrowUp':
          newRow = Math.max(1, rowNum - 1);
          e.preventDefault();
          break;
        case 'ArrowDown':
          newRow = Math.min(rows.length, rowNum + 1);
          e.preventDefault();
          break;
        case 'ArrowLeft':
          newCol = columns[Math.max(0, colIndex - 1)];
          e.preventDefault();
          break;
        case 'ArrowRight':
          newCol = columns[Math.min(columns.length - 1, colIndex + 1)];
          e.preventDefault();
          break;
        case 'Enter':
          // Start editing
          const cellInfo = cellData.get(selectedCell);
          setEditingCell(selectedCell);
          setEditValue(cellInfo?.raw || '');
          e.preventDefault();
          return;
        case 'Delete':
        case 'Backspace':
          onCellChange(selectedCell, '');
          e.preventDefault();
          return;
        default:
          // Start typing to edit
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            setEditingCell(selectedCell);
            setEditValue(e.key);
            e.preventDefault();
          }
          return;
      }
      
      onCellSelect(`${newCol}${newRow}` as CellAddress);
    }
  }, [selectedCell, editingCell, columns, rows.length, cellData, onCellSelect, onCellChange]);

  const handleEditKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitEdit();
      // Move to next row
      if (editingCell) {
        const match = editingCell.match(/^([A-Z]+)(\d+)$/);
        if (match) {
          const [, col, row] = match;
          const nextRow = Math.min(rows.length, parseInt(row) + 1);
          onCellSelect(`${col}${nextRow}` as CellAddress);
        }
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      commitEdit();
      // Move to next column
      if (editingCell) {
        const match = editingCell.match(/^([A-Z]+)(\d+)$/);
        if (match) {
          const [, col, row] = match;
          const colIndex = columns.indexOf(col);
          const nextCol = columns[Math.min(columns.length - 1, colIndex + 1)];
          onCellSelect(`${nextCol}${row}` as CellAddress);
        }
      }
    }
  }, [editingCell, commitEdit, rows.length, columns, onCellSelect]);

  const isInSelectedRange = useCallback((col: string, row: number): boolean => {
    if (!selectedRange) return false;
    
    const startMatch = selectedRange.start.match(/^([A-Z]+)(\d+)$/);
    const endMatch = selectedRange.end.match(/^([A-Z]+)(\d+)$/);
    if (!startMatch || !endMatch) return false;
    
    const [, startCol, startRow] = startMatch;
    const [, endCol, endRow] = endMatch;
    
    const startColIdx = columns.indexOf(startCol);
    const endColIdx = columns.indexOf(endCol);
    const colIdx = columns.indexOf(col);
    
    const minCol = Math.min(startColIdx, endColIdx);
    const maxCol = Math.max(startColIdx, endColIdx);
    const minRow = Math.min(parseInt(startRow), parseInt(endRow));
    const maxRow = Math.max(parseInt(startRow), parseInt(endRow));
    
    return colIdx >= minCol && colIdx <= maxCol && row >= minRow && row <= maxRow;
  }, [selectedRange, columns]);

  const formatDisplayValue = (value: CellValue): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') {
      // Format numbers nicely
      if (Number.isInteger(value)) return value.toString();
      return value.toFixed(2);
    }
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  return (
    <div 
      ref={gridRef}
      className={`flex-1 overflow-auto relative ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}
      onKeyDown={handleKeyDown}
      onMouseUp={handleCellMouseUp}
      tabIndex={0}
    >
      <div className="inline-block min-w-max">
        {/* Column Headers */}
        <div className="flex sticky top-0 z-20">
          <div 
            className={`w-12 h-8 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-300'} border-b border-r flex items-center justify-center sticky left-0 z-30`}
          />
          {columns.map(col => {
            const isSelectedCol = selectedCell?.startsWith(col);
            return (
              <div
                key={col}
                className={`w-24 h-8 ${
                  isSelectedCol
                    ? darkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-indigo-100 text-indigo-700'
                    : darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'
                } border-b border-r flex items-center justify-center text-xs font-medium transition-colors ${
                  darkMode ? 'border-gray-800' : 'border-gray-300'
                }`}
              >
                {col}
              </div>
            );
          })}
        </div>
        
        {/* Grid Rows */}
        {rows.map(row => (
          <div key={row} className="flex">
            {/* Row Header */}
            <div 
              className={`w-12 h-7 ${
                selectedCell?.endsWith(String(row))
                  ? darkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-indigo-100 text-indigo-700'
                  : darkMode ? 'bg-gray-900 text-gray-500' : 'bg-gray-100 text-gray-600'
              } border-b border-r flex items-center justify-center text-xs sticky left-0 z-10 transition-colors ${
                darkMode ? 'border-gray-800' : 'border-gray-300'
              }`}
            >
              {row}
            </div>
            
            {/* Cells */}
            {columns.map(col => {
              const cellId = `${col}${row}` as CellAddress;
              const isSelected = selectedCell === cellId;
              const isEditing = editingCell === cellId;
              const isAiGenerating = aiGeneratingCells.has(cellId);
              const isHighlighted = highlightedCells.has(cellId);
              const isInRange = isInSelectedRange(col, row);
              const cellInfo = cellData.get(cellId);
              const hasError = cellInfo?.error;
              
              return (
                <motion.div
                  key={cellId}
                  onClick={(e) => handleCellClick(col, row, e)}
                  onDoubleClick={() => handleCellDoubleClick(col, row)}
                  onMouseDown={() => handleCellMouseDown(col, row)}
                  onMouseEnter={() => handleCellMouseEnter(col, row)}
                  className={`w-24 h-7 relative cursor-cell group transition-all ${
                    darkMode ? 'border-gray-800' : 'border-gray-200'
                  } border-b border-r overflow-hidden`}
                  style={{
                    background: isSelected 
                      ? darkMode 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)'
                      : isInRange
                        ? darkMode 
                          ? 'rgba(16, 185, 129, 0.08)'
                          : 'rgba(99, 102, 241, 0.06)'
                        : isHighlighted
                          ? darkMode
                            ? 'rgba(234, 179, 8, 0.15)'
                            : 'rgba(234, 179, 8, 0.2)'
                          : darkMode
                            ? '#0a0a0f'
                            : '#ffffff',
                    boxShadow: isSelected 
                      ? darkMode
                        ? 'inset 0 0 0 2px rgba(16, 185, 129, 0.7)'
                        : 'inset 0 0 0 2px rgba(99, 102, 241, 0.7)'
                      : hasError
                        ? 'inset 0 0 0 1px rgba(239, 68, 68, 0.5)'
                        : 'none'
                  }}
                >
                  {/* Cell content */}
                  {isEditing ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      onBlur={commitEdit}
                      className={`absolute inset-0 w-full h-full px-1.5 text-xs outline-none ${
                        darkMode 
                          ? 'bg-gray-800 text-white' 
                          : 'bg-white text-gray-900'
                      }`}
                      style={{
                        boxShadow: darkMode
                          ? '0 0 0 2px rgba(16, 185, 129, 1), 0 0 20px rgba(16, 185, 129, 0.3)'
                          : '0 0 0 2px rgba(99, 102, 241, 1), 0 0 20px rgba(99, 102, 241, 0.2)'
                      }}
                    />
                  ) : (
                    <div className={`px-1.5 text-xs truncate ${
                      hasError
                        ? 'text-red-500'
                        : cellInfo?.raw?.startsWith('=')
                          ? darkMode ? 'text-emerald-400' : 'text-indigo-600'
                          : typeof cellInfo?.display === 'number'
                            ? darkMode ? 'text-blue-400 text-right' : 'text-blue-600 text-right'
                            : darkMode ? 'text-gray-200' : 'text-gray-900'
                    } h-full flex items-center ${typeof cellInfo?.display === 'number' ? 'justify-end' : ''}`}>
                      {hasError ? '#ERROR' : formatDisplayValue(cellInfo?.display ?? null)}
                    </div>
                  )}
                  
                  {/* Hover effect */}
                  {!isSelected && !isEditing && !isAiGenerating && (
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{
                        background: darkMode
                          ? 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.06) 0%, transparent 70%)'
                          : 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.04) 0%, transparent 70%)'
                      }}
                    />
                  )}
                  
                  {/* AI Generating Effect - Ghost typing */}
                  <AnimatePresence>
                    {isAiGenerating && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0"
                          style={{
                            background: darkMode
                              ? 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.2), transparent)'
                              : 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent)',
                            animation: 'shimmer 1s infinite'
                          }}
                        />
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`absolute bottom-0 left-0 h-0.5 ${darkMode ? 'bg-emerald-400' : 'bg-indigo-500'}`}
                          style={{
                            boxShadow: darkMode 
                              ? '0 0 10px rgba(16, 185, 129, 0.8)' 
                              : '0 0 10px rgba(99, 102, 241, 0.6)'
                          }}
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 0.4, repeat: Infinity }}
                          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg ${
                            darkMode ? 'text-emerald-400' : 'text-indigo-500'
                          }`}
                        >
                          ✨
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                  
                  {/* Highlighted cell glow */}
                  <AnimatePresence>
                    {isHighlighted && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow: 'inset 0 0 20px rgba(234, 179, 8, 0.5)',
                          border: '2px solid rgba(234, 179, 8, 0.7)',
                        }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Error indicator */}
                  {hasError && (
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-red-500" />
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Charts Layer */}
      {charts.map(chart => (
        <DraggableChart
          key={chart.id}
          chart={chart}
          darkMode={darkMode}
          cellData={cellData}
          onUpdate={(updates) => onChartUpdate(chart.id, updates)}
          onDelete={() => onChartDelete(chart.id)}
        />
      ))}
      
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
