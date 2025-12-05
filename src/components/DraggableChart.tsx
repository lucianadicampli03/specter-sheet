import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { X, Move, Maximize2, Minimize2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Chart, CellAddress, CellValue } from '../types';

interface DraggableChartProps {
  chart: Chart;
  darkMode: boolean;
  cellData: Map<CellAddress, { raw: string; display: CellValue; error: string | null }>;
  onUpdate: (updates: Partial<Chart>) => void;
  onDelete: () => void;
}

export function DraggableChart({
  chart,
  darkMode,
  cellData,
  onUpdate,
  onDelete,
}: DraggableChartProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const resizeStart = useRef({ width: 0, height: 0, x: 0, y: 0 });

  // Get data from cells or use sample data
  const getData = () => {
    const data = [];
    for (let i = 1; i <= 6; i++) {
      const labelCell = cellData.get(`A${i}` as CellAddress);
      const valueCell = cellData.get(`B${i}` as CellAddress);
      
      if (labelCell?.display || valueCell?.display) {
        data.push({
          name: String(labelCell?.display || `Item ${i}`),
          value: Number(valueCell?.display) || 0,
        });
      }
    }
    
    if (data.length === 0) {
      return [
        { name: 'Jan', value: 4200 },
        { name: 'Feb', value: 5800 },
        { name: 'Mar', value: 4900 },
        { name: 'Apr', value: 7300 },
        { name: 'May', value: 8100 },
        { name: 'Jun', value: 9500 },
      ];
    }
    
    return data;
  };

  const data = getData();
  
  const colors = darkMode 
    ? ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1']
    : ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'];

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: chart.position.x,
      posY: chart.position.y,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      onUpdate({
        position: {
          x: Math.max(0, dragStart.current.posX + dx),
          y: Math.max(0, dragStart.current.posY + dy),
        },
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [chart.position, onUpdate]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = {
      width: chart.size.width,
      height: chart.size.height,
      x: e.clientX,
      y: e.clientY,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      onUpdate({
        size: {
          width: Math.max(200, resizeStart.current.width + dx),
          height: Math.max(150, resizeStart.current.height + dy),
        },
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [chart.size, onUpdate]);

  const renderChart = () => {
    if (isMinimized) return null;
    
    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} opacity={0.3} />
              <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={10} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} opacity={0.3} />
              <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={10} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={darkMode ? '#10b981' : '#6366f1'} 
                strokeWidth={2}
                dot={{ fill: darkMode ? '#10b981' : '#6366f1', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="70%"
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        width: isMinimized ? 200 : chart.size.width,
        height: isMinimized ? 40 : chart.size.height,
      }}
      className={`absolute rounded-xl overflow-hidden ${
        darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      } ${isDragging || isResizing ? 'z-50' : 'z-20'}`}
      style={{
        left: chart.position.x,
        top: chart.position.y,
        boxShadow: isHovered || isDragging
          ? darkMode
            ? '0 0 30px rgba(16, 185, 129, 0.3), 0 10px 40px rgba(0, 0, 0, 0.5)'
            : '0 0 30px rgba(99, 102, 241, 0.2), 0 10px 40px rgba(0, 0, 0, 0.2)'
          : darkMode
            ? '0 4px 20px rgba(0, 0, 0, 0.4)'
            : '0 4px 20px rgba(0, 0, 0, 0.1)',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div 
        className={`h-10 px-3 flex items-center justify-between cursor-grab ${
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2">
          <Move size={14} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
          <span className={`text-sm font-medium truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {chart.config.title || 'Chart'}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Data binding indicator */}
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-indigo-100 text-indigo-600'
          }`}>
            {chart.dataRange.start}:{chart.dataRange.end}
          </span>
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`p-1 rounded transition-colors ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
            }`}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          
          <button
            onClick={onDelete}
            className={`p-1 rounded transition-colors ${
              darkMode ? 'hover:bg-red-900/50 text-gray-400 hover:text-red-400' : 'hover:bg-red-100 text-gray-500 hover:text-red-500'
            }`}
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      {/* Chart Content */}
      {!isMinimized && (
        <div className="relative" style={{ height: chart.size.height - 40 }}>
          {renderChart()}
          
          {/* Glow effect when hovered */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: darkMode
                  ? 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 70%)'
                  : 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 70%)'
              }}
            />
          )}
        </div>
      )}
      
      {/* Resize Handle */}
      {!isMinimized && (
        <div
          className={`absolute bottom-0 right-0 w-4 h-4 cursor-se-resize ${
            isHovered ? 'opacity-100' : 'opacity-0'
          } transition-opacity`}
          onMouseDown={handleResizeStart}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className={darkMode ? 'text-gray-600' : 'text-gray-400'}
          >
            <path
              fill="currentColor"
              d="M14 14H10V12H12V10H14V14ZM14 6H12V8H14V6ZM8 12H6V14H10V12H8Z"
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

