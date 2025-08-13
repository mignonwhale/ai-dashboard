'use client';

import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Model Comparison', href: '/comparison', icon: '⚖️' },
  { name: 'Conversations', href: '/conversations', icon: '💬' },
  { name: 'Analytics', href: '/analytics', icon: '📈' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-200 ease-in-out
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-foreground">AI Dashboard</h2>
          <button 
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md text-foreground/60 hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground/80 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-6 px-6 w-full">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-foreground/60 mb-2">AI Models Status</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/70">ChatGPT</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/70">Claude</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}