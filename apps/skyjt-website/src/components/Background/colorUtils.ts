export interface RGB {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export function parseRgbColor(str: string): RGB {
  if (str.startsWith("#")) {
    const hex = str.replace("#", "");
    if (hex.length === 6) {
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
      };
    }
  }
  const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match && match[1] && match[2] && match[3]) {
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
    };
  }
  return { r: 99, g: 102, b: 241 };
}
