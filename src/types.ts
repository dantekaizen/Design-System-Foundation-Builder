export interface TokenColorGroup {
  base: string;
  light: string;
  dark: string;
  text: string;
}

export interface DesignSystemFoundations {
  name: string;
  description: string;
  colors: {
    primary: TokenColorGroup;
    secondary: TokenColorGroup;
    accent: TokenColorGroup;
    neutral: TokenColorGroup;
    background: {
      default: string;
      surface: string;
      surfaceMuted: string;
    };
    border: {
      default: string;
      focus: string;
    };
  };
  typography: {
    fontFamily: {
      headings: string;
      body: string;
      mono: string;
    };
    sizeScale: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
      xxxl: string;
    };
    lineHeights: {
      tight: string;
      normal: string;
      loose: string;
    };
  };
  spacing: {
    baseUnit: string;
    scale: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
      xxxl: string;
    };
  };
  shape: {
    radius: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    borderWidth: {
      sm: string;
      md: string;
      lg: string;
    };
  };
  elevation: {
    sm: string;
    md: string;
    lg: string;
  };
  motion: {
    duration: {
      instant: string;
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      easeInOut: string;
      easeOut: string;
      easeIn: string;
      linear: string;
    };
  };
  grid: {
    breakpoints: {
      xs: {
        width: string;
        columns: string;
        gutter: string;
        margin: string;
      };
      sm: {
        width: string;
        columns: string;
        gutter: string;
        margin: string;
      };
      md: {
        width: string;
        columns: string;
        gutter: string;
        margin: string;
      };
      lg: {
        width: string;
        columns: string;
        gutter: string;
        margin: string;
      };
      xl: {
        width: string;
        columns: string;
        gutter: string;
        margin: string;
      };
    };
  };
}

// Beautiful default presets representing our suggested design system architectures
export const PRESETS: Record<string, DesignSystemFoundations> = {
  swiss: {
    name: "Swiss Minimalist Mono",
    description: "Designed for high-precision technical dashboards, medical software, or editorial archives. Emphasizes razor-sharp grids, thin borders, extreme typographic contrast, and absolute clarity.",
    colors: {
      primary: {
        base: "#000000",
        light: "#333333",
        dark: "#000000",
        text: "#FFFFFF"
      },
      secondary: {
        base: "#64748B",
        light: "#94A3B8",
        dark: "#475569",
        text: "#FFFFFF"
      },
      accent: {
        base: "#EF4444",
        light: "#FCA5A5",
        dark: "#B91C1C",
        text: "#FFFFFF"
      },
      neutral: {
        base: "#0F172A",
        light: "#E2E8F0",
        dark: "#1E293B",
        text: "#FFFFFF"
      },
      background: {
        default: "#FAFAFA",
        surface: "#FFFFFF",
        surfaceMuted: "#F1F5F9"
      },
      border: {
        default: "#E2E8F0",
        focus: "#000000"
      }
    },
    typography: {
      fontFamily: {
        headings: "Space Grotesk, sans-serif",
        body: "Inter, sans-serif",
        mono: "JetBrains Mono, monospace"
      },
      sizeScale: {
        xs: "11px",
        sm: "13px",
        md: "15px",
        lg: "18px",
        xl: "22px",
        xxl: "28px",
        xxxl: "36px"
      },
      lineHeights: {
        tight: "1.15",
        normal: "1.45",
        loose: "1.65"
      }
    },
    spacing: {
      baseUnit: "4px",
      scale: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        xxl: "32px",
        xxxl: "48px"
      }
    },
    shape: {
      radius: {
        none: "0px",
        sm: "2px",
        md: "4px",
        lg: "6px",
        xl: "8px",
        full: "9999px"
      },
      borderWidth: {
        sm: "1px",
        md: "1.5px",
        lg: "2px"
      }
    },
    elevation: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)"
    },
    motion: {
      duration: {
        instant: "0ms",
        fast: "100ms",
        normal: "200ms",
        slow: "400ms"
      },
      easing: {
        easeInOut: "cubic-bezier(0.16, 1, 0.3, 1)",
        easeOut: "cubic-bezier(0, 0, 0.2, 1)",
        easeIn: "cubic-bezier(0.4, 0, 1, 1)",
        linear: "linear"
      }
    },
    grid: {
      breakpoints: {
        xs: { width: "480px", columns: "4", gutter: "12px", margin: "16px" },
        sm: { width: "640px", columns: "8", gutter: "16px", margin: "24px" },
        md: { width: "768px", columns: "12", gutter: "20px", margin: "32px" },
        lg: { width: "1024px", columns: "12", gutter: "24px", margin: "40px" },
        xl: { width: "1280px", columns: "12", gutter: "24px", margin: "48px" }
      }
    }
  },
  editorial: {
    name: "Organic Warm Editorial",
    description: "Designed for premium lifestyle blogs, cozy e-commerce, recipe apps, and wellness platforms. Emphasizes warm backgrounds, terracotta tones, graceful serifs, and soft, welcoming shapes.",
    colors: {
      primary: {
        base: "#7C2D12",
        light: "#9A3412",
        dark: "#431407",
        text: "#FFEDD5"
      },
      secondary: {
        base: "#224A3B",
        light: "#2F5D4C",
        dark: "#143126",
        text: "#E6F4EA"
      },
      accent: {
        base: "#D97706",
        light: "#FBBF24",
        dark: "#92400E",
        text: "#FFFBEB"
      },
      neutral: {
        base: "#292524",
        light: "#E7E5E4",
        dark: "#1C1917",
        text: "#FAFAF9"
      },
      background: {
        default: "#FAF7F2",
        surface: "#FFFDF9",
        surfaceMuted: "#F5EFE6"
      },
      border: {
        default: "#E6DFD5",
        focus: "#7C2D12"
      }
    },
    typography: {
      fontFamily: {
        headings: "Playfair Display, Georgia, serif",
        body: "Inter, system-ui, sans-serif",
        mono: "Courier New, monospace"
      },
      sizeScale: {
        xs: "12px",
        sm: "14px",
        md: "16px",
        lg: "20px",
        xl: "26px",
        xxl: "34px",
        xxxl: "44px"
      },
      lineHeights: {
        tight: "1.25",
        normal: "1.55",
        loose: "1.8"
      }
    },
    spacing: {
      baseUnit: "6px",
      scale: {
        xs: "6px",
        sm: "12px",
        md: "18px",
        lg: "24px",
        xl: "36px",
        xxl: "48px",
        xxxl: "72px"
      }
    },
    shape: {
      radius: {
        none: "0px",
        sm: "6px",
        md: "12px",
        lg: "18px",
        xl: "24px",
        full: "9999px"
      },
      borderWidth: {
        sm: "1px",
        md: "2px",
        lg: "3px"
      }
    },
    elevation: {
      sm: "0 2px 4px 0 rgba(124, 45, 18, 0.02)",
      md: "0 8px 16px -4px rgba(124, 45, 18, 0.04), 0 4px 6px -2px rgba(124, 45, 18, 0.02)",
      lg: "0 20px 24px -6px rgba(124, 45, 18, 0.06), 0 8px 12px -4px rgba(124, 45, 18, 0.03)"
    },
    motion: {
      duration: {
        instant: "0ms",
        fast: "150ms",
        normal: "320ms",
        slow: "600ms"
      },
      easing: {
        easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
        easeOut: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        easeIn: "cubic-bezier(0.36, 0, 0.66, -0.56)",
        linear: "linear"
      }
    },
    grid: {
      breakpoints: {
        xs: { width: "480px", columns: "4", gutter: "16px", margin: "20px" },
        sm: { width: "640px", columns: "6", gutter: "24px", margin: "32px" },
        md: { width: "768px", columns: "8", gutter: "32px", margin: "40px" },
        lg: { width: "1024px", columns: "12", gutter: "40px", margin: "48px" },
        xl: { width: "1280px", columns: "12", gutter: "48px", margin: "64px" }
      }
    }
  },
  brutalist: {
    name: "Neo-Brutalist Electric",
    description: "Designed for bold web3 apps, design portfolio hubs, creative agencies, and hackathon projects. Emphasizes saturated neons, heavy borders, flat isometric shadows, and loud, expressive sizes.",
    colors: {
      primary: {
        base: "#FFFF00",
        light: "#FFFF66",
        dark: "#CCCC00",
        text: "#000000"
      },
      secondary: {
        base: "#00FFFF",
        light: "#66FFFF",
        dark: "#00CCCC",
        text: "#000000"
      },
      accent: {
        base: "#FF00FF",
        light: "#FF66FF",
        dark: "#CC00CC",
        text: "#FFFFFF"
      },
      neutral: {
        base: "#000000",
        light: "#CCCCCC",
        dark: "#000000",
        text: "#FFFFFF"
      },
      background: {
        default: "#FFFDF6",
        surface: "#FFFFFF",
        surfaceMuted: "#FFFFE6"
      },
      border: {
        default: "#000000",
        focus: "#FF00FF"
      }
    },
    typography: {
      fontFamily: {
        headings: "Impact, Syne, sans-serif",
        body: "Plus Jakarta Sans, Inter, sans-serif",
        mono: "JetBrains Mono, monospace"
      },
      sizeScale: {
        xs: "13px",
        sm: "15px",
        md: "17px",
        lg: "22px",
        xl: "28px",
        xxl: "38px",
        xxxl: "52px"
      },
      lineHeights: {
        tight: "1.0",
        normal: "1.4",
        loose: "1.7"
      }
    },
    spacing: {
      baseUnit: "8px",
      scale: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
        xxxl: "64px"
      }
    },
    shape: {
      radius: {
        none: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        full: "9999px"
      },
      borderWidth: {
        sm: "1.5px",
        md: "3px",
        lg: "5px"
      }
    },
    elevation: {
      sm: "2px 2px 0px 0px #000000",
      md: "5px 5px 0px 0px #000000",
      lg: "9px 9px 0px 0px #000000"
    },
    motion: {
      duration: {
        instant: "0ms",
        fast: "80ms",
        normal: "160ms",
        slow: "300ms"
      },
      easing: {
        easeInOut: "steps(3, end)",
        easeOut: "steps(4, end)",
        easeIn: "steps(2, end)",
        linear: "linear"
      }
    },
    grid: {
      breakpoints: {
        xs: { width: "480px", columns: "2", gutter: "16px", margin: "16px" },
        sm: { width: "640px", columns: "6", gutter: "20px", margin: "24px" },
        md: { width: "768px", columns: "8", gutter: "24px", margin: "32px" },
        lg: { width: "1024px", columns: "12", gutter: "32px", margin: "40px" },
        xl: { width: "1280px", columns: "12", gutter: "32px", margin: "48px" }
      }
    }
  },
  cyberpunk: {
    name: "Futuristic Cyber-Dark",
    description: "Designed for sci-fi games, coding terminals, blockchain analytical suites, and tech collectives. Emphasizes dark canvas, neon glow effects, and futuristic geometric details.",
    colors: {
      primary: {
        base: "#00FF66",
        light: "#66FF99",
        dark: "#009933",
        text: "#000000"
      },
      secondary: {
        base: "#00E5FF",
        light: "#66F0FF",
        dark: "#009BB0",
        text: "#000000"
      },
      accent: {
        base: "#FF0055",
        light: "#FF6699",
        dark: "#B3003B",
        text: "#FFFFFF"
      },
      neutral: {
        base: "#E6EDF0",
        light: "#2A363B",
        dark: "#0D1117",
        text: "#FFFFFF"
      },
      background: {
        default: "#0A0D10",
        surface: "#12181F",
        surfaceMuted: "#1B222C"
      },
      border: {
        default: "#232F3F",
        focus: "#00FF66"
      }
    },
    typography: {
      fontFamily: {
        headings: "Orbitron, Fira Code, sans-serif",
        body: "Inter, sans-serif",
        mono: "Fira Code, monospace"
      },
      sizeScale: {
        xs: "11px",
        sm: "13px",
        md: "15px",
        lg: "19px",
        xl: "25px",
        xxl: "32px",
        xxxl: "42px"
      },
      lineHeights: {
        tight: "1.1",
        normal: "1.5",
        loose: "1.7"
      }
    },
    spacing: {
      baseUnit: "5px",
      scale: {
        xs: "5px",
        sm: "10px",
        md: "15px",
        lg: "25px",
        xl: "35px",
        xxl: "50px",
        xxxl: "75px"
      }
    },
    shape: {
      radius: {
        none: "0px",
        sm: "2px",
        md: "4px",
        lg: "8px",
        xl: "12px",
        full: "9999px"
      },
      borderWidth: {
        sm: "1px",
        md: "2px",
        lg: "3px"
      }
    },
    elevation: {
      sm: "0 0 5px 0 rgba(0, 255, 102, 0.15)",
      md: "0 0 12px 0 rgba(0, 255, 102, 0.25)",
      lg: "0 0 25px 0 rgba(0, 255, 102, 0.4)"
    },
    motion: {
      duration: {
        instant: "0ms",
        fast: "120ms",
        normal: "240ms",
        slow: "450ms"
      },
      easing: {
        easeInOut: "cubic-bezier(0.25, 0.8, 0.25, 1)",
        easeOut: "cubic-bezier(0.1, 0.9, 0.2, 1)",
        easeIn: "cubic-bezier(0.9, 0.1, 0.8, 0.2)",
        linear: "linear"
      }
    },
    grid: {
      breakpoints: {
        xs: { width: "480px", columns: "4", gutter: "10px", margin: "12px" },
        sm: { width: "640px", columns: "8", gutter: "15px", margin: "20px" },
        md: { width: "768px", columns: "12", gutter: "20px", margin: "24px" },
        lg: { width: "1024px", columns: "12", gutter: "25px", margin: "30px" },
        xl: { width: "1280px", columns: "16", gutter: "30px", margin: "40px" }
      }
    }
  }
};
