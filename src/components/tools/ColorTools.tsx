// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   Copy, Eye, EyeOff, Check, Shuffle, Save
// } from 'lucide-react';
// import { ToolContainer } from '../ui/ToolContainer';
// import { useLocalStorage } from '../../hooks/useLocalStorage';
// import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
// import { useDebounce } from '../../hooks/useDebounce';
// import { 
//   hexToRGB, rgbToHex, hexToHSL, hslToHex, 
//   getContrastColor, simulateColorBlindness, getColorName 
// } from '../../utils/colorUtils';

// type ColorMode = 'picker' | 'palette' | 'gradient' | 'accessibility' | 'extract';
// type ColorFormat = 'hex' | 'rgb' | 'hsl';
// type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia';

// interface SavedColor {
//   color: string;
//   timestamp: number;
//   name?: string;
// }

// interface AccessibilityResult {
//   ratio: number;
//   AALarge: boolean;
//   AA: boolean;
//   AAA: boolean;
// }

// const isValidHex = (val: string) => /^#[0-9A-Fa-f]{6}$/.test(val);

// const ColorInput: React.FC<{
//   value: string;
//   onChange: (v: string) => void;
//   label: string;
//   error?: string;
// }> = ({ value, onChange, label, error }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//       {label}
//     </label>
//     <div className="flex items-center space-x-2">
//       <input
//         aria-label={label + " color picker"}
//         type="color"
//         value={isValidHex(value) ? value : '#000000'}
//         onChange={e => onChange(e.target.value)}
//         className="h-10 w-20 cursor-pointer rounded border-none"
//       />
//       <input
//         aria-label={label + " color input"}
//         type="text"
//         value={value}
//         onChange={e => onChange(e.target.value)}
//         className={`flex-1 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
//         placeholder="#RRGGBB"
//       />
//     </div>
//     {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
//   </div>
// );

// const SavedColorsPanel: React.FC<{
//   colors: SavedColor[];
//   onCopy: (color: string) => void;
// }> = ({ colors, onCopy }) => (
//   <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//     <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//       Recently Used Colors
//     </h3>
//     <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
//       {colors.map((saved, index) => (
//         <div
//           key={index}
//           className="relative group cursor-pointer"
//           tabIndex={0}
//           aria-label={`Copy color ${saved.color}`}
//           onClick={() => onCopy(saved.color)}
//           onKeyDown={e => e.key === 'Enter' && onCopy(saved.color)}
//         >
//           <div
//             className="w-8 h-8 rounded-md shadow-sm transition-transform hover:scale-110"
//             style={{ backgroundColor: saved.color }}
//           />
//           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//             <Copy size={14} className="text-white drop-shadow" />
//           </div>
//           {saved.name && (
//             <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//               {saved.name}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   </div>
// );

// export const ColorTools: React.FC = () => {
//   const [colorMode, setColorMode] = useState<ColorMode>('picker');
//   const [pickerColor, setPickerColor] = useState('#3B82F6');
//   const [pickerError, setPickerError] = useState('');
//   const [contrastColor, setContrastColor] = useState('#FFFFFF');
//   const [contrastError, setContrastError] = useState('');
//   const [colorFormat, setColorFormat] = useState<ColorFormat>('hex');
//   const [copied, setCopied] = useState<string | null>(null);
//   const [savedColors, setSavedColors] = useLocalStorage<SavedColor[]>('saved-colors', []);
//   const [showSavedColors, setShowSavedColors] = useState(false);
//   const [showColorBlindness, setShowColorBlindness] = useState(false);
//   const [imageUrl, setImageUrl] = useState('');
//   const [extractedColors, setExtractedColors] = useState<string[]>([]);
//   const [extractLoading, setExtractLoading] = useState(false);
//   const [extractError, setExtractError] = useState('');

//   const debouncedPickerColor = useDebounce(pickerColor, 300);

//   // Keyboard shortcuts
//   useKeyboardShortcuts({
//     onCopy: () => handleCopy(pickerColor),
//     onSave: () => handleSaveColor(pickerColor),
//   });

//   // Color blindness simulation
//   const colorBlindnessSimulation = useMemo(() => {
//     if (!showColorBlindness) return null;
//     return {
//       protanopia: simulateColorBlindness(pickerColor, 'protanopia'),
//       deuteranopia: simulateColorBlindness(pickerColor, 'deuteranopia'),
//       tritanopia: simulateColorBlindness(pickerColor, 'tritanopia'),
//     };
//   }, [pickerColor, showColorBlindness]);

//   // Calculate contrast ratio
//   const calculateContrastRatio = (color1: string, color2: string): AccessibilityResult => {
//     const rgb1 = hexToRGB(color1);
//     const rgb2 = hexToRGB(color2);
//     const l1 = (0.2126 * rgb1.r + 0.7152 * rgb1.g + 0.0722 * rgb1.b) / 255;
//     const l2 = (0.2126 * rgb2.r + 0.7152 * rgb2.g + 0.0722 * rgb2.b) / 255;
//     const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
//     return {
//       ratio: Math.round(ratio * 100) / 100,
//       AALarge: ratio >= 3,
//       AA: ratio >= 4.5,
//       AAA: ratio >= 7,
//     };
//   };

//   const contrastResult = useMemo(() => 
//     calculateContrastRatio(pickerColor, contrastColor),
//     [pickerColor, contrastColor]
//   );

//   // Validate color input
//   useEffect(() => {
//     setPickerError(isValidHex(pickerColor) ? '' : 'Invalid HEX color');
//   }, [pickerColor]);
//   useEffect(() => {
//     setContrastError(isValidHex(contrastColor) ? '' : 'Invalid HEX color');
//   }, [contrastColor]);

//   // Extract colors from image
//   const extractColorsFromImage = async (url: string) => {
//     setExtractLoading(true);
//     setExtractError('');
//     setExtractedColors([]);
//     try {
//       const img = new window.Image();
//       img.crossOrigin = 'Anonymous';
//       img.src = url;
//       await new Promise((resolve, reject) => {
//         img.onload = resolve;
//         img.onerror = reject;
//       });
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       if (!ctx) throw new Error('Could not get canvas context');
//       canvas.width = img.width;
//       canvas.height = img.height;
//       ctx.drawImage(img, 0, 0);
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
//       const colorMap = new Map<string, number>();
//       for (let i = 0; i < imageData.length; i += 4) {
//         const hex = rgbToHex(imageData[i], imageData[i + 1], imageData[i + 2]);
//         colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
//       }
//       const sortedColors = Array.from(colorMap.entries())
//         .sort((a, b) => b[1] - a[1])
//         .slice(0, 5)
//         .map(([color]) => color);
//       setExtractedColors(sortedColors);
//     } catch (error) {
//       setExtractError('Failed to extract colors from image.');
//       setExtractedColors([]);
//     } finally {
//       setExtractLoading(false);
//     }
//   };

//   const handleCopy = async (color: string) => {
//     let colorValue = color;
//     if (colorFormat === 'rgb') {
//       const rgb = hexToRGB(color);
//       colorValue = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
//     } else if (colorFormat === 'hsl') {
//       const { h, s, l } = hexToHSL(color);
//       colorValue = `hsl(${h}, ${s}%, ${l}%)`;
//     }
//     try {
//       await navigator.clipboard.writeText(colorValue);
//       setCopied(color);
//       setTimeout(() => setCopied(null), 2000);
//     } catch {
//       setCopied(null);
//       // Optionally display a toast or error
//     }
//   };

//   const handleSaveColor = (color: string) => {
//     if (!isValidHex(color)) return;
//     setSavedColors(prev => {
//       const colorName = getColorName(color);
//       const newColor: SavedColor = { 
//         color, 
//         timestamp: Date.now(),
//         name: colorName 
//       };
//       return [newColor, ...prev].slice(0, 20);
//     });
//   };

//   const generateRandomColor = () => {
//     const hex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
//     setPickerColor(hex);
//   };

//   return (
//     <ToolContainer title="Color Tools">
//       <div className="space-y-6">
//         {/* Mode Switcher */}
//         <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
//           {(['picker', 'palette', 'gradient', 'accessibility', 'extract'] as ColorMode[]).map((mode) => (
//             <button
//               key={mode}
//               className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
//                 colorMode === mode
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
//               }`}
//               onClick={() => setColorMode(mode)}
//               aria-label={`Switch to ${mode} mode`}
//             >
//               {mode.charAt(0).toUpperCase() + mode.slice(1)}
//             </button>
//           ))}
//         </div>
//         {/* Format & Random & History */}
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex space-x-4">
//             <select
//               aria-label="Color format"
//               value={colorFormat}
//               onChange={(e) => setColorFormat(e.target.value as ColorFormat)}
//               className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//             >
//               <option value="hex">HEX</option>
//               <option value="rgb">RGB</option>
//               <option value="hsl">HSL</option>
//             </select>
//             <button
//               onClick={generateRandomColor}
//               className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//               aria-label="Generate random color"
//             >
//               <Shuffle size={16} className="mr-2" />
//               Random
//             </button>
//           </div>
//           <button
//             onClick={() => setShowSavedColors(!showSavedColors)}
//             className="flex items-center px-3 py-1.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
//             aria-label={showSavedColors ? 'Hide History' : 'Show History'}
//           >
//             {showSavedColors ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
//             {showSavedColors ? 'Hide History' : 'Show History'}
//           </button>
//         </div>
//         {/* Saved Colors */}
//         {showSavedColors && savedColors.length > 0 && (
//           <SavedColorsPanel colors={savedColors} onCopy={handleCopy} />
//         )}
//         {/* Picker Mode */}
//         {colorMode === 'picker' && (
//           <div className="space-y-6">
//             <ColorInput
//               value={pickerColor}
//               onChange={setPickerColor}
//               label="Select Color"
//               error={pickerError}
//             />
//             <div className="flex space-x-2 mt-2">
//               <button
//                 onClick={() => handleCopy(pickerColor)}
//                 className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
//                 aria-label="Copy color"
//                 disabled={!!pickerError}
//               >
//                 <Copy size={16} className="mr-2" />
//                 {copied === pickerColor ? "Copied!" : "Copy"}
//               </button>
//               <button
//                 onClick={() => handleSaveColor(pickerColor)}
//                 className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
//                 aria-label="Save color"
//                 disabled={!!pickerError}
//               >
//                 <Save size={16} className="mr-2" />
//                 Save
//               </button>
//             </div>
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Preview</h3>
//               <div className="flex flex-col space-y-2">
//                 <div 
//                   className="h-24 rounded-md shadow-sm"
//                   style={{ backgroundColor: pickerColor }}
//                 />
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     {colorFormat === 'hex' ? pickerColor :
//                      colorFormat === 'rgb' ? `rgb(${Object.values(hexToRGB(pickerColor)).join(', ')})` :
//                      (() => {
//                        const { h, s, l } = hexToHSL(pickerColor);
//                        return `hsl(${h}, ${s}%, ${l}%)`;
//                      })()}
//                   </span>
//                   <span className="text-sm text-gray-500 dark:text-gray-400">
//                     {getColorName(pickerColor)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             {/* Color Blindness */}
//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
//                   Color Blindness Simulation
//                 </h3>
//                 <button
//                   onClick={() => setShowColorBlindness(!showColorBlindness)}
//                   className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
//                   aria-label="Toggle color blindness simulation"
//                 >
//                   {showColorBlindness ? 'Hide' : 'Show'}
//                 </button>
//               </div>
//               {showColorBlindness && colorBlindnessSimulation && (
//                 <div className="grid grid-cols-3 gap-4">
//                   {(Object.entries(colorBlindnessSimulation) as [ColorBlindnessType, string][]).map(([type, color]) => (
//                     <div key={type} className="flex flex-col items-center">
//                       <div
//                         className="w-full h-16 rounded-md shadow-sm mb-2"
//                         style={{ backgroundColor: color }}
//                       />
//                       <span className="text-sm text-gray-700 dark:text-gray-300">
//                         {type.charAt(0).toUpperCase() + type.slice(1)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//         {/* Accessibility Mode */}
//         {colorMode === 'accessibility' && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <ColorInput
//                 value={pickerColor}
//                 onChange={setPickerColor}
//                 label="Foreground Color"
//                 error={pickerError}
//               />
//               <ColorInput
//                 value={contrastColor}
//                 onChange={setContrastColor}
//                 label="Background Color"
//                 error={contrastError}
//               />
//             </div>
//             <div className="p-6 rounded-lg" style={{ backgroundColor: contrastColor }}>
//               <p 
//                 className="text-3xl font-bold"
//                 style={{ color: pickerColor }}
//               >
//                 Accessibility Preview
//               </p>
//               <p className="mt-2 text-gray-700 dark:text-gray-300">
//                 Contrast Ratio: <span className="font-mono">{contrastResult.ratio}</span>
//                 {contrastResult.AA && <span className="ml-2 px-2 py-1 rounded bg-green-100 text-green-800 text-xs">AA</span>}
//                 {contrastResult.AAA && <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">AAA</span>}
//                 {!contrastResult.AA && <span className="ml-2 px-2 py-1 rounded bg-red-100 text-red-800 text-xs">Fail</span>}
//               </p>
//             </div>
//           </div>
//         )}
//         {/* Extract Mode */}
//         {colorMode === 'extract' && (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Image URL
//               </label>
//               <div className="flex space-x-2">
//                 <input
//                   type="text"
//                   value={imageUrl}
//                   onChange={e => setImageUrl(e.target.value)}
//                   className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                   placeholder="Paste image URL"
//                   aria-label="Image URL"
//                 />
//                 <button
//                   onClick={() => extractColorsFromImage(imageUrl)}
//                   className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                   disabled={!imageUrl}
//                   aria-label="Extract colors"
//                 >
//                   Extract
//                 </button>
//               </div>
//               {extractError && <div className="text-xs text-red-500 mt-1">{extractError}</div>}
//             </div>
//             {extractLoading && (
//               <div className="text-sm text-gray-500 dark:text-gray-400">Extracting colors...</div>
//             )}
//             {extractedColors.length > 0 && (
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Extracted Colors
//                 </h3>
//                 <div className="flex space-x-2">
//                   {extractedColors.map((color, i) => (
//                     <div key={i} className="flex flex-col items-center">
//                       <div
//                         className="w-10 h-10 rounded shadow"
//                         style={{ backgroundColor: color }}
//                         aria-label={`Extracted color ${color}`}
//                       />
//                       <span className="text-xs mt-1">{color}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//         {/* Placeholder for other modes */}
//         {(colorMode === 'palette' || colorMode === 'gradient') && (
//           <div className="text-gray-500 dark:text-gray-400 text-sm">
//             This feature is coming soon.
//           </div>
//         )}
//       </div>
//     </ToolContainer>
//   );
// };



import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Eye, EyeOff, Check, Shuffle, Save } from 'lucide-react';
import { ToolContainer } from '../ui/ToolContainer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useDebounce } from '../../hooks/useDebounce';
import {
  hexToRGB, rgbToHex, hexToHSL, hslToHex,
  getContrastColor, simulateColorBlindness, getColorName
} from '../../utils/colorUtils';

// --- Harmony fallback implementations (see above) ---
function getComplementaryColor(hex: string): string {
  const { h, s, l } = hexToHSL(hex);
  const newHue = (h + 180) % 360;
  return hslToHex({ h: newHue, s, l });
}
function getAnalogousColors(hex: string): string[] {
  const { h, s, l } = hexToHSL(hex);
  return [
    hslToHex({ h: (h + 30) % 360, s, l }),
    hslToHex({ h: (h + 330) % 360, s, l })
  ];
}
function getTriadicColors(hex: string): string[] {
  const { h, s, l } = hexToHSL(hex);
  return [
    hslToHex({ h: (h + 120) % 360, s, l }),
    hslToHex({ h: (h + 240) % 360, s, l })
  ];
}
// ---------------------------------------------------

type ColorMode = 'picker' | 'palette' | 'gradient' | 'accessibility' | 'extract';
type ColorFormat = 'hex' | 'rgb' | 'hsl';
type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia';

interface SavedColor {
  color: string;
  timestamp: number;
  name?: string;
}

interface AccessibilityResult {
  ratio: number;
  AALarge: boolean;
  AA: boolean;
  AAA: boolean;
}

const isValidHex = (val: string) => /^#[0-9A-Fa-f]{6}$/.test(val);

const ColorInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  label: string;
  error?: string;
}> = ({ value, onChange, label, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <div className="flex items-center space-x-2">
      <input
        aria-label={label + " color picker"}
        type="color"
        value={isValidHex(value) ? value : '#000000'}
        onChange={e => onChange(e.target.value)}
        className="h-10 w-20 cursor-pointer rounded border-none"
      />
      <input
        aria-label={label + " color input"}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`flex-1 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
        placeholder="#RRGGBB"
      />
    </div>
    {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
  </div>
);

const SavedColorsPanel: React.FC<{
  colors: SavedColor[];
  onCopy: (color: string) => void;
}> = ({ colors, onCopy }) => (
  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
      Recently Used Colors
    </h3>
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
      {colors.map((saved, index) => (
        <div
          key={index}
          className="relative group cursor-pointer"
          tabIndex={0}
          aria-label={`Copy color ${saved.color}`}
          onClick={() => onCopy(saved.color)}
          onKeyDown={e => e.key === 'Enter' && onCopy(saved.color)}
        >
          <div
            className="w-8 h-8 rounded-md shadow-sm transition-transform hover:scale-110"
            style={{ backgroundColor: saved.color }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy size={14} className="text-white drop-shadow" />
          </div>
          {saved.name && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {saved.name}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Palette Panel
const PalettePanel: React.FC<{
  baseColor: string;
  onCopy: (color: string) => void;
  onSave: (color: string) => void;
}> = ({ baseColor, onCopy, onSave }) => {
  const complementary = getComplementaryColor(baseColor);
  const analogous = getAnalogousColors(baseColor);
  const triadic = getTriadicColors(baseColor);

  // Remove duplicates, keep order
  const paletteColors = Array.from(new Set([
    baseColor,
    complementary,
    ...analogous,
    ...triadic
  ]));

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Color Palette</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {paletteColors.map((color, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded shadow cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => onCopy(color)}
              title={`Copy ${color}`}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onCopy(color)}
              aria-label={`Copy color ${color}`}
            />
            <button
              onClick={() => onSave(color)}
              className="mt-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded"
              aria-label={`Save color ${color}`}
              type="button"
            >
              <Save size={14} />
            </button>
            <span className="mt-1 text-xs text-gray-700 dark:text-gray-300">{getColorName(color)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Click a color to copy. Save colors to your history.
      </div>
    </div>
  );
};

// Gradient Panel
const GradientPanel: React.FC<{
  onCopy: (css: string) => void;
}> = ({ onCopy }) => {
  const [colors, setColors] = useState(['#3B82F6', '#06B6D4']);
  const [direction, setDirection] = useState(90); // degrees

  const updateColor = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };

  const addColor = () => {
    setColors([...colors, '#FFFFFF']);
  };

  const removeColor = (index: number) => {
    if (colors.length <= 2) return;
    setColors(colors.filter((_, i) => i !== index));
  };

  const gradientCSS = `linear-gradient(${direction}deg, ${colors.join(', ')})`;

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Gradient Generator</h3>
      <div className="space-y-4">
        <div className="flex space-x-2">
          {colors.map((color, index) => (
            <div key={index} className="flex flex-col items-center">
              <input
                type="color"
                value={color}
                onChange={e => updateColor(index, e.target.value)}
                className="w-12 h-12 rounded"
                aria-label={`Select color ${index + 1}`}
              />
              {colors.length > 2 && (
                <button
                  onClick={() => removeColor(index)}
                  className="mt-1 text-red-600 hover:text-red-800 text-xs"
                  aria-label={`Remove color ${index + 1}`}
                  type="button"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addColor}
            className="self-center px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
            aria-label="Add color"
            type="button"
          >
            + Add Color
          </button>
        </div>
        <div>
          <label htmlFor="direction" className="block mb-1 font-medium">
            Direction (degrees)
          </label>
          <input
            id="direction"
            type="range"
            min="0"
            max="360"
            value={direction}
            onChange={e => setDirection(Number(e.target.value))}
            className="w-full"
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={direction}
            aria-label="Gradient direction"
          />
          <div className="text-sm text-gray-600 dark:text-gray-400">{direction}°</div>
        </div>
        <div
          className="h-24 rounded shadow"
          style={{ background: gradientCSS }}
          aria-label="Gradient preview"
        />
        <button
          onClick={() => onCopy(gradientCSS)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          aria-label="Copy gradient CSS"
          type="button"
        >
          <Copy size={16} className="inline-block mr-2" />
          Copy CSS
        </button>
      </div>
    </div>
  );
};

export const ColorTools: React.FC = () => {
  const [colorMode, setColorMode] = useState<ColorMode>('picker');
  const [pickerColor, setPickerColor] = useState('#3B82F6');
  const [pickerError, setPickerError] = useState('');
  const [contrastColor, setContrastColor] = useState('#FFFFFF');
  const [contrastError, setContrastError] = useState('');
  const [colorFormat, setColorFormat] = useState<ColorFormat>('hex');
  const [copied, setCopied] = useState<string | null>(null);
  const [savedColors, setSavedColors] = useLocalStorage<SavedColor[]>('saved-colors', []);
  const [showSavedColors, setShowSavedColors] = useState(false);
  const [showColorBlindness, setShowColorBlindness] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [extractLoading, setExtractLoading] = useState(false);
  const [extractError, setExtractError] = useState('');

  useKeyboardShortcuts({
    onCopy: () => handleCopy(pickerColor),
    onSave: () => handleSaveColor(pickerColor),
  });

  const colorBlindnessSimulation = useMemo(() => {
    if (!showColorBlindness) return null;
    return {
      protanopia: simulateColorBlindness(pickerColor, 'protanopia'),
      deuteranopia: simulateColorBlindness(pickerColor, 'deuteranopia'),
      tritanopia: simulateColorBlindness(pickerColor, 'tritanopia'),
    };
  }, [pickerColor, showColorBlindness]);

  const calculateContrastRatio = (color1: string, color2: string): AccessibilityResult => {
    const rgb1 = hexToRGB(color1);
    const rgb2 = hexToRGB(color2);
    const l1 = (0.2126 * rgb1.r + 0.7152 * rgb1.g + 0.0722 * rgb1.b) / 255;
    const l2 = (0.2126 * rgb2.r + 0.7152 * rgb2.g + 0.0722 * rgb2.b) / 255;
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return {
      ratio: Math.round(ratio * 100) / 100,
      AALarge: ratio >= 3,
      AA: ratio >= 4.5,
      AAA: ratio >= 7,
    };
  };

  const contrastResult = useMemo(() =>
    calculateContrastRatio(pickerColor, contrastColor),
    [pickerColor, contrastColor]
  );

  useEffect(() => {
    setPickerError(isValidHex(pickerColor) ? '' : 'Invalid HEX color');
  }, [pickerColor]);
  useEffect(() => {
    setContrastError(isValidHex(contrastColor) ? '' : 'Invalid HEX color');
  }, [contrastColor]);

  const extractColorsFromImage = async (url: string) => {
    setExtractLoading(true);
    setExtractError('');
    setExtractedColors([]);
    try {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorMap = new Map<string, number>();
      for (let i = 0; i < imageData.length; i += 4) {
        const hex = rgbToHex(imageData[i], imageData[i + 1], imageData[i + 2]);
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
      }
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([color]) => color);
      setExtractedColors(sortedColors);
    } catch (error) {
      setExtractError('Failed to extract colors from image.');
      setExtractedColors([]);
    } finally {
      setExtractLoading(false);
    }
  };

  const handleCopy = async (colorOrCSS: string) => {
    let value = colorOrCSS;
    if (colorMode !== 'gradient' && isValidHex(colorOrCSS)) {
      if (colorFormat === 'rgb') {
        const rgb = hexToRGB(colorOrCSS);
        value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      } else if (colorFormat === 'hsl') {
        const { h, s, l } = hexToHSL(colorOrCSS);
        value = `hsl(${h}, ${s}%, ${l}%)`;
      }
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopied(colorOrCSS);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  const handleSaveColor = (color: string) => {
    if (!isValidHex(color)) return;
    setSavedColors(prev => {
      const colorName = getColorName(color);
      const newColor: SavedColor = {
        color,
        timestamp: Date.now(),
        name: colorName
      };
      return [newColor, ...prev].slice(0, 20);
    });
  };

  const generateRandomColor = () => {
    const hex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setPickerColor(hex);
  };

  return (
    <ToolContainer title="Color Tools">
      <div className="space-y-6">
        {/* Mode Switcher */}
        <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
          {(['picker', 'palette', 'gradient', 'accessibility', 'extract'] as ColorMode[]).map((mode) => (
            <button
              key={mode}
              className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                colorMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setColorMode(mode)}
              aria-label={`Switch to ${mode} mode`}
              type="button"
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        {/* Format & Random & History */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <select
              aria-label="Color format"
              value={colorFormat}
              onChange={(e) => setColorFormat(e.target.value as ColorFormat)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="hex">HEX</option>
              <option value="rgb">RGB</option>
              <option value="hsl">HSL</option>
            </select>
            <button
              onClick={generateRandomColor}
              className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Generate random color"
              type="button"
            >
              <Shuffle size={16} className="mr-2" />
              Random
            </button>
          </div>
          <button
            onClick={() => setShowSavedColors(!showSavedColors)}
            className="flex items-center px-3 py-1.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            aria-label={showSavedColors ? 'Hide History' : 'Show History'}
            type="button"
          >
            {showSavedColors ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
            {showSavedColors ? 'Hide History' : 'Show History'}
          </button>
        </div>
        {/* Saved Colors */}
        {showSavedColors && savedColors.length > 0 && (
          <SavedColorsPanel colors={savedColors} onCopy={handleCopy} />
        )}
        {/* Picker Mode */}
        {colorMode === 'picker' && (
          <div className="space-y-6">
            <ColorInput
              value={pickerColor}
              onChange={setPickerColor}
              label="Select Color"
              error={pickerError}
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleCopy(pickerColor)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                aria-label="Copy color"
                disabled={!!pickerError}
                type="button"
              >
                <Copy size={16} className="mr-2" />
                {copied === pickerColor ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={() => handleSaveColor(pickerColor)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                aria-label="Save color"
                disabled={!!pickerError}
                type="button"
              >
                <Save size={16} className="mr-2" />
                Save
              </button>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Preview</h3>
              <div className="flex flex-col space-y-2">
                <div
                  className="h-24 rounded-md shadow-sm"
                  style={{ backgroundColor: pickerColor }}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {colorFormat === 'hex' ? pickerColor :
                      colorFormat === 'rgb' ? `rgb(${Object.values(hexToRGB(pickerColor)).join(', ')})` :
                        (() => {
                          const { h, s, l } = hexToHSL(pickerColor);
                          return `hsl(${h}, ${s}%, ${l}%)`;
                        })()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {getColorName(pickerColor)}
                  </span>
                </div>
              </div>
            </div>
            {/* Color Blindness */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Color Blindness Simulation
                </h3>
                <button
                  onClick={() => setShowColorBlindness(!showColorBlindness)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  aria-label="Toggle color blindness simulation"
                  type="button"
                >
                  {showColorBlindness ? 'Hide' : 'Show'}
                </button>
              </div>
              {showColorBlindness && colorBlindnessSimulation && (
                <div className="grid grid-cols-3 gap-4">
                  {(Object.entries(colorBlindnessSimulation) as [ColorBlindnessType, string][]).map(([type, color]) => (
                    <div key={type} className="flex flex-col items-center">
                      <div
                        className="w-full h-16 rounded-md shadow-sm mb-2"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Palette Mode */}
        {colorMode === 'palette' && (
          <PalettePanel
            baseColor={pickerColor}
            onCopy={handleCopy}
            onSave={handleSaveColor}
          />
        )}
        {/* Gradient Mode */}
        {colorMode === 'gradient' && (
          <GradientPanel
            onCopy={handleCopy}
          />
        )}
        {/* Accessibility Mode */}
        {colorMode === 'accessibility' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorInput
                value={pickerColor}
                onChange={setPickerColor}
                label="Foreground Color"
                error={pickerError}
              />
              <ColorInput
                value={contrastColor}
                onChange={setContrastColor}
                label="Background Color"
                error={contrastError}
              />
            </div>
            <div className="p-6 rounded-lg" style={{ backgroundColor: contrastColor }}>
              <p
                className="text-3xl font-bold"
                style={{ color: pickerColor }}
              >
                Accessibility Preview
              </p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                Contrast Ratio: <span className="font-mono">{contrastResult.ratio}</span>
                {contrastResult.AA && <span className="ml-2 px-2 py-1 rounded bg-green-100 text-green-800 text-xs">AA</span>}
                {contrastResult.AAA && <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">AAA</span>}
                {!contrastResult.AA && <span className="ml-2 px-2 py-1 rounded bg-red-100 text-red-800 text-xs">Fail</span>}
              </p>
            </div>
          </div>
        )}
        {/* Extract Mode */}
        {colorMode === 'extract' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Paste image URL"
                  aria-label="Image URL"
                />
                <button
                  onClick={() => extractColorsFromImage(imageUrl)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={!imageUrl}
                  aria-label="Extract colors"
                  type="button"
                >
                  Extract
                </button>
              </div>
              {extractError && <div className="text-xs text-red-500 mt-1">{extractError}</div>}
            </div>
            {extractLoading && (
              <div className="text-sm text-gray-500 dark:text-gray-400">Extracting colors...</div>
            )}
            {extractedColors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Extracted Colors
                </h3>
                <div className="flex space-x-2">
                  {extractedColors.map((color, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded shadow"
                        style={{ backgroundColor: color }}
                        aria-label={`Extracted color ${color}`}
                      />
                      <span className="text-xs mt-1">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolContainer>
  );
};
