export const hexToRGB = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

export const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  const { r, g, b } = hexToRGB(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

export const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  return rgbToHex(
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  );
};

export const getContrastColor = (hex: string): string => {
  const { r, g, b } = hexToRGB(hex);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
};

export const simulateColorBlindness = (hex: string, type: 'protanopia' | 'deuteranopia' | 'tritanopia'): string => {
  const { r, g, b } = hexToRGB(hex);
  let simulated;

  switch (type) {
    case 'protanopia':
      simulated = {
        r: 0.567 * r + 0.433 * g + 0 * b,
        g: 0.558 * r + 0.442 * g + 0 * b,
        b: 0 * r + 0.242 * g + 0.758 * b
      };
      break;
    case 'deuteranopia':
      simulated = {
        r: 0.625 * r + 0.375 * g + 0 * b,
        g: 0.7 * r + 0.3 * g + 0 * b,
        b: 0 * r + 0.3 * g + 0.7 * b
      };
      break;
    case 'tritanopia':
      simulated = {
        r: 0.95 * r + 0.05 * g + 0 * b,
        g: 0 * r + 0.433 * g + 0.567 * b,
        b: 0 * r + 0.475 * g + 0.525 * b
      };
      break;
  }

  return rgbToHex(
    Math.round(simulated.r),
    Math.round(simulated.g),
    Math.round(simulated.b)
  );
};

export const getColorName = (hex: string): string => {
  const colorNames: Record<string, string> = {
    '#ff0000': 'Red',
    '#00ff00': 'Green',
    '#0000ff': 'Blue',
    '#ffff00': 'Yellow',
    '#ff00ff': 'Magenta',
    '#00ffff': 'Cyan',
    '#000000': 'Black',
    '#ffffff': 'White',
    // Add more color names as needed
  };

  return colorNames[hex.toLowerCase()] || hex;
};