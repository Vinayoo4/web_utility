import React, { useState, useEffect } from 'react';
import { ClipboardCopy, ArrowDown } from 'lucide-react';
import { ToolContainer } from '../ui/ToolContainer';

type FormatterType = 
  | 'uppercase' 
  | 'lowercase' 
  | 'capitalize' 
  | 'sentence-case' 
  | 'remove-whitespace'
  | 'trim-lines'
  | 'remove-line-breaks'
  | 'add-line-breaks';

export const TextFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedFormatter, setSelectedFormatter] = useState<FormatterType>('uppercase');
  const [charCount, setCharCount] = useState({ input: 0, output: 0 });
  const [wordCount, setWordCount] = useState({ input: 0, output: 0 });
  const [lineCount, setLineCount] = useState({ input: 0, output: 0 });
  const [copied, setCopied] = useState(false);

  // Format handlers
  const formatters = {
    uppercase: (text: string) => text.toUpperCase(),
    lowercase: (text: string) => text.toLowerCase(),
    capitalize: (text: string) => 
      text.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' '),
    'sentence-case': (text: string) => {
      return text.split('. ')
        .map(sentence => {
          if (!sentence) return '';
          return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
        })
        .join('. ');
    },
    'remove-whitespace': (text: string) => text.replace(/\s+/g, ' ').trim(),
    'trim-lines': (text: string) => 
      text.split('\n').map(line => line.trim()).join('\n'),
    'remove-line-breaks': (text: string) => text.replace(/\n/g, ' '),
    'add-line-breaks': (text: string) => {
      // Insert line break after each sentence
      return text.replace(/([.!?])\s+/g, '$1\n');
    },
  };

  // Process text when input or formatter changes
  useEffect(() => {
    if (input) {
      const formattedText = formatters[selectedFormatter](input);
      setOutput(formattedText);
    } else {
      setOutput('');
    }
  }, [input, selectedFormatter]);

  // Update stats when text changes
  useEffect(() => {
    const countStats = (text: string) => {
      return {
        chars: text.length,
        words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
        lines: text.trim() === '' ? 0 : text.trim().split('\n').length
      };
    };

    const inputStats = countStats(input);
    const outputStats = countStats(output);

    setCharCount({ input: inputStats.chars, output: outputStats.chars });
    setWordCount({ input: inputStats.words, output: outputStats.words });
    setLineCount({ input: inputStats.lines, output: outputStats.lines });
  }, [input, output]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolContainer title="Text Formatter">
      <div className="space-y-6">
        {/* Tool Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Formatter
          </label>
          <select
            value={selectedFormatter}
            onChange={(e) => setSelectedFormatter(e.target.value as FormatterType)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="uppercase">UPPERCASE</option>
            <option value="lowercase">lowercase</option>
            <option value="capitalize">Title Case</option>
            <option value="sentence-case">Sentence case</option>
            <option value="remove-whitespace">Remove Extra Whitespace</option>
            <option value="trim-lines">Trim Each Line</option>
            <option value="remove-line-breaks">Remove Line Breaks</option>
            <option value="add-line-breaks">Add Line Breaks</option>
          </select>
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter text to format..."
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {charCount.input} characters | {wordCount.input} words | {lineCount.input} lines
          </div>
        </div>

        {/* Conversion Arrow */}
        <div className="flex justify-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
            <ArrowDown className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
        </div>

        {/* Text Output */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Formatted Text
            </label>
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ClipboardCopy size={16} className="mr-2" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {charCount.output} characters | {wordCount.output} words | {lineCount.output} lines
          </div>
        </div>
      </div>
    </ToolContainer>
  );
};