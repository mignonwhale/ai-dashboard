'use client';

import { useState } from 'react';

interface Conversation {
  id: string;
  title: string;
  model: string;
  timestamp: string;
  messages: number;
  tokens: number;
  cost: number;
  status: 'completed' | 'active' | 'error';
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Web Development Best Practices',
    model: 'GPT-4',
    timestamp: '2024-01-15 14:30:00',
    messages: 12,
    tokens: 2450,
    cost: 0.074,
    status: 'completed'
  },
  {
    id: '2',
    title: 'AI Ethics Discussion',
    model: 'Gemini 1.5 Pro',
    timestamp: '2024-01-15 13:15:00',
    messages: 8,
    tokens: 1890,
    cost: 0.028,
    status: 'completed'
  },
  {
    id: '3',
    title: 'Data Science Tutorial',
    model: 'GPT-4',
    timestamp: '2024-01-15 11:45:00',
    messages: 15,
    tokens: 3200,
    cost: 0.096,
    status: 'active'
  },
  {
    id: '4',
    title: 'TypeScript Advanced Patterns',
    model: 'Gemini 1.5 Flash',
    timestamp: '2024-01-15 09:20:00',
    messages: 6,
    tokens: 1200,
    cost: 0.003,
    status: 'completed'
  },
  {
    id: '5',
    title: 'API Error Troubleshooting',
    model: 'GPT-3.5 Turbo',
    timestamp: '2024-01-15 08:10:00',
    messages: 4,
    tokens: 800,
    cost: 0.0016,
    status: 'error'
  }
];

export default function ConversationHistory() {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredConversations = conversations.filter(conv => {
    const matchesFilter = filter === 'all' || conv.status === filter;
    const matchesSearch = conv.title.toLowerCase().includes(search.toLowerCase()) ||
                         conv.model.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'active': return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Conversation History</h2>
            <p className="text-foreground/60 mt-1">Browse and manage your AI conversations</p>
          </div>
          
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            />
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="active">Active</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {filteredConversations.map((conversation) => (
            <div key={conversation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-foreground">{conversation.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                      {conversation.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2 text-sm text-foreground/60">
                    <span>Model: {conversation.model}</span>
                    <span>•</span>
                    <span>{conversation.messages} messages</span>
                    <span>•</span>
                    <span>{conversation.tokens.toLocaleString()} tokens</span>
                    <span>•</span>
                    <span>${conversation.cost.toFixed(4)}</span>
                  </div>
                  
                  <p className="text-sm text-foreground/60 mt-1">
                    {formatTimestamp(conversation.timestamp)}
                  </p>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors">
                    View
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                    Export
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredConversations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60">No conversations found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}