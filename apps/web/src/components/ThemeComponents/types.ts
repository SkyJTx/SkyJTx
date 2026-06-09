export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      sm: string;
      base: string;
      lg: string;
      xl: string;
    };
    lineHeight: {
      normal: string;
      relaxed: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      bold: number;
    };
  };
  radii: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  zIndex: {
    dropdown: number;
    modal: number;
    tooltip: number;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}
