import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Palette, 
  Type, 
  Grid, 
  Columns,
  Square, 
  Layers, 
  Activity, 
  Sliders, 
  Eye, 
  Code, 
  BookOpen, 
  Copy, 
  Check, 
  RotateCcw, 
  Download, 
  Info, 
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Upload,
  Plus,
  Search,
  Globe,
  FolderOpen
} from "lucide-react";
import { DesignSystemFoundations, PRESETS } from "./types";
import { 
  getContrastRating, 
  exportToCSS, 
  exportToW3C, 
  exportToTailwind 
} from "./utils";

const CATALOG_FONTS = [
  // Sans-Serif
  { name: "Inter", family: "Inter, sans-serif", category: "sans-serif", provider: "Google Fonts / Swiss Clean" },
  { name: "Plus Jakarta Sans", family: "Plus Jakarta Sans, sans-serif", category: "sans-serif", provider: "Google Fonts / Friendly Clean" },
  { name: "Outfit", family: "Outfit, sans-serif", category: "sans-serif", provider: "Google Fonts / Geometric Sans" },
  { name: "Montserrat", family: "Montserrat, sans-serif", category: "sans-serif", provider: "Google Fonts / High Contrast" },
  { name: "Poppins", family: "Poppins, sans-serif", category: "sans-serif", provider: "Google Fonts / Friendly Rounded" },
  { name: "DM Sans", family: "DM Sans, sans-serif", category: "sans-serif", provider: "Google Fonts / Minimal modern" },
  { name: "Manrope", family: "Manrope, sans-serif", category: "sans-serif", provider: "Google Fonts / Neo-grotesque" },
  { name: "Cabin", family: "Cabin, sans-serif", category: "sans-serif", provider: "Google Fonts / Humanities Sans" },
  { name: "Satoshi Alt", family: "Outfit, sans-serif", category: "sans-serif", provider: "Font Share Alternative" },

  // Serif
  { name: "Playfair Display", family: "Playfair Display, Georgia, serif", category: "serif", provider: "Google Fonts / Editorial Serif" },
  { name: "Fraunces", family: "Fraunces, serif", category: "serif", provider: "Google Fonts / Soft Display Serif" },
  { name: "Lora", family: "Lora, serif", category: "serif", provider: "Google Fonts / Contemporary Book" },
  { name: "Merriweather", family: "Merriweather, serif", category: "serif", provider: "Google Fonts / Highly Readable Book" },
  { name: "EB Garamond", family: "EB Garamond, serif", category: "serif", provider: "Google Fonts / Renaissance Classic" },
  { name: "Cormorant Garamond", family: "Cormorant Garamond, serif", category: "serif", provider: "Google Fonts / Elegant Display" },
  { name: "Cinzel", family: "Cinzel, serif", category: "serif", provider: "Google Fonts / Roman Classic" },

  // Display / Expressive
  { name: "Space Grotesk", family: "Space Grotesk, sans-serif", category: "display", provider: "Google Fonts / Modern Brutalist" },
  { name: "Syne", family: "Syne, sans-serif", category: "display", provider: "Google Fonts / Artistic Bold" },
  { name: "Bricolage Grotesque", family: "Bricolage Grotesque, sans-serif", category: "display", provider: "Google Fonts / Expressive Tech" },
  { name: "Orbitron", family: "Orbitron, sans-serif", category: "display", provider: "Google Fonts / Sci-Fi Cyber" },
  { name: "Unbounded", family: "Unbounded, sans-serif", category: "display", provider: "Google Fonts / Wide Brutalist" },
  { name: "Righteous", family: "Righteous, sans-serif", category: "display", provider: "Google Fonts / Retro Deco" },
  { name: "Cabinet Grotesk style", family: "Space Grotesk, sans-serif", category: "display", provider: "Cabinet Alternative" },

  // Monospace
  { name: "JetBrains Mono", family: "JetBrains Mono, monospace", category: "mono", provider: "Google Fonts / JetBrains Developer" },
  { name: "Fira Code", family: "Fira Code, monospace", category: "mono", provider: "Google Fonts / Ligature Tech" },
  { name: "IBM Plex Mono", family: "IBM Plex Mono, monospace", category: "mono", provider: "Google Fonts / Industrial Tech" },
  { name: "Space Mono", family: "Space Mono, monospace", category: "mono", provider: "Google Fonts / Retro Tech" },
  { name: "Source Code Pro", family: "Source Code Pro, monospace", category: "mono", provider: "Google Fonts / Adobe Dev" },
  { name: "Share Tech Mono", family: "Share Tech Mono, monospace", category: "mono", provider: "Google Fonts / Cyber Display" }
];

export default function App() {
  // State for the active token foundations
  const [foundations, setFoundations] = useState<DesignSystemFoundations>(PRESETS.swiss);
  const [activeTab, setActiveTab] = useState<"builder" | "ideas" | "research">("builder");
  const [activeExporter, setActiveExporter] = useState<"css" | "w3c" | "tailwind">("css");

  // Dynamic loaded custom fonts
  const [customFonts, setCustomFonts] = useState<Array<{ name: string; family: string; type: "google" | "uploaded"; category?: string }>>([]);
  const [activeFontTab, setActiveFontTab] = useState<"catalog" | "upload">("catalog");
  const [fontSearchQuery, setFontSearchQuery] = useState("");
  const [fontCategoryFilter, setFontCategoryFilter] = useState<string>("all");
  const [fontTargetRole, setFontTargetRole] = useState<"headings" | "body" | "mono">("headings");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleAddGoogleFont = (font: { name: string; family: string; category: string }, role: "headings" | "body" | "mono") => {
    const newFontObj = {
      name: font.name,
      family: font.family,
      type: "google" as const,
      category: font.category
    };

    setCustomFonts(prev => {
      if (prev.some(f => f.family === font.family)) return prev;
      return [...prev, newFontObj];
    });

    updateTypography(role, font.family);
  };

  const handleLocalFontUpload = async (file: File, role: "headings" | "body" | "mono") => {
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    const allowedExtensions = ["ttf", "otf", "woff", "woff2"];
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      setUploadError("Invalid format. Please upload .ttf, .otf, .woff, or .woff2");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          if (!arrayBuffer) {
            setUploadError("Could not read font file.");
            return;
          }

          // Generate an elegant, clean font name from the file name
          let fontName = file.name
            .replace(/\.[^/.]+$/, "") // remove extension
            .replace(/[-_]/g, " ") // replace dashes/underscores with spaces
            .replace(/\b\w/g, c => c.toUpperCase()) // title case
            .replace(/\s+/g, " ")
            .trim();

          // Register in the browser document.fonts
          const fontFace = new FontFace(fontName, arrayBuffer);
          await fontFace.load();
          document.fonts.add(fontFace);

          const fontValue = `"${fontName}", sans-serif`;
          const newFontObj = {
            name: fontName,
            family: fontValue,
            type: "uploaded" as const,
            category: "custom"
          };

          setCustomFonts(prev => {
            if (prev.some(f => f.family === fontValue)) return prev;
            return [...prev, newFontObj];
          });

          // Set immediately to the selected role!
          updateTypography(role, fontValue);

          setUploadSuccess(`Font "${fontName}" loaded and applied to ${role} successfully!`);
        } catch (err: any) {
          console.error("FontFace loading error:", err);
          setUploadError(`Error loading FontFace API: ${err?.message || err}`);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err: any) {
      setUploadError(`Failed to read file: ${err?.message || err}`);
    }
  };

  // Typescale generator controls
  const [typescaleBaseVal, setTypescaleBaseVal] = useState<string>("16");
  const [typescaleUnit, setTypescaleUnit] = useState<string>("px");
  const [typescaleRatio, setTypescaleRatio] = useState<string>("1.250");
  
  // Color contrast calculation states
  const [primaryContrast, setPrimaryContrast] = useState(getContrastRating(PRESETS.swiss.colors.primary.base, PRESETS.swiss.colors.primary.text));
  const [accentContrast, setAccentContrast] = useState(getContrastRating(PRESETS.swiss.colors.accent.base, PRESETS.swiss.colors.accent.text));
  const [neutralContrast, setNeutralContrast] = useState(getContrastRating(PRESETS.swiss.colors.neutral.dark, PRESETS.swiss.colors.neutral.text));

  // State for AI Prompt generator
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Clipboard copy feedback
  const [isCopied, setIsCopied] = useState(false);

  // Active sub-section in builder left pane
  const [activeBuilderSection, setActiveBuilderSection] = useState<"color" | "typography" | "spacing" | "shape" | "elevation" | "motion" | "grid">("color");

  // Grid system preview breakpoint
  const [previewBreakpoint, setPreviewBreakpoint] = useState<"xs" | "sm" | "md" | "lg" | "xl">("md");

  // Dynamic Google Font Injection
  useEffect(() => {
    // Collect unique font families requested in foundations
    const families = [
      foundations.typography.fontFamily.headings,
      foundations.typography.fontFamily.body,
      foundations.typography.fontFamily.mono
    ]
      .map(font => font.split(",")[0].trim().replace(/['"]/g, ""))
      .filter(font => !["sans-serif", "serif", "monospace", "system-ui"].includes(font.toLowerCase()));

    if (families.length > 0) {
      const linkId = "ds-dynamic-google-fonts";
      let linkElement = document.getElementById(linkId) as HTMLLinkElement | null;
      if (!linkElement) {
        linkElement = document.createElement("link");
        linkElement.id = linkId;
        linkElement.rel = "stylesheet";
        document.head.appendChild(linkElement);
      }
      
      const queryStr = families.map(f => `family=${f.replace(/\s+/g, "+")}:wght@400;500;600;700`).join("&");
      linkElement.href = `https://fonts.googleapis.com/css2?${queryStr}&display=swap`;
    }
  }, [foundations.typography.fontFamily]);

  // Catalog Preview Fonts Injection
  useEffect(() => {
    const catalogFamilies = [
      "Inter", "Plus Jakarta Sans", "Outfit", "Montserrat", "Poppins", "DM Sans", "Manrope",
      "Playfair Display", "Fraunces", "Lora", "Space Grotesk", "Syne", 
      "Bricolage Grotesque", "Orbitron", "Unbounded", "JetBrains Mono", "Fira Code", "IBM Plex Mono", "Space Mono"
    ];
    const linkId = "ds-catalog-google-fonts";
    let linkElement = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!linkElement) {
      linkElement = document.createElement("link");
      linkElement.id = linkId;
      linkElement.rel = "stylesheet";
      document.head.appendChild(linkElement);
    }
    const queryStr = catalogFamilies.map(f => `family=${f.replace(/\s+/g, "+")}:wght@400;700`).join("&");
    linkElement.href = `https://fonts.googleapis.com/css2?${queryStr}&display=swap`;
  }, []);

  // Dynamically calculate and update WCAG contrast whenever colors change
  useEffect(() => {
    setPrimaryContrast(getContrastRating(foundations.colors.primary.base, foundations.colors.primary.text));
    setAccentContrast(getContrastRating(foundations.colors.accent.base, foundations.colors.accent.text));
    setNeutralContrast(getContrastRating(foundations.colors.background.surface, foundations.colors.neutral.base));
  }, [foundations.colors]);

  const parseFontSize = (str: string) => {
    const num = parseFloat(str) || 16;
    const unit = str.replace(/[0-9.]/g, "").trim() || "px";
    return { num, unit };
  };

  // Sync typescale generator inputs when a new preset is loaded
  useEffect(() => {
    const { num, unit } = parseFontSize(foundations.typography.sizeScale.md);
    setTypescaleBaseVal(num.toString());
    setTypescaleUnit(unit);
    
    const mdParsed = parseFloat(foundations.typography.sizeScale.md) || 16;
    const lgParsed = parseFloat(foundations.typography.sizeScale.lg) || 20;
    if (mdParsed > 0) {
      const calculatedRatio = Math.round((lgParsed / mdParsed) * 1000) / 1000;
      setTypescaleRatio(calculatedRatio.toString());
    }
  }, [foundations.name]);

  const applyTypescale = (baseStr: string, unit: string, ratioStr: string) => {
    const base = parseFloat(baseStr) || 16;
    const ratio = parseFloat(ratioStr) || 1.25;
    
    const formatValue = (val: number) => {
      if (unit === "px") {
        return `${Math.round(val * 10) / 10}px`;
      } else {
        return `${Math.round(val * 1000) / 1000}${unit}`;
      }
    };

    const scale = {
      xs: formatValue(base / (ratio * ratio)),
      sm: formatValue(base / ratio),
      md: `${base}${unit}`,
      lg: formatValue(base * ratio),
      xl: formatValue(base * ratio * ratio),
      xxl: formatValue(base * ratio * ratio * ratio),
      xxxl: formatValue(base * ratio * ratio * ratio * ratio)
    };

    setFoundations(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        sizeScale: scale
      }
    }));
  };

  const handleTypescaleBaseValChange = (val: string) => {
    setTypescaleBaseVal(val);
    applyTypescale(val, typescaleUnit, typescaleRatio);
  };

  const handleTypescaleUnitChange = (unit: string) => {
    setTypescaleUnit(unit);
    applyTypescale(typescaleBaseVal, unit, typescaleRatio);
  };

  const handleTypescaleRatioChange = (ratio: string) => {
    setTypescaleRatio(ratio);
    applyTypescale(typescaleBaseVal, typescaleUnit, ratio);
  };

  // Dynamic Spacing scale recalculation helper based on Base Unit
  const handleBaseUnitChange = (unitVal: string) => {
    const val = parseInt(unitVal) || 8;
    const pxVal = `${val}px`;
    setFoundations(prev => ({
      ...prev,
      spacing: {
        baseUnit: pxVal,
        scale: {
          xs: `${Math.round(val * 0.5)}px`,
          sm: `${val}px`,
          md: `${Math.round(val * 1.5)}px`,
          lg: `${val * 2}px`,
          xl: `${val * 3}px`,
          xxl: `${val * 4}px`,
          xxxl: `${val * 6}px`
        }
      }
    }));
  };

  // Helper to load a theme preset
  const loadPreset = (presetKey: keyof typeof PRESETS) => {
    setFoundations(PRESETS[presetKey]);
  };

  // Helper to update specific nested token parameters
  const updateColor = (group: keyof typeof foundations.colors, key: string, val: string) => {
    setFoundations(prev => {
      const groupData = prev.colors[group] as any;
      return {
        ...prev,
        colors: {
          ...prev.colors,
          [group]: {
            ...groupData,
            [key]: val
          }
        }
      };
    });
  };

  const updateTypography = (familyKey: string, val: string) => {
    setFoundations(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        fontFamily: {
          ...prev.typography.fontFamily,
          [familyKey]: val
        }
      }
    }));
  };

  const updateFontSize = (sizeKey: string, val: string) => {
    setFoundations(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        sizeScale: {
          ...prev.typography.sizeScale,
          [sizeKey]: val
        }
      }
    }));
  };

  const updateLineHeight = (key: string, val: string) => {
    setFoundations(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        lineHeights: {
          ...prev.typography.lineHeights,
          [key]: val
        }
      }
    }));
  };

  const updateRadius = (key: string, val: string) => {
    setFoundations(prev => ({
      ...prev,
      shape: {
        ...prev.shape,
        radius: {
          ...prev.shape.radius,
          [key]: val
        }
      }
    }));
  };

  const updateBorderWidth = (key: string, val: string) => {
    setFoundations(prev => ({
      ...prev,
      shape: {
        ...prev.shape,
        borderWidth: {
          ...prev.shape.borderWidth,
          [key]: val
        }
      }
    }));
  };

  const updateElevation = (key: string, val: string) => {
    setFoundations(prev => ({
      ...prev,
      elevation: {
        ...prev.elevation,
        [key]: val
      }
    }));
  };

  const updateMotionDuration = (key: string, val: string) => {
    setFoundations(prev => ({
      ...prev,
      motion: {
        ...prev.motion,
        duration: {
          ...prev.motion.duration,
          [key]: val
        }
      }
    }));
  };

  const updateMotionEasing = (key: string, val: string) => {
    setFoundations(prev => ({
      ...prev,
      motion: {
        ...prev.motion,
        easing: {
          ...prev.motion.easing,
          [key]: val
        }
      }
    }));
  };

  const updateGridBreakpoint = (bpKey: "xs" | "sm" | "md" | "lg" | "xl", propKey: "width" | "columns" | "gutter" | "margin", val: string) => {
    setFoundations(prev => ({
      ...prev,
      grid: {
        ...prev.grid,
        breakpoints: {
          ...prev.grid.breakpoints,
          [bpKey]: {
            ...prev.grid.breakpoints[bpKey],
            [propKey]: val
          }
        }
      }
    }));
  };

  // Trigger Gemini API to generate Design System Foundations based on a prompt
  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    setAiError(null);

    try {
      const response = await fetch("/api/generate-foundations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setFoundations(data);
      // Automatically focus first builder tab to visualize results
      setActiveBuilderSection("color");
      setAiPrompt("");
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Could not connect to the server to generate with AI.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Dynamic CSS variables injector to render custom CSS in preview
  const cssVariables = `
    :root {
      --ds-primary-base: ${foundations.colors.primary.base};
      --ds-primary-light: ${foundations.colors.primary.light};
      --ds-primary-dark: ${foundations.colors.primary.dark};
      --ds-primary-text: ${foundations.colors.primary.text};
      
      --ds-secondary-base: ${foundations.colors.secondary.base};
      --ds-secondary-light: ${foundations.colors.secondary.light};
      --ds-secondary-dark: ${foundations.colors.secondary.dark};
      --ds-secondary-text: ${foundations.colors.secondary.text};
      
      --ds-accent-base: ${foundations.colors.accent.base};
      --ds-accent-light: ${foundations.colors.accent.light};
      --ds-accent-dark: ${foundations.colors.accent.dark};
      --ds-accent-text: ${foundations.colors.accent.text};
      
      --ds-neutral-base: ${foundations.colors.neutral.base};
      --ds-neutral-light: ${foundations.colors.neutral.light};
      --ds-neutral-dark: ${foundations.colors.neutral.dark};
      --ds-neutral-text: ${foundations.colors.neutral.text};
      
      --ds-bg-default: ${foundations.colors.background.default};
      --ds-bg-surface: ${foundations.colors.background.surface};
      --ds-bg-surface-muted: ${foundations.colors.background.surfaceMuted};
      
      --ds-border-default: ${foundations.colors.border.default};
      --ds-border-focus: ${foundations.colors.border.focus};
      
      --ds-font-headings: "${foundations.typography.fontFamily.headings.split(',')[0].replace(/['"]/g, "")}", sans-serif;
      --ds-font-body: "${foundations.typography.fontFamily.body.split(',')[0].replace(/['"]/g, "")}", system-ui, sans-serif;
      --ds-font-mono: "${foundations.typography.fontFamily.mono.split(',')[0].replace(/['"]/g, "")}", monospace;
      
      --ds-size-xs: ${foundations.typography.sizeScale.xs};
      --ds-size-sm: ${foundations.typography.sizeScale.sm};
      --ds-size-md: ${foundations.typography.sizeScale.md};
      --ds-size-lg: ${foundations.typography.sizeScale.lg};
      --ds-size-xl: ${foundations.typography.sizeScale.xl};
      --ds-size-xxl: ${foundations.typography.sizeScale.xxl};
      --ds-size-xxxl: ${foundations.typography.sizeScale.xxxl};
      
      --ds-lh-tight: ${foundations.typography.lineHeights.tight};
      --ds-lh-normal: ${foundations.typography.lineHeights.normal};
      --ds-lh-loose: ${foundations.typography.lineHeights.loose};
      
      --ds-space-xs: ${foundations.spacing.scale.xs};
      --ds-space-sm: ${foundations.spacing.scale.sm};
      --ds-space-md: ${foundations.spacing.scale.md};
      --ds-space-lg: ${foundations.spacing.scale.lg};
      --ds-space-xl: ${foundations.spacing.scale.xl};
      --ds-space-xxl: ${foundations.spacing.scale.xxl};
      --ds-space-xxxl: ${foundations.spacing.scale.xxxl};
      
      --ds-radius-none: ${foundations.shape.radius.none};
      --ds-radius-sm: ${foundations.shape.radius.sm};
      --ds-radius-md: ${foundations.shape.radius.md};
      --ds-radius-lg: ${foundations.shape.radius.lg};
      --ds-radius-xl: ${foundations.shape.radius.xl};
      --ds-radius-full: ${foundations.shape.radius.full};
      
      --ds-border-sm: ${foundations.shape.borderWidth.sm};
      --ds-border-md: ${foundations.shape.borderWidth.md};
      --ds-border-lg: ${foundations.shape.borderWidth.lg};
      
      --ds-elevation-sm: ${foundations.elevation.sm};
      --ds-elevation-md: ${foundations.elevation.md};
      --ds-elevation-lg: ${foundations.elevation.lg};
      
      --ds-motion-fast: ${foundations.motion.duration.fast};
      --ds-motion-normal: ${foundations.motion.duration.normal};
      --ds-motion-slow: ${foundations.motion.duration.slow};
      
      --ds-easing-ease-in-out: ${foundations.motion.easing.easeInOut};
      --ds-easing-ease-out: ${foundations.motion.easing.easeOut};
      --ds-easing-ease-in: ${foundations.motion.easing.easeIn};
      --ds-easing-linear: ${foundations.motion.easing.linear};
    }
  `;

  // Get active exporter code
  const getExporterCode = () => {
    switch (activeExporter) {
      case "css":
        return exportToCSS(foundations);
      case "w3c":
        return exportToW3C(foundations);
      case "tailwind":
        return exportToTailwind(foundations);
    }
  };

  // Copy code to clipboard helper
  const copyToClipboard = () => {
    const code = getExporterCode();
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper to trigger JSON download
  const downloadTokens = () => {
    const code = getExporterCode();
    const extension = activeExporter === "w3c" ? "json" : activeExporter === "tailwind" ? "css" : "css";
    const filename = `${foundations.name.toLowerCase().replace(/\s+/g, "-")}-tokens.${extension}`;
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Format WCAG Rating component helper
  const ContrastBadge = ({ rating }: { rating: typeof primaryContrast }) => {
    const isAA = rating.aaNormal;
    const isAAA = rating.aaaNormal;

    return (
      <div className="flex items-center gap-2 mt-1">
        <span className="font-mono text-xs font-bold text-slate-400">Ratio: {rating.ratio}:1</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${isAAA ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : isAA ? "bg-cyan-950 text-cyan-400 border border-cyan-800" : "bg-rose-950 text-rose-400 border border-rose-800"}`}>
          {isAAA ? "WCAG AAA" : isAA ? "WCAG AA" : "CONSTRAST WARNING"}
        </span>
      </div>
    );
  };

  return (
    <div id="app" className="min-h-screen bg-[#fdfdfd] text-[#1a1a1a] flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Dynamic CSS Variables Injector */}
      <style>{cssVariables}</style>

      {/* HEADER BAR */}
      <header className="h-14 border-b border-gray-200 bg-white sticky top-0 z-50 px-6 flex flex-row items-center justify-between gap-4 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">SF</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-gray-800 flex items-center gap-2">
              Design System Foundations Builder
              <span className="text-[10px] bg-indigo-100 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded font-mono font-medium">v1.2</span>
            </h1>
            <p className="text-[10px] text-gray-500 hidden sm:block">
              Design board and technical token specifications for software architects and senior UX designers
            </p>
          </div>
        </div>

        {/* TOP LEVEL NAVIGATION TABS */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded border border-gray-200">
          <button
            onClick={() => setActiveTab("builder")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === "builder" 
                ? "bg-white text-indigo-700 shadow-xs border border-gray-300" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Interactive Workbench
          </button>
          <button
            onClick={() => setActiveTab("ideas")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === "ideas" 
                ? "bg-white text-indigo-700 shadow-xs border border-gray-300" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Proposed Ideas (3-5 Concepts)
          </button>
          <button
            onClick={() => setActiveTab("research")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === "research" 
                ? "bg-white text-indigo-700 shadow-xs border border-gray-300" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Theoretical Research
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE */}
      <main className="flex-1 flex flex-col">
        
        {/* TAB 1: INTERACTIVE TOKEN BUILDER WORKSPACE */}
        {activeTab === "builder" && (
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-0">
            
            {/* LEFT PANE: CONTROLS & SPECIFIERS (5 Columns) */}
            <div className="xl:col-span-5 border-r border-gray-200 bg-[#f8f9fa] flex flex-col h-auto xl:h-[calc(100vh-56px)] overflow-y-auto">
              
              {/* Preset Quick Loader */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider">Load Base Preset</span>
                  <span className="text-[10px] text-gray-400">Start with a defined architecture</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
                  <button 
                    onClick={() => loadPreset("swiss")}
                    className={`px-2.5 py-1.5 rounded text-xs font-semibold text-left transition border ${
                      foundations.name === PRESETS.swiss.name 
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                        : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    Minimalist Swiss
                  </button>
                  <button 
                    onClick={() => loadPreset("editorial")}
                    className={`px-2.5 py-1.5 rounded text-xs font-semibold text-left transition border ${
                      foundations.name === PRESETS.editorial.name 
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                        : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    Organic Editorial
                  </button>
                  <button 
                    onClick={() => loadPreset("brutalist")}
                    className={`px-2.5 py-1.5 rounded text-xs font-semibold text-left transition border ${
                      foundations.name === PRESETS.brutalist.name 
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                        : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    Neo-Brutalist
                  </button>
                  <button 
                    onClick={() => loadPreset("cyberpunk")}
                    className={`px-2.5 py-1.5 rounded text-xs font-semibold text-left transition border ${
                      foundations.name === PRESETS.cyberpunk.name 
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                        : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    Cyber-Dark
                  </button>
                </div>
              </div>

              {/* AI Mood Generative Tool (Gemini Powered) in Dark Carbon high-contrast style */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="bg-[#2D333B] border border-gray-700 rounded-lg shadow-sm flex flex-col text-white overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-gray-700 flex items-center justify-between bg-[#1C2128]">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      AI Brand Moodboard to Tokens
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-green-900/60 text-green-300 text-[8px] uppercase tracking-widest font-bold">Gemini-3.5-Flash</span>
                  </div>
                  <div className="p-3.5 space-y-2.5">
                    <p className="text-[10px] text-gray-300 leading-normal">
                      Describe a brand's mood or a conceptual prompt and let the AI model dynamically generate a matching color palette, typography scale, spacing, and component curvatures.
                    </p>
                    
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g., 'An organic artisanal coffee shop, warm earth tones' or 'Neon cyber-fintech'"
                        className="flex-1 bg-[#1C2128] border border-gray-600 rounded px-2.5 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-400"
                        onKeyDown={(e) => e.key === "Enter" && generateWithAI()}
                        disabled={isAiGenerating}
                      />
                      <button
                        onClick={generateWithAI}
                        disabled={isAiGenerating || !aiPrompt.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-400 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all shrink-0 cursor-pointer"
                      >
                        {isAiGenerating ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        {isAiGenerating ? "Generating..." : "Sync"}
                      </button>
                    </div>

                    {aiError && (
                      <div className="p-2.5 bg-rose-950/60 border border-rose-800 text-rose-200 rounded text-[10px] flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                        <span>{aiError}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTIVE SYSTEM SPECIFIER PANEL */}
              <div className="flex p-1.5 gap-1 border-b border-gray-200 bg-white sticky top-0 z-10 overflow-x-auto shrink-0">
                <button
                  onClick={() => setActiveBuilderSection("color")}
                  className={`px-2.5 py-1.5 text-[11px] font-semibold flex items-center gap-1 transition whitespace-nowrap rounded ${
                    activeBuilderSection === "color" 
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs" 
                      : "border border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  Color
                </button>
                <button
                  onClick={() => setActiveBuilderSection("typography")}
                  className={`px-2.5 py-1.5 text-[11px] font-semibold flex items-center gap-1 transition whitespace-nowrap rounded ${
                    activeBuilderSection === "typography" 
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs" 
                      : "border border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  Typography
                </button>
                <button
                  onClick={() => setActiveBuilderSection("spacing")}
                  className={`px-2.5 py-1.5 text-[11px] font-semibold flex items-center gap-1 transition whitespace-nowrap rounded ${
                    activeBuilderSection === "spacing" 
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs" 
                      : "border border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  Spacing
                </button>
                <button
                  onClick={() => setActiveBuilderSection("shape")}
                  className={`px-2.5 py-1.5 text-[11px] font-semibold flex items-center gap-1 transition whitespace-nowrap rounded ${
                    activeBuilderSection === "shape" 
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs" 
                      : "border border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                  Shapes & Borders
                </button>
                <button
                  onClick={() => setActiveBuilderSection("elevation")}
                  className={`px-2.5 py-1.5 text-[11px] font-semibold flex items-center gap-1 transition whitespace-nowrap rounded ${
                    activeBuilderSection === "elevation" 
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs" 
                      : "border border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Elevation & Shadows
                </button>
                <button
                  onClick={() => setActiveBuilderSection("motion")}
                  className={`px-2.5 py-1.5 text-[11px] font-semibold flex items-center gap-1 transition whitespace-nowrap rounded ${
                    activeBuilderSection === "motion" 
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs" 
                      : "border border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Motion
                </button>
                <button
                  onClick={() => setActiveBuilderSection("grid")}
                  className={`px-2.5 py-1.5 text-[11px] font-semibold flex items-center gap-1 transition whitespace-nowrap rounded ${
                    activeBuilderSection === "grid" 
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs" 
                      : "border border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  Grid & Breakpoints
                </button>
              </div>

              {/* SPECIFIC CONTROLS CONTAINER */}
              <div className="p-4 flex-1">
                
                {/* 1. COLOR SECTION */}
                {activeBuilderSection === "color" && (
                  <div className="space-y-4">
                    <div className="px-1">
                      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-tight">Functional Color Palette</h3>
                      <p className="text-[11px] text-gray-500 leading-normal mt-0.5">
                        Configure primary, secondary, accent, and neutral colors. Each color set includes background, shades, and contrast-guaranteed text colors.
                      </p>
                    </div>

                    {/* Primary Color Group */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                        <span className="text-[11px] font-bold font-mono text-gray-700">Primary Color</span>
                        <ContrastBadge rating={primaryContrast} />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase">Base HEX</label>
                          <div className="flex gap-2 items-center mt-1">
                            <input 
                              type="color" 
                              value={foundations.colors.primary.base} 
                              onChange={(e) => updateColor("primary", "base", e.target.value)}
                              className="w-6 h-6 rounded cursor-pointer shrink-0 border-0 bg-transparent"
                            />
                            <input 
                              type="text" 
                              value={foundations.colors.primary.base} 
                              onChange={(e) => updateColor("primary", "base", e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs text-gray-800 font-mono w-full focus:border-indigo-400 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase">Contrast-Guaranteed Text</label>
                          <div className="flex gap-2 items-center mt-1">
                            <input 
                              type="color" 
                              value={foundations.colors.primary.text} 
                              onChange={(e) => updateColor("primary", "text", e.target.value)}
                              className="w-6 h-6 rounded cursor-pointer shrink-0 border-0 bg-transparent"
                            />
                            <input 
                              type="text" 
                              value={foundations.colors.primary.text} 
                              onChange={(e) => updateColor("primary", "text", e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs text-gray-800 font-mono w-full focus:border-indigo-400 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase">Light Highlight</label>
                          <div className="flex gap-2 items-center mt-1">
                            <input 
                              type="color" 
                              value={foundations.colors.primary.light} 
                              onChange={(e) => updateColor("primary", "light", e.target.value)}
                              className="w-6 h-6 rounded cursor-pointer shrink-0 border-0 bg-transparent"
                            />
                            <input 
                              type="text" 
                              value={foundations.colors.primary.light} 
                              onChange={(e) => updateColor("primary", "light", e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs text-gray-800 font-mono w-full focus:border-indigo-400 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase">Dark Shading</label>
                          <div className="flex gap-2 items-center mt-1">
                            <input 
                              type="color" 
                              value={foundations.colors.primary.dark} 
                              onChange={(e) => updateColor("primary", "dark", e.target.value)}
                              className="w-6 h-6 rounded cursor-pointer shrink-0 border-0 bg-transparent"
                            />
                            <input 
                              type="text" 
                              value={foundations.colors.primary.dark} 
                              onChange={(e) => updateColor("primary", "dark", e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs text-gray-800 font-mono w-full focus:border-indigo-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Accent Color Group */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                        <span className="text-[11px] font-bold font-mono text-gray-700">Accent Color</span>
                        <ContrastBadge rating={accentContrast} />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase">Base HEX</label>
                          <div className="flex gap-2 items-center mt-1">
                            <input 
                              type="color" 
                              value={foundations.colors.accent.base} 
                              onChange={(e) => updateColor("accent", "base", e.target.value)}
                              className="w-6 h-6 rounded cursor-pointer shrink-0 border-0 bg-transparent"
                            />
                            <input 
                              type="text" 
                              value={foundations.colors.accent.base} 
                              onChange={(e) => updateColor("accent", "base", e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs text-gray-800 font-mono w-full focus:border-indigo-400 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase">Contrast-Guaranteed Text</label>
                          <div className="flex gap-2 items-center mt-1">
                            <input 
                              type="color" 
                              value={foundations.colors.accent.text} 
                              onChange={(e) => updateColor("accent", "text", e.target.value)}
                              className="w-6 h-6 rounded cursor-pointer shrink-0 border-0 bg-transparent"
                            />
                            <input 
                              type="text" 
                              value={foundations.colors.accent.text} 
                              onChange={(e) => updateColor("accent", "text", e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs text-gray-800 font-mono w-full focus:border-indigo-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Secondary & Neutral Palette */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs space-y-2">
                        <span className="text-[11px] font-bold font-mono text-gray-700 block">Secondary Color</span>
                        <div>
                          <label className="text-[9px] font-mono text-gray-500 block uppercase">Base HEX</label>
                          <div className="flex gap-1.5 items-center mt-0.5">
                            <input 
                              type="color" 
                              value={foundations.colors.secondary.base} 
                              onChange={(e) => updateColor("secondary", "base", e.target.value)}
                              className="w-5.5 h-5.5 rounded cursor-pointer border-0 bg-transparent shrink-0"
                            />
                            <input 
                              type="text" 
                              value={foundations.colors.secondary.base} 
                              onChange={(e) => updateColor("secondary", "base", e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-1.5 py-0.5 text-[11px] text-gray-800 font-mono w-full focus:border-indigo-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs space-y-2">
                        <span className="text-[11px] font-bold font-mono text-gray-700 block">Neutral Color</span>
                        <div>
                          <label className="text-[9px] font-mono text-gray-500 block uppercase">Base HEX</label>
                          <div className="flex gap-1.5 items-center mt-0.5">
                            <input 
                              type="color" 
                              value={foundations.colors.neutral.base} 
                              onChange={(e) => updateColor("neutral", "base", e.target.value)}
                              className="w-5.5 h-5.5 rounded cursor-pointer border-0 bg-transparent shrink-0"
                            />
                            <input 
                              type="text" 
                              value={foundations.colors.neutral.base} 
                              onChange={(e) => updateColor("neutral", "base", e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-1.5 py-0.5 text-[11px] text-gray-800 font-mono w-full focus:border-indigo-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Canvas & Background Colors */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-3">
                      <span className="text-[11px] font-bold font-mono text-gray-700 block">Background & Canvas</span>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 block">Page Default</label>
                          <div className="flex gap-1 mt-1">
                            <input 
                              type="color" 
                              value={foundations.colors.background.default} 
                              onChange={(e) => updateColor("background", "default", e.target.value)}
                              className="w-5 h-5 shrink-0"
                            />
                            <input 
                              type="text" 
                              value={foundations.colors.background.default} 
                              className="bg-gray-50 text-[10px] border border-gray-300 w-full text-center rounded font-mono text-gray-800 focus:border-indigo-400 focus:outline-none"
                              onChange={(e) => updateColor("background", "default", e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 block">Surface (Card)</label>
                          <div className="flex gap-1 mt-1">
                            <input 
                              type="color" 
                              value={foundations.colors.background.surface} 
                              onChange={(e) => updateColor("background", "surface", e.target.value)}
                              className="w-5 h-5 shrink-0"
                            />
                            <input 
                              type="text" 
                              value={foundations.colors.background.surface} 
                              className="bg-gray-50 text-[10px] border border-gray-300 w-full text-center rounded font-mono text-gray-800 focus:border-indigo-400 focus:outline-none"
                              onChange={(e) => updateColor("background", "surface", e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 block">Surface Muted</label>
                          <div className="flex gap-1 mt-1">
                            <input 
                              type="color" 
                              value={foundations.colors.background.surfaceMuted} 
                              onChange={(e) => updateColor("background", "surfaceMuted", e.target.value)}
                              className="w-5 h-5 shrink-0"
                            />
                            <input 
                              type="text" 
                              value={foundations.colors.background.surfaceMuted} 
                              className="bg-gray-50 text-[10px] border border-gray-300 w-full text-center rounded font-mono text-gray-800 focus:border-indigo-400 focus:outline-none"
                              onChange={(e) => updateColor("background", "surfaceMuted", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Borders */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-3">
                      <span className="text-[11px] font-bold font-mono text-gray-700 block">Lines & Outlines (Borders)</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 block">Default Border HEX</label>
                          <div className="flex gap-2 items-center mt-1">
                            <input 
                              type="color" 
                              value={foundations.colors.border.default} 
                              onChange={(e) => updateColor("border", "default", e.target.value)}
                              className="w-5 h-5 border-0 cursor-pointer"
                            />
                            <input 
                              type="text" 
                              value={foundations.colors.border.default} 
                              onChange={(e) => updateColor("border", "default", e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-800 font-mono w-full focus:border-indigo-400 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 block">Focus Border HEX</label>
                          <div className="flex gap-2 items-center mt-1">
                            <input 
                              type="color" 
                              value={foundations.colors.border.focus} 
                              onChange={(e) => updateColor("border", "focus", e.target.value)}
                              className="w-5 h-5 border-0 cursor-pointer"
                            />
                            <input 
                              type="text" 
                              value={foundations.colors.border.focus} 
                              onChange={(e) => updateColor("border", "focus", e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-800 font-mono w-full focus:border-indigo-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TYPOGRAPHY SECTION */}
                {activeBuilderSection === "typography" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 mb-1">Typography Scale & Families</h3>
                      <p className="text-xs text-gray-500">
                        Select the font families for brand headings, UI body text, and technical/monospace data representation.
                      </p>
                    </div>

                    {/* Font Families */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-3">
                      <span className="text-[11px] font-bold font-mono text-gray-700 block uppercase tracking-wider">Font Families</span>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 block">Headings</label>
                          <select 
                            value={foundations.typography.fontFamily.headings} 
                            onChange={(e) => updateTypography("headings", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1.5 mt-1 text-xs text-gray-800 w-full focus:outline-none focus:border-indigo-400 font-medium"
                          >
                            <option value="Space Grotesk, sans-serif">Space Grotesk (Modern Tech)</option>
                            <option value="Playfair Display, Georgia, serif">Playfair Display (Editorial Serif)</option>
                            <option value="Inter, sans-serif">Inter (Swiss Sans)</option>
                            <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans (Friendly Clean)</option>
                            <option value="Orbitron, sans-serif">Orbitron (Geometric Cyber)</option>
                            <option value="Syne, sans-serif">Syne (Expressive Art)</option>
                            {customFonts.length > 0 && <option disabled>── Imported Fonts ──</option>}
                            {customFonts.map(font => (
                              <option key={`heading-${font.family}`} value={font.family}>
                                {font.name} ({font.type === "google" ? "Google" : "Uploaded"})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-500 block">UI & Body Text</label>
                          <select 
                            value={foundations.typography.fontFamily.body} 
                            onChange={(e) => updateTypography("body", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1.5 mt-1 text-xs text-gray-800 w-full focus:outline-none focus:border-indigo-400 font-medium"
                          >
                            <option value="Inter, sans-serif">Inter (Highly readable)</option>
                            <option value="system-ui, sans-serif">System UI (Native OS)</option>
                            <option value="Georgia, serif">Georgia (Warm Editorial)</option>
                            <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans (Contemporary)</option>
                            {customFonts.length > 0 && <option disabled>── Imported Fonts ──</option>}
                            {customFonts.map(font => (
                              <option key={`body-${font.family}`} value={font.family}>
                                {font.name} ({font.type === "google" ? "Google" : "Uploaded"})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-500 block">Monospace / Data</label>
                          <select 
                            value={foundations.typography.fontFamily.mono} 
                            onChange={(e) => updateTypography("mono", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1.5 mt-1 text-xs text-gray-800 w-full focus:outline-none focus:border-indigo-400 font-medium"
                          >
                            <option value="JetBrains Mono, monospace">JetBrains Mono (Clean Developer)</option>
                            <option value="Fira Code, monospace">Fira Code (Futuristic Data)</option>
                            <option value="Courier New, monospace">Courier Traditional</option>
                            {customFonts.length > 0 && <option disabled>── Imported Fonts ──</option>}
                            {customFonts.map(font => (
                              <option key={`mono-${font.family}`} value={font.family}>
                                {font.name} ({font.type === "google" ? "Google" : "Uploaded"})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Font Explorer & Importer Panel */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-indigo-500" />
                          <span className="text-[11px] font-bold font-mono text-gray-700 block uppercase tracking-wider">
                            Font Directory & Importer
                          </span>
                        </div>
                        <span className="text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded font-mono font-bold">
                          Free & Custom
                        </span>
                      </div>

                      {/* Tab buttons */}
                      <div className="flex bg-gray-100 p-0.5 rounded-md text-xs">
                        <button
                          type="button"
                          onClick={() => { setActiveFontTab("catalog"); setUploadError(null); setUploadSuccess(null); }}
                          className={`flex-1 py-1 text-center font-semibold rounded cursor-pointer transition ${activeFontTab === "catalog" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"}`}
                        >
                          Google Fonts Catalog
                        </button>
                        <button
                          type="button"
                          onClick={() => { setActiveFontTab("upload"); setUploadError(null); setUploadSuccess(null); }}
                          className={`flex-1 py-1 text-center font-semibold rounded cursor-pointer transition ${activeFontTab === "upload" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"}`}
                        >
                          Upload Local File (.ttf)
                        </button>
                      </div>

                      {activeFontTab === "catalog" ? (
                        <div className="space-y-3">
                          {/* Search and Filters */}
                          <div className="space-y-1.5">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search fonts (e.g. Bricolage, Fraunces)..."
                                value={fontSearchQuery}
                                onChange={(e) => setFontSearchQuery(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded pl-8 pr-3 py-1 text-xs text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                              />
                            </div>
                            <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
                              {[
                                { key: "all", label: "All Categories" },
                                { key: "sans-serif", label: "Sans-Serif" },
                                { key: "serif", label: "Serif" },
                                { key: "display", label: "Display / Expressive" },
                                { key: "mono", label: "Monospace" }
                              ].map((cat) => (
                                <button
                                  key={cat.key}
                                  type="button"
                                  onClick={() => setFontCategoryFilter(cat.key)}
                                  className={`px-2 py-0.5 rounded whitespace-nowrap border cursor-pointer ${fontCategoryFilter === cat.key ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}
                                >
                                  {cat.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* List of Catalog Fonts */}
                          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 border-t border-gray-100 pt-2 custom-scrollbar">
                            {CATALOG_FONTS.filter((font) => {
                              const matchesSearch = font.name.toLowerCase().includes(fontSearchQuery.toLowerCase());
                              const matchesCategory = fontCategoryFilter === "all" || font.category === fontCategoryFilter;
                              return matchesSearch && matchesCategory;
                            }).map((font) => (
                              <div key={font.name} className="p-2 border border-gray-100 hover:border-indigo-200 rounded bg-gray-50/50 hover:bg-white transition flex flex-col gap-2">
                                <div className="flex justify-between items-start gap-1">
                                  <div>
                                    <span className="text-xs font-bold text-gray-800 block leading-tight">{font.name}</span>
                                    <span className="text-[9px] text-gray-400 font-mono">{font.provider}</span>
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleAddGoogleFont(font, "headings")}
                                      className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 transition border border-indigo-200 cursor-pointer"
                                      title="Set as Headings font"
                                    >
                                      Headings
                                    </button>
                                    <button
                                      onClick={() => handleAddGoogleFont(font, "body")}
                                      className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 transition border border-emerald-200 cursor-pointer"
                                      title="Set as UI & Body font"
                                    >
                                      Body
                                    </button>
                                    <button
                                      onClick={() => handleAddGoogleFont(font, "mono")}
                                      className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 transition border border-amber-200 cursor-pointer"
                                      title="Set as Monospace font"
                                    >
                                      Mono
                                    </button>
                                  </div>
                                </div>
                                <div className="p-1.5 rounded bg-white border border-gray-200/60 overflow-hidden text-ellipsis whitespace-nowrap">
                                  <span
                                    style={{ fontFamily: font.name }}
                                    className="text-gray-800 text-sm tracking-tight"
                                  >
                                    The quick brown fox jumps over the lazy dog
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* File Uploader UI */}
                          <div className="space-y-2">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-mono text-gray-500 block">Apply uploaded font to:</label>
                              <div className="flex gap-1 bg-gray-50 p-0.5 border border-gray-200 rounded text-[10px]">
                                {[
                                  { key: "headings", label: "Headings" },
                                  { key: "body", label: "UI & Body" },
                                  { key: "mono", label: "Monospace" }
                                ].map((role) => (
                                  <button
                                    key={role.key}
                                    type="button"
                                    onClick={() => setFontTargetRole(role.key as any)}
                                    className={`flex-1 py-1 text-center font-bold uppercase rounded cursor-pointer ${fontTargetRole === role.key ? "bg-indigo-600 text-white" : "text-gray-500 hover:text-gray-900"}`}
                                  >
                                    {role.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-5 bg-gray-50/50 hover:bg-indigo-50/20 hover:border-indigo-400 transition cursor-pointer text-center">
                              <Upload className="w-7 h-7 text-indigo-500 mb-1.5" />
                              <span className="text-xs font-bold text-gray-700 block">Click to select font file</span>
                              <span className="text-[9px] text-gray-400 block mt-0.5">Supports TTF, OTF, WOFF, or WOFF2</span>
                              <input 
                                type="file" 
                                accept=".ttf,.otf,.woff,.woff2" 
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleLocalFontUpload(e.target.files[0], fontTargetRole);
                                  }
                                }} 
                                className="hidden" 
                              />
                            </label>
                          </div>

                          {/* Status Alerts */}
                          {uploadError && (
                            <div className="p-2 border border-rose-200 bg-rose-50 text-rose-800 rounded text-[11px] flex gap-2 items-start animate-fade-in">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                              <span>{uploadError}</span>
                            </div>
                          )}

                          {uploadSuccess && (
                            <div className="p-2 border border-emerald-200 bg-emerald-50 text-emerald-800 rounded text-[11px] flex gap-2 items-start animate-fade-in">
                              <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                              <span>{uploadSuccess}</span>
                            </div>
                          )}

                          {/* List of custom registered fonts */}
                          {customFonts.filter(f => f.type === "uploaded").length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-bold font-mono text-gray-500 uppercase block tracking-wider">Currently Loaded Uploads:</span>
                              <div className="space-y-1 max-h-24 overflow-y-auto">
                                {customFonts.filter(f => f.type === "uploaded").map((font) => (
                                  <div key={font.name} className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded p-1.5 text-xs">
                                    <div className="flex items-center gap-1.5">
                                      <FolderOpen className="w-3 h-3 text-indigo-500" />
                                      <span className="font-bold text-gray-700">{font.name}</span>
                                    </div>
                                    <span className="text-[9px] text-gray-400 uppercase font-mono">FontFace Active</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Typescale Generator Settings */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold font-mono text-gray-700 block uppercase tracking-wider">
                          Typescale Generator
                        </span>
                        <span className="text-[9px] bg-indigo-100 text-indigo-800 border border-indigo-200 px-1.5 py-0.5 rounded font-mono font-bold">
                          Interactive
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {/* Base Font Size input & unit dropdown */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-500 block">Base Font Size</label>
                          <div className="flex gap-1.5">
                            <input 
                              type="text" 
                              value={typescaleBaseVal} 
                              onChange={(e) => handleTypescaleBaseValChange(e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                              placeholder="16"
                            />
                            <select
                              value={typescaleUnit}
                              onChange={(e) => handleTypescaleUnitChange(e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-1.5 py-1 text-xs font-mono text-gray-800 focus:outline-none focus:border-indigo-400"
                            >
                              <option value="px">px</option>
                              <option value="rem">rem</option>
                              <option value="em">em</option>
                            </select>
                          </div>
                        </div>

                        {/* Ratio Preset & Numeric Input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-500 block">Scale Ratio</label>
                          <div className="flex flex-col gap-1.5">
                            <select
                              value={
                                [1.067, 1.125, 1.200, 1.250, 1.333, 1.414, 1.500, 1.618, 1.778, 2.000]
                                  .some(val => Math.abs(val - parseFloat(typescaleRatio)) < 0.002)
                                    ? [1.067, 1.125, 1.200, 1.250, 1.333, 1.414, 1.500, 1.618, 1.778, 2.000]
                                        .find(val => Math.abs(val - parseFloat(typescaleRatio)) < 0.002)?.toString()
                                    : "custom"
                              }
                              onChange={(e) => {
                                if (e.target.value !== "custom") {
                                  handleTypescaleRatioChange(e.target.value);
                                }
                              }}
                              className="bg-gray-50 border border-gray-300 rounded px-1.5 py-1 mt-0.5 text-xs text-gray-800 focus:outline-none focus:border-indigo-400 w-full"
                            >
                              <option value="1.067">1.067 - Minor Second</option>
                              <option value="1.125">1.125 - Major Second</option>
                              <option value="1.200">1.200 - Minor Third</option>
                              <option value="1.250">1.250 - Major Third</option>
                              <option value="1.333">1.333 - Perfect Fourth</option>
                              <option value="1.414">1.414 - Augmented Fourth</option>
                              <option value="1.500">1.500 - Perfect Fifth</option>
                              <option value="1.618">1.618 - Golden Ratio</option>
                              <option value="1.778">1.778 - Major Seventh</option>
                              <option value="2.000">2.000 - Double / Octave</option>
                              <option value="custom">Custom Ratio</option>
                            </select>
                            
                            <input 
                              type="text" 
                              value={typescaleRatio} 
                              onChange={(e) => handleTypescaleRatioChange(e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs font-mono text-gray-800 focus:outline-none focus:border-indigo-400 w-full"
                              placeholder="1.250"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Size Scale Editor */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-3">
                      <span className="text-[11px] font-bold font-mono text-gray-700 block uppercase tracking-wider">
                        Font Size Steps
                      </span>
                      <p className="text-[10px] text-gray-500 leading-normal">
                        Calculated from base size <span className="font-mono text-indigo-600 font-bold">{typescaleBaseVal}{typescaleUnit}</span> with scale ratio <span className="font-mono text-indigo-600 font-bold">{typescaleRatio}</span>. You can still modify individual sizes manually.
                      </p>
                      
                      <div className="space-y-3 pt-2">
                        {[
                          { key: "xs", label: "XS - Subtext / Caption", desc: "Two steps below base" },
                          { key: "sm", label: "SM - Secondary / Small UI", desc: "One step below base" },
                          { key: "md", label: "MD - Body Base Size (1x)", desc: "Anchor size of scale", highlight: true },
                          { key: "lg", label: "LG - Subheading / Large UI", desc: "One step above base" },
                          { key: "xl", label: "XL - H3 / Component Header", desc: "Two steps above base" },
                          { key: "xxl", label: "2XL - H2 / Section Title", desc: "Three steps above base" },
                          { key: "xxxl", label: "3XL - H1 / Page Title", desc: "Four steps above base" },
                        ].map((step) => {
                          const sizeVal = (foundations.typography.sizeScale as any)[step.key];
                          return (
                            <div key={step.key} className={`p-2.5 rounded border transition ${step.highlight ? "bg-indigo-50/50 border-indigo-200" : "bg-gray-50/40 border-gray-200"}`}>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-gray-700">{step.label}</span>
                                  <span className="text-[9px] text-gray-400 font-medium">{step.desc}</span>
                                </div>
                                <div className="w-24 shrink-0">
                                  <input 
                                    type="text" 
                                    value={sizeVal || ""} 
                                    onChange={(e) => updateFontSize(step.key, e.target.value)}
                                    className="bg-white border border-gray-300 rounded px-2 py-0.5 text-xs font-mono font-bold text-gray-800 text-right w-full focus:outline-none focus:border-indigo-400"
                                  />
                                </div>
                              </div>
                              {/* Visual interactive preview of typescale step */}
                              <div className="overflow-hidden text-ellipsis whitespace-nowrap bg-white p-2 rounded border border-gray-200 flex items-center">
                                <span 
                                  style={{ 
                                    fontFamily: foundations.typography.fontFamily.body,
                                    fontSize: sizeVal,
                                  }}
                                  className="text-gray-800 tracking-tight block max-w-full"
                                >
                                  Visual Typographic Specimen
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Line Heights */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-3">
                      <span className="text-[11px] font-bold font-mono text-gray-700 block">Line Heights</span>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500">Tight</label>
                          <input 
                            type="text" 
                            value={foundations.typography.lineHeights.tight} 
                            onChange={(e) => updateLineHeight("tight", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full text-center focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500">Normal</label>
                          <input 
                            type="text" 
                            value={foundations.typography.lineHeights.normal} 
                            onChange={(e) => updateLineHeight("normal", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full text-center focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500">Loose</label>
                          <input 
                            type="text" 
                            value={foundations.typography.lineHeights.loose} 
                            onChange={(e) => updateLineHeight("loose", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full text-center focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SPACING SECTION */}
                {activeBuilderSection === "spacing" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 mb-1">Grid & Spacing System</h3>
                      <p className="text-xs text-gray-500">
                        Define the spacing increment base (e.g., 4px or 8px) and let it scale proportionally for paddings, margins, and component alignments.
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 shadow-xs">
                      <span className="text-[11px] font-bold font-mono text-gray-700 block">Grid Base Unit Scale</span>
                      
                      <div>
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                          <span>Base Incremental Unit</span>
                          <span className="font-mono text-indigo-600 font-bold">{foundations.spacing.baseUnit}</span>
                        </div>
                        <input 
                          type="range" 
                          min="4" 
                          max="12" 
                          step="1"
                          value={parseInt(foundations.spacing.baseUnit) || 8} 
                          onChange={(e) => handleBaseUnitChange(e.target.value)}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
                          <span>4px (Ultra Compact)</span>
                          <span>8px (Standard Web)</span>
                          <span>12px (Generous Editorial)</span>
                        </div>
                      </div>
                    </div>

                    {/* Resulting Spacing scale */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 shadow-xs">
                      <span className="text-[11px] font-bold font-mono text-gray-700 block">Calculated Spacing Tokens</span>
                      
                      <div className="space-y-2">
                        {Object.entries(foundations.spacing.scale).map(([key, val]) => (
                          <div key={key} className="flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-1.5 rounded">
                            <span className="font-mono text-[10px] font-bold text-gray-500 uppercase">spacing.{key}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs text-gray-700">{val}</span>
                              <div 
                                className="bg-indigo-500/20 border border-indigo-500/40 rounded-sm" 
                                style={{ width: val, height: "12px" }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. SHAPE SECTION */}
                {activeBuilderSection === "shape" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 mb-1">Geometries & Corner Radii</h3>
                      <p className="text-xs text-gray-500">
                        Shape the corner geometry of your design system: from extremely rounded curves to sharp brutalist corners, plus interactive border widths.
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-3">
                      <span className="text-[11px] font-bold font-mono text-gray-700 block">Corner Radii</span>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500">SM (Mini badges)</label>
                          <input 
                            type="text" 
                            value={foundations.shape.radius.sm} 
                            onChange={(e) => updateRadius("sm", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500">MD (Button/Input)</label>
                          <input 
                            type="text" 
                            value={foundations.shape.radius.md} 
                            onChange={(e) => updateRadius("md", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500">LG (Cards/Panels)</label>
                          <input 
                            type="text" 
                            value={foundations.shape.radius.lg} 
                            onChange={(e) => updateRadius("lg", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500">XL (Promo cards)</label>
                          <input 
                            type="text" 
                            value={foundations.shape.radius.xl} 
                            onChange={(e) => updateRadius("xl", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-3">
                      <span className="text-[11px] font-bold font-mono text-gray-700 block">Border Widths</span>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500">Thin (SM)</label>
                          <input 
                            type="text" 
                            value={foundations.shape.borderWidth.sm} 
                            onChange={(e) => updateBorderWidth("sm", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full text-center focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500">Medium (MD)</label>
                          <input 
                            type="text" 
                            value={foundations.shape.borderWidth.md} 
                            onChange={(e) => updateBorderWidth("md", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full text-center focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500">Thick (LG)</label>
                          <input 
                            type="text" 
                            value={foundations.shape.borderWidth.lg} 
                            onChange={(e) => updateBorderWidth("lg", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full text-center focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. ELEVATION SECTION */}
                {activeBuilderSection === "elevation" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 mb-1">Elevation & Shadows</h3>
                      <p className="text-xs text-gray-500">
                        Configure depth levels to simulate space (ranging from flat embedded items to elevated panels and modal overlays).
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-4">
                      <div>
                        <label className="text-xs font-bold font-mono text-gray-700 block mb-1">Low Elevation (SM) - Embedded Cards</label>
                        <input 
                          type="text" 
                          value={foundations.elevation.sm} 
                          onChange={(e) => updateElevation("sm", e.target.value)}
                          className="bg-gray-50 border border-gray-300 rounded px-2.5 py-2 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold font-mono text-gray-700 block mb-1">Medium Elevation (MD) - Elevated Panels</label>
                        <input 
                          type="text" 
                          value={foundations.elevation.md} 
                          onChange={(e) => updateElevation("md", e.target.value)}
                          className="bg-gray-50 border border-gray-300 rounded px-2.5 py-2 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold font-mono text-gray-700 block mb-1">High Elevation (LG) - Modals & Overlays</label>
                        <input 
                          type="text" 
                          value={foundations.elevation.lg} 
                          onChange={(e) => updateElevation("lg", e.target.value)}
                          className="bg-gray-50 border border-gray-300 rounded px-2.5 py-2 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. MOTION SECTION */}
                {activeBuilderSection === "motion" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 mb-1">Motion & Easing</h3>
                      <p className="text-xs text-gray-500">
                        Determine the timing durations and non-linear transition curves for button hovers, transitions, and state transformations.
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-3">
                      <span className="text-[11px] font-bold font-mono text-gray-700 block">Durations</span>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500">Fast</label>
                          <input 
                            type="text" 
                            value={foundations.motion.duration.fast} 
                            onChange={(e) => updateMotionDuration("fast", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500">Normal</label>
                          <input 
                            type="text" 
                            value={foundations.motion.duration.normal} 
                            onChange={(e) => updateMotionDuration("normal", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-mono text-gray-500">Slow / Entrance</label>
                          <input 
                            type="text" 
                            value={foundations.motion.duration.slow} 
                            onChange={(e) => updateMotionDuration("slow", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-3">
                      <span className="text-[11px] font-bold font-mono text-gray-700 block">Easing Curves</span>
                      
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 block">Ease In Out</label>
                          <input 
                            type="text" 
                            value={foundations.motion.easing.easeInOut} 
                            onChange={(e) => updateMotionEasing("easeInOut", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 block">Ease Out</label>
                          <input 
                            type="text" 
                            value={foundations.motion.easing.easeOut} 
                            onChange={(e) => updateMotionEasing("easeOut", e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. GRID & BREAKPOINTS SECTION */}
                {activeBuilderSection === "grid" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 mb-1">Grid Anatomy & Breakpoints</h3>
                      <p className="text-xs text-gray-500">
                        Configure responsive grids for each layout. Define column count, gutters (inner columns spacing), and outer page margins.
                      </p>
                    </div>

                    {(["xs", "sm", "md", "lg", "xl"] as const).map((bp) => (
                      <div key={bp} className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                          <span className="text-[11px] font-bold font-mono text-indigo-700 uppercase">Breakpoint: {bp.toUpperCase()}</span>
                          <span className="text-[10px] text-gray-400 font-mono">min-width: {foundations.grid.breakpoints[bp].width}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 block">Breakpoint Screen Width</label>
                            <input 
                              type="text" 
                              value={foundations.grid.breakpoints[bp].width} 
                              onChange={(e) => updateGridBreakpoint(bp, "width", e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 block">Columns Count</label>
                            <input 
                              type="text" 
                              value={foundations.grid.breakpoints[bp].columns} 
                              onChange={(e) => updateGridBreakpoint(bp, "columns", e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 block">Inner Gutter</label>
                            <input 
                              type="text" 
                              value={foundations.grid.breakpoints[bp].gutter} 
                              onChange={(e) => updateGridBreakpoint(bp, "gutter", e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 block">Outer Margin</label>
                            <input 
                              type="text" 
                              value={foundations.grid.breakpoints[bp].margin} 
                              onChange={(e) => updateGridBreakpoint(bp, "margin", e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 mt-1 text-xs font-mono text-gray-800 w-full focus:outline-none focus:border-indigo-400"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

            {/* RIGHT PANE: REAL-TIME COMPONENT PREVIEW & CODE EXPORTS (7 Columns) */}
            <div className="xl:col-span-7 bg-gray-100 flex flex-col h-auto xl:h-[calc(100vh-77px)] overflow-y-auto p-4 sm:p-5 space-y-4">
              
              {/* Active Token Brand Tagline */}
              <div className="bg-white border border-gray-200 p-3.5 rounded-lg shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--ds-primary-base)" }} />
                    <span className="text-xs font-mono text-gray-500">Active Style</span>
                  </div>
                  <h2 className="text-base font-bold text-gray-800 mt-1">{foundations.name}</h2>
                  <p className="text-xs text-gray-500 mt-1 max-w-xl">{foundations.description}</p>
                </div>
                
                <button 
                  onClick={() => setFoundations(PRESETS.swiss)}
                  className="flex items-center gap-1.5 border border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-2.5 py-1.5 rounded text-xs transition shrink-0 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>

              {/* LIVE COMPONENT PREVIEW CONTAINER */}
              <div 
                className="rounded-lg p-5 border transition-all duration-300 relative overflow-hidden"
                style={{ 
                  backgroundColor: "var(--ds-bg-default)", 
                  borderColor: "var(--ds-border-default)",
                  borderWidth: "var(--ds-border-sm)"
                }}
              >
                {/* Background Grid Pattern to visualize transparency/alignment */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

                {/* Simulated Component Specs */}
                <div className="relative z-10 space-y-6">
                  
                  {/* Sandbox Section Header */}
                  <div className="flex items-center justify-between border-b pb-3 border-dashed" style={{ borderColor: "var(--ds-border-default)" }}>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">Live Component Visualizer</span>
                    </div>
                    <span className="font-mono text-[10px] text-gray-400">React Interactive Preview</span>
                  </div>

                  {/* SPEC 1: TYPOGRAPHY HIERARCHY */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">1. Typography Hierarchy</span>
                    
                    <div className="space-y-2">
                      <h1 
                        style={{ 
                          fontFamily: "var(--ds-font-headings)", 
                          fontSize: "var(--ds-size-xxxl)", 
                          lineHeight: "var(--ds-lh-tight)",
                          color: "var(--ds-neutral-base)"
                        }}
                        className="font-bold tracking-tight"
                      >
                        Triple XL Header (Main Title)
                      </h1>
                      
                      <h2 
                        style={{ 
                          fontFamily: "var(--ds-font-headings)", 
                          fontSize: "var(--ds-size-xxl)", 
                          lineHeight: "var(--ds-lh-tight)",
                          color: "var(--ds-neutral-base)"
                        }}
                        className="font-semibold"
                      >
                        Double XL Header (Section Subtitle)
                      </h2>

                      <h3 
                        style={{ 
                          fontFamily: "var(--ds-font-headings)", 
                          fontSize: "var(--ds-size-xl)", 
                          color: "var(--ds-neutral-base)"
                        }}
                        className="font-medium"
                      >
                        XL Header (Sub-components)
                      </h3>

                      <p 
                        style={{ 
                          fontFamily: "var(--ds-font-body)", 
                          fontSize: "var(--ds-size-md)", 
                          lineHeight: "var(--ds-lh-normal)",
                          color: "var(--ds-neutral-base)",
                          opacity: 0.85
                        }}
                        className="max-w-2xl"
                      >
                        This is standard body copy for testing layout legibility and typographic rhythm. It pairs with normal line height set at <code className="px-1 py-0.5 rounded font-mono text-xs bg-black/5 text-gray-600 font-bold">var(--ds-lh-normal)</code>.
                      </p>

                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "var(--ds-size-xs)" }} className="text-gray-400">
                          Monospace XS: system_core_v1_live_indicator
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SPEC 2: BUTTONS AND SHAPES */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">2. Buttons & Corner Shapes</span>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Primary Button */}
                      <button 
                        style={{ 
                          backgroundColor: "var(--ds-primary-base)", 
                          color: "var(--ds-primary-text)", 
                          fontFamily: "var(--ds-font-body)",
                          fontSize: "var(--ds-size-sm)",
                          borderRadius: "var(--ds-radius-md)",
                          borderWidth: "var(--ds-border-sm)",
                          borderColor: "var(--ds-primary-dark)",
                          padding: "var(--ds-space-sm) var(--ds-space-lg)",
                          boxShadow: "var(--ds-elevation-sm)"
                        }}
                        className="font-medium hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Primary Button
                      </button>

                      {/* Secondary Button */}
                      <button 
                        style={{ 
                          backgroundColor: "var(--ds-secondary-base)", 
                          color: "var(--ds-secondary-text)", 
                          fontFamily: "var(--ds-font-body)",
                          fontSize: "var(--ds-size-sm)",
                          borderRadius: "var(--ds-radius-md)",
                          padding: "var(--ds-space-sm) var(--ds-space-lg)",
                        }}
                        className="font-medium hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Secondary
                      </button>

                      {/* Accent Button */}
                      <button 
                        style={{ 
                          backgroundColor: "var(--ds-accent-base)", 
                          color: "var(--ds-accent-text)", 
                          fontFamily: "var(--ds-font-body)",
                          fontSize: "var(--ds-size-sm)",
                          borderRadius: "var(--ds-radius-md)",
                          padding: "var(--ds-space-sm) var(--ds-space-lg)",
                          boxShadow: "var(--ds-elevation-sm)"
                        }}
                        className="font-medium hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Accent
                      </button>

                      {/* Badge / Pill with shape.radius.full */}
                      <span 
                        style={{ 
                          backgroundColor: "var(--ds-primary-light)", 
                          color: "var(--ds-primary-base)", 
                          fontFamily: "var(--ds-font-mono)",
                          fontSize: "var(--ds-size-xs)",
                          borderRadius: "var(--ds-radius-full)",
                          border: "var(--ds-border-sm) solid var(--ds-primary-base)",
                          padding: "var(--ds-space-xs) var(--ds-space-sm)"
                        }}
                        className="font-bold"
                      >
                        BADGE FULL RADIUS
                      </span>
                    </div>
                  </div>

                  {/* SPEC 3: INTERACTIVE CONTROLS (ELEVATION & FORM INPUTS) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Form Spec */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">3. Forms & Focus States</span>
                      <div>
                        <label 
                          style={{ fontFamily: "var(--ds-font-body)", fontSize: "var(--ds-size-xs)", color: "var(--ds-neutral-base)" }} 
                          className="font-bold block mb-1"
                        >
                          Username Input (Focus Ring)
                        </label>
                        <input 
                          type="text" 
                          placeholder="Type something..." 
                          style={{ 
                            fontFamily: "var(--ds-font-body)", 
                            fontSize: "var(--ds-size-sm)",
                            borderRadius: "var(--ds-radius-sm)",
                            borderWidth: "var(--ds-border-sm)",
                            borderColor: "var(--ds-border-default)",
                            padding: "var(--ds-space-xs) var(--ds-space-sm)",
                            backgroundColor: "var(--ds-bg-surface)"
                          }}
                          className="w-full focus:outline-none focus:ring-2 focus:ring-offset-1 text-slate-900"
                        />
                      </div>
                    </div>

                    {/* Elevation Shadow Card Demo */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">4. Layout Elevations</span>
                      <div 
                        style={{ 
                          backgroundColor: "var(--ds-bg-surface)", 
                          borderColor: "var(--ds-border-default)", 
                          borderWidth: "var(--ds-border-sm)",
                          borderRadius: "var(--ds-radius-lg)",
                          boxShadow: "var(--ds-elevation-md)",
                          padding: "var(--ds-space-sm)"
                        }}
                        className="flex items-center gap-3"
                      >
                        <div 
                          className="w-8 h-8 rounded shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: "var(--ds-primary-base)", color: "var(--ds-primary-text)" }}
                        >
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "var(--ds-size-sm)", color: "var(--ds-neutral-base)" }} className="font-bold block">
                            Medium Elevated Card
                          </span>
                          <span className="text-[10px] text-gray-400 block font-mono">
                            box-shadow: var(--ds-elevation-md)
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* SPEC 4: THE INTEGRATED LIVE DEMO LAYOUT MOCKUP */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">5. Integrated Layout Mockup</span>
                    
                    {/* Mockup Dashboard Card */}
                    <div 
                      style={{ 
                        backgroundColor: "var(--ds-bg-surface-muted)", 
                        borderColor: "var(--ds-border-default)", 
                        borderWidth: "var(--ds-border-sm)",
                        borderRadius: "var(--ds-radius-xl)",
                        padding: "var(--ds-space-md)",
                      }}
                      className="border"
                    >
                      {/* Nav Bar */}
                      <div className="flex items-center justify-between border-b pb-2 mb-3" style={{ borderColor: "var(--ds-border-default)" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: "var(--ds-primary-base)", color: "var(--ds-primary-text)" }}>S</div>
                          <span style={{ fontFamily: "var(--ds-font-headings)", fontSize: "var(--ds-size-sm)", color: "var(--ds-neutral-base)" }} className="font-bold">
                            Control Console
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="w-2 h-2 rounded-full bg-gray-300" />
                        </div>
                      </div>

                      {/* Bento grid mockup */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div 
                          style={{ 
                            backgroundColor: "var(--ds-bg-surface)", 
                            borderRadius: "var(--ds-radius-md)", 
                            padding: "var(--ds-space-sm)",
                            boxShadow: "var(--ds-elevation-sm)",
                            border: "var(--ds-border-sm) solid var(--ds-border-default)"
                          }}
                        >
                          <span className="text-[9px] font-mono text-gray-400 block">SIGNAL LEVEL</span>
                          <span style={{ fontFamily: "var(--ds-font-headings)", fontSize: "var(--ds-size-xl)", color: "var(--ds-neutral-base)" }} className="font-bold block mt-1">
                            94.8%
                          </span>
                          <span className="text-[8px] text-emerald-500 font-mono">● Optimal</span>
                        </div>

                        <div 
                          style={{ 
                            backgroundColor: "var(--ds-bg-surface)", 
                            borderRadius: "var(--ds-radius-md)", 
                            padding: "var(--ds-space-sm)",
                            boxShadow: "var(--ds-elevation-sm)",
                            border: "var(--ds-border-sm) solid var(--ds-border-default)"
                          }}
                        >
                          <span className="text-[9px] font-mono text-gray-400 block">ACTIVE UPTIME</span>
                          <span style={{ fontFamily: "var(--ds-font-headings)", fontSize: "var(--ds-size-xl)", color: "var(--ds-neutral-base)" }} className="font-bold block mt-1">
                            12.4h
                          </span>
                          <span className="text-[8px] text-gray-400 font-mono">+20% Increase</span>
                        </div>

                        <div 
                          style={{ 
                            backgroundColor: "var(--ds-bg-surface)", 
                            borderRadius: "var(--ds-radius-md)", 
                            padding: "var(--ds-space-sm)",
                            boxShadow: "var(--ds-elevation-sm)",
                            border: "var(--ds-border-sm) solid var(--ds-border-default)"
                          }}
                          className="flex flex-col justify-between"
                        >
                          <span className="text-[9px] font-mono text-gray-400 block">ACTIONS</span>
                          <button 
                            style={{ 
                              backgroundColor: "var(--ds-primary-base)", 
                              color: "var(--ds-primary-text)",
                              fontFamily: "var(--ds-font-body)",
                              fontSize: "var(--ds-size-xs)",
                              borderRadius: "var(--ds-radius-sm)",
                              padding: "var(--ds-space-xs) var(--ds-space-sm)",
                              textAlign: "center"
                            }}
                            className="font-bold hover:opacity-95 active:scale-95 transition-all w-full mt-2 cursor-pointer"
                          >
                            Run Sync
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* SPEC 6: ANATOMÍA DE LA GRILLA */}
                  <div className="space-y-3 pt-4 border-t border-dashed" style={{ borderColor: "var(--ds-border-default)" }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">6. Grid Anatomy & Breakpoints</span>
                      
                      {/* Breakpoint selector for preview */}
                      <div className="flex bg-gray-200/60 p-0.5 rounded border border-gray-300/40">
                        {(["xs", "sm", "md", "lg", "xl"] as const).map((bp) => (
                          <button
                            key={bp}
                            onClick={() => setPreviewBreakpoint(bp)}
                            className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                              previewBreakpoint === bp 
                                ? "bg-white text-indigo-700 shadow-xs" 
                                : "text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            {bp.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs space-y-4">
                      {/* Grid info display */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 border border-gray-200 p-3 rounded font-mono text-[10px]">
                        <div>
                          <span className="text-gray-400 block uppercase">Breakpoint</span>
                          <span className="text-indigo-600 font-bold text-xs uppercase">{previewBreakpoint} (&gt;= {foundations.grid.breakpoints[previewBreakpoint].width})</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase">Columns</span>
                          <span className="text-gray-800 font-bold text-xs">{foundations.grid.breakpoints[previewBreakpoint].columns} cols</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase">Gutter</span>
                          <span className="text-gray-800 font-bold text-xs">{foundations.grid.breakpoints[previewBreakpoint].gutter}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase">Outer Margin</span>
                          <span className="text-gray-800 font-bold text-xs">{foundations.grid.breakpoints[previewBreakpoint].margin}</span>
                        </div>
                      </div>

                      {/* Interactive Visualizer Stage */}
                      <div className="border border-gray-200 rounded bg-gray-50 relative overflow-hidden p-4 min-h-[140px] flex flex-col justify-between">
                        {/* Margins & Columns Layer */}
                        <div className="w-full flex h-24 relative rounded overflow-hidden bg-white border border-gray-200">
                          
                          {/* Left Margin Indicator */}
                          <div 
                            className="h-full bg-rose-100/40 border-r border-dashed border-rose-300 flex items-center justify-center shrink-0 relative transition-all"
                            style={{ width: foundations.grid.breakpoints[previewBreakpoint].margin }}
                          >
                            <div className="absolute -rotate-90 text-[8px] font-mono text-rose-500 whitespace-nowrap font-bold">
                              M ({foundations.grid.breakpoints[previewBreakpoint].margin})
                            </div>
                          </div>

                          {/* Grid Columns Area */}
                          <div className="flex-1 h-full flex justify-between relative transition-all">
                            {Array.from({ length: parseInt(foundations.grid.breakpoints[previewBreakpoint].columns) || 4 }).map((_, idx) => (
                              <div key={idx} className="flex-1 h-full flex transition-all">
                                {/* Column fill */}
                                <div className="flex-1 h-full bg-indigo-500/10 border-l border-r border-indigo-500/15 flex items-center justify-center relative">
                                  <span className="text-[9px] font-mono text-indigo-500/60 font-bold">{idx + 1}</span>
                                </div>
                                {/* Gutter fill (except last item) */}
                                {idx < (parseInt(foundations.grid.breakpoints[previewBreakpoint].columns) || 4) - 1 && (
                                  <div 
                                    className="h-full bg-amber-500/10 border-l border-r border-dashed border-amber-500/20 shrink-0 flex items-center justify-center relative transition-all"
                                    style={{ width: foundations.grid.breakpoints[previewBreakpoint].gutter }}
                                  >
                                    <span className="absolute text-[7px] font-mono text-amber-600/70 scale-75 whitespace-nowrap">
                                      {foundations.grid.breakpoints[previewBreakpoint].gutter}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Right Margin Indicator */}
                          <div 
                            className="h-full bg-rose-100/40 border-l border-dashed border-rose-300 flex items-center justify-center shrink-0 relative transition-all"
                            style={{ width: foundations.grid.breakpoints[previewBreakpoint].margin }}
                          >
                            <div className="absolute rotate-90 text-[8px] font-mono text-rose-500 whitespace-nowrap font-bold">
                              M ({foundations.grid.breakpoints[previewBreakpoint].margin})
                            </div>
                          </div>

                        </div>

                        {/* Annotations/Labels Legend */}
                        <div className="flex flex-wrap items-center justify-center gap-4 text-[9px] font-mono mt-2 pt-2 border-t border-gray-200 text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 bg-rose-100 border border-rose-300 rounded-xs" />
                            <span>Margin</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 bg-indigo-50 border border-indigo-200 rounded-xs" />
                            <span>Column</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 bg-amber-50 border border-amber-200 border-dashed rounded-xs" />
                            <span>Gutter</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* CODES EXPORT AND TECHNICAL SPECIFICATION SECTION */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-700">
                      Foundations Code Exporter
                    </span>
                  </div>
                  
                  {/* Selector of code format */}
                  <div className="flex bg-gray-100 p-0.5 rounded-md border border-gray-200">
                    <button
                      onClick={() => setActiveExporter("css")}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono transition ${
                        activeExporter === "css" ? "bg-white text-gray-800 border border-gray-200/50 shadow-xs" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      CSS Variables
                    </button>
                    <button
                      onClick={() => setActiveExporter("tailwind")}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono transition ${
                        activeExporter === "tailwind" ? "bg-white text-gray-800 border border-gray-200/50 shadow-xs" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      Tailwind v4
                    </button>
                    <button
                      onClick={() => setActiveExporter("w3c")}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono transition ${
                        activeExporter === "w3c" ? "bg-white text-gray-800 border border-gray-200/50 shadow-xs" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      W3C JSON
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <pre className="p-3.5 text-[11px] font-mono text-gray-800 overflow-x-auto bg-gray-50 h-[280px] border-b border-gray-200">
                    <code>{getExporterCode()}</code>
                  </pre>
                  
                  {/* Action overlays */}
                  <div className="absolute right-4 bottom-4 flex items-center gap-2">
                    <button 
                      onClick={copyToClipboard}
                      className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-2.5 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                    <button 
                      onClick={downloadTokens}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: SUGGESTED IDEAS PRESENTATION (3 TO 5 IDEAS) */}
        {activeTab === "ideas" && (
          <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Implementation Concepts & Solution Proposals
              </h2>
              <p className="text-slate-400 text-xs max-w-2xl mx-auto">
                To match your role as a Senior Design System Designer, we propose 4 concrete solutions addressing technical complexity in defining and propagating design tokens.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Idea 1 Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-slate-700 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center shrink-0">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">IDEA 1</span>
                    <h3 className="text-base font-bold text-white">Interactive Token Sandbox with Live Preview</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Modify color semantics, sizing, and geometric corner curves in real-time with an intuitive builder, immediately rendering actual interactive components in a live sandbox.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-[11px] font-mono text-slate-500">Status: Implemented on tab 1</span>
                  <button 
                    onClick={() => { setActiveTab("builder"); setActiveBuilderSection("color"); }}
                    className="text-xs text-emerald-400 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    Try now
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Idea 2 Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-slate-700 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-lg flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-widest block">IDEA 2</span>
                    <h3 className="text-base font-bold text-white">AI Brand Moodboard to Token Sync</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Transform abstract branding concepts into a production-ready design token schema using Google Gemini. It parses natural language into a fully-fledged exportable design system foundation.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-[11px] font-mono text-slate-500">Status: Integrated with Gemini-3.5-Flash</span>
                  <button 
                    onClick={() => { setActiveTab("builder"); setActiveBuilderSection("color"); }}
                    className="text-xs text-teal-400 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    Try generator
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Idea 3 Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-slate-700 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center shrink-0">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">IDEA 3</span>
                    <h3 className="text-base font-bold text-white">Live Accessibility & WCAG Contrast Calculator</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  An automated, real-time contrast checker for key text-on-background pairings. It displays compliance with Web Content Accessibility Guidelines (WCAG 2.1) AA & AAA standards to ensure perfect contrast before deployment.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-[11px] font-mono text-slate-500">Status: Integrated with Real Relative Luminance</span>
                  <button 
                    onClick={() => { setActiveTab("builder"); setActiveBuilderSection("color"); }}
                    className="text-xs text-cyan-400 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    View contrast checks
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Idea 4 Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-slate-700 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-lg flex items-center justify-center shrink-0">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-widest block">IDEA 4</span>
                    <h3 className="text-base font-bold text-white">Multi-Format Token Export Engine</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  One of the biggest issues in product development is token format translation. This module instantly outputs pure CSS3 Custom Properties, the standard W3C Design Tokens JSON, and Tailwind CSS v4 custom theme extensions.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-[11px] font-mono text-slate-500">Status: Integrated with one-click clipboard copy</span>
                  <button 
                    onClick={() => { setActiveTab("builder"); }}
                    className="text-xs text-violet-400 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    View code export
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

            {/* Aesthetic Showcase of presets */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Aesthetic Concepts Showcase (Load Preset)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <div key={key} className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="font-bold text-xs text-white block">{preset.name}</span>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-3">{preset.description}</p>
                    </div>
                    
                    {/* Visual miniature */}
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full border border-slate-800" style={{ backgroundColor: preset.colors.primary.base }} />
                      <div className="w-4 h-4 rounded-full border border-slate-800" style={{ backgroundColor: preset.colors.accent.base }} />
                      <div className="w-4 h-4 rounded-full border border-slate-800" style={{ backgroundColor: preset.colors.background.default }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.colors.neutral.base, width: "16px", height: "16px" }} />
                    </div>

                    <button 
                      onClick={() => { loadPreset(key); setActiveTab("builder"); }}
                      className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-[11px] font-semibold py-1 px-2 rounded transition text-center cursor-pointer"
                    >
                      Load into Editor
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: THEORETICAL RESEARCH PANEL (SYSTEM DESIGN FOUNDATIONS) */}
        {activeTab === "research" && (
          <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
            <div className="space-y-2 border-b border-slate-800 pb-5">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block">Technical Foundations Research</span>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Which technical design foundations should be defined and why
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                As a senior designer or system architect, establishing design system foundations is not just about picking beautiful colors; it is about establishing logical rules, mathematical proportions, and technical boundaries that will guide the construction of hundreds of cohesive components.
              </p>
            </div>

            {/* Core foundations analysis */}
            <div className="space-y-6">
              
              {/* Foundation 1: Color */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">1. Color System</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A scalable color system must define not just the brand color, but also its semantic application. We must specify:
                </p>
                <ul className="text-xs text-slate-400 list-disc list-inside space-y-1.5 pl-2">
                  <li><strong className="text-slate-300">Brand Colors:</strong> Primary, Secondary, and Accent colors with their tone variations (Light, Base, Dark) for hover, focus, and active interactions.</li>
                  <li><strong className="text-slate-300">Surface Colors (Backgrounds):</strong> Default page backgrounds, elevated card surfaces, disabled panels.</li>
                  <li><strong className="text-slate-300">Accessible Contrast (WCAG Compliance):</strong> Certifying that critical text-on-background pairings satisfy legal contrast ratio requirements (AA {`>=`} 4.5:1 for normal text, AAA {`>=`} 7:1).</li>
                </ul>
              </div>

              {/* Foundation 2: Typography */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <Type className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">2. Typography Scale</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  To ensure vertical rhythm on-screen, it is essential to regulate the scale using mathematical multiplier factors rather than choosing random numbers:
                </p>
                <ul className="text-xs text-slate-400 list-disc list-inside space-y-1.5 pl-2">
                  <li><strong className="text-slate-300">Font Families:</strong> A highly expressive typeface for headings, a robust and readable typeface for body copy, and a technical monospace typeface for metadata.</li>
                  <li><strong className="text-slate-300">Modular Scale:</strong> Define progressions like Perfect Fourth (1.333), Major Third (1.25), or the Golden Ratio (1.618) to scale harmoniously from XS to 4XL.</li>
                  <li><strong className="text-slate-300">Adaptive Line Heights:</strong> 1.15 to 1.25 for large headings (avoiding overlaps), 1.5 for extensive paragraphs (guaranteeing legibility), and 1.4 for compact UI.</li>
                </ul>
              </div>

              {/* Foundation 3: Spacing Grid */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <Grid className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">3. Grid & Spacing Scale</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Empty space defines software clarity. The best practice for consistency between UI designers and frontenders is to implement a grid rule:
                </p>
                <ul className="text-xs text-slate-400 list-disc list-inside space-y-1.5 pl-2">
                  <li><strong className="text-slate-300">8-Point Grid (8pt Grid):</strong> All margin, padding, and container sizing must be a multiple of 8px (or its logical 4px subdivision for ultra-dense user interfaces).</li>
                  <li><strong className="text-slate-300">Consistent Geometric Scale:</strong> Scaling predictably as <code className="px-1 bg-black/40 text-emerald-400 rounded">4, 8, 12, 16, 24, 32, 48, 64px</code> to prevent developers from guessing margins and paddings.</li>
                </ul>
              </div>

              {/* Foundation 4: Shapes and Elevation */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <Square className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">4. Shape & Depth (Geometry & Elevation)</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Establishes the three-dimensional feel and tactile boundaries of interactive elements on screen:
                </p>
                <ul className="text-xs text-slate-400 list-disc list-inside space-y-1.5 pl-2">
                  <li><strong className="text-slate-300">Corner Curves (Border Radii):</strong> Small radii (2px-4px) convey technical rigor and precision; generous curves (12px-24px) convey friendliness, warmth, and consumer-focused elegance.</li>
                  <li><strong className="text-slate-300">Z-Axis & Shadows (Elevation):</strong> Defining 2 to 3 depth levels (Flat, Raised, Floating/Modals) using subtle opacities over specific background colors to prevent visual fatigue.</li>
                </ul>
              </div>

              {/* Foundation 5: Motion and Transition */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">5. Motion & Dynamic Transitions</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Transitions are the difference between a static website and a premium, ergonomic, and interactive product:
                </p>
                <ul className="text-xs text-slate-400 list-disc list-inside space-y-1.5 pl-2">
                  <li><strong className="text-slate-300">Ergonomic Timings (Durations):</strong> Animations for micro-interactions should last between <code className="px-1 bg-black/40 text-emerald-400 rounded">150ms and 250ms</code>. Full-screen page transitions should last between <code className="px-1 bg-black/40 text-emerald-400 rounded">300ms and 450ms</code> to keep the application feeling responsive and not sluggish.</li>
                  <li><strong className="text-slate-300">Non-Linear Acceleration Curves (Easings):</strong> Using cubic-bezier curves like <code className="px-1 bg-black/40 text-emerald-400 rounded">ease-out</code> for entering objects and <code className="px-1 bg-black/40 text-emerald-400 rounded">ease-in-out</code> for internal state mutations.</li>
                </ul>
              </div>

            </div>

            {/* Informational callout */}
            <div className="bg-emerald-950/30 border border-emerald-900 p-4 rounded-lg flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-emerald-200 block">Tip for Senior Designers:</span>
                <p className="text-xs text-emerald-400/80 mt-1">
                  When defining these foundations, export them in platform-agnostic formats (such as JSON) to feed your design files (Figma Variables) and your component libraries in React, iOS, or Android. This reduces design-to-code friction to zero.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER BAR */}
      <footer className="border-t border-slate-800 bg-slate-900/40 py-4 px-6 text-center flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          <span>Design System Foundations Builder — Built with technical rigor for modular UI architectures</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-mono">✔ Ready for Production</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 font-mono">Port: 3000</span>
        </div>
      </footer>
    </div>
  );
}
