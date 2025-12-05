import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Moon, Sun, Layout, Database, FormInput, BarChart3, Plus, Save, Eye, Download, Code, Share2, Check, Copy, Rocket, X, Trash2, Edit2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line } from 'recharts';
import type { CellAddress, CellValue } from '../types';

interface AppBuilderModeProps {
  darkMode: boolean;
  cellData: Map<CellAddress, { raw: string; display: CellValue; error: string | null }>;
  onBack: () => void;
  onToggleDarkMode: () => void;
}

export function AppBuilderMode({
  darkMode,
  cellData,
  onBack,
  onToggleDarkMode,
}: AppBuilderModeProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'form' | 'dashboard'>('preview');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishStep, setPublishStep] = useState<'options' | 'generating' | 'done'>('options');
  const [copiedCode, setCopiedCode] = useState(false);
  const [addedRecords, setAddedRecords] = useState<Record<string, string>[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<number | null>(null);

  // Extract table structure from cell data
  const tableData = useMemo(() => {
    const headers: string[] = [];
    const rows: Record<string, CellValue>[] = [];
    
    // Get headers from row 1
    for (let col = 0; col < 10; col++) {
      const colLetter = String.fromCharCode(65 + col);
      const cell = cellData.get(`${colLetter}1` as CellAddress);
      if (cell?.display && cell.display !== '') {
        headers.push(String(cell.display));
      }
    }
    
    // Get data rows
    for (let row = 2; row <= 20; row++) {
      const rowData: Record<string, CellValue> = {};
      let hasData = false;
      
      for (let col = 0; col < headers.length; col++) {
        const colLetter = String.fromCharCode(65 + col);
        const cell = cellData.get(`${colLetter}${row}` as CellAddress);
        if (cell?.display !== null && cell?.display !== undefined) {
          rowData[headers[col]] = cell.display;
          if (cell.display !== '') hasData = true;
        }
      }
      
      if (hasData) {
        rows.push(rowData);
      }
    }
    
    return { headers, rows };
  }, [cellData]);

  // Generate form fields from headers
  const formFields = tableData.headers.map(header => ({
    name: header,
    type: header.toLowerCase().includes('price') || header.toLowerCase().includes('quantity') || header.toLowerCase().includes('value')
      ? 'number'
      : header.toLowerCase().includes('email')
        ? 'email'
        : header.toLowerCase().includes('date')
          ? 'date'
          : 'text',
    required: header.toLowerCase().includes('name') || header.toLowerCase().includes('id'),
  }));

  // Generate chart data
  const chartData = tableData.rows.map((row, index) => ({
    name: String(row[tableData.headers[0]] || `Item ${index + 1}`),
    value: Number(row[tableData.headers[tableData.headers.length - 1]]) || 0,
  })).filter(d => d.value > 0);

  const pieData = tableData.rows.slice(0, 5).map((row, index) => ({
    name: String(row[tableData.headers[0]] || `Category ${index + 1}`),
    value: Number(row[tableData.headers[1]]) || Number(row[tableData.headers[tableData.headers.length - 1]]) || 0,
  })).filter(d => d.value > 0);

  const colors = darkMode 
    ? ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6']
    : ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe'];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord !== null) {
      // Update existing record
      setAddedRecords(prev => prev.map((r, i) => i === editingRecord ? formData : r));
      setEditingRecord(null);
      showNotification('✏️ Record updated successfully!');
    } else {
      // Add new record
      setAddedRecords(prev => [...prev, formData]);
      showNotification('✅ New record added successfully!');
    }
    setFormData({});
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteRecord = (index: number) => {
    setAddedRecords(prev => prev.filter((_, i) => i !== index));
    showNotification('🗑️ Record deleted');
  };

  const handleEditRecord = (index: number) => {
    setFormData(addedRecords[index]);
    setEditingRecord(index);
    setActiveTab('form');
  };

  const handlePublish = () => {
    setShowPublishModal(true);
    setPublishStep('options');
  };

  const handleGenerateApp = () => {
    setPublishStep('generating');
    setTimeout(() => {
      setPublishStep('done');
    }, 2000);
  };

  const handleDownloadApp = () => {
    const appHtml = generateStandaloneApp();
    const blob = new Blob([appHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'specter-app.html';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('📦 App downloaded!');
  };

  const handleCopyEmbedCode = () => {
    const embedCode = `<iframe src="https://spectersheet.app/embed/${Date.now()}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    showNotification('📋 Embed code copied!');
  };

  const generateStandaloneApp = () => {
    const allRows = [...tableData.rows, ...addedRecords];
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tableData.headers[0] || 'Data'} Manager - Built with SpecterSheet</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body class="bg-gray-950 text-white min-h-screen">
  <header class="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
    <h1 class="text-2xl font-bold">${tableData.headers[0] || 'Data'} Manager</h1>
    <p class="text-white/70">Built with SpecterSheet AI 👻</p>
  </header>
  
  <main class="max-w-6xl mx-auto p-6">
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-gray-800 rounded-xl p-4">
        <div class="text-gray-400 text-sm">Total Records</div>
        <div class="text-2xl font-bold">${allRows.length}</div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4">
        <div class="text-gray-400 text-sm">Fields</div>
        <div class="text-2xl font-bold">${tableData.headers.length}</div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4">
        <div class="text-gray-400 text-sm">Status</div>
        <div class="text-2xl font-bold text-emerald-400">Active</div>
      </div>
    </div>
    
    <div class="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-800">
          <tr>
            ${tableData.headers.map(h => `<th class="px-4 py-3 text-left text-sm font-medium text-gray-300">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${allRows.map(row => `
            <tr class="border-t border-gray-800 animate-fade-in">
              ${tableData.headers.map(h => `<td class="px-4 py-3 text-sm text-gray-400">${row[h] || '—'}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </main>
  
  <footer class="text-center p-4 text-gray-500 text-sm">
    Built with SpecterSheet AI - Kiroween Hackathon 2024 👻
  </footer>
</body>
</html>`;
  };

  const tabs = [
    { id: 'preview' as const, icon: Eye, label: 'Preview' },
    { id: 'form' as const, icon: FormInput, label: 'Data Entry Form' },
    { id: 'dashboard' as const, icon: BarChart3, label: 'Dashboard' },
  ];

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      {/* Top Bar */}
      <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onBack}
            whileHover={{ x: -2 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              darkMode 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft size={18} />
            <span>Back to Sheet</span>
          </motion.button>
          
          <div className={`h-6 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
          
          <div className="flex items-center gap-2">
            <Layout size={20} className={darkMode ? 'text-emerald-400' : 'text-indigo-500'} />
            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              App Builder
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${
              darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-indigo-100 text-indigo-600'
            }`}>
              Preview Mode
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                : 'bg-gray-200 hover:bg-gray-300 text-indigo-600'
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <motion.button
            onClick={handlePublish}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              darkMode 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Rocket size={16} />
            Publish App
          </motion.button>
        </div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-20 left-1/2 px-4 py-2 rounded-lg shadow-xl z-50 ${
              darkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'
            }`}
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Publish Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowPublishModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg rounded-2xl ${
                darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
              } shadow-2xl overflow-hidden`}
            >
              {/* Modal Header */}
              <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-900/50' : 'bg-indigo-100'}`}>
                    <Rocket className={darkMode ? 'text-emerald-400' : 'text-indigo-600'} size={20} />
                  </div>
                  <div>
                    <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Publish Your App
                    </h2>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Share your creation with the world
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPublishModal(false)}
                  className={`p-1 rounded hover:bg-gray-800 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {publishStep === 'options' && (
                    <motion.div
                      key="options"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      <button
                        onClick={handleGenerateApp}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                          darkMode 
                            ? 'border-gray-700 hover:border-emerald-500 hover:bg-emerald-900/20' 
                            : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                        }`}
                      >
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          <Share2 className={darkMode ? 'text-emerald-400' : 'text-indigo-600'} size={24} />
                        </div>
                        <div>
                          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Deploy to Cloud
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Get a shareable URL instantly
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={handleDownloadApp}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                          darkMode 
                            ? 'border-gray-700 hover:border-emerald-500 hover:bg-emerald-900/20' 
                            : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                        }`}
                      >
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          <Download className={darkMode ? 'text-emerald-400' : 'text-indigo-600'} size={24} />
                        </div>
                        <div>
                          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Download as HTML
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Self-contained app file
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={handleCopyEmbedCode}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                          darkMode 
                            ? 'border-gray-700 hover:border-emerald-500 hover:bg-emerald-900/20' 
                            : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                        }`}
                      >
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          {copiedCode ? (
                            <Check className="text-green-500" size={24} />
                          ) : (
                            <Code className={darkMode ? 'text-emerald-400' : 'text-indigo-600'} size={24} />
                          )}
                        </div>
                        <div>
                          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {copiedCode ? 'Copied!' : 'Get Embed Code'}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Embed in any website
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  )}

                  {publishStep === 'generating' && (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className={`w-16 h-16 mx-auto mb-4 border-4 border-t-transparent rounded-full ${
                          darkMode ? 'border-emerald-400' : 'border-indigo-500'
                        }`}
                      />
                      <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                        Generating your app...
                      </p>
                      <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Bundling {tableData.rows.length + addedRecords.length} records
                      </p>
                    </motion.div>
                  )}

                  {publishStep === 'done' && (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-8 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                        className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-emerald-900/50' : 'bg-green-100'
                        }`}
                      >
                        <Check className={darkMode ? 'text-emerald-400' : 'text-green-600'} size={40} />
                      </motion.div>
                      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        App Published! 🎉
                      </h3>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your app is now live at:
                      </p>
                      <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
                        darkMode ? 'bg-gray-800' : 'bg-gray-100'
                      }`}>
                        <code className={`flex-1 text-sm ${darkMode ? 'text-emerald-400' : 'text-indigo-600'}`}>
                          https://spectersheet.app/app/{Date.now().toString(36)}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`https://spectersheet.app/app/${Date.now().toString(36)}`);
                            showNotification('📋 URL copied!');
                          }}
                          className={`p-2 rounded hover:bg-gray-700 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => setShowPublishModal(false)}
                        className={`px-6 py-2 rounded-lg font-medium ${
                          darkMode 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        Done
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'} px-4 py-2 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex gap-2">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === id
                  ? darkMode
                    ? 'bg-gray-800 text-emerald-400'
                    : 'bg-white text-indigo-600 shadow-sm'
                  : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              {/* App Preview */}
              <div className={`rounded-2xl overflow-hidden ${
                darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
              } shadow-xl`}>
                {/* App Header */}
                <div 
                  className="p-6"
                  style={{
                    background: darkMode
                      ? 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)'
                      : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  }}
                >
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {tableData.headers[0] ? `${tableData.headers[0]} Manager` : 'Generated App'}
                  </h1>
                  <p className="text-white/70">
                    Auto-generated from your SpecterSheet data
                  </p>
                </div>
                
                {/* Stats Cards */}
                <div className="p-6 grid grid-cols-3 gap-4">
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Records</div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {tableData.rows.length}
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fields</div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {tableData.headers.length}
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last Updated</div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Now
                    </div>
                  </div>
                </div>
                
                {/* Data Table Preview */}
                <div className="p-6 pt-0">
                  <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Data Preview
                  </h3>
                  <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <table className="w-full">
                      <thead>
                        <tr className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                          {tableData.headers.map((header, i) => (
                            <th key={i} className={`px-4 py-3 text-left text-sm font-medium ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.rows.slice(0, 5).map((row, rowIndex) => (
                          <tr 
                            key={rowIndex} 
                            className={`${darkMode ? 'border-gray-800' : 'border-gray-100'} border-t`}
                          >
                            {tableData.headers.map((header, colIndex) => (
                              <td key={colIndex} className={`px-4 py-3 text-sm ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {String(row[header] || '—')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className={`rounded-2xl p-6 ${
                darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
              } shadow-xl`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-900/50' : 'bg-indigo-100'}`}>
                    <FormInput className={darkMode ? 'text-emerald-400' : 'text-indigo-600'} size={20} />
                  </div>
                  <div>
                    <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Add New Record
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Auto-generated form from your data structure
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {formFields.map((field, index) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <label className={`block text-sm font-medium mb-1.5 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {field.name}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        type={field.type}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        } focus:outline-none focus:ring-2 ${
                          darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-indigo-500/50'
                        }`}
                        placeholder={`Enter ${field.name.toLowerCase()}`}
                      />
                    </motion.div>
                  ))}
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setFormData({})}
                      className={`flex-1 px-4 py-2.5 rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Clear
                    </button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 ${
                        darkMode 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <Plus size={18} />
                      Add Record
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className={`rounded-2xl p-6 ${
                  darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
                } shadow-xl`}>
                  <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Value Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} opacity={0.3} />
                      <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={11} />
                      <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Pie Chart */}
                <div className={`rounded-2xl p-6 ${
                  darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
                } shadow-xl`}>
                  <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Category Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name }) => name}
                      >
                        {pieData.map((_, index) => (
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
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Data Summary */}
                <div className={`col-span-2 rounded-2xl p-6 ${
                  darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
                } shadow-xl`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Data Summary
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      Live from sheet
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    {tableData.headers.slice(0, 4).map((header, i) => {
                      const values = tableData.rows.map(row => Number(row[header]) || 0).filter(v => v > 0);
                      const sum = values.reduce((a, b) => a + b, 0);
                      const avg = values.length > 0 ? sum / values.length : 0;
                      
                      return (
                        <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <div className={`text-xs uppercase mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {header}
                          </div>
                          {values.length > 0 ? (
                            <>
                              <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {sum.toLocaleString()}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Avg: {avg.toFixed(2)}
                              </div>
                            </>
                          ) : (
                            <div className={`text-xl font-bold ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              Text field
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t px-4 py-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database size={14} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Connected to: Sheet1 ({tableData.rows.length} records)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${darkMode ? 'bg-emerald-400' : 'bg-green-500'} animate-pulse`} />
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Live sync enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

