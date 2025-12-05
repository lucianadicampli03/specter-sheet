// Groq AI Integration for SpecterSheet
// API key should be set in environment variable VITE_GROQ_API_KEY
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface AIResponse {
  cells?: { address: string; value: string }[];
  chartConfig?: {
    type: 'bar' | 'line' | 'pie';
    title: string;
    dataRange: string;
  };
  message?: string;
  action?: 'create-chart' | 'create-macro' | 'build-app' | 'fill-cells';
}

const SYSTEM_PROMPT = `You are SpecterSheet AI, an intelligent spreadsheet assistant. You help users by generating spreadsheet data, formulas, and configurations.

When the user asks you to create something, respond with a JSON object containing the data to fill in the spreadsheet.

IMPORTANT: Always respond with ONLY valid JSON, no markdown, no explanation outside the JSON.

Response format:
{
  "action": "fill-cells" | "create-chart" | "create-macro" | "build-app",
  "message": "Brief description of what you did",
  "cells": [
    { "address": "A1", "value": "Header or value" },
    { "address": "A2", "value": "100" },
    { "address": "B1", "value": "=SUM(A2:A10)" }
  ],
  "chartConfig": {
    "type": "bar" | "line" | "pie",
    "title": "Chart Title",
    "dataRange": "A1:B10"
  }
}

Rules:
- Use column letters A-O and row numbers 1-50
- For formulas, start with = (e.g., =SUM(A1:A10), =AVERAGE(B2:B20))
- Supported formulas: SUM, AVERAGE, MAX, MIN, COUNT, IF
- Keep data concise and relevant
- For budget trackers, include categories, amounts, and totals
- For charts, suggest appropriate chart type based on data
- Always include realistic sample data

Examples:
- "monthly budget" → Create expense categories with amounts and a SUM total
- "sales data" → Create product names, quantities, prices, and revenue formulas
- "chart for column A" → Return chartConfig with appropriate settings`;

export async function callGroqAI(userPrompt: string): Promise<AIResponse> {
  console.log('🤖 Calling Groq AI with:', userPrompt);
  
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Groq API error:', response.status, error);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Groq response:', data);
    
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const parsed = JSON.parse(content) as AIResponse;
    console.log('📊 Parsed response:', parsed);
    return parsed;
  } catch (error) {
    console.error('❌ Error calling Groq AI:', error);
    // Return a fallback response with sample data
    return {
      action: 'fill-cells',
      message: 'Created sample budget (API fallback)',
      cells: [
        { address: 'A1', value: 'Category' },
        { address: 'B1', value: 'Amount' },
        { address: 'A2', value: 'Food' },
        { address: 'B2', value: '500' },
        { address: 'A3', value: 'Rent' },
        { address: 'B3', value: '1200' },
        { address: 'A4', value: 'Transport' },
        { address: 'B4', value: '200' },
        { address: 'A5', value: 'Total' },
        { address: 'B5', value: '=SUM(B2:B4)' },
      ]
    };
  }
}

