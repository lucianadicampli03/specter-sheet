import { motion, AnimatePresence } from 'motion/react';
import { X, FileSpreadsheet, Sparkles, TrendingUp, ShoppingCart, Users, Calendar } from 'lucide-react';

interface CreateSheetModalProps {
  darkMode: boolean;
  onClose: () => void;
  onSelectTemplate: (template: string) => void;
}

export function CreateSheetModal({ darkMode, onClose, onSelectTemplate }: CreateSheetModalProps) {
  const templates = [
    { 
      name: 'Blank SpecterSheet', 
      description: 'Start from scratch with an empty canvas',
      icon: FileSpreadsheet,
      gradient: 'from-gray-600 to-gray-700'
    },
    { 
      name: 'AI-Powered Budget', 
      description: 'Smart budget tracker with automated insights',
      icon: Sparkles,
      gradient: darkMode ? 'from-emerald-600 to-teal-700' : 'from-indigo-500 to-purple-600'
    },
    { 
      name: 'Revenue Dashboard', 
      description: 'Track sales and revenue with real-time calculations',
      icon: TrendingUp,
      gradient: darkMode ? 'from-blue-600 to-cyan-700' : 'from-blue-500 to-cyan-600'
    },
    { 
      name: 'Inventory Manager', 
      description: 'Track stock levels and product information',
      icon: ShoppingCart,
      gradient: darkMode ? 'from-purple-600 to-pink-700' : 'from-pink-500 to-rose-600'
    },
    { 
      name: 'Team Planner', 
      description: 'Manage team schedules and assignments',
      icon: Users,
      gradient: darkMode ? 'from-orange-600 to-amber-700' : 'from-orange-500 to-amber-600'
    },
    { 
      name: 'Project Timeline', 
      description: 'Track milestones and project progress',
      icon: Calendar,
      gradient: darkMode ? 'from-cyan-600 to-blue-700' : 'from-teal-500 to-cyan-600'
    },
  ];

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
          {/* Header with Spooky Lighting */}
          <div 
            className="relative h-32 overflow-hidden"
            style={{
              background: darkMode
                ? 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)'
                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)'
            }}
          >
            {/* Animated glow orbs */}
            <motion.div
              className="absolute top-0 left-1/4 w-32 h-32 rounded-full blur-3xl opacity-40"
              style={{ background: darkMode ? '#10b981' : '#c4b5fd' }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full blur-3xl opacity-30"
              style={{ background: darkMode ? '#06b6d4' : '#ddd6fe' }}
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center">
                <motion.h1
                  animate={{
                    textShadow: darkMode
                      ? ['0 0 10px rgba(16, 185, 129, 0.6)', '0 0 20px rgba(16, 185, 129, 0.9)', '0 0 10px rgba(16, 185, 129, 0.6)']
                      : ['0 0 10px rgba(255, 255, 255, 0.6)', '0 0 20px rgba(255, 255, 255, 0.9)', '0 0 10px rgba(255, 255, 255, 0.6)']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-white text-2xl font-bold mb-2"
                >
                  Create New SpecterSheet
                </motion.h1>
                <p className="text-white/70 text-sm">Choose a template to begin your supernatural spreadsheet</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors z-20"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* Templates Grid */}
          <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="grid grid-cols-2 gap-4">
              {templates.map((template, index) => {
                const Icon = template.icon;
                return (
                  <motion.button
                    key={template.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectTemplate(template.name)}
                    className={`flex items-center gap-4 p-4 rounded-xl ${
                      darkMode ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    } transition-all text-left group`}
                  >
                    <div 
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.gradient} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}
                      style={{
                        boxShadow: darkMode
                          ? '0 0 15px rgba(16, 185, 129, 0.2)'
                          : '0 0 15px rgba(99, 102, 241, 0.15)'
                      }}
                    >
                      <Icon size={22} className="text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${darkMode ? 'text-white group-hover:text-emerald-400' : 'text-gray-900 group-hover:text-indigo-600'} mb-0.5 transition-colors`}>
                        {template.name}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'} truncate`}>
                        {template.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Quick tip */}
            <div className={`mt-6 p-4 rounded-lg ${
              darkMode ? 'bg-emerald-900/20 border border-emerald-900' : 'bg-indigo-50 border border-indigo-200'
            }`}>
              <div className="flex items-center gap-3">
                <Sparkles size={18} className={darkMode ? 'text-emerald-400' : 'text-indigo-600'} />
                <p className={`text-sm ${darkMode ? 'text-emerald-400/90' : 'text-indigo-700'}`}>
                  <span className="font-medium">Pro tip:</span> You can also type natural language commands to create any custom spreadsheet structure.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
