import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import type { CellAddress } from '../types';

interface FormulaBarProps {
  darkMode: boolean;
  aiActive: boolean;
  aiThinking: boolean;
  selectedCell: CellAddress | null;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  aiCommand: string;
  onAICommandChange: (command: string) => void;
  onAICommandSubmit: () => void;
}

export function FormulaBar({
  darkMode,
  aiActive,
  aiThinking,
  selectedCell,
  value,
  onChange,
  onSubmit,
  aiCommand,
  onAICommandChange,
  onAICommandSubmit,
}: FormulaBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);

  // Focus AI input when AI mode is active
  useEffect(() => {
    if (aiActive && aiInputRef.current) {
      aiInputRef.current.focus();
    }
  }, [aiActive]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    } else if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  const handleAIKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !aiThinking) {
      e.preventDefault();
      onAICommandSubmit();
    } else if (e.key === 'Escape') {
      onAICommandChange('');
    }
  };

  const suggestedCommands = [
    'Make a monthly budget tracker',
    'Create a running total',
    'Generate a chart',
    'Build an inventory app',
  ];

  return (
    <div className={`${
      aiActive 
        ? darkMode 
          ? 'bg-emerald-950/50 border-emerald-800' 
          : 'bg-indigo-50 border-indigo-200'
        : darkMode 
          ? 'bg-gray-900/95 border-gray-800' 
          : 'bg-white/95 border-gray-200'
    } border-b px-3 py-1.5 transition-colors backdrop-blur-sm relative z-40`}>
      <div className="flex items-center gap-2">
        {/* Cell Address or AI indicator */}
        <div className={`px-2 py-1 rounded min-w-[50px] text-center font-mono text-xs ${
          aiActive
            ? darkMode 
              ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700' 
              : 'bg-indigo-100 text-indigo-600 border border-indigo-300'
            : darkMode 
              ? 'bg-gray-800 text-emerald-400 border border-gray-700' 
              : 'bg-gray-100 text-indigo-600 border border-gray-300'
        }`}>
          {aiActive ? '✨ AI' : (selectedCell || '—')}
        </div>
        
        {/* fx indicator */}
        <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-xs font-medium`}>
          {aiActive ? 'ask' : 'fx'}
        </span>
        
        {/* Formula/Value Input */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {!aiActive ? (
              <motion.div
                key="formula"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={selectedCell ? 'Enter value or formula (start with =)' : 'Select a cell'}
                  disabled={!selectedCell}
                  className={`w-full px-2.5 py-1.5 rounded text-xs ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 disabled:bg-gray-850 disabled:text-gray-600' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-400'
                  } border focus:outline-none focus:ring-2 ${
                    darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-indigo-500/50'
                  } transition-all`}
                  style={{
                    fontFamily: value.startsWith('=') ? 'monospace' : 'inherit',
                  }}
                />
                
                {/* Formula indicator */}
                {value.startsWith('=') && (
                  <div className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs px-1.5 py-0.5 rounded ${
                    darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    fx
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="relative"
              >
                <input
                  ref={aiInputRef}
                  type="text"
                  value={aiCommand}
                  onChange={(e) => onAICommandChange(e.target.value)}
                  onKeyDown={handleAIKeyDown}
                  placeholder="Ask anything… e.g., 'Create a monthly budget tracker'"
                  disabled={aiThinking}
                  className={`w-full px-2.5 py-1.5 pr-10 rounded text-xs ${
                    darkMode 
                      ? 'bg-gray-800 text-white placeholder-gray-500' 
                      : 'bg-gray-50 text-gray-900 placeholder-gray-400'
                  } border-2 focus:outline-none transition-all`}
                  style={{
                    borderColor: darkMode ? 'rgba(16, 185, 129, 0.5)' : 'rgba(99, 102, 241, 0.5)',
                    boxShadow: darkMode 
                      ? '0 0 20px rgba(16, 185, 129, 0.15)' 
                      : '0 0 20px rgba(99, 102, 241, 0.1)'
                  }}
                />
                
                {/* Send button or loading */}
                <button
                  onClick={onAICommandSubmit}
                  disabled={aiThinking || !aiCommand.trim()}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${
                    aiThinking || !aiCommand.trim()
                      ? darkMode ? 'text-gray-600' : 'text-gray-400'
                      : darkMode ? 'text-emerald-400 hover:bg-emerald-900/30' : 'text-indigo-600 hover:bg-indigo-100'
                  }`}
                >
                  {aiThinking ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </button>
                
                {/* AI thinking animation */}
                {aiThinking && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: darkMode
                          ? 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent)'
                          : 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.08), transparent)',
                      }}
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
        
      </div>
      
      {/* AI Status Bar */}
      <AnimatePresence>
        {aiThinking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-1.5 flex items-center gap-1.5 text-xs ${
              darkMode ? 'text-emerald-400' : 'text-indigo-600'
            }`}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={12} />
            </motion.div>
            <span>AI is thinking</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ...
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
