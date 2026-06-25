import { DesignSystemFoundations } from "./types";

// Helper to convert HEX to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Helper to calculate relative luminance
export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate WCAG contrast ratio between two HEX colors
export function calculateContrast(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return 1;

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);

  return (brightest + 0.05) / (darkest + 0.05);
}

// Get WCAG compliance rating
export interface ContrastRating {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
}

export function getContrastRating(hex1: string, hex2: string): ContrastRating {
  const ratio = calculateContrast(hex1, hex2);
  return {
    ratio: parseFloat(ratio.toFixed(2)),
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3.0,
    aaaNormal: ratio >= 7.0,
    aaaLarge: ratio >= 4.5,
  };
}

// EXPORTER: CSS Variables format
export function exportToCSS(foundations: DesignSystemFoundations): string {
  return `/* 
  * Design System Foundations: ${foundations.name}
  * Generated with Design System Foundations Builder
  */

:root {
  /* Color Palette - Primary */
  --ds-color-primary-base: ${foundations.colors.primary.base};
  --ds-color-primary-light: ${foundations.colors.primary.light};
  --ds-color-primary-dark: ${foundations.colors.primary.dark};
  --ds-color-primary-text: ${foundations.colors.primary.text};

  /* Color Palette - Secondary */
  --ds-color-secondary-base: ${foundations.colors.secondary.base};
  --ds-color-secondary-light: ${foundations.colors.secondary.light};
  --ds-color-secondary-dark: ${foundations.colors.secondary.dark};
  --ds-color-secondary-text: ${foundations.colors.secondary.text};

  /* Color Palette - Accent */
  --ds-color-accent-base: ${foundations.colors.accent.base};
  --ds-color-accent-light: ${foundations.colors.accent.light};
  --ds-color-accent-dark: ${foundations.colors.accent.dark};
  --ds-color-accent-text: ${foundations.colors.accent.text};

  /* Color Palette - Neutral */
  --ds-color-neutral-base: ${foundations.colors.neutral.base};
  --ds-color-neutral-light: ${foundations.colors.neutral.light};
  --ds-color-neutral-dark: ${foundations.colors.neutral.dark};
  --ds-color-neutral-text: ${foundations.colors.neutral.text};

  /* Backgrounds */
  --ds-color-bg-default: ${foundations.colors.background.default};
  --ds-color-bg-surface: ${foundations.colors.background.surface};
  --ds-color-bg-surface-muted: ${foundations.colors.background.surfaceMuted};

  /* Borders */
  --ds-color-border-default: ${foundations.colors.border.default};
  --ds-color-border-focus: ${foundations.colors.border.focus};

  /* Typography families */
  --ds-font-headings: ${foundations.typography.fontFamily.headings};
  --ds-font-body: ${foundations.typography.fontFamily.body};
  --ds-font-mono: ${foundations.typography.fontFamily.mono};

  /* Font sizes */
  --ds-size-xs: ${foundations.typography.sizeScale.xs};
  --ds-size-sm: ${foundations.typography.sizeScale.sm};
  --ds-size-md: ${foundations.typography.sizeScale.md};
  --ds-size-lg: ${foundations.typography.sizeScale.lg};
  --ds-size-xl: ${foundations.typography.sizeScale.xl};
  --ds-size-xxl: ${foundations.typography.sizeScale.xxl};
  --ds-size-xxxl: ${foundations.typography.sizeScale.xxxl};

  /* Line Heights */
  --ds-lh-tight: ${foundations.typography.lineHeights.tight};
  --ds-lh-normal: ${foundations.typography.lineHeights.normal};
  --ds-lh-loose: ${foundations.typography.lineHeights.loose};

  /* Spacing Scale (Base unit: ${foundations.spacing.baseUnit}) */
  --ds-spacing-xs: ${foundations.spacing.scale.xs};
  --ds-spacing-sm: ${foundations.spacing.scale.sm};
  --ds-spacing-md: ${foundations.spacing.scale.md};
  --ds-spacing-lg: ${foundations.spacing.scale.lg};
  --ds-spacing-xl: ${foundations.spacing.scale.xl};
  --ds-spacing-xxl: ${foundations.spacing.scale.xxl};
  --ds-spacing-xxxl: ${foundations.spacing.scale.xxxl};

  /* Shapes & Borders */
  --ds-radius-none: ${foundations.shape.radius.none};
  --ds-radius-sm: ${foundations.shape.radius.sm};
  --ds-radius-md: ${foundations.shape.radius.md};
  --ds-radius-lg: ${foundations.shape.radius.lg};
  --ds-radius-xl: ${foundations.shape.radius.xl};
  --ds-radius-full: ${foundations.shape.radius.full};

  --ds-border-width-sm: ${foundations.shape.borderWidth.sm};
  --ds-border-width-md: ${foundations.shape.borderWidth.md};
  --ds-border-width-lg: ${foundations.shape.borderWidth.lg};

  /* Elevation / Shadows */
  --ds-shadow-sm: ${foundations.elevation.sm};
  --ds-shadow-md: ${foundations.elevation.md};
  --ds-shadow-lg: ${foundations.elevation.lg};

  /* Motion & Timings */
  --ds-duration-instant: ${foundations.motion.duration.instant};
  --ds-duration-fast: ${foundations.motion.duration.fast};
  --ds-duration-normal: ${foundations.motion.duration.normal};
  --ds-duration-slow: ${foundations.motion.duration.slow};

  --ds-easing-ease-in-out: ${foundations.motion.easing.easeInOut};
  --ds-easing-ease-out: ${foundations.motion.easing.easeOut};
  --ds-easing-ease-in: ${foundations.motion.easing.easeIn};
  --ds-easing-linear: ${foundations.motion.easing.linear};

  /* Grid Anatomy & Breakpoints */
  --ds-grid-breakpoint-xs: ${foundations.grid.breakpoints.xs.width};
  --ds-grid-columns-xs: ${foundations.grid.breakpoints.xs.columns};
  --ds-grid-gutter-xs: ${foundations.grid.breakpoints.xs.gutter};
  --ds-grid-margin-xs: ${foundations.grid.breakpoints.xs.margin};

  --ds-grid-breakpoint-sm: ${foundations.grid.breakpoints.sm.width};
  --ds-grid-columns-sm: ${foundations.grid.breakpoints.sm.columns};
  --ds-grid-gutter-sm: ${foundations.grid.breakpoints.sm.gutter};
  --ds-grid-margin-sm: ${foundations.grid.breakpoints.sm.margin};

  --ds-grid-breakpoint-md: ${foundations.grid.breakpoints.md.width};
  --ds-grid-columns-md: ${foundations.grid.breakpoints.md.columns};
  --ds-grid-gutter-md: ${foundations.grid.breakpoints.md.gutter};
  --ds-grid-margin-md: ${foundations.grid.breakpoints.md.margin};

  --ds-grid-breakpoint-lg: ${foundations.grid.breakpoints.lg.width};
  --ds-grid-columns-lg: ${foundations.grid.breakpoints.lg.columns};
  --ds-grid-gutter-lg: ${foundations.grid.breakpoints.lg.gutter};
  --ds-grid-margin-lg: ${foundations.grid.breakpoints.lg.margin};

  --ds-grid-breakpoint-xl: ${foundations.grid.breakpoints.xl.width};
  --ds-grid-columns-xl: ${foundations.grid.breakpoints.xl.columns};
  --ds-grid-gutter-xl: ${foundations.grid.breakpoints.xl.gutter};
  --ds-grid-margin-xl: ${foundations.grid.breakpoints.xl.margin};
}
`;
}

// EXPORTER: W3C Design Tokens JSON format
export function exportToW3C(foundations: DesignSystemFoundations): string {
  const result = {
    metadata: {
      generator: "Design System Foundations Builder",
      systemName: foundations.name,
      description: foundations.description,
    },
    color: {
      primary: {
        base: { $type: "color", $value: foundations.colors.primary.base },
        light: { $type: "color", $value: foundations.colors.primary.light },
        dark: { $type: "color", $value: foundations.colors.primary.dark },
        text: { $type: "color", $value: foundations.colors.primary.text },
      },
      secondary: {
        base: { $type: "color", $value: foundations.colors.secondary.base },
        light: { $type: "color", $value: foundations.colors.secondary.light },
        dark: { $type: "color", $value: foundations.colors.secondary.dark },
        text: { $type: "color", $value: foundations.colors.secondary.text },
      },
      accent: {
        base: { $type: "color", $value: foundations.colors.accent.base },
        light: { $type: "color", $value: foundations.colors.accent.light },
        dark: { $type: "color", $value: foundations.colors.accent.dark },
        text: { $type: "color", $value: foundations.colors.accent.text },
      },
      neutral: {
        base: { $type: "color", $value: foundations.colors.neutral.base },
        light: { $type: "color", $value: foundations.colors.neutral.light },
        dark: { $type: "color", $value: foundations.colors.neutral.dark },
        text: { $type: "color", $value: foundations.colors.neutral.text },
      },
      background: {
        default: { $type: "color", $value: foundations.colors.background.default },
        surface: { $type: "color", $value: foundations.colors.background.surface },
        surfaceMuted: { $type: "color", $value: foundations.colors.background.surfaceMuted },
      },
      border: {
        default: { $type: "color", $value: foundations.colors.border.default },
        focus: { $type: "color", $value: foundations.colors.border.focus },
      },
    },
    font: {
      family: {
        headings: { $type: "fontFamily", $value: foundations.typography.fontFamily.headings },
        body: { $type: "fontFamily", $value: foundations.typography.fontFamily.body },
        mono: { $type: "fontFamily", $value: foundations.typography.fontFamily.mono },
      },
      size: {
        xs: { $type: "dimension", $value: foundations.typography.sizeScale.xs },
        sm: { $type: "dimension", $value: foundations.typography.sizeScale.sm },
        md: { $type: "dimension", $value: foundations.typography.sizeScale.md },
        lg: { $type: "dimension", $value: foundations.typography.sizeScale.lg },
        xl: { $type: "dimension", $value: foundations.typography.sizeScale.xl },
        xxl: { $type: "dimension", $value: foundations.typography.sizeScale.xxl },
        xxxl: { $type: "dimension", $value: foundations.typography.sizeScale.xxxl },
      },
      lineHeight: {
        tight: { $type: "number", $value: foundations.typography.lineHeights.tight },
        normal: { $type: "number", $value: foundations.typography.lineHeights.normal },
        loose: { $type: "number", $value: foundations.typography.lineHeights.loose },
      },
    },
    spacing: {
      baseUnit: { $type: "dimension", $value: foundations.spacing.baseUnit },
      xs: { $type: "dimension", $value: foundations.spacing.scale.xs },
      sm: { $type: "dimension", $value: foundations.spacing.scale.sm },
      md: { $type: "dimension", $value: foundations.spacing.scale.md },
      lg: { $type: "dimension", $value: foundations.spacing.scale.lg },
      xl: { $type: "dimension", $value: foundations.spacing.scale.xl },
      xxl: { $type: "dimension", $value: foundations.spacing.scale.xxl },
      xxxl: { $type: "dimension", $value: foundations.spacing.scale.xxxl },
    },
    shape: {
      radius: {
        none: { $type: "dimension", $value: foundations.shape.radius.none },
        sm: { $type: "dimension", $value: foundations.shape.radius.sm },
        md: { $type: "dimension", $value: foundations.shape.radius.md },
        lg: { $type: "dimension", $value: foundations.shape.radius.lg },
        xl: { $type: "dimension", $value: foundations.shape.radius.xl },
        full: { $type: "dimension", $value: foundations.shape.radius.full },
      },
      borderWidth: {
        sm: { $type: "dimension", $value: foundations.shape.borderWidth.sm },
        md: { $type: "dimension", $value: foundations.shape.borderWidth.md },
        lg: { $type: "dimension", $value: foundations.shape.borderWidth.lg },
      },
    },
    shadow: {
      sm: { $type: "shadow", $value: foundations.elevation.sm },
      md: { $type: "shadow", $value: foundations.elevation.md },
      lg: { $type: "shadow", $value: foundations.elevation.lg },
    },
    duration: {
      instant: { $type: "duration", $value: foundations.motion.duration.instant },
      fast: { $type: "duration", $value: foundations.motion.duration.fast },
      normal: { $type: "duration", $value: foundations.motion.duration.normal },
      slow: { $type: "duration", $value: foundations.motion.duration.slow },
    },
    easing: {
      easeInOut: { $type: "cubicBezier", $value: foundations.motion.easing.easeInOut },
      easeOut: { $type: "cubicBezier", $value: foundations.motion.easing.easeOut },
      easeIn: { $type: "cubicBezier", $value: foundations.motion.easing.easeIn },
      linear: { $type: "string", $value: foundations.motion.easing.linear },
    },
    grid: {
      breakpoints: {
        xs: {
          width: { $type: "dimension", $value: foundations.grid.breakpoints.xs.width },
          columns: { $type: "number", $value: foundations.grid.breakpoints.xs.columns },
          gutter: { $type: "dimension", $value: foundations.grid.breakpoints.xs.gutter },
          margin: { $type: "dimension", $value: foundations.grid.breakpoints.xs.margin }
        },
        sm: {
          width: { $type: "dimension", $value: foundations.grid.breakpoints.sm.width },
          columns: { $type: "number", $value: foundations.grid.breakpoints.sm.columns },
          gutter: { $type: "dimension", $value: foundations.grid.breakpoints.sm.gutter },
          margin: { $type: "dimension", $value: foundations.grid.breakpoints.sm.margin }
        },
        md: {
          width: { $type: "dimension", $value: foundations.grid.breakpoints.md.width },
          columns: { $type: "number", $value: foundations.grid.breakpoints.md.columns },
          gutter: { $type: "dimension", $value: foundations.grid.breakpoints.md.gutter },
          margin: { $type: "dimension", $value: foundations.grid.breakpoints.md.margin }
        },
        lg: {
          width: { $type: "dimension", $value: foundations.grid.breakpoints.lg.width },
          columns: { $type: "number", $value: foundations.grid.breakpoints.lg.columns },
          gutter: { $type: "dimension", $value: foundations.grid.breakpoints.lg.gutter },
          margin: { $type: "dimension", $value: foundations.grid.breakpoints.lg.margin }
        },
        xl: {
          width: { $type: "dimension", $value: foundations.grid.breakpoints.xl.width },
          columns: { $type: "number", $value: foundations.grid.breakpoints.xl.columns },
          gutter: { $type: "dimension", $value: foundations.grid.breakpoints.xl.gutter },
          margin: { $type: "dimension", $value: foundations.grid.breakpoints.xl.margin }
        }
      }
    },
  };

  return JSON.stringify(result, null, 2);
}

// EXPORTER: Tailwind CSS v4 Theme Config Extension format
export function exportToTailwind(foundations: DesignSystemFoundations): string {
  return `/* 
  * Add this to your main CSS file (Tailwind v4 theme setup)
  */

@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary: ${foundations.colors.primary.base};
  --color-primary-light: ${foundations.colors.primary.light};
  --color-primary-dark: ${foundations.colors.primary.dark};
  --color-primary-text: ${foundations.colors.primary.text};

  --color-secondary: ${foundations.colors.secondary.base};
  --color-secondary-light: ${foundations.colors.secondary.light};
  --color-secondary-dark: ${foundations.colors.secondary.dark};
  --color-secondary-text: ${foundations.colors.secondary.text};

  --color-accent: ${foundations.colors.accent.base};
  --color-accent-light: ${foundations.colors.accent.light};
  --color-accent-dark: ${foundations.colors.accent.dark};
  --color-accent-text: ${foundations.colors.accent.text};

  --color-neutral-ds: ${foundations.colors.neutral.base};
  --color-neutral-light: ${foundations.colors.neutral.light};
  --color-neutral-dark: ${foundations.colors.neutral.dark};
  --color-neutral-text: ${foundations.colors.neutral.text};

  --color-bg-default: ${foundations.colors.background.default};
  --color-bg-surface: ${foundations.colors.background.surface};
  --color-bg-surface-muted: ${foundations.colors.background.surfaceMuted};

  --color-border-ds: ${foundations.colors.border.default};
  --color-border-focus: ${foundations.colors.border.focus};

  /* Fonts */
  --font-display: "${foundations.typography.fontFamily.headings}", sans-serif;
  --font-sans: "${foundations.typography.fontFamily.body}", system-ui, sans-serif;
  --font-mono: "${foundations.typography.fontFamily.mono}", monospace;

  /* Font Sizes */
  --text-ds-xs: ${foundations.typography.sizeScale.xs};
  --text-ds-sm: ${foundations.typography.sizeScale.sm};
  --text-ds-md: ${foundations.typography.sizeScale.md};
  --text-ds-lg: ${foundations.typography.sizeScale.lg};
  --text-ds-xl: ${foundations.typography.sizeScale.xl};
  --text-ds-2xl: ${foundations.typography.sizeScale.xxl};
  --text-ds-3xl: ${foundations.typography.sizeScale.xxxl};

  /* Radii */
  --radius-ds-sm: ${foundations.shape.radius.sm};
  --radius-ds-md: ${foundations.shape.radius.md};
  --radius-ds-lg: ${foundations.shape.radius.lg};
  --radius-ds-xl: ${foundations.shape.radius.xl};

  /* Elevation / Shadows */
  --shadow-ds-sm: ${foundations.elevation.sm};
  --shadow-ds-md: ${foundations.elevation.md};
  --shadow-ds-lg: ${foundations.elevation.lg};

  /* Motion */
  --animate-ds-fast: ${foundations.motion.duration.fast};
  --animate-ds-normal: ${foundations.motion.duration.normal};
  --animate-ds-slow: ${foundations.motion.duration.slow};
  
  --ease-ds-in-out: ${foundations.motion.easing.easeInOut};
  --ease-ds-out: ${foundations.motion.easing.easeOut};
  --ease-ds-in: ${foundations.motion.easing.easeIn};

  /* Grid Anatomy Breakpoints */
  --grid-columns-xs: ${foundations.grid.breakpoints.xs.columns};
  --grid-gutter-xs: ${foundations.grid.breakpoints.xs.gutter};
  --grid-margin-xs: ${foundations.grid.breakpoints.xs.margin};

  --grid-columns-sm: ${foundations.grid.breakpoints.sm.columns};
  --grid-gutter-sm: ${foundations.grid.breakpoints.sm.gutter};
  --grid-margin-sm: ${foundations.grid.breakpoints.sm.margin};

  --grid-columns-md: ${foundations.grid.breakpoints.md.columns};
  --grid-gutter-md: ${foundations.grid.breakpoints.md.gutter};
  --grid-margin-md: ${foundations.grid.breakpoints.md.margin};

  --grid-columns-lg: ${foundations.grid.breakpoints.lg.columns};
  --grid-gutter-lg: ${foundations.grid.breakpoints.lg.gutter};
  --grid-margin-lg: ${foundations.grid.breakpoints.lg.margin};

  --grid-columns-xl: ${foundations.grid.breakpoints.xl.columns};
  --grid-gutter-xl: ${foundations.grid.breakpoints.xl.gutter};
  --grid-margin-xl: ${foundations.grid.breakpoints.xl.margin};
}
`;
}
