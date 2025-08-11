'use client';

import { useState } from 'react';

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    openai: {
      apiKey: '••••••••••••••••••••••••••••••••••••••••',
      organization: 'org-example',
      defaultModel: 'gpt-4'
    },
    anthropic: {
      apiKey: '••••••••••••••••••••••••••••••••••••••••',
      defaultModel: 'claude-3-5-sonnet-20241022'
    },
    general: {
      theme: 'system',
      autoSave: true,
      notifications: true,
      maxTokens: 4000,
      temperature: 0.7
    }
  });

  const [activeTab, setActiveTab] = useState('api');

  const handleInputChange = (provider: string, field: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'api', label: 'API Configuration', icon: '🔑' },
    { id: 'general', label: 'General Settings', icon: '⚙️' },
    { id: 'usage', label: 'Usage Limits', icon: '📊' },
    { id: 'export', label: 'Data Export', icon: '📁' }
  ];

  const renderApiSettings = () => (
    <div className="space-y-8">
      {/* OpenAI Settings */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
            <span className="text-green-600 font-bold">AI</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">OpenAI Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">API Key</label>
            <input
              type="password"
              value={settings.openai.apiKey}
              onChange={(e) => handleInputChange('openai', 'apiKey', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Organization ID</label>
            <input
              type="text"
              value={settings.openai.organization}
              onChange={(e) => handleInputChange('openai', 'organization', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Default Model</label>
            <select
              value={settings.openai.defaultModel}
              onChange={(e) => handleInputChange('openai', 'defaultModel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Anthropic Settings */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
            <span className="text-orange-600 font-bold">C</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Anthropic Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">API Key</label>
            <input
              type="password"
              value={settings.anthropic.apiKey}
              onChange={(e) => handleInputChange('anthropic', 'apiKey', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Default Model</label>
            <select
              value={settings.anthropic.defaultModel}
              onChange={(e) => handleInputChange('anthropic', 'defaultModel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">General Preferences</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
          <select
            value={settings.general.theme}
            onChange={(e) => handleInputChange('general', 'theme', e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-foreground">Auto-save conversations</label>
            <p className="text-xs text-foreground/60 mt-1">Automatically save all conversations</p>
          </div>
          <input
            type="checkbox"
            checked={settings.general.autoSave}
            onChange={(e) => handleInputChange('general', 'autoSave', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-foreground">Enable notifications</label>
            <p className="text-xs text-foreground/60 mt-1">Receive notifications for important events</p>
          </div>
          <input
            type="checkbox"
            checked={settings.general.notifications}
            onChange={(e) => handleInputChange('general', 'notifications', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Default Max Tokens</label>
          <input
            type="number"
            value={settings.general.maxTokens}
            onChange={(e) => handleInputChange('general', 'maxTokens', parseInt(e.target.value))}
            className="w-full md:w-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Default Temperature</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.general.temperature}
            onChange={(e) => handleInputChange('general', 'temperature', parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-foreground/60 mt-1">
            <span>0 (Deterministic)</span>
            <span>{settings.general.temperature}</span>
            <span>1 (Creative)</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-foreground/60 hover:text-foreground hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'api' && renderApiSettings()}
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'usage' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Usage Limits</h3>
            <p className="text-foreground/60">Usage limit settings coming soon...</p>
          </div>
        )}
        {activeTab === 'export' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Data Export</h3>
            <p className="text-foreground/60">Data export functionality coming soon...</p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-foreground/70 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors">
          Reset to Defaults
        </button>
        <button className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}