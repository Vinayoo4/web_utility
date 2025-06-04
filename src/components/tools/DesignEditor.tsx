import React, { useState, useRef, useEffect } from 'react';
import {
  Image as ImageIcon, Square, PanelLeft, PanelRight, Download, ChevronUp, ChevronDown, ZoomOut, ZoomIn
} from 'lucide-react';

type ElementType = 'text' | 'shape' | 'image';
type ShapeType = 'rectangle' | 'circle' | 'ellipse' | 'triangle' | 'star' | 'polygon' | 'line';
type TextAlignment = 'left' | 'center' | 'right';

interface DesignElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  alignment?: TextAlignment;
  shape?: ShapeType;
  imageUrl?: string;
  zIndex: number;
  gradient?: { from: string; to: string; direction: number };
}

const businessCardTemplate: DesignElement[] = [
  {
    id: 'bc-bg',
    type: 'shape',
    shape: 'rectangle',
    x: 0,
    y: 0,
    width: 1050,
    height: 600,
    color: '#fff',
    zIndex: 1,
    gradient: { from: '#f7fafc', to: '#e0e7ff', direction: 90 }
  },
  {
    id: 'bc-logo',
    type: 'image',
    x: 60,
    y: 60,
    width: 120,
    height: 120,
    imageUrl: 'https://placehold.co/120x120?text=Logo',
    zIndex: 2
  },
  {
    id: 'bc-name',
    type: 'text',
    x: 220,
    y: 80,
    width: 500,
    height: 60,
    content: 'Jane Doe',
    color: '#1a202c',
    fontSize: 36,
    alignment: 'left',
    fontWeight: 'bold',
    zIndex: 3
  },
  {
    id: 'bc-title',
    type: 'text',
    x: 220,
    y: 150,
    width: 500,
    height: 40,
    content: 'Creative Director',
    color: '#4a5568',
    fontSize: 24,
    alignment: 'left',
    zIndex: 4
  },
  {
    id: 'bc-contact',
    type: 'text',
    x: 220,
    y: 210,
    width: 500,
    height: 40,
    content: 'jane@company.com | (555) 123-4567',
    color: '#718096',
    fontSize: 20,
    alignment: 'left',
    zIndex: 5
  },
  {
    id: 'bc-line',
    type: 'shape',
    shape: 'line',
    x: 60,
    y: 300,
    width: 930,
    height: 2,
    color: '#cbd5e1',
    zIndex: 6
  },
  {
    id: 'bc-address',
    type: 'text',
    x: 60,
    y: 320,
    width: 930,
    height: 40,
    content: '123 Main St, City, Country',
    color: '#a0aec0',
    fontSize: 18,
    alignment: 'left',
    zIndex: 7
  }
];

const socialMediaTemplate: DesignElement[] = [
  {
    id: 'smp-bg',
    type: 'shape',
    shape: 'rectangle',
    x: 0,
    y: 0,
    width: 1080,
    height: 1080,
    color: '#f9fafb',
    zIndex: 1,
    gradient: { from: '#f9fafb', to: '#e0e7ff', direction: 135 }
  },
  {
    id: 'smp-title',
    type: 'text',
    x: 80,
    y: 100,
    width: 920,
    height: 80,
    content: 'Big Announcement!',
    color: '#222',
    fontSize: 54,
    alignment: 'center',
    fontWeight: 'bold',
    zIndex: 2
  },
  {
    id: 'smp-image',
    type: 'image',
    x: 340,
    y: 250,
    width: 400,
    height: 400,
    imageUrl: 'https://placehold.co/400x400?text=Image',
    zIndex: 3
  },
  {
    id: 'smp-desc',
    type: 'text',
    x: 80,
    y: 700,
    width: 920,
    height: 100,
    content: 'We are launching a new product. Stay tuned for updates!',
    color: '#333',
    fontSize: 30,
    alignment: 'center',
    zIndex: 4
  },
  {
    id: 'smp-tags',
    type: 'text',
    x: 80,
    y: 820,
    width: 920,
    height: 40,
    content: '#launch #newproduct #excited',
    color: '#3b82f6',
    fontSize: 22,
    alignment: 'center',
    zIndex: 5
  }
];

const templates = [
  {
    name: 'Social Media Post',
    width: 1080,
    height: 1080,
    description: 'Square format for Instagram, Facebook, etc.',
    elements: socialMediaTemplate
  },
  {
    name: 'Business Card',
    width: 1050,
    height: 600,
    description: 'Standard business card size (3.5 x 2 inches)',
    elements: businessCardTemplate
  }
];

const shapeOptions: { type: ShapeType; label: string; icon: JSX.Element }[] = [
  { type: 'rectangle', label: 'Rectangle', icon: <Square size={20} /> },
  { type: 'circle', label: 'Circle', icon: <div className="w-5 h-5 rounded-full bg-gray-400" /> },
  { type: 'ellipse', label: 'Ellipse', icon: <div className="w-7 h-5 rounded-full bg-gray-400" /> },
  { type: 'triangle', label: 'Triangle', icon: <div style={{ width: 20, height: 20, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '20px solid #aaa' }} /> },
  { type: 'star', label: 'Star', icon: <span style={{ fontSize: 20 }}>⭐</span> },
  { type: 'polygon', label: 'Polygon', icon: <span style={{ fontSize: 20 }}>⬟</span> },
  { type: 'line', label: 'Line', icon: <div style={{ width: 20, height: 2, background: '#aaa', marginTop: 9 }} /> }
];

export const DesignEditor: React.FC = () => {
  // State
  const [canvas, setCanvas] = useState({ width: 1080, height: 1080 });
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState<'left' | 'right' | null>('left');
  const [isMoving, setIsMoving] = useState(false);
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [textEditValue, setTextEditValue] = useState('');
  // Scheduling state for social media
  const [scheduleModal, setScheduleModal] = useState(false);
  const [schedule, setSchedule] = useState({ title: '', description: '', tags: '', date: '' });
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);

  const selected = elements.find(e => e.id === selectedId);

  // --- Undo/Redo ---
  const [history, setHistory] = useState<DesignElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = (els: DesignElement[]) => {
    const newHistory = [...history.slice(0, historyIndex + 1), els];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  useEffect(() => { if (historyIndex === -1) pushHistory([]); }, []); // Init history

  const undo = () => {
    if (historyIndex > 0) {
      setElements(history[historyIndex - 1]);
      setHistoryIndex(historyIndex - 1);
      setSelectedId(null);
    }
  };
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setElements(history[historyIndex + 1]);
      setHistoryIndex(historyIndex + 1);
      setSelectedId(null);
    }
  };

  // --- Add Text ---
  const addText = () => {
    const id = `element-${Date.now()}`;
    const el: DesignElement = {
      id,
      type: 'text',
      x: canvas.width / 2 - 100,
      y: canvas.height / 2 - 50,
      width: 200,
      height: 40,
      content: 'Double click to edit text',
      color: '#222',
      fontSize: 20,
      alignment: 'left',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      zIndex: elements.length + 1
    };
    const newEls = [...elements, el];
    setElements(newEls); setSelectedId(id); pushHistory(newEls);
  };

  // --- Add Shape ---
  const addShape = (shape: ShapeType) => {
    const id = `element-${Date.now()}`;
    const el: DesignElement = {
      id,
      type: 'shape',
      shape,
      x: canvas.width / 2 - 50,
      y: canvas.height / 2 - 50,
      width: 100,
      height: 100,
      color: '#3B82F6',
      zIndex: elements.length + 1,
      gradient: { from: '#3B82F6', to: '#6366f1', direction: 90 }
    };
    const newEls = [...elements, el];
    setElements(newEls); setSelectedId(id); pushHistory(newEls);
  };

  // --- Add Image ---
  const addImage = () => {
    const id = `element-${Date.now()}`;
    const el: DesignElement = {
      id,
      type: 'image',
      x: canvas.width / 2 - 100,
      y: canvas.height / 2 - 100,
      width: 200,
      height: 200,
      imageUrl: 'https://placehold.co/200x200?text=Double+Click+to+Upload',
      zIndex: elements.length + 1
    };
    const newEls = [...elements, el];
    setElements(newEls); setSelectedId(id); pushHistory(newEls);
  };

  // --- Select/Move ---
  const handleMoveStart = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    setIsMoving(true); setSelectedId(id);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setMoveOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleMoveEnd);
  };
  const handleMove = (e: MouseEvent) => {
    if (!isMoving || !selectedId || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const idx = elements.findIndex(el => el.id === selectedId);
    if (idx === -1) return;
    const updated = [...elements];
    const el = { ...updated[idx] };
    const newX = (e.clientX - canvasRect.left - moveOffset.x) / scale;
    const newY = (e.clientY - canvasRect.top - moveOffset.y) / scale;
    el.x = Math.max(0, Math.min(canvas.width - el.width, newX));
    el.y = Math.max(0, Math.min(canvas.height - el.height, newY));
    updated[idx] = el;
    setElements(updated);
  };
  const handleMoveEnd = () => {
    setIsMoving(false);
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleMoveEnd);
    pushHistory(elements);
  };

  // --- Inline Text Edit ---
  const startTextEdit = (id: string, content: string = '') => {
    setEditingTextId(id);
    setTextEditValue(content);
  };
  const finishTextEdit = () => {
    if (!editingTextId) return;
    const idx = elements.findIndex(el => el.id === editingTextId);
    if (idx === -1) return;
    const updated = [...elements];
    updated[idx] = { ...updated[idx], content: textEditValue };
    setElements(updated);
    setEditingTextId(null);
    setTextEditValue('');
    pushHistory(updated);
  };

  // --- Image Upload ---
  const handleImageEdit = (id: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const idx = elements.findIndex(el => el.id === id);
        if (idx === -1) return;
        const updated = [...elements];
        updated[idx] = { ...updated[idx], imageUrl: reader.result as string };
        setElements(updated);
        pushHistory(updated);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // --- Delete/Duplicate/Layering ---
  const deleteElement = () => {
    if (!selectedId) return;
    const newEls = elements.filter(el => el.id !== selectedId);
    setElements(newEls); setSelectedId(null); setEditingTextId(null); pushHistory(newEls);
  };
  const duplicateElement = () => {
    if (!selectedId) return;
    const idx = elements.findIndex(el => el.id === selectedId);
    if (idx === -1) return;
    const base = elements[idx];
    const dup = { ...base, id: `element-${Date.now()}`, x: base.x + 20, y: base.y + 20, zIndex: elements.length + 1 };
    const newEls = [...elements, dup];
    setElements(newEls); setSelectedId(dup.id); pushHistory(newEls);
  };
  const bringForward = () => {
    if (!selectedId) return;
    const idx = elements.findIndex(el => el.id === selectedId);
    if (idx === -1 || idx === elements.length - 1) return;
    const newEls = [...elements];
    [newEls[idx], newEls[idx + 1]] = [newEls[idx + 1], newEls[idx]];
    newEls.forEach((el, i) => (el.zIndex = i + 1));
    setElements(newEls); pushHistory(newEls);
  };
  const sendBackward = () => {
    if (!selectedId) return;
    const idx = elements.findIndex(el => el.id === selectedId);
    if (idx <= 0) return;
    const newEls = [...elements];
    [newEls[idx], newEls[idx - 1]] = [newEls[idx - 1], newEls[idx]];
    newEls.forEach((el, i) => (el.zIndex = i + 1));
    setElements(newEls); pushHistory(newEls);
  };

  // --- Update Element Property ---
  const updateElementProperty = (prop: keyof DesignElement, value: any) => {
    if (!selectedId) return;
    const idx = elements.findIndex(el => el.id === selectedId);
    if (idx === -1) return;
    const updated = [...elements];
    updated[idx] = { ...updated[idx], [prop]: value };
    setElements(updated); pushHistory(updated);
  };

  // --- Gradient ---
  const updateGradient = (from: string, to: string, direction: number) => {
    if (!selectedId) return;
    const idx = elements.findIndex(el => el.id === selectedId);
    if (idx === -1) return;
    const updated = [...elements];
    updated[idx] = { ...updated[idx], gradient: { from, to, direction } };
    setElements(updated); pushHistory(updated);
  };

  // --- Canvas Click (deselect) ---
  const handleCanvasClick = () => { setSelectedId(null); setEditingTextId(null); };

  // --- Apply Template ---
  const applyTemplate = (tpl: typeof templates[0]) => {
    setCanvas({ width: tpl.width, height: tpl.height });
    setElements(tpl.elements.map(el => ({ ...el, id: `${el.id}-${Date.now()}` })));
    setSelectedId(null);
    setEditingTextId(null);
    pushHistory(tpl.elements);
  };

  // --- Download as JSON ---
  const downloadDesign = () => {
    const dataStr = JSON.stringify({ canvas, elements });
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'design.json');
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // --- Zoom ---
  const zoomIn = () => setScale(s => Math.min(s + 0.1, 3));
  const zoomOut = () => setScale(s => Math.max(s - 0.1, 0.5));

  // --- Keyboard shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') deleteElement();
      if (e.key === 'Escape') setEditingTextId(null);
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') undo();
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) redo();
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); duplicateElement(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // --- Clean up move events ---
  useEffect(() => () => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleMoveEnd);
  }, []);

  // --- Scheduling Modal ---
  const openScheduleModal = () => setScheduleModal(true);
  const closeScheduleModal = () => setScheduleModal(false);
  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSchedule({ ...schedule, [e.target.name]: e.target.value });
  };
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduledPosts([...scheduledPosts, { ...schedule, date: schedule.date || new Date().toISOString() }]);
    setSchedule({ title: '', description: '', tags: '', date: '' });
    setScheduleModal(false);
  };

  // --- Render ---
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row h-full gap-4">
        {/* Left Sidebar */}
        {showSidebar === 'left' && (
          <div className="w-full md:w-64 bg-gray-100 p-4 overflow-auto">
            <h2 className="text-lg font-bold mb-4">Templates</h2>
            {templates.map(tpl => (
              <button
                key={tpl.name}
                className="w-full mb-2 p-2 bg-white rounded border hover:bg-blue-50"
                onClick={() => applyTemplate(tpl)}
              >
                {tpl.name}
              </button>
            ))}
            <h2 className="text-lg font-bold mt-6 mb-4">Add Elements</h2>
            <button onClick={addText} className="w-full mb-2 p-2 bg-white rounded border hover:bg-blue-50">Add Text</button>
            <div className="flex flex-wrap gap-2 mb-4">
              {shapeOptions.map(({ type, label, icon }) => (
                <button
                  key={type}
                  title={label}
                  className="p-2 bg-white rounded border hover:bg-blue-50"
                  onClick={() => addShape(type)}
                >
                  {icon}
                </button>
              ))}
            </div>
            <button onClick={addImage} className="w-full p-2 bg-white rounded border hover:bg-blue-50 flex items-center justify-center gap-2">
              <ImageIcon size={16} /> Add Image
            </button>
          </div>
        )}

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="relative bg-white border border-gray-300 flex-grow mx-auto"
          style={{
            width: canvas.width * scale,
            height: canvas.height * scale,
            transformOrigin: 'top left',
            userSelect: isMoving ? 'none' : 'auto',
            position: 'relative'
          }}
          onClick={handleCanvasClick}
        >
          {elements.map(el => {
            const isSelected = el.id === selectedId;
            const style: React.CSSProperties = {
              position: 'absolute',
              left: el.x * scale,
              top: el.y * scale,
              width: el.width * scale,
              height: el.height * scale,
              zIndex: el.zIndex,
              cursor: isMoving ? 'grabbing' : 'pointer',
              userSelect: 'none',
              color: el.color,
              fontSize: el.fontSize ? el.fontSize * scale : undefined,
              fontWeight: el.fontWeight,
              fontStyle: el.fontStyle,
              textDecoration: el.textDecoration,
              textAlign: el.alignment,
              background: el.type === 'shape' && el.gradient
                ? `linear-gradient(${el.gradient.direction}deg, ${el.gradient.from}, ${el.gradient.to})`
                : el.type === 'shape' && el.color
                  ? el.color
                  : undefined,
              border: isSelected ? '2px solid #3B82F6' : undefined,
              borderRadius: el.shape === 'circle' || el.shape === 'ellipse' ? '50%' : undefined,
              display: 'flex',
              alignItems: 'center',
              justifyContent: el.alignment === 'left' ? 'flex-start' : el.alignment === 'center' ? 'center' : 'flex-end',
              padding: el.type === 'text' ? '4px' : undefined,
              overflow: 'hidden',
              boxSizing: 'border-box'
            };

            if (el.type === 'text') {
              if (editingTextId === el.id) {
                return (
                  <textarea
                    key={el.id}
                    style={{
                      ...style,
                      resize: 'none',
                      outline: 'none',
                      border: '1px solid #3B82F6',
                      backgroundColor: 'white',
                      fontSize: el.fontSize ? el.fontSize * scale : undefined,
                      fontWeight: el.fontWeight,
                      fontStyle: el.fontStyle,
                      textDecoration: el.textDecoration,
                      textAlign: el.alignment,
                      padding: 4,
                      boxSizing: 'border-box'
                    }}
                    value={textEditValue}
                    onChange={e => setTextEditValue(e.target.value)}
                    onBlur={finishTextEdit}
                    autoFocus
                  />
                );
              }
              return (
                <div
                  key={el.id}
                  style={style}
                  onDoubleClick={() => startTextEdit(el.id, el.content)}
                  onMouseDown={e => handleMoveStart(e, el.id)}
                >
                  {el.content}
                </div>
              );
            } else if (el.type === 'image') {
              return (
                <img
                  key={el.id}
                  src={el.imageUrl}
                  alt=""
                  style={style}
                  onDoubleClick={() => handleImageEdit(el.id)}
                  onMouseDown={e => handleMoveStart(e, el.id)}
                  draggable={false}
                />
              );
            } else if (el.type === 'shape') {
              // Custom rendering for line
              if (el.shape === 'line') {
                return (
                  <div
                    key={el.id}
                    style={{
                      ...style,
                      height: el.height * scale,
                      background: el.color,
                      borderRadius: 0
                    }}
                    onMouseDown={e => handleMoveStart(e, el.id)}
                    title={el.shape}
                  />
                );
              }
              // Polygon, star, triangle, etc. can be SVG for more realism
              if (el.shape === 'triangle') {
                return (
                  <svg
                    key={el.id}
                    style={style}
                    width={el.width * scale}
                    height={el.height * scale}
                    onMouseDown={e => handleMoveStart(e, el.id)}
                  >
                    <polygon
                      points={`${el.width * scale / 2},0 0,${el.height * scale} ${el.width * scale},${el.height * scale}`}
                      fill={el.color}
                    />
                  </svg>
                );
              }
              if (el.shape === 'star') {
                // Simple 5-point star
                const w = el.width * scale, h = el.height * scale;
                const points = [
                  [w * 0.5, 0],
                  [w * 0.62, h * 0.38],
                  [w, h * 0.38],
                  [w * 0.68, h * 0.62],
                  [w * 0.8, h],
                  [w * 0.5, h * 0.76],
                  [w * 0.2, h],
                  [w * 0.32, h * 0.62],
                  [0, h * 0.38],
                  [w * 0.38, h * 0.38]
                ].map(p => p.join(',')).join(' ');
                return (
                  <svg
                    key={el.id}
                    style={style}
                    width={w}
                    height={h}
                    onMouseDown={e => handleMoveStart(e, el.id)}
                  >
                    <polygon points={points} fill={el.color} />
                  </svg>
                );
              }
              if (el.shape === 'polygon') {
                // Hexagon
                const w = el.width * scale, h = el.height * scale;
                const points = [
                  [w * 0.5, 0],
                  [w, h * 0.25],
                  [w, h * 0.75],
                  [w * 0.5, h],
                  [0, h * 0.75],
                  [0, h * 0.25]
                ].map(p => p.join(',')).join(' ');
                return (
                  <svg
                    key={el.id}
                    style={style}
                    width={w}
                    height={h}
                    onMouseDown={e => handleMoveStart(e, el.id)}
                  >
                    <polygon points={points} fill={el.color} />
                  </svg>
                );
              }
              // Rectangle, circle, ellipse
              return (
                <div
                  key={el.id}
                  style={style}
                  onMouseDown={e => handleMoveStart(e, el.id)}
                  title={el.shape}
                />
              );
            }
            return null;
          })}
        </div>

        {/* Right Sidebar */}
        {showSidebar === 'right' && selected && (
          <div className="w-full md:w-64 bg-gray-100 p-4 overflow-auto">
            <h2 className="text-lg font-bold mb-4">Properties</h2>
            <label className="block mb-2">
              Color:
              <input
                type="color"
                value={selected.color || '#000000'}
                onChange={e => updateElementProperty('color', e.target.value)}
                className="ml-2"
              />
            </label>
            {selected.type === 'text' && (
              <>
                <label className="block mb-2">
                  Font Size:
                  <input
                    type="number"
                    min={8}
                    max={100}
                    value={selected.fontSize || 20}
                    onChange={e => updateElementProperty('fontSize', Number(e.target.value))}
                    className="ml-2 w-16"
                  />
                </label>
                <label className="block mb-2">
                  Alignment:
                  <select
                    value={selected.alignment || 'left'}
                    onChange={e => updateElementProperty('alignment', e.target.value as TextAlignment)}
                    className="ml-2"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </label>
                <label className="block mb-2">
                  Font Weight:
                  <select
                    value={selected.fontWeight || 'normal'}
                    onChange={e => updateElementProperty('fontWeight', e.target.value)}
                    className="ml-2"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="lighter">Light</option>
                  </select>
                </label>
                <label className="block mb-2">
                  Font Style:
                  <select
                    value={selected.fontStyle || 'normal'}
                    onChange={e => updateElementProperty('fontStyle', e.target.value)}
                    className="ml-2"
                  >
                    <option value="normal">Normal</option>
                    <option value="italic">Italic</option>
                  </select>
                </label>
                <label className="block mb-2">
                  Text Decoration:
                  <select
                    value={selected.textDecoration || 'none'}
                    onChange={e => updateElementProperty('textDecoration', e.target.value)}
                    className="ml-2"
                  >
                    <option value="none">None</option>
                    <option value="underline">Underline</option>
                    <option value="line-through">Line-through</option>
                  </select>
                </label>
              </>
            )}
            {selected.type === 'shape' && (
              <>
                <label className="block mb-2">
                  Gradient From:
                  <input
                    type="color"
                    value={selected.gradient?.from || '#3B82F6'}
                    onChange={e => updateGradient(e.target.value, selected.gradient?.to || '#6366f1', selected.gradient?.direction || 90)}
                    className="ml-2"
                  />
                </label>
                <label className="block mb-2">
                  Gradient To:
                  <input
                    type="color"
                    value={selected.gradient?.to || '#6366f1'}
                    onChange={e => updateGradient(selected.gradient?.from || '#3B82F6', e.target.value, selected.gradient?.direction || 90)}
                    className="ml-2"
                  />
                </label>
                <label className="block mb-2">
                  Gradient Direction:
                  <input
                    type="number"
                    min={0}
                    max={360}
                    value={selected.gradient?.direction || 90}
                    onChange={e => updateGradient(selected.gradient?.from || '#3B82F6', selected.gradient?.to || '#6366f1', Number(e.target.value))}
                    className="ml-2 w-20"
                  />
                </label>
              </>
            )}
            <div className="flex gap-2 mt-4">
              <button onClick={bringForward} className="flex-1 p-2 bg-white rounded border hover:bg-blue-50">Bring Forward</button>
              <button onClick={sendBackward} className="flex-1 p-2 bg-white rounded border hover:bg-blue-50">Send Backward</button>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={duplicateElement} className="flex-1 p-2 bg-white rounded border hover:bg-blue-50">Duplicate</button>
              <button onClick={deleteElement} className="flex-1 p-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        )}
        {/* Social Media Scheduling Modal */}
        {scheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form className="bg-white p-6 rounded shadow-lg w-96" onSubmit={handleScheduleSubmit}>
              <h2 className="text-xl font-bold mb-4">Schedule Social Media Post</h2>
              <label className="block mb-2">Title:
                <input name="title" className="w-full border p-2 rounded" value={schedule.title} onChange={handleScheduleChange} required />
              </label>
              <label className="block mb-2">Description:
                <textarea name="description" className="w-full border p-2 rounded" value={schedule.description} onChange={handleScheduleChange} required />
              </label>
              <label className="block mb-2">Tags:
                <input name="tags" className="w-full border p-2 rounded" value={schedule.tags} onChange={handleScheduleChange} placeholder="#tag1 #tag2" />
              </label>
              <label className="block mb-2">Schedule Date:
                <input name="date" type="datetime-local" className="w-full border p-2 rounded" value={schedule.date} onChange={handleScheduleChange} required />
              </label>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="flex-1 p-2 bg-blue-500 text-white rounded">Schedule</button>
                <button type="button" className="flex-1 p-2 bg-gray-300 rounded" onClick={closeScheduleModal}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
      {/* Bottom toolbar */}
      <div className="flex justify-center items-center gap-4 p-2 bg-gray-50 border-t border-gray-300">
        <button onClick={undo} title="Undo" className="p-2 bg-white rounded border hover:bg-blue-50"><ChevronUp size={16} /></button>
        <button onClick={redo} title="Redo" className="p-2 bg-white rounded border hover:bg-blue-50"><ChevronDown size={16} /></button>
        <button onClick={zoomOut} title="Zoom Out" className="p-2 bg-white rounded border hover:bg-blue-50"><ZoomOut size={16} /></button>
        <button onClick={zoomIn} title="Zoom In" className="p-2 bg-white rounded border hover:bg-blue-50"><ZoomIn size={16} /></button>
        <button onClick={downloadDesign} title="Download Design" className="p-2 bg-white rounded border hover:bg-blue-50"><Download size={16} /></button>
        <button onClick={() => setShowSidebar(showSidebar === 'left' ? 'right' : 'left')} title="Toggle Sidebar" className="p-2 bg-white rounded border hover:bg-blue-50">
          {showSidebar === 'left' ? <PanelRight size={16} /> : <PanelLeft size={16} />}
        </button>
        <button onClick={openScheduleModal} title="Schedule Social Media Post" className="p-2 bg-green-500 text-white rounded border hover:bg-green-600">
          Schedule Post
        </button>
      </div>
      {/* Scheduled Posts List */}
      {scheduledPosts.length > 0 && (
        <div className="bg-gray-100 p-4">
          <h3 className="font-bold mb-2">Scheduled Social Media Posts</h3>
          <ul>
            {scheduledPosts.map((post, idx) => (
              <li key={idx} className="mb-2 border-b pb-2">
                <div><b>Title:</b> {post.title}</div>
                <div><b>Description:</b> {post.description}</div>
                <div><b>Tags:</b> {post.tags}</div>
                <div><b>Scheduled for:</b> {new Date(post.date).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
