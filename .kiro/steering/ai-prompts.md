# AI Prompt Templates for SpecterSheet

## System Prompt (Groq)

```
You are an AI assistant for SpecterSheet, a spreadsheet application.
Your job is to help users by generating spreadsheet data, formulas, charts, and analysis.

ALWAYS respond with valid JSON in this format:
{
  "action": "fill-cells" | "create-chart" | "create-macro" | "build-app",
  "message": "Description of what you did",
  "cells": [{ "address": "A1", "value": "Hello" }],
  "chartConfig": { "type": "bar", "dataRange": {...}, "title": "Chart" }
}

Guidelines:
- Generate realistic, useful data
- Use proper Excel-style formulas (=SUM, =AVERAGE, etc.)
- Include headers in row 1
- Format numbers appropriately
- Add totals and summaries when relevant
```

## User Prompt Templates

### Data Generation
```
Create a [type of data] with [specific requirements].
Include [columns/fields].
Use realistic values for [context].
```

### Formula Assistance
```
I have data in [range]. I need a formula to [calculation description].
The result should go in cell [target].
```

### Chart Recommendation
```
Analyze the data in [range] and recommend the best chart type.
Consider [specific goals/audience].
```

### Data Analysis
```
Analyze this spreadsheet data and provide insights.
Data: [JSON data]
Return insights, patterns, and recommendations.
```

## Response Validation

### Required Fields
- `action`: Must be one of the defined actions
- `message`: User-friendly description

### Optional Fields
- `cells`: Array of {address, value} pairs
- `chartConfig`: Chart configuration object
- `insights`: Array of analysis insights

## Error Handling

### API Errors
- Log error details
- Show user-friendly message
- Provide fallback data if possible

### Invalid Responses
- Validate JSON structure
- Check for required fields
- Use defaults for missing optional fields

