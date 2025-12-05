import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, Terminal, Check, TrendingUp, Code2, BarChart3, Paintbrush, Database, Loader2 } from 'lucide-react';
import type { AIAction } from '../App';

interface AIOutputDrawerProps {
  darkMode: boolean;
  isOpen: boolean;
  onToggle: () => void;
  aiActions: AIAction[];
  aiThinking: boolean;
  onActionClick: (action: AIAction) => void;
}

export function AIOutputDrawer({ 
  darkMode, 
  isOpen, 
  onToggle, 
  aiActions,
  aiThinking,
  onActionClick,
}: AIOutputDrawerProps) {
  const getActionIcon = (type: AIAction['type']) => {
    switch (type) {
      case 'formula':
        return <Code2 size={14} className="text-emerald-400" />;
      case 'chart':
        return <BarChart3 size={14} className="text-blue-400" />;
      case 'macro':
        return <TrendingUp size={14} className="text-purple-400" />;
      case 'format':
        return <Paintbrush size={14} className="text-pink-400" />;
      case 'data':
        return <Database size={14} className="text-orange-400" />;
      default:
        return <Check size={14} className="text-emerald-400" />;
    }
  };

  const getActionTypeLabel = (type: AIAction['type']) => {
    switch (type) {
      case 'formula':
        return 'Formula';
      case 'chart':
        return 'Chart';
      case 'macro':
        return 'Macro';
      case 'format':
        return 'Format';
      case 'data':
        return 'Data';
      default:
        return 'Action';
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? 260 : 36 }}
      className={`${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-900 border-gray-700'} border-t relative flex flex-col`}
      style={{
        boxShadow: isOpen 
          ? darkMode 
            ? '0 -10px 40px rgba(16, 185, 129, 0.1)' 
            : '0 -10px 40px rgba(99, 102, 241, 0.1)'
          : 'none'
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className={`w-full h-9 px-3 flex items-center justify-between transition-colors ${
          darkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={aiThinking ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: aiThinking ? Infinity : 0, ease: 'linear' }}
          >
            <Terminal size={14} className={darkMode ? 'text-emerald-400' : 'text-indigo-400'} />
          </motion.div>
          <span className={`text-xs font-medium ${darkMode ? 'text-emerald-400' : 'text-indigo-400'}`}>
            AI Activity Log
          </span>
          
          {/* Status indicator */}
          {aiThinking ? (
            <div className="flex items-center gap-1.5">
              <Loader2 size={12} className={`animate-spin ${darkMode ? 'text-emerald-400' : 'text-indigo-400'}`} />
              <span className={`text-xs ${darkMode ? 'text-emerald-400/70' : 'text-indigo-400/70'}`}>
                Processing...
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-emerald-400' : 'bg-indigo-400'}`}
              />
              <span className="text-xs text-gray-500">
                {aiActions.length} action{aiActions.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1.5">
          {!isOpen && aiActions.length > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-indigo-900/50 text-indigo-400'
            }`}>
              {aiActions[0]?.action.slice(0, 25)}...
            </span>
          )}
          {isOpen ? (
            <ChevronDown size={14} className="text-gray-500" />
          ) : (
            <ChevronUp size={14} className="text-gray-500" />
          )}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-hidden flex flex-col"
          >
            {/* Filter tabs */}
            <div className={`flex gap-0.5 px-3 py-1.5 border-b ${darkMode ? 'border-gray-800' : 'border-gray-700'}`}>
              {['All', 'Formula', 'Chart', 'Data', 'Macro'].map((filter) => (
                <button
                  key={filter}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    filter === 'All'
                      ? darkMode 
                        ? 'bg-emerald-900/50 text-emerald-400' 
                        : 'bg-indigo-900/50 text-indigo-400'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            {/* Actions list */}
            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs custom-scrollbar">
              {aiActions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-600">
                  <Terminal size={24} className="mb-1.5 opacity-50" />
                  <p className="text-xs">No AI actions yet</p>
                  <p className="text-xs mt-0.5 opacity-70">Use the AI command bar to get started</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {aiActions.map((action, index) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onActionClick(action)}
                      className={`flex gap-2 p-2 rounded cursor-pointer transition-all group ${
                        darkMode 
                          ? 'hover:bg-gray-800/80' 
                          : 'hover:bg-gray-800/50'
                      }`}
                      style={{
                        background: darkMode
                          ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.03) 0%, transparent 100%)'
                          : 'linear-gradient(90deg, rgba(99, 102, 241, 0.03) 0%, transparent 100%)'
                      }}
                    >
                      {/* Timestamp */}
                      <span className="text-gray-600 text-xs min-w-[48px] font-normal">
                        {action.time}
                      </span>
                      
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {getActionIcon(action.type)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-xs ${darkMode ? 'text-emerald-400' : 'text-indigo-400'} group-hover:text-emerald-300`}>
                            {action.action}
                          </span>
                          <span className={`text-xs px-1 py-0.5 rounded ${
                            darkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-700 text-gray-400'
                          }`}>
                            {getActionTypeLabel(action.type)}
                          </span>
                        </div>
                        
                        <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {action.detail}
                        </div>
                        
                        {/* Affected cells badges */}
                        {action.affectedCells && action.affectedCells.length > 0 && (
                          <div className="flex gap-0.5 mt-1 flex-wrap">
                            {action.affectedCells.slice(0, 5).map((cell) => (
                              <span
                                key={cell}
                                className={`text-xs px-1 py-0.5 rounded font-mono ${
                                  darkMode 
                                    ? 'bg-emerald-900/30 text-emerald-400 group-hover:bg-emerald-900/50' 
                                    : 'bg-indigo-900/30 text-indigo-400 group-hover:bg-indigo-900/50'
                                }`}
                              >
                                {cell}
                              </span>
                            ))}
                            {action.affectedCells.length > 5 && (
                              <span className="text-xs text-gray-600">
                                +{action.affectedCells.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Click indicator */}
                      <div className={`opacity-0 group-hover:opacity-100 transition-opacity text-xs ${
                        darkMode ? 'text-emerald-400' : 'text-indigo-400'
                      }`}>
                        →
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* AI Thinking indicator at bottom */}
                  {aiThinking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 p-2"
                    >
                      <span className="text-gray-600 text-xs min-w-[48px]">now</span>
                      <Loader2 size={12} className={`animate-spin ${darkMode ? 'text-emerald-400' : 'text-indigo-400'}`} />
                      <span className={`text-xs ${darkMode ? 'text-emerald-400/70' : 'text-indigo-400/70'}`}>
                        AI is processing your request...
                      </span>
                    </motion.div>
                  )}
                  
                  {/* Cursor */}
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex gap-2 pl-2"
                  >
                    <span className="text-gray-600 text-xs min-w-[48px]">_</span>
                    <span className={`text-xs ${darkMode ? 'text-emerald-400' : 'text-indigo-400'}`}>▊</span>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
