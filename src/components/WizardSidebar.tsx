import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, Wand2, ChevronRight, Layout, Sparkles } from 'lucide-react';

interface WizardSidebarProps {
  darkMode: boolean;
  onClose: () => void;
  onGenerateApp: () => void;
}

export function WizardSidebar({ darkMode, onClose, onGenerateApp }: WizardSidebarProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, string[]>>({});
  
  const steps = [
    { 
      title: 'App Type', 
      description: 'What kind of app do you want to build?',
      options: ['Budget Tracker', 'Expense Manager', 'Invoice Generator', 'Inventory System', 'Project Tracker', 'Custom']
    },
    { 
      title: 'Data Structure', 
      description: 'What information will your app track?',
      options: ['Income & Expenses', 'Categories & Tags', 'Time Periods', 'Inventory Items', 'Custom Fields']
    },
    { 
      title: 'Features', 
      description: 'Select the features you need',
      options: ['Charts & Graphs', 'Automated Calculations', 'Data Export', 'Sharing', 'Notifications', 'Reports']
    },
    { 
      title: 'Finalize', 
      description: 'Review and create your app',
      options: []
    }
  ];

  const handleOptionSelect = (option: string) => {
    setSelections(prev => {
      const current = prev[currentStep] || [];
      if (current.includes(option)) {
        return { ...prev, [currentStep]: current.filter(o => o !== option) };
      }
      return { ...prev, [currentStep]: [...current, option] };
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isOptionSelected = (option: string) => {
    return (selections[currentStep] || []).includes(option);
  };

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      className={`w-[400px] ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-l flex flex-col shadow-2xl`}
      style={{
        boxShadow: darkMode
          ? '-10px 0 40px rgba(0, 0, 0, 0.5)'
          : '-10px 0 30px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div 
        className="p-6 relative overflow-hidden"
        style={{
          background: darkMode
            ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
        }}
      >
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30"
          style={{ background: darkMode ? '#10b981' : '#c4b5fd' }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layout className="text-white" size={20} />
              <h2 className="text-white font-semibold">App Builder Wizard</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  index <= currentStep 
                    ? darkMode ? 'bg-emerald-400' : 'bg-white'
                    : 'bg-white/20'
                }`}
                animate={index === currentStep ? {
                  boxShadow: darkMode
                    ? ['0 0 0 rgba(16, 185, 129, 0)', '0 0 15px rgba(16, 185, 129, 0.8)', '0 0 0 rgba(16, 185, 129, 0)']
                    : ['0 0 0 rgba(255, 255, 255, 0)', '0 0 15px rgba(255, 255, 255, 0.8)', '0 0 0 rgba(255, 255, 255, 0)']
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-3 text-white/70 text-xs">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% complete</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                {steps[currentStep].title}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {steps[currentStep].description}
              </p>
            </div>

            {currentStep < steps.length - 1 ? (
              <div className="space-y-2">
                {steps[currentStep].options.map((option, index) => (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isOptionSelected(option)
                        ? darkMode 
                          ? 'bg-emerald-900/30 border-2 border-emerald-500 text-white' 
                          : 'bg-indigo-50 border-2 border-indigo-500 text-gray-900'
                        : darkMode 
                          ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700 text-white' 
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isOptionSelected(option)
                          ? darkMode 
                            ? 'border-emerald-400 bg-emerald-500' 
                            : 'border-indigo-500 bg-indigo-500'
                          : darkMode 
                            ? 'border-gray-600' 
                            : 'border-gray-300'
                      } transition-colors`}>
                        {isOptionSelected(option) && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              // Final step - Review
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="space-y-4 mb-6">
                  {Object.entries(selections).map(([stepIndex, selected]) => {
                    if (selected.length === 0) return null;
                    const step = steps[Number(stepIndex)];
                    return (
                      <div key={stepIndex} className="flex items-start gap-3">
                        <Check size={18} className={darkMode ? 'text-emerald-400' : 'text-indigo-600'} />
                        <div>
                          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                            {step.title}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {selected.join(', ')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className={`p-4 rounded-lg mb-6 ${
                  darkMode ? 'bg-emerald-900/20 border border-emerald-800' : 'bg-indigo-50 border border-indigo-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className={darkMode ? 'text-emerald-400' : 'text-indigo-600'} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-emerald-400' : 'text-indigo-600'}`}>
                      AI will generate:
                    </span>
                  </div>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li className="flex items-center gap-2">
                      <ChevronRight size={14} /> Data entry form
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight size={14} /> Dashboard with charts
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight size={14} /> Automated formulas
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight size={14} /> Summary statistics
                    </li>
                  </ul>
                </div>
                
                <motion.button
                  onClick={onGenerateApp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-lg ${
                    darkMode ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  } flex items-center justify-center gap-2 font-medium transition-colors`}
                  style={{
                    boxShadow: darkMode
                      ? '0 0 25px rgba(16, 185, 129, 0.4)'
                      : '0 0 25px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <Wand2 size={18} />
                  <span>Generate App</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className={`p-4 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t flex gap-3`}>
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
            currentStep === 0
              ? darkMode ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300'
          }`}
        >
          Previous
        </button>
        
        {currentStep < steps.length - 1 && (
          <button
            onClick={handleNext}
            className={`flex-1 py-2.5 rounded-lg font-medium ${
              darkMode ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } flex items-center justify-center gap-2 transition-colors`}
          >
            <span>Next</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
