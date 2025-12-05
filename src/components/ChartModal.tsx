import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, BarChart3, LineChart, PieChart, ScatterChart, Sparkles } from 'lucide-react';
import { BarChart, Bar, LineChart as ReLineChart, Line, PieChart as RePieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { CellAddress, CellValue, Chart } from '../types';

interface ChartModalProps {
  darkMode: boolean;
  onClose: () => void;
  onConfirm: (config: Partial<Chart>) => void;
  pendingChart: Partial<Chart> | null;
  cellData: Map<CellAddress, { raw: string; display: CellValue; error: string | null }>;
}

export function ChartModal({
  darkMode,
  onClose,
  onConfirm,
  pendingChart,
  cellData,
}: ChartModalProps) {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'scatter'>(pendingChart?.type || 'bar');
  const [chartTitle, setChartTitle] = useState(pendingChart?.config?.title || 'My Chart');
  const [dataRange, setDataRange] = useState('A1:B6');

  // Generate sample data from cellData or use defaults
  const getSampleData = () => {
    // Try to extract data from cells
    const data = [];
    for (let i = 1; i <= 6; i++) {
      const labelCell = cellData.get(`A${i}` as CellAddress);
      const valueCell = cellData.get(`B${i}` as CellAddress);
      
      if (labelCell?.display || valueCell?.display) {
        data.push({
          name: String(labelCell?.display || `Item ${i}`),
          value: Number(valueCell?.display) || Math.floor(Math.random() * 100) + 20,
        });
      }
    }
    
    // If no data found, use sample data
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

  const data = getSampleData();
  
  const colors = darkMode 
    ? ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1']
    : ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'];

  const chartTypes = [
    { type: 'bar' as const, icon: BarChart3, label: 'Bar Chart' },
    { type: 'line' as const, icon: LineChart, label: 'Line Chart' },
    { type: 'pie' as const, icon: PieChart, label: 'Pie Chart' },
    { type: 'scatter' as const, icon: ScatterChart, label: 'Scatter' },
  ];

  const handleConfirm = () => {
    onConfirm({
      type: chartType,
      dataRange: { start: 'A1', end: 'B6' },
      config: {
        type: chartType,
        dataRange: { start: 'A1', end: 'B6' },
        title: chartTitle,
      },
    });
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} opacity={0.3} />
              <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <ReLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} opacity={0.3} />
              <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={darkMode ? '#10b981' : '#6366f1'} 
                strokeWidth={3}
                dot={{ fill: darkMode ? '#10b981' : '#6366f1', strokeWidth: 2 }}
              />
            </ReLineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
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
                  borderRadius: '8px',
                }}
              />
            </RePieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip />
              <Bar dataKey="value" fill={darkMode ? '#10b981' : '#6366f1'} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden`}
          style={{
            boxShadow: darkMode 
              ? '0 0 60px rgba(16, 185, 129, 0.2), 0 20px 40px rgba(0, 0, 0, 0.8)' 
              : '0 0 60px rgba(99, 102, 241, 0.15), 0 20px 40px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Header */}
          <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-900/50' : 'bg-indigo-100'}`}
              >
                <Sparkles className={darkMode ? 'text-emerald-400' : 'text-indigo-600'} size={20} />
              </motion.div>
              <div>
                <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Create Chart
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Visualize your data with AI assistance
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6">
            {/* Chart Type Selection */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Chart Type
              </label>
              <div className="grid grid-cols-4 gap-3">
                {chartTypes.map(({ type, icon: Icon, label }) => (
                  <motion.button
                    key={type}
                    onClick={() => setChartType(type)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      chartType === type
                        ? darkMode
                          ? 'border-emerald-500 bg-emerald-900/30'
                          : 'border-indigo-500 bg-indigo-50'
                        : darkMode
                          ? 'border-gray-700 hover:border-gray-600 bg-gray-800'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                  >
                    <Icon size={24} className={
                      chartType === type
                        ? darkMode ? 'text-emerald-400' : 'text-indigo-600'
                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                    } />
                    <span className={`text-xs ${
                      chartType === type
                        ? darkMode ? 'text-emerald-400' : 'text-indigo-600'
                        : darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {label}
                    </span>
                    {chartType === type && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`}
                      >
                        <Check size={12} className="text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Chart Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Chart Title
                </label>
                <input
                  type="text"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 ${
                    darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-indigo-500/50'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Data Range
                </label>
                <input
                  type="text"
                  value={dataRange}
                  onChange={(e) => setDataRange(e.target.value)}
                  placeholder="A1:B10"
                  className={`w-full px-3 py-2 rounded-lg border font-mono ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-emerald-400' 
                      : 'bg-white border-gray-300 text-indigo-600'
                  } focus:outline-none focus:ring-2 ${
                    darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-indigo-500/50'
                  }`}
                />
              </div>
            </div>
            
            {/* Chart Preview */}
            <div className={`rounded-xl p-4 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Preview
                </h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                }`}>
                  Live preview
                </span>
              </div>
              
              {/* Glowing chart container */}
              <motion.div
                className="relative"
                animate={{
                  boxShadow: darkMode
                    ? ['0 0 0 rgba(16, 185, 129, 0)', '0 0 30px rgba(16, 185, 129, 0.2)', '0 0 0 rgba(16, 185, 129, 0)']
                    : ['0 0 0 rgba(99, 102, 241, 0)', '0 0 30px rgba(99, 102, 241, 0.15)', '0 0 0 rgba(99, 102, 241, 0)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {renderChart()}
              </motion.div>
            </div>
            
            {/* Data Binding Preview */}
            <div className={`p-3 rounded-lg mb-6 flex items-center gap-3 ${
              darkMode ? 'bg-emerald-900/20 border border-emerald-800' : 'bg-indigo-50 border border-indigo-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-emerald-400' : 'bg-indigo-500'}`} />
              <span className={`text-sm ${darkMode ? 'text-emerald-400' : 'text-indigo-600'}`}>
                Chart will be linked to cells {dataRange}. Updates automatically when data changes.
              </span>
            </div>
          </div>
          
          {/* Footer */}
          <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex justify-end gap-3`}>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <motion.button
              onClick={handleConfirm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
                darkMode 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              style={{
                boxShadow: darkMode
                  ? '0 0 20px rgba(16, 185, 129, 0.3)'
                  : '0 0 20px rgba(99, 102, 241, 0.2)'
              }}
            >
              <Check size={18} />
              Add to Sheet
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

