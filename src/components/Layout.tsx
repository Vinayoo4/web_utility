import React from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  activeTool: string;
  setActiveTool: (tool: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTool, setActiveTool }) => {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="font-bold text-xl text-blue-600 dark:text-blue-400">WebUtility</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
            <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-50" onClick={e => e.stopPropagation()}>
              <Sidebar activeTool={activeTool} setActiveTool={(tool) => { setActiveTool(tool); setSidebarOpen(false); }} />
            </div>
          </div>
        )}
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block md:w-64 bg-white dark:bg-gray-800 shadow-sm">
          <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};