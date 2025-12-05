import { useState, useRef, useEffect } from 'react';
import { Ghost, Moon, Sun, FileSpreadsheet, ChevronDown, Plus, Copy, Download, Settings, Trash2, Save, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSummonAI: () => void;
  onShowCreate: () => void;
  aiActive: boolean;
  sheetName: string;
  onSheetNameChange: (name: string) => void;
  onFileUpload?: (data: { headers: string[]; rows: string[][] }) => void;
}

export function Navigation({ 
  darkMode, 
  onToggleDarkMode, 
  onSummonAI, 
  aiActive, 
  onShowCreate,
  sheetName,
  onSheetNameChange,
  onFileUpload,
}: NavigationProps) {
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(sheetName);
  const [isUploading, setIsUploading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowFileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when editing name
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleNameSubmit = () => {
    if (editName.trim()) {
      onSheetNameChange(editName.trim());
    }
    setIsEditingName(false);
  };

  const handleDownloadCSV = () => {
    // Simulate CSV download
    const csvContent = "Category,Budget,Actual,Difference\nHousing,1500,1450,50\nFood,600,720,-120";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sheetName.replace(/\s+/g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setShowFileMenu(false);
  };

  const parseCSV = (text: string): { headers: string[]; rows: string[][] } => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = lines.slice(1).map(line => {
      // Handle quoted values with commas
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/^"|"$/g, ''));
      return values;
    });
    
    return { headers, rows };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setShowFileMenu(false);

    try {
      const text = await file.text();
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension === 'csv' || extension === 'txt') {
        const data = parseCSV(text);
        onFileUpload?.(data);
        onSheetNameChange(file.name.replace(/\.[^/.]+$/, ''));
      } else if (extension === 'xlsx' || extension === 'xls') {
        // For Excel files, we'll parse as CSV if it's actually CSV
        // Real Excel parsing would need a library like xlsx
        alert('For Excel files (.xlsx), please save as CSV first.\n\nTip: In Excel, go to File → Save As → CSV');
      } else {
        alert('Please upload a CSV file (.csv)');
      }
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const menuItems = [
    { icon: Plus, label: 'New Sheet', onClick: onShowCreate, shortcut: '⌘N' },
    { icon: Upload, label: 'Upload File', onClick: () => fileInputRef.current?.click(), shortcut: '⌘O' },
    { icon: Copy, label: 'Duplicate', onClick: () => setShowFileMenu(false), shortcut: '⌘D' },
    { icon: Save, label: 'Save', onClick: () => setShowFileMenu(false), shortcut: '⌘S' },
    { type: 'divider' as const },
    { icon: Download, label: 'Export as CSV', onClick: handleDownloadCSV },
    { icon: Download, label: 'Export as Excel', onClick: () => setShowFileMenu(false) },
    { type: 'divider' as const },
    { icon: Settings, label: 'AI Settings', onClick: () => setShowFileMenu(false) },
    { icon: Trash2, label: 'Delete', onClick: () => setShowFileMenu(false), danger: true },
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'} border-b px-3 py-2 flex items-center justify-between transition-colors backdrop-blur-sm relative z-50`}>
      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* Upload indicator */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className={`w-12 h-12 border-4 border-t-transparent rounded-full ${
                darkMode ? 'border-emerald-400' : 'border-indigo-500'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Left: Logo, File Menu, and Sheet Name */}
      <div className="flex items-center gap-2.5">
        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{
              filter: darkMode 
                ? ['drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))', 'drop-shadow(0 0 16px rgba(16, 185, 129, 0.8))', 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))']
                : ['drop-shadow(0 0 6px rgba(99, 102, 241, 0.4))', 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.6))', 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.4))']
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Ghost className={`${darkMode ? 'text-emerald-400' : 'text-indigo-500'}`} size={22} />
          </motion.div>
          <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            SpecterSheet
          </span>
        </div>
        
        <div className={`h-5 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
        
        {/* File Menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setShowFileMenu(!showFileMenu)}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              showFileMenu
                ? darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'
                : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-sm">File</span>
            <ChevronDown size={14} className={showFileMenu ? 'rotate-180' : ''} />
          </button>
          
          <AnimatePresence>
            {showFileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute top-full left-0 mt-1 w-64 rounded-lg z-[100] ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                } shadow-xl`}
              >
                {menuItems.map((item, index) => {
                  if (item.type === 'divider') {
                    return (
                      <div key={index} className={`h-px my-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    );
                  }
                  
                  const Icon = item.icon!;
                  return (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                        item.danger
                          ? 'text-red-500 hover:bg-red-500/10'
                          : darkMode 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.shortcut && (
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Sheet Name */}
        <div className="flex items-center gap-2">
          <FileSpreadsheet size={16} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
          {isEditingName ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSubmit();
                if (e.key === 'Escape') {
                  setEditName(sheetName);
                  setIsEditingName(false);
                }
              }}
              className={`px-2 py-0.5 rounded text-sm ${
                darkMode 
                  ? 'bg-gray-800 text-white border border-emerald-500' 
                  : 'bg-white text-gray-900 border border-indigo-500'
              } focus:outline-none`}
            />
          ) : (
            <button
              onClick={() => {
                setEditName(sheetName);
                setIsEditingName(true);
              }}
              className={`text-sm transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              {sheetName}
            </button>
          )}
        </div>
      </div>
      
      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Summon AI Button */}
        <motion.button
          onClick={onSummonAI}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 relative overflow-hidden ${
            aiActive 
              ? darkMode ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
              : darkMode ? 'bg-emerald-600/90 hover:bg-emerald-600 text-white' : 'bg-indigo-600/90 hover:bg-indigo-600 text-white'
          } transition-all`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={aiActive ? {
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Ghost size={16} />
          </motion.div>
          <span className="text-xs font-medium">Summon AI</span>
          {aiActive && (
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0.2, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.button>
        
        {/* Autosave Status */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <motion.div 
            className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-emerald-400' : 'bg-green-500'}`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
            Autosaved
          </span>
        </div>
        
        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className={`p-1.5 rounded-lg transition-colors ${
            darkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
              : 'bg-gray-200 hover:bg-gray-300 text-indigo-600'
          }`}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        
        {/* User Avatar */}
        <motion.div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer ${
            darkMode 
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
              : 'bg-gradient-to-br from-indigo-500 to-purple-600'
          }`}
          whileHover={{ scale: 1.05 }}
          style={{
            boxShadow: darkMode 
              ? '0 0 15px rgba(16, 185, 129, 0.4)' 
              : '0 0 15px rgba(99, 102, 241, 0.3)'
          }}
        >
          <span className="text-xs font-medium">U</span>
        </motion.div>
      </div>
    </div>
  );
}
