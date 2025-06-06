import React from 'react';
import { 
  Type, FileText, Palette, Image, Paintbrush, 
} from 'lucide-react';

interface SidebarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
}

type Tool = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, setActiveTool }) => {
  const tools: Tool[] = [
    { 
      id: 'text-formatter', 
      name: 'Text Formatter', 
      icon: <Type size={20} />, 
      description: 'Format, clean, and transform text'
    },
    { 
      id: 'lorem-generator', 
      name: 'Lorem Generator', 
      icon: <FileText size={20} />, 
      description: 'Generate dummy text for designs'
    },
    { 
      id: 'design-editor', 
      name: 'Design Editor', 
      icon: <Paintbrush size={20} />, 
      description: 'Create designs for POD services'
    },
    { 
      id: 'color-tools', 
      name: 'Color Tools', 
      icon: <Palette size={20} />, 
      description: 'Color palettes and pickers'
    },
    { 
      id: 'image-tools', 
      name: 'Image Tools', 
      icon: <Image size={20} />, 
      description: 'Resize, crop, and convert images'
    },
  ];

  return (
    <div className="p-4 h-full">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Tools</h2>
      <nav>
        <ul className="space-y-2">
          {tools.map((tool) => (
            <li key={tool.id}>
              <button
                className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  activeTool === tool.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setActiveTool(tool.id)}
              >
                <span className="flex-shrink-0 mr-3">{tool.icon}</span>
                <div className="text-left">
                  <span className="font-medium block">{tool.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{tool.description}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};