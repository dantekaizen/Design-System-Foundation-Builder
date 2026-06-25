import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI with appropriate headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// JSON Schema for design system foundations response
const foundationsSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: "Descriptive name of this design system foundation, e.g., 'Retro Cyberpunk', 'Minimalist Slate'.",
    },
    description: {
      type: Type.STRING,
      description: "Brief explanation of the core aesthetic choices and rationale.",
    },
    colors: {
      type: Type.OBJECT,
      properties: {
        primary: {
          type: Type.OBJECT,
          properties: {
            base: { type: Type.STRING, description: "HEX color code for primary base" },
            light: { type: Type.STRING, description: "HEX color code for primary light highlight" },
            dark: { type: Type.STRING, description: "HEX color code for primary dark shading" },
            text: { type: Type.STRING, description: "HEX color code for text on primary background" },
          },
          required: ["base", "light", "dark", "text"],
        },
        secondary: {
          type: Type.OBJECT,
          properties: {
            base: { type: Type.STRING },
            light: { type: Type.STRING },
            dark: { type: Type.STRING },
            text: { type: Type.STRING },
          },
          required: ["base", "light", "dark", "text"],
        },
        accent: {
          type: Type.OBJECT,
          properties: {
            base: { type: Type.STRING },
            light: { type: Type.STRING },
            dark: { type: Type.STRING },
            text: { type: Type.STRING },
          },
          required: ["base", "light", "dark", "text"],
        },
        neutral: {
          type: Type.OBJECT,
          properties: {
            base: { type: Type.STRING, description: "Main text or dark slate color" },
            light: { type: Type.STRING, description: "Light gray or soft border color" },
            dark: { type: Type.STRING, description: "Deep background or dark grey color" },
            text: { type: Type.STRING, description: "Inverse neutral color (e.g. white)" },
          },
          required: ["base", "light", "dark", "text"],
        },
        background: {
          type: Type.OBJECT,
          properties: {
            default: { type: Type.STRING, description: "HEX code for main page background" },
            surface: { type: Type.STRING, description: "HEX code for cards/panels" },
            surfaceMuted: { type: Type.STRING, description: "HEX code for secondary subtle panels" },
          },
          required: ["default", "surface", "surfaceMuted"],
        },
        border: {
          type: Type.OBJECT,
          properties: {
            default: { type: Type.STRING, description: "HEX code for neutral borders" },
            focus: { type: Type.STRING, description: "HEX code for focus ring/active states" },
          },
          required: ["default", "focus"],
        },
      },
      required: ["primary", "secondary", "accent", "neutral", "background", "border"],
    },
    typography: {
      type: Type.OBJECT,
      properties: {
        fontFamily: {
          type: Type.OBJECT,
          properties: {
            headings: { type: Type.STRING, description: "Font name for headers, e.g., 'Space Grotesk', 'Playfair Display', 'Inter'" },
            body: { type: Type.STRING, description: "Font name for body text, e.g., 'Inter', 'system-ui'" },
            mono: { type: Type.STRING, description: "Font name for technical indicators or code, e.g., 'JetBrains Mono', 'Fira Code'" },
          },
          required: ["headings", "body", "mono"],
        },
        sizeScale: {
          type: Type.OBJECT,
          properties: {
            xs: { type: Type.STRING, description: "Font size in px or rem, e.g. '12px' or '0.75rem'" },
            sm: { type: Type.STRING },
            md: { type: Type.STRING, description: "Base font size" },
            lg: { type: Type.STRING },
            xl: { type: Type.STRING },
            xxl: { type: Type.STRING },
            xxxl: { type: Type.STRING },
          },
          required: ["xs", "sm", "md", "lg", "xl", "xxl", "xxxl"],
        },
        lineHeights: {
          type: Type.OBJECT,
          properties: {
            tight: { type: Type.STRING, description: "e.g., '1.2'" },
            normal: { type: Type.STRING, description: "e.g., '1.5'" },
            loose: { type: Type.STRING, description: "e.g., '1.75'" },
          },
          required: ["tight", "normal", "loose"],
        },
      },
      required: ["fontFamily", "sizeScale", "lineHeights"],
    },
    spacing: {
      type: Type.OBJECT,
      properties: {
        baseUnit: { type: Type.STRING, description: "Core grid unit, e.g., '4px' or '8px'" },
        scale: {
          type: Type.OBJECT,
          properties: {
            xs: { type: Type.STRING, description: "Spacing value, e.g. '4px'" },
            sm: { type: Type.STRING, description: "Spacing value, e.g. '8px'" },
            md: { type: Type.STRING, description: "Spacing value, e.g. '16px'" },
            lg: { type: Type.STRING, description: "Spacing value, e.g. '24px'" },
            xl: { type: Type.STRING, description: "Spacing value, e.g. '32px'" },
            xxl: { type: Type.STRING, description: "Spacing value, e.g. '48px'" },
            xxxl: { type: Type.STRING, description: "Spacing value, e.g. '64px'" },
          },
          required: ["xs", "sm", "md", "lg", "xl", "xxl", "xxxl"],
        },
      },
      required: ["baseUnit", "scale"],
    },
    shape: {
      type: Type.OBJECT,
      properties: {
        radius: {
          type: Type.OBJECT,
          properties: {
            none: { type: Type.STRING, description: "e.g., '0px'" },
            sm: { type: Type.STRING, description: "e.g., '4px'" },
            md: { type: Type.STRING, description: "e.g., '8px'" },
            lg: { type: Type.STRING, description: "e.g., '12px'" },
            xl: { type: Type.STRING, description: "e.g., '24px'" },
            full: { type: Type.STRING, description: "e.g., '9999px'" },
          },
          required: ["none", "sm", "md", "lg", "xl", "full"],
        },
        borderWidth: {
          type: Type.OBJECT,
          properties: {
            sm: { type: Type.STRING, description: "e.g., '1px'" },
            md: { type: Type.STRING, description: "e.g., '2px'" },
            lg: { type: Type.STRING, description: "e.g., '3px'" },
          },
          required: ["sm", "md", "lg"],
        },
      },
      required: ["radius", "borderWidth"],
    },
    elevation: {
      type: Type.OBJECT,
      properties: {
        sm: { type: Type.STRING, description: "box-shadow CSS value for subtle/flat depth" },
        md: { type: Type.STRING, description: "box-shadow CSS value for raised elements" },
        lg: { type: Type.STRING, description: "box-shadow CSS value for overlays/floating menus" },
      },
      required: ["sm", "md", "lg"],
    },
    motion: {
      type: Type.OBJECT,
      properties: {
        duration: {
          type: Type.OBJECT,
          properties: {
            instant: { type: Type.STRING, description: "e.g., '0ms'" },
            fast: { type: Type.STRING, description: "e.g., '150ms'" },
            normal: { type: Type.STRING, description: "e.g., '300ms'" },
            slow: { type: Type.STRING, description: "e.g., '500ms'" },
          },
          required: ["instant", "fast", "normal", "slow"],
        },
        easing: {
          type: Type.OBJECT,
          properties: {
            easeInOut: { type: Type.STRING, description: "e.g., 'cubic-bezier(0.4, 0, 0.2, 1)'" },
            easeOut: { type: Type.STRING, description: "e.g., 'cubic-bezier(0, 0, 0.2, 1)'" },
            easeIn: { type: Type.STRING, description: "e.g., 'cubic-bezier(0.4, 0, 1, 1)'" },
            linear: { type: Type.STRING, description: "e.g., 'linear'" },
          },
          required: ["easeInOut", "easeOut", "easeIn", "linear"],
        },
      },
      required: ["duration", "easing"],
    },
    grid: {
      type: Type.OBJECT,
      properties: {
        breakpoints: {
          type: Type.OBJECT,
          properties: {
            xs: {
              type: Type.OBJECT,
              properties: {
                width: { type: Type.STRING, description: "e.g., '480px'" },
                columns: { type: Type.STRING, description: "e.g., '4'" },
                gutter: { type: Type.STRING, description: "e.g., '12px'" },
                margin: { type: Type.STRING, description: "e.g., '16px'" },
              },
              required: ["width", "columns", "gutter", "margin"],
            },
            sm: {
              type: Type.OBJECT,
              properties: {
                width: { type: Type.STRING, description: "e.g., '640px'" },
                columns: { type: Type.STRING, description: "e.g., '8'" },
                gutter: { type: Type.STRING, description: "e.g., '16px'" },
                margin: { type: Type.STRING, description: "e.g., '24px'" },
              },
              required: ["width", "columns", "gutter", "margin"],
            },
            md: {
              type: Type.OBJECT,
              properties: {
                width: { type: Type.STRING, description: "e.g., '768px'" },
                columns: { type: Type.STRING, description: "e.g., '12'" },
                gutter: { type: Type.STRING, description: "e.g., '20px'" },
                margin: { type: Type.STRING, description: "e.g., '32px'" },
              },
              required: ["width", "columns", "gutter", "margin"],
            },
            lg: {
              type: Type.OBJECT,
              properties: {
                width: { type: Type.STRING, description: "e.g., '1024px'" },
                columns: { type: Type.STRING, description: "e.g., '12'" },
                gutter: { type: Type.STRING, description: "e.g., '24px'" },
                margin: { type: Type.STRING, description: "e.g., '40px'" },
              },
              required: ["width", "columns", "gutter", "margin"],
            },
            xl: {
              type: Type.OBJECT,
              properties: {
                width: { type: Type.STRING, description: "e.g., '1280px'" },
                columns: { type: Type.STRING, description: "e.g., '12'" },
                gutter: { type: Type.STRING, description: "e.g., '24px'" },
                margin: { type: Type.STRING, description: "e.g., '48px'" },
              },
              required: ["width", "columns", "gutter", "margin"],
            },
          },
          required: ["xs", "sm", "md", "lg", "xl"],
        },
      },
      required: ["breakpoints"],
    },
  },
  required: [
    "name",
    "description",
    "colors",
    "typography",
    "spacing",
    "shape",
    "elevation",
    "motion",
    "grid",
  ],
};

// POST endpoint to generate Design System Foundations via Gemini
app.post("/api/generate-foundations", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  // Gracefully handle missing API Key
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not configured or still set to placeholder.");
    return res.status(503).json({
      error: "Gemini API key is not configured yet. You can still customize the Design System manually or set your API key in settings.",
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a coherent, beautiful, professional design system foundations JSON based on this brand description or mood: "${prompt}".
Make sure the colors match the brand identity, contrast is excellent for accessibility (complying with WCAG AA as much as possible), and the fonts and radii reflect the specified mood.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: foundationsSchema,
        systemInstruction: "You are a professional design system engineer and visual designer. You produce beautiful, cohesive, modern design token specifications following Tailwind/W3C best practices. Ensure that the values you output are highly usable, modern HEX colors, reasonable typography scales, clean pixel values for spacing and shapes, and standard cubic-beziers.",
      },
    });

    const text = response.text || "{}";
    const foundationsData = JSON.parse(text);
    res.json(foundationsData);
  } catch (error: any) {
    console.error("Error generating design system with Gemini:", error);
    res.status(500).json({
      error: "Error generating foundations with AI. Please check if your API key is correct or try again. Details: " + (error.message || error),
    });
  }
});

// Start function to wrap express listen & Vite dev server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode with Vite dev middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode serving static built assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
