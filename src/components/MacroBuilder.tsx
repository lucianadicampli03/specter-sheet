import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Plus, ChevronRight, Code2, Zap, Settings, Copy, CheckCircle2 } from 'lucide-react';
import type { Macro, MacroAction } from '../types';

interface MacroBuilderProps {
  darkMode: boolean;
  macros: Macro[];
  onClose: () => void;
  onRunMacro: (macro: Macro) => void;
  onCreateMacro: (macro: Macro) => void;
}

export function MacroBuilder({
  darkMode,
  macros,
  onClose,
  onRunMacro,
  onCreateMacro,
}: MacroBuilderProps) {
  const [selectedMacro, setSelectedMacro] = useState<Macro | null>(macros[0] || null);
  const [isRunning, setIsRunning] = useState(false);
  const [runningStep, setRunningStep] = useState<number | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));

  // Default macros if none exist
  const defaultMacros: Macro[] = [
    {
      id: 'default-1',
      name: 'Data Cleanup',
      description: 'Remove empty rows and format data',
      trigger: { type: 'manual' },
      actions: [
        { type: 'set-cell', address: 'A1', value: 'Cleaned Data' },
        { type: 'set-cell', address: 'B1', value: 'Status' },
        { type: 'show-alert', message: 'Data cleanup complete!' },
      ],
      code: `// Auto-generated macro
function cleanupData() {
  // Remove empty rows
  const range = sheet.getRange('A:A');
  range.removeEmptyRows();
  
  // Apply formatting
  sheet.getRange('A1:B1').setBold(true);
  
  alert('Cleanup complete!');
}`,
      enabled: true,
    },
    {
      id: 'default-2',
      name: 'Auto-Calculate Totals',
      description: 'Add SUM formulas to bottom of columns',
      trigger: { type: 'manual' },
      actions: [
        { type: 'run-formula', formula: '=SUM(B2:B10)', target: 'B11' },
        { type: 'run-formula', formula: '=SUM(C2:C10)', target: 'C11' },
        { type: 'set-cell', address: 'A11', value: 'Total' },
      ],
      code: `// Auto-generated macro
function calculateTotals() {
  // Add totals row
  sheet.setCell('A11', 'Total');
  sheet.setCell('B11', '=SUM(B2:B10)');
  sheet.setCell('C11', '=SUM(C2:C10)');
}`,
      enabled: true,
    },
  ];

  const displayMacros = macros.length > 0 ? macros : defaultMacros;

  const handleRunMacro = async (macro: Macro) => {
    setIsRunning(true);
    setSelectedMacro(macro);
    
    for (let i = 0; i < macro.actions.length; i++) {
      setRunningStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    onRunMacro(macro);
    setRunningStep(null);
    setIsRunning(false);
  };

  const getActionDescription = (action: MacroAction): string => {
    switch (action.type) {
      case 'set-cell':
        return `Set cell ${action.address} to "${action.value}"`;
      case 'set-range':
        return `Update range ${action.range.start}:${action.range.end}`;
      case 'show-alert':
        return `Show message: "${action.message}"`;
      case 'run-formula':
        return `Run formula ${action.formula} in ${action.target}`;
      default:
        return 'Unknown action';
    }
  };

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleCreateNew = () => {
    const newMacro: Macro = {
      id: crypto.randomUUID(),
      name: 'New Macro',
      description: 'Custom automation',
      trigger: { type: 'manual' },
      actions: [
        { type: 'show-alert', message: 'Hello from SpecterSheet!' },
      ],
      code: '// Your custom macro code here\nfunction run() {\n  // ...\n}',
      enabled: true,
    };
    onCreateMacro(newMacro);
    setSelectedMacro(newMacro);
  };

  return (
    <motion.div
      initial={{ x: 340 }}
      animate={{ x: 0 }}
      exit={{ x: 340 }}
      className={`w-80 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-l flex flex-col shadow-2xl`}
      style={{
        boxShadow: darkMode
          ? '-10px 0 40px rgba(0, 0, 0, 0.5)'
          : '-10px 0 30px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div 
        className="p-3 relative overflow-hidden"
        style={{
          background: darkMode
            ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
            : 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)'
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Zap className="text-white" size={16} />
              <h2 className="text-white font-semibold text-sm">Macro Builder</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
          <p className="text-white/70 text-sm">Automate repetitive tasks with AI-generated macros</p>
        </div>
      </div>

      {/* Macro List */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your Macros
          </span>
          <button
            onClick={handleCreateNew}
            className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
              darkMode 
                ? 'bg-purple-900/50 text-purple-400 hover:bg-purple-900/70' 
                : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
            }`}
          >
            <Plus size={14} />
            New
          </button>
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
          {displayMacros.map((macro) => (
            <motion.button
              key={macro.id}
              onClick={() => setSelectedMacro(macro)}
              whileHover={{ scale: 1.01 }}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                selectedMacro?.id === macro.id
                  ? darkMode
                    ? 'bg-purple-900/30 border border-purple-700'
                    : 'bg-indigo-50 border border-indigo-300'
                  : darkMode
                    ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {macro.name}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  macro.enabled
                    ? darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-green-100 text-green-600'
                    : darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500'
                }`}>
                  {macro.enabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {macro.description}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Macro Details */}
      {selectedMacro && (
        <div className="flex-1 overflow-y-auto p-4">
          {/* Actions */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Settings size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Steps ({selectedMacro.actions.length})
              </span>
            </div>
            
            <div className="space-y-2">
              {selectedMacro.actions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-lg overflow-hidden ${
                    runningStep === index
                      ? darkMode
                        ? 'bg-purple-900/40 border-2 border-purple-500'
                        : 'bg-indigo-100 border-2 border-indigo-400'
                      : darkMode
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => toggleStep(index)}
                    className="w-full p-3 flex items-center gap-3"
                  >
                    {/* Step number */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      runningStep === index
                        ? darkMode ? 'bg-purple-500 text-white' : 'bg-indigo-500 text-white'
                        : runningStep !== null && index < runningStep
                          ? darkMode ? 'bg-emerald-600 text-white' : 'bg-green-500 text-white'
                          : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {runningStep !== null && index < runningStep ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    
                    {/* Action description */}
                    <span className={`flex-1 text-left text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {getActionDescription(action)}
                    </span>
                    
                    {/* Expand icon */}
                    <ChevronRight 
                      size={16} 
                      className={`transition-transform ${
                        expandedSteps.has(index) ? 'rotate-90' : ''
                      } ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                    />
                    
                    {/* Running animation */}
                    {runningStep === index && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className={`w-2 h-2 rounded-full ${
                          darkMode ? 'bg-purple-400' : 'bg-indigo-500'
                        }`}
                      />
                    )}
                  </button>
                  
                  {/* Expanded details */}
                  <AnimatePresence>
                    {expandedSteps.has(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`px-3 pb-3 border-t ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      >
                        <div className="pt-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              Type:
                            </span>
                            <code className={`text-xs px-1.5 py-0.5 rounded ${
                              darkMode ? 'bg-gray-700 text-purple-400' : 'bg-gray-100 text-indigo-600'
                            }`}>
                              {action.type}
                            </code>
                          </div>
                          {action.type === 'set-cell' && (
                            <>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  Target:
                                </span>
                                <code className={`text-xs px-1.5 py-0.5 rounded ${
                                  darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-green-100 text-green-600'
                                }`}>
                                  {action.address}
                                </code>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  Value:
                                </span>
                                <code className={`text-xs px-1.5 py-0.5 rounded ${
                                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {action.value}
                                </code>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Code Preview */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Code2 size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Generated Code
              </span>
            </div>
            
            <div className={`rounded-lg p-3 font-mono text-xs overflow-x-auto ${
              darkMode ? 'bg-gray-950 border border-gray-800' : 'bg-gray-100 border border-gray-200'
            }`}>
              <pre className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                {selectedMacro.code}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'} flex gap-3`}>
        <button
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            darkMode 
              ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          <Copy size={16} />
          Duplicate
        </button>
        
        <motion.button
          onClick={() => selectedMacro && handleRunMacro(selectedMacro)}
          disabled={!selectedMacro || isRunning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isRunning
              ? darkMode
                ? 'bg-purple-900/50 text-purple-400'
                : 'bg-indigo-200 text-indigo-600'
              : darkMode 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
          style={{
            boxShadow: !isRunning && darkMode
              ? '0 0 20px rgba(168, 85, 247, 0.3)'
              : !isRunning
                ? '0 0 20px rgba(99, 102, 241, 0.2)'
                : 'none'
          }}
        >
          {isRunning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Zap size={16} />
              </motion.div>
              Running...
            </>
          ) : (
            <>
              <Play size={16} />
              Run Macro
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

