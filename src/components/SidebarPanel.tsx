import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Wand2, BarChart3, Layout, History, Zap, Sparkles } from 'lucide-react';
import type { CommandHistoryItem } from '../App';

interface SidebarPanelProps {
  darkMode: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onShowChart: () => void;
  onShowWizard: () => void;
  onActivateAI: () => void;
  commandHistory: CommandHistoryItem[];
  onCommandSelect: (command: string) => void;
  onShowMacroBuilder: () => void;
  onShowDataAnalyzer: () => void;
}

// Recently used formulas
const recentFormulas = [
  '=SUM(A1:A10)',
  '=AVERAGE(B2:B20)',
  '=IF(A1>100,"High","Low")',
  '=COUNT(C:C)',
  '=MAX(D1:D50)',
];

export function SidebarPanel({ 
  darkMode, 
  collapsed, 
  onToggleCollapse, 
  onShowChart, 
  onShowWizard,
  onActivateAI,
  commandHistory,
  onCommandSelect,
  onShowMacroBuilder,
  onShowDataAnalyzer,
}: SidebarPanelProps) {
  const suggestedCommands = [
    'Make a monthly budget tracker',
    'Create a running total',
    'Generate a chart for this data',
    'Build an inventory app',
    'Create a macro for data cleanup',
  ];

  return (
    <motion.div
      animate={{ width: collapsed ? 44 : 260 }}
      className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r flex flex-col transition-colors`}
    >

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className={`px-3 py-2 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between`}>
              <div>
                <h2 className={`${darkMode ? 'text-emerald-400' : 'text-indigo-600'} flex items-center gap-1.5 font-semibold text-sm`}>
                  <Wand2 size={14} />
                  Specter Powers
                </h2>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  AI-powered magic
                </p>
              </div>
              <button 
                onClick={onToggleCollapse}
                className={`p-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <ChevronLeft size={16} />
              </button>
            </div>

            {/* Main Actions - Each does something different */}
            <div className="px-3 py-3 space-y-2">
              {/* AI Analyze - Uses Groq to analyze existing data */}
              <motion.button
                onClick={onShowDataAnalyzer}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full px-3 py-2.5 rounded-lg ${
                  darkMode ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
                } flex items-center justify-center gap-2 transition-all text-xs font-semibold`}
                style={{
                  boxShadow: darkMode 
                    ? '0 0 25px rgba(16, 185, 129, 0.4)' 
                    : '0 0 20px rgba(99, 102, 241, 0.4)'
                }}
              >
                <Sparkles size={14} />
                <span>AI Analyze Data</span>
              </motion.button>

              {/* Grid of 4 distinct actions */}
              <div className="grid grid-cols-2 gap-1.5">
                <motion.button
                  onClick={onShowChart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-2.5 rounded-lg ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
                  } flex flex-col items-center gap-1 transition-colors`}
                >
                  <BarChart3 size={18} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                  <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Chart</span>
                </motion.button>

                <motion.button
                  onClick={onShowWizard}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-2.5 rounded-lg ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
                  } flex flex-col items-center gap-1 transition-colors`}
                >
                  <Layout size={18} className={darkMode ? 'text-emerald-400' : 'text-emerald-600'} />
                  <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>App</span>
                </motion.button>

                <motion.button
                  onClick={onShowMacroBuilder}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-2.5 rounded-lg ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
                  } flex flex-col items-center gap-1 transition-colors`}
                >
                  <Zap size={18} className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                  <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Macro</span>
                </motion.button>

                <motion.button
                  onClick={onActivateAI}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-2.5 rounded-lg ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
                  } flex flex-col items-center gap-1 transition-colors`}
                >
                  <Wand2 size={18} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
                  <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>AI Chat</span>
                </motion.button>
              </div>
            </div>

            {/* Try These Commands */}
            <div className={`px-3 py-3 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Wand2 size={12} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                <span className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Try These
                </span>
              </div>
              <div className="space-y-1">
                {suggestedCommands.slice(0, 3).map((cmd, index) => (
                  <button
                    key={index}
                    onClick={() => onCommandSelect(cmd)}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                      darkMode 
                        ? 'text-gray-400 hover:text-emerald-400 hover:bg-gray-800' 
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
                    }`}
                  >
                    → {cmd}
                  </button>
                ))}
              </div>
            </div>

            {/* Command History */}
            <div className={`flex-1 overflow-hidden border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="px-3 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <History size={12} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Command History
                  </span>
                </div>
                
                <div className="space-y-1.5 overflow-y-auto max-h-[180px] pr-1 custom-scrollbar">
                  {commandHistory.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onCommandSelect(item.command)}
                      className={`w-full p-2 rounded-lg text-left ${
                        darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'
                      } cursor-pointer transition-colors group`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                          {item.time}
                        </span>
                        <span className={`text-xs px-1 py-0.5 rounded ${
                          item.status === 'completed'
                            ? darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-green-100 text-green-600'
                            : darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600'
                        }`}>
                          ✓
                        </span>
                      </div>
                      <div className={`text-xs ${
                        darkMode 
                          ? 'text-gray-300 group-hover:text-emerald-400' 
                          : 'text-gray-700 group-hover:text-indigo-600'
                      } transition-colors line-clamp-2`}>
                        {item.command}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed State Icons */}
      {collapsed && (
        <div className="flex flex-col items-center py-2 gap-1">
          <button 
            onClick={onToggleCollapse} 
            className={`p-1.5 rounded transition-colors mb-2 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ChevronRight size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
          </button>
          <button onClick={onActivateAI} className={`p-1.5 rounded transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <Wand2 size={16} className={darkMode ? 'text-emerald-400' : 'text-indigo-600'} />
          </button>
          <button onClick={onShowChart} className={`p-1.5 rounded transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <BarChart3 size={16} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
          </button>
          <button onClick={onShowWizard} className={`p-1.5 rounded transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <Layout size={16} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
          </button>
          <button onClick={onShowMacroBuilder} className={`p-1.5 rounded transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <Zap size={16} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
          </button>
        </div>
      )}
    </motion.div>
  );
}
