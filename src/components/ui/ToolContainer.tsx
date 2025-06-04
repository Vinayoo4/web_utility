import React from 'react';

interface ToolContainerProps {
  title: string;
  children: React.ReactNode;
}

export const ToolContainer: React.FC<ToolContainerProps> = ({ title, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm animate-fadeIn">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};