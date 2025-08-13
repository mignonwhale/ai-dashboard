'use client';

import { useState } from 'react';

interface ModelStats {
  name: string;
  provider: string;
  responseTime: number;
  accuracy: number;
  cost: number;
  tokensUsed: number;
  status: 'active' | 'inactive' | 'maintenance';
}

const mockModelData: ModelStats[] = [
  {
    name: 'GPT-4',
    provider: 'OpenAI',
    responseTime: 1.2,
    accuracy: 94.5,
    cost: 0.03,
    tokensUsed: 1250,
    status: 'active'
  },
  {
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    responseTime: 0.9,
    accuracy: 96.2,
    cost: 0.015,
    tokensUsed: 1100,
    status: 'active'
  },
  {
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    responseTime: 0.7,
    accuracy: 87.3,
    cost: 0.002,
    tokensUsed: 1320,
    status: 'active'
  },
  {
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    responseTime: 0.5,
    accuracy: 89.1,
    cost: 0.0025,
    tokensUsed: 980,
    status: 'active'
  }
];

export default function ModelComparison() {
  const [selectedModels, setSelectedModels] = useState<string[]>(['GPT-4', 'Gemini 1.5 Pro']);

  const toggleModel = (modelName: string) => {
    setSelectedModels(prev => 
      prev.includes(modelName) 
        ? prev.filter(name => name !== modelName)
        : [...prev, modelName]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-red-600';
      case 'maintenance': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-foreground">AI Model Comparison</h2>
        <p className="text-foreground/60 mt-1">Compare performance metrics across different AI models</p>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Select models to compare:</h3>
          <div className="flex flex-wrap gap-2">
            {mockModelData.map((model) => (
              <button
                key={model.name}
                onClick={() => toggleModel(model.name)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  selectedModels.includes(model.name)
                    ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300'
                    : 'bg-white border-gray-300 text-foreground/70 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700'
                }`}
              >
                {model.name}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-foreground">Model</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Provider</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Response Time</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Accuracy</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Cost per 1K tokens</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Tokens Used</th>
              </tr>
            </thead>
            <tbody>
              {mockModelData
                .filter(model => selectedModels.includes(model.name))
                .map((model) => (
                <tr key={model.name} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-4 font-medium text-foreground">{model.name}</td>
                  <td className="py-4 px-4 text-foreground/70">{model.provider}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusDot(model.status)}`}></span>
                      <span className={`text-sm font-medium ${getStatusColor(model.status)}`}>
                        {model.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground/70">{model.responseTime}s</td>
                  <td className="py-4 px-4 text-foreground/70">{model.accuracy}%</td>
                  <td className="py-4 px-4 text-foreground/70">${model.cost}</td>
                  <td className="py-4 px-4 text-foreground/70">{model.tokensUsed.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedModels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60">Select models above to compare their performance metrics</p>
          </div>
        )}
      </div>
    </div>
  );
}