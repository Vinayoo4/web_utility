import React, { useState, useRef } from 'react';
import { Upload, RotateCcw, RotateCw, ZoomIn, ZoomOut, Download, RefreshCw, Crop as CropIcon } from 'lucide-react';
import { ToolContainer } from '../ui/ToolContainer';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { toPng } from 'html-to-image';
import imageCompression from 'browser-image-compression';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sepia: number;
}

interface ImageDimensions {
  width: number;
  height: number;
}

export const ImageTools: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(100);
  const [loading, setLoading] = useState(false);
  const [recentImages, setRecentImages] = useLocalStorage<string[]>('recent-images', []);
  const [filters, setFilters] = useState<ImageFilters>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sepia: 0
  });
  const [dimensions, setDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [isCropping, setIsCropping] = useState(false);
  const [quality, setQuality] = useState(80);

  const imageRef = useRef<HTMLImageElement>(null);

  useKeyboardShortcuts({
    onSave: handleDownload,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImage(result);
        setOriginalImage(result);
        setRotation(0);
        setScale(100);
        setFilters({
          brightness: 100,
          contrast: 100,
          saturation: 100,
          blur: 0,
          sepia: 0
        });
        setCrop(undefined);
        setCompletedCrop(undefined);
        setIsCropping(false);

        // Update recent images
        setRecentImages(prev =>
          [result, ...prev.filter(img => img !== result)].slice(0, 8)
        );

        // Get image dimensions
        const img = new window.Image();
        img.src = result;
        img.onload = () => {
          setDimensions({
            width: img.width,
            height: img.height
          });
        };
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRotateLeft = () => setRotation((prev) => (prev - 90 + 360) % 360);
  const handleRotateRight = () => setRotation((prev) => (prev + 90) % 360);
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 10, 10));

  const handleReset = () => {
    setImage(originalImage);
    setRotation(0);
    setScale(100);
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      sepia: 0
    });
    setCrop(undefined);
    setCompletedCrop(undefined);
    setIsCropping(false);
  };

  const handleFilterChange = (filter: keyof ImageFilters, value: number) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  const getFilterStyle = () => ({
    filter: `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      blur(${filters.blur}px)
      sepia(${filters.sepia}%)
    `,
    transform: `rotate(${rotation}deg) scale(${scale / 100})`,
    transition: 'transform 0.3s ease'
  });

  // Helper to draw filtered, rotated, scaled, cropped image to canvas
  const drawToCanvas = async (
    imgSrc: string,
    crop: Crop,
    filters: ImageFilters,
    rotation: number,
    scale: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = imgSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const width = crop.width ?? 0;
        const height = crop.height ?? 0;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No 2d context');

        ctx.filter = `
          brightness(${filters.brightness}%)
          contrast(${filters.contrast}%)
          saturate(${filters.saturation}%)
          blur(${filters.blur}px)
          sepia(${filters.sepia}%)
        `;

        // Move to center and rotate/scale
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale / 100, scale / 100);

        ctx.drawImage(
          img,
          crop.x ?? 0,
          crop.y ?? 0,
          width,
          height,
          -width / 2,
          -height / 2,
          width,
          height
        );
        ctx.restore();

        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
    });
  };

  async function handleDownload() {
    if (!imageRef.current || !image) return;
    try {
      let dataUrl: string | undefined;

      if (completedCrop && isCropping && completedCrop.width && completedCrop.height) {
        dataUrl = await drawToCanvas(
          image,
          completedCrop,
          filters,
          rotation,
          scale
        );
      } else {
        dataUrl = await toPng(imageRef.current, {
          quality: quality / 100,
          pixelRatio: 2
        });
      }

      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = dataUrl!;
      link.click();
    } catch (err) {
      console.error('Error downloading image:', err);
    }
  }

  const toggleCropping = () => {
    setIsCropping((prev) => {
      if (!prev) {
        setCrop(undefined);
        setCompletedCrop(undefined);
      }
      return !prev;
    });
  };

  return (
    <ToolContainer title="Image Tools">
      <div className="space-y-6">
        {!image ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
            <Upload size={48} className="mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload an image to get started
            </p>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => document.getElementById('image-upload')?.click()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Select Image
            </button>
            {recentImages.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Images</h3>
                <div className="grid grid-cols-4 gap-2">
                  {recentImages.slice(0, 4).map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Recent ${index + 1}`}
                      className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => {
                        setImage(src);
                        setOriginalImage(src);
                        setCrop(undefined);
                        setCompletedCrop(undefined);
                        setIsCropping(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Editor</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleReset}
                  className="p-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Reset"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  onClick={handleRotateLeft}
                  className="p-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Rotate Left"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={handleRotateRight}
                  className="p-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Rotate Right"
                >
                  <RotateCw size={16} />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={toggleCropping}
                  className={`p-2 rounded-md transition-colors ${
                    isCropping
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Crop"
                >
                  <CropIcon size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="flex justify-center rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 p-4">
                  <div className="relative max-w-full max-h-[400px] flex items-center justify-center">
                    {isCropping ? (
                      <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={undefined}
                      >
                        <img
                          ref={imageRef}
                          src={image}
                          alt="Edited image"
                          style={getFilterStyle()}
                          className="max-h-[400px] max-w-full"
                        />
                      </ReactCrop>
                    ) : (
                      <img
                        ref={imageRef}
                        src={image}
                        alt="Edited image"
                        style={getFilterStyle()}
                        className="max-h-[400px] max-w-full"
                      />
                    )}
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Dimensions: {dimensions.width}x{dimensions.height}px
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Brightness
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.brightness}
                    onChange={(e) => handleFilterChange('brightness', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contrast
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.contrast}
                    onChange={(e) => handleFilterChange('contrast', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Saturation
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.saturation}
                    onChange={(e) => handleFilterChange('saturation', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blur
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={filters.blur}
                    onChange={(e) => handleFilterChange('blur', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sepia
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.sepia}
                    onChange={(e) => handleFilterChange('sepia', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Export Quality
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                    {quality}%
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex space-x-2">
                <input
                  type="file"
                  id="image-replace"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => document.getElementById('image-replace')?.click()}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Change Image
                </button>
              </div>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download size={16} className="inline-block mr-2" />
                Download
              </button>
            </div>
          </>
        )}
      </div>
    </ToolContainer>
  );
};
