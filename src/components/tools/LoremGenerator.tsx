import React, { useState } from 'react';
import { ClipboardCopy } from 'lucide-react';
import { ToolContainer } from '../ui/ToolContainer';

type GeneratorType = 'paragraphs' | 'sentences' | 'words';

export const LoremGenerator: React.FC = () => {
  const [generatorType, setGeneratorType] = useState<GeneratorType>('paragraphs');
  const [count, setCount] = useState(3);
  const [includeLorem, setIncludeLorem] = useState(true);
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
    'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
    'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit',
    'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generateRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const generateSentence = (minWords = 5, maxWords = 15) => {
    const numWords = generateRandomInt(minWords, maxWords);
    const sentenceWords = [];
    
    for (let i = 0; i < numWords; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      sentenceWords.push(i === 0 ? randomWord.charAt(0).toUpperCase() + randomWord.slice(1) : randomWord);
    }
    
    return sentenceWords.join(' ') + '.';
  };

  const generateParagraph = (minSentences = 3, maxSentences = 7) => {
    const numSentences = generateRandomInt(minSentences, maxSentences);
    const sentences = [];
    
    for (let i = 0; i < numSentences; i++) {
      sentences.push(generateSentence());
    }
    
    return sentences.join(' ');
  };

  const generateText = () => {
    let result = '';
    
    switch (generatorType) {
      case 'paragraphs':
        const paragraphs = [];
        for (let i = 0; i < count; i++) {
          paragraphs.push(generateParagraph());
        }
        result = paragraphs.join('\n\n');
        break;
      
      case 'sentences':
        const sentences = [];
        for (let i = 0; i < count; i++) {
          sentences.push(generateSentence());
        }
        result = sentences.join(' ');
        break;
      
      case 'words':
        const randomWords = [];
        for (let i = 0; i < count; i++) {
          randomWords.push(words[Math.floor(Math.random() * words.length)]);
        }
        // Capitalize first word
        randomWords[0] = randomWords[0].charAt(0).toUpperCase() + randomWords[0].slice(1);
        result = randomWords.join(' ') + '.';
        break;
    }
    
    if (!includeLorem && result.toLowerCase().startsWith('lorem')) {
      // Replace the first word if it's 'Lorem'
      const alternativeStarters = ['Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur'];
      const randomStarter = alternativeStarters[Math.floor(Math.random() * alternativeStarters.length)];
      result = randomStarter + result.substring(5);
    }
    
    setGeneratedText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolContainer title="Lorem Ipsum Generator">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Generator Type
            </label>
            <select
              value={generatorType}
              onChange={(e) => setGeneratorType(e.target.value as GeneratorType)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Count
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value || '1'))))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="include-lorem"
            checked={includeLorem}
            onChange={() => setIncludeLorem(!includeLorem)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="include-lorem" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Start with "Lorem ipsum"
          </label>
        </div>

        <div>
          <button
            onClick={generateText}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Generate Text
          </button>
        </div>

        {generatedText && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Generated Text</h3>
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ClipboardCopy size={16} className="mr-2" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md max-h-80 overflow-y-auto">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {generatedText}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolContainer>
  );
};