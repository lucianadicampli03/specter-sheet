import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, TrendingUp, BarChart3, Zap, X, Loader2, Lightbulb, PieChart } from 'lucide-react';
import type { CellAddress, CellValue } from '../types';
import { callGroqAI } from '../lib/groqAI';

interface DataAnalyzerPanelProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  cellData: Map<CellAddress, { raw: string; display: CellValue; error: string | null }>;
  onApplyFormula: (address: CellAddress, formula: string) => void;
  onCreateChart: (config: any) => void;
}

interface Insight {
  type: 'summary' | 'insight' | 'suggestion' | 'chart';
  icon: any;
  title: string;
  description: string;
  action?: {
    label: string;
    formula?: string;
    address?: CellAddress;
    chartConfig?: any;
  };
}

export function DataAnalyzerPanel({
  darkMode,
  isOpen,
  onClose,
  cellData,
  onApplyFormula,
  onCreateChart,
}: DataAnalyzerPanelProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);

  const analyzeData = async () => {
    setAnalyzing(true);
    setInsights([]);

    // Convert cell data to a readable format for AI
    const cells = Array.from(cellData.entries());
    const dataForAI: Record<string, string> = {};
    
    cells.forEach(([address, cell]) => {
      if (cell.raw && cell.raw.trim()) {
        dataForAI[address] = cell.raw;
      }
    });

    // Check if there's data to analyze
    if (Object.keys(dataForAI).length === 0) {
      setInsights([{
        type: 'summary',
        icon: Sparkles,
        title: 'No Data Found',
        description: 'Add some data to your spreadsheet first, then click Analyze Data to get AI-powered insights.',
      }]);
      setAnalyzing(false);
      return;
    }

    // Find data bounds
    let maxRow = 1;
    let maxCol = 'A';
    cells.forEach(([address]) => {
      const col = address.match(/[A-Z]+/)?.[0] || 'A';
      const row = parseInt(address.match(/\d+/)?.[0] || '1');
      if (row > maxRow) maxRow = row;
      if (col > maxCol) maxCol = col;
    });

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are a data analyst AI. Analyze spreadsheet data and provide insights.
              
Return ONLY valid JSON with this structure:
{
  "insights": [
    {
      "type": "summary" | "insight" | "suggestion" | "chart",
      "title": "Short title",
      "description": "Detailed insight or recommendation"
    }
  ],
  "suggestedFormula": {
    "formula": "=SUM(B2:B10)",
    "address": "B11",
    "reason": "Why this formula helps"
  },
  "suggestedChart": {
    "type": "bar" | "line" | "pie",
    "reason": "Why this chart type"
  }
}

Provide 4-6 meaningful insights. Be specific about the data values you see.`
            },
            {
              role: 'user',
              content: `Analyze this spreadsheet data and provide insights:\n\n${JSON.stringify(dataForAI, null, 2)}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content in response');
      }
      
      const parsed = JSON.parse(content);

      const generatedInsights: Insight[] = [];

      // Add AI insights
      if (parsed.insights) {
        parsed.insights.forEach((insight: any) => {
          const iconMap: Record<string, any> = {
            summary: Sparkles,
            insight: TrendingUp,
            suggestion: Lightbulb,
            chart: BarChart3,
          };
          
          generatedInsights.push({
            type: insight.type || 'insight',
            icon: iconMap[insight.type] || Sparkles,
            title: insight.title,
            description: insight.description,
          });
        });
      }

      // Add formula suggestion if provided
      if (parsed.suggestedFormula) {
        generatedInsights.push({
          type: 'suggestion',
          icon: Zap,
          title: 'Recommended Formula',
          description: parsed.suggestedFormula.reason,
          action: {
            label: 'Apply Formula',
            formula: parsed.suggestedFormula.formula,
            address: parsed.suggestedFormula.address as CellAddress,
          },
        });
      }

      // Add chart suggestion if provided
      if (parsed.suggestedChart) {
        generatedInsights.push({
          type: 'chart',
          icon: parsed.suggestedChart.type === 'pie' ? PieChart : BarChart3,
          title: `Create ${parsed.suggestedChart.type.charAt(0).toUpperCase() + parsed.suggestedChart.type.slice(1)} Chart`,
          description: parsed.suggestedChart.reason,
          action: {
            label: 'Create Chart',
            chartConfig: {
              type: parsed.suggestedChart.type,
              dataRange: { start: 'A1', end: `${maxCol}${maxRow}` },
              title: 'Data Analysis',
            },
          },
        });
      }

      setInsights(generatedInsights);
    } catch (error) {
      console.error('AI Analysis error:', error);
      // Fallback insights
      setInsights([{
        type: 'summary',
        icon: Sparkles,
        title: 'Analysis Complete',
        description: `Found ${Object.keys(dataForAI).length} cells with data. Try asking the AI assistant for specific insights.`,
      }]);
    }

    setAnalyzing(false);
  };

  const handleApplyAction = (insight: Insight) => {
    if (!insight.action) return;

    if (insight.action.formula && insight.action.address) {
      onApplyFormula(insight.action.address, insight.action.formula);
    } else if (insight.action.chartConfig) {
      onCreateChart(insight.action.chartConfig);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full w-96 z-50 shadow-2xl ${
              darkMode ? 'bg-gray-900 border-l border-purple-500/30' : 'bg-white border-l border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    AI Data Analyzer
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className={`p-1 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Get AI-powered insights about your spreadsheet data
              </p>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto h-[calc(100%-180px)]">
              {insights.length === 0 && !analyzing && (
                <div className="text-center py-12">
                  <Sparkles className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    Click "Analyze Data" to get AI insights
                  </p>
                </div>
              )}

              {analyzing && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border-2 animate-pulse ${
                        darkMode
                          ? 'bg-gray-800/50 border-purple-500/30'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`h-4 rounded mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                      <div className={`h-3 rounded w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    </div>
                  ))}
                </div>
              )}

              {insights.length > 0 && (
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 ${
                        darkMode
                          ? 'bg-gray-800/50 border-purple-500/30 hover:border-purple-500/50'
                          : 'bg-white border-gray-200 hover:border-purple-300'
                      } transition-all`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${
                          insight.type === 'summary' ? 'bg-blue-500/20 text-blue-400' :
                          insight.type === 'insight' ? 'bg-green-500/20 text-green-400' :
                          insight.type === 'suggestion' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          <insight.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {insight.title}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {insight.description}
                          </p>
                        </div>
                      </div>

                      {insight.action && (
                        <button
                          onClick={() => handleApplyAction(insight)}
                          className={`w-full mt-3 px-4 py-2 rounded-lg font-medium transition-all ${
                            darkMode
                              ? 'bg-purple-600 hover:bg-purple-500 text-white'
                              : 'bg-purple-500 hover:bg-purple-600 text-white'
                          } flex items-center justify-center gap-2 group`}
                        >
                          <Zap className="w-4 h-4 group-hover:animate-pulse" />
                          {insight.action.label}
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`absolute bottom-0 left-0 right-0 p-6 border-t ${
              darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
            }`}>
              <button
                onClick={analyzeData}
                disabled={analyzing}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                  analyzing
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : darkMode
                    ? 'bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-500 hover:to-green-500 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white shadow-lg'
                } flex items-center justify-center gap-2`}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Data
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
