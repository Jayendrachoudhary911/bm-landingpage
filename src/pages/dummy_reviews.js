import React, { useMemo, useRef, useState } from "react";

export default function ColorPaletteManager() {
  const [colors, setColors] = useState([
    { name: "Royal Blue", hex: "#3B82F6", format: "HEX" },
    { name: "Emerald", hex: "#10B981", format: "HEX" },
    { name: "Amber Gold", hex: "#F59E0B", format: "HEX" },
  ]);

  const [pickerColor, setPickerColor] = useState("#6366F1");
  const [pickerName, setPickerName] = useState("");
  const [hexInput, setHexInput] = useState("");
  const [manualName, setManualName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const fileInputRef = useRef(null);

  // Normalize and validate 3-digit or 6-digit HEX values
  const validateHex = (hex) => {
    let cleanHex = hex.trim().replace(/^#/, "");

    if (/^[0-9A-Fa-f]{3}$/.test(cleanHex)) {
      cleanHex = cleanHex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    return /^[0-9A-Fa-f]{6}$/.test(cleanHex)
      ? `#${cleanHex.toUpperCase()}`
      : null;
  };

  // Convert HEX to RGB
  const hexToRgb = (hex) => {
    const cleanHex = hex.replace("#", "");

    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16),
    };
  };

  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const difference = max - min;

      s =
        l > 0.5
          ? difference / (2 - max - min)
          : difference / (max + min);

      switch (max) {
        case r:
          h = (g - b) / difference + (g < b ? 6 : 0);
          break;

        case g:
          h = (b - r) / difference + 2;
          break;

        default:
          h = (r - g) / difference + 4;
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

  // Generate supported color formats
  const getColorFormats = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);

    return {
      HEX: hex,
      RGB: `rgb(${r}, ${g}, ${b})`,
      RGBA: `rgba(${r}, ${g}, ${b}, 1)`,
      HSL: `hsl(${h}, ${s}%, ${l}%)`,
    };
  };

  // Determine readable text color
  const getContrastColor = (hex) => {
    const { r, g, b } = hexToRgb(hex);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 155 ? "#111111" : "#FFFFFF";
  };

  const handleAddFromPicker = () => {
    const formatted = validateHex(pickerColor);

    if (!formatted) return;

    const name = pickerName.trim() || `Color ${colors.length + 1}`;

    setColors((previous) => [
      ...previous,
      {
        name,
        hex: formatted,
        format: "HEX",
      },
    ]);

    setPickerName("");
  };

  const handleAddManual = (event) => {
    event.preventDefault();

    setError("");

    const formatted = validateHex(hexInput);

    if (!formatted) {
      setError("Please enter a valid 3 or 6-character HEX code.");
      return;
    }

    const name = manualName.trim() || `Color ${colors.length + 1}`;

    setColors((previous) => [
      ...previous,
      {
        name,
        hex: formatted,
        format: "HEX",
      },
    ]);

    setHexInput("");
    setManualName("");
  };

  const handleFileUpload = (event) => {
    setError("");

    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".txt")) {
      setError("Please upload a standard .txt file.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (fileEvent) => {
      const content = fileEvent.target?.result;

      if (typeof content !== "string") return;

      const lines = content.split(/\r?\n/);
      const parsedColors = [];

      lines.forEach((line) => {
        const trimmedLine = line.trim();

        if (!trimmedLine) return;

        const hexMatch = trimmedLine.match(
          /(?:#)?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/
        );

        if (!hexMatch) return;

        const rawHex = hexMatch[0];
        const formattedHex = validateHex(rawHex);

        if (!formattedHex) return;

        let extractedName = trimmedLine
          .replace(rawHex, "")
          .replace(/^#/, "")
          .replace(/[:=\-,]/g, "")
          .trim();

        if (!extractedName) {
          extractedName = `Color ${
            colors.length + parsedColors.length + 1
          }`;
        }

        parsedColors.push({
          name: extractedName,
          hex: formattedHex,
          format: "HEX",
        });
      });

      if (parsedColors.length === 0) {
        setError("No valid HEX codes or color names found in the file.");
      } else {
        setColors((previous) => [...previous, ...parsedColors]);
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  const removeColor = (indexToRemove) => {
    setColors((previous) =>
      previous.filter((_, index) => index !== indexToRemove)
    );
  };

  const changeColorFormat = (index, format) => {
    setColors((previous) =>
      previous.map((color, colorIndex) =>
        colorIndex === index
          ? {
              ...color,
              format,
            }
          : color
      )
    );
  };

  const copyToClipboard = async (value, index) => {
    try {
      await navigator.clipboard.writeText(value);

      setCopiedIndex(index);

      window.setTimeout(() => {
        setCopiedIndex(null);
      }, 1500);
    } catch {
      setError("Unable to copy the color value.");
    }
  };

  // Search colors by name and all available color formats
  const filteredColors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return colors.map((color, index) => ({
        ...color,
        originalIndex: index,
      }));
    }

    return colors
      .map((color, index) => {
        const formats = getColorFormats(color.hex);

        const searchableText = [
          color.name,
          color.hex,
          formats.RGB,
          formats.RGBA,
          formats.HSL,
        ]
          .join(" ")
          .toLowerCase();

        return {
          ...color,
          originalIndex: index,
          searchableText,
        };
      })
      .filter((color) => color.searchableText.includes(query));
  }, [colors, searchQuery]);

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.heading}>Palette Studio</h1>

            <p style={styles.subHeading}>
              Build, search and manage your color palette.
            </p>
          </div>

          <span style={styles.countBadge}>
            {colors.length} {colors.length === 1 ? "Color" : "Colors"}
          </span>
        </div>

        {/* Controls */}
        <div style={styles.card}>
          <div style={styles.controlsGrid}>
            {/* Native Color Picker */}
            <div style={styles.controlGroup}>
              <label style={styles.label}>Picker & Name</label>

              <div style={styles.row}>
                <input
                  type="color"
                  value={pickerColor}
                  onChange={(event) => setPickerColor(event.target.value)}
                  style={styles.nativePicker}
                />

                <input
                  type="text"
                  placeholder="Color name (optional)"
                  value={pickerName}
                  onChange={(event) => setPickerName(event.target.value)}
                  style={styles.textInput}
                />

                <button
                  type="button"
                  onClick={handleAddFromPicker}
                  style={styles.primaryButton}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Manual HEX Input */}
            <div style={styles.controlGroup}>
              <label style={styles.label}>Manual HEX & Name</label>

              <form onSubmit={handleAddManual} style={styles.row}>
                <input
                  type="text"
                  placeholder="#3B82F6"
                  value={hexInput}
                  onChange={(event) => setHexInput(event.target.value)}
                  style={{
                    ...styles.textInput,
                    maxWidth: "135px",
                  }}
                />

                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={manualName}
                  onChange={(event) => setManualName(event.target.value)}
                  style={styles.textInput}
                />

                <button type="submit" style={styles.primaryButton}>
                  Add
                </button>
              </form>
            </div>

            {/* File Upload */}
            <div style={styles.controlGroup}>
              <label style={styles.label}>Import Colors</label>

              <input
                type="file"
                accept=".txt"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={styles.secondaryButton}
              >
                Upload .txt File
              </button>
            </div>
          </div>

          {error && <p style={styles.errorText}>{error}</p>}
        </div>

        {/* Palette Header and Search */}
        <div style={styles.paletteToolbar}>
          <div style={styles.paletteTitleGroup}>
            <span style={styles.paletteLabel}>Your Palette</span>

            <span style={styles.resultCount}>
              {searchQuery
                ? `${filteredColors.length} of ${colors.length}`
                : `${colors.length} total`}
            </span>
          </div>

          <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>⌕</span>

            <input
              type="text"
              placeholder="Search colors..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={styles.searchInput}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={styles.clearSearchButton}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Color Cards - Flex Layout */}
        {filteredColors.length > 0 ? (
          <div style={styles.colorsFlex}>
            {filteredColors.map((item) => {
              const formats = getColorFormats(item.hex);
              const activeFormat = item.format || "HEX";
              const displayValue = formats[activeFormat];
              const foreground = getContrastColor(item.hex);

              return (
                <div
                  key={`${item.hex}-${item.originalIndex}`}
                  className="palette-color-card"
                  style={{
                    ...styles.colorCard,
                    backgroundColor: item.hex,
                    color: foreground,
                  }}
                >
                  {/* Hover Overlay */}
                  <div
                    className="color-card-overlay"
                    style={styles.overlay}
                  />

                  {/* Top Actions */}
                  <div
                    className="color-card-actions"
                    style={styles.topActions}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          displayValue,
                          item.originalIndex
                        )
                      }
                      style={{
                        ...styles.iconButton,
                        color: foreground,
                        borderColor:
                          foreground === "#FFFFFF"
                            ? "rgba(255,255,255,0.28)"
                            : "rgba(0,0,0,0.18)",
                        backgroundColor:
                          foreground === "#FFFFFF"
                            ? "rgba(255,255,255,0.12)"
                            : "rgba(255,255,255,0.28)",
                      }}
                      title={`Copy ${activeFormat}`}
                    >
                      {copiedIndex === item.originalIndex ? "✓" : "⧉"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeColor(item.originalIndex)
                      }
                      style={{
                        ...styles.iconButton,
                        color: foreground,
                        borderColor:
                          foreground === "#FFFFFF"
                            ? "rgba(255,255,255,0.28)"
                            : "rgba(0,0,0,0.18)",
                        backgroundColor:
                          foreground === "#FFFFFF"
                            ? "rgba(255,255,255,0.12)"
                            : "rgba(255,255,255,0.28)",
                      }}
                      title="Remove color"
                    >
                      ×
                    </button>
                  </div>

                  {/* Bottom Details */}
                  <div
                    className="color-card-details"
                    style={styles.colorDetails}
                  >
                    <div style={styles.colorInfo}>
                      <div style={styles.colorName}>
                        {item.name}
                      </div>

                      <div style={styles.colorCode}>
                        {displayValue}
                      </div>
                    </div>

                    <div style={styles.formatSwitcher}>
                      {Object.keys(formats).map((format) => (
                        <button
                          key={format}
                          type="button"
                          onClick={() =>
                            changeColorFormat(
                              item.originalIndex,
                              format
                            )
                          }
                          style={{
                            ...styles.formatButton,
                            color: foreground,
                            backgroundColor:
                              activeFormat === format
                                ? foreground === "#FFFFFF"
                                  ? "rgba(255,255,255,0.22)"
                                  : "rgba(255,255,255,0.42)"
                                : "transparent",
                            borderColor:
                              activeFormat === format
                                ? foreground === "#FFFFFF"
                                  ? "rgba(255,255,255,0.4)"
                                  : "rgba(0,0,0,0.18)"
                                : "transparent",
                          }}
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>⌕</div>

            <h3 style={styles.emptyStateTitle}>
              No colors found
            </h3>

            <p style={styles.emptyStateText}>
              No colors match "{searchQuery}".
            </p>

            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={styles.emptyStateButton}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      <style>{`
        .palette-color-card {
          transition:
            transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 220ms ease,
            filter 220ms ease;
        }

        .palette-color-card:hover {
          transform: translateY(-4px);
          filter: saturate(1.04);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.28);
        }

        .color-card-actions,
        .color-card-details,
        .color-card-overlay {
          opacity: 0;
          transition:
            opacity 220ms ease,
            transform 220ms ease;
        }

        .color-card-actions {
          transform: translateY(-8px);
        }

        .color-card-details {
          transform: translateY(8px);
        }

        .palette-color-card:hover .color-card-actions,
        .palette-color-card:hover .color-card-details,
        .palette-color-card:hover .color-card-overlay {
          opacity: 1;
        }

        .palette-color-card:hover .color-card-actions,
        .palette-color-card:hover .color-card-details {
          transform: translateY(0);
        }

        @media (hover: none) {
          .color-card-actions,
          .color-card-details,
          .color-card-overlay {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .palette-toolbar {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0D0D0D",
    color: "#F5F5F5",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "32px 20px 60px",
    boxSizing: "border-box",
  },

  wrapper: {
    width: "100%",
    maxWidth: "1280px",
    margin: "0 auto",
  },

  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "28px",
  },

  heading: {
    margin: 0,
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: "750",
    letterSpacing: "-0.045em",
    lineHeight: 1.1,
  },

  subHeading: {
    margin: "8px 0 0",
    color: "#8C8C8C",
    fontSize: "14px",
  },

  countBadge: {
    flexShrink: 0,
    padding: "7px 12px",
    borderRadius: "999px",
    backgroundColor: "#181818",
    border: "1px solid #292929",
    color: "#A3A3A3",
    fontSize: "12px",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#151515",
    border: "1px solid #252525",
    borderRadius: "18px",
    padding: "22px",
    marginBottom: "36px",
  },

  controlsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    alignItems: "end",
  },

  controlGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  label: {
    fontSize: "12px",
    fontWeight: "650",
    color: "#969696",
    letterSpacing: "0.01em",
  },

  row: {
    display: "flex",
    gap: "8px",
    width: "100%",
  },

  nativePicker: {
    width: "46px",
    height: "42px",
    flexShrink: 0,
    padding: "4px",
    borderRadius: "10px",
    backgroundColor: "#202020",
    border: "1px solid #303030",
    cursor: "pointer",
  },

  textInput: {
    minWidth: 0,
    flex: 1,
    height: "42px",
    boxSizing: "border-box",
    padding: "0 12px",
    borderRadius: "10px",
    backgroundColor: "#1B1B1B",
    border: "1px solid #303030",
    color: "#FFFFFF",
    fontSize: "13px",
    outline: "none",
  },

  primaryButton: {
    height: "42px",
    padding: "0 15px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#F1F1F1",
    color: "#111111",
    fontSize: "13px",
    fontWeight: "650",
    cursor: "pointer",
    flexShrink: 0,
  },

  secondaryButton: {
    width: "100%",
    height: "42px",
    border: "1px solid #303030",
    borderRadius: "10px",
    backgroundColor: "#1B1B1B",
    color: "#D4D4D4",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  errorText: {
    margin: "16px 0 0",
    color: "#FF7878",
    fontSize: "13px",
  },

  paletteToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "18px",
  },

  paletteTitleGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },

  paletteLabel: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#E5E5E5",
  },

  resultCount: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#777777",
    backgroundColor: "#171717",
    border: "1px solid #272727",
    borderRadius: "999px",
    padding: "5px 9px",
  },

  searchWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: "360px",
    display: "flex",
    alignItems: "center",
  },

  searchIcon: {
    position: "absolute",
    left: "13px",
    color: "#777777",
    fontSize: "19px",
    pointerEvents: "none",
    lineHeight: 1,
  },

  searchInput: {
    width: "100%",
    height: "42px",
    boxSizing: "border-box",
    padding: "0 40px 0 38px",
    borderRadius: "12px",
    border: "1px solid #2D2D2D",
    backgroundColor: "#151515",
    color: "#FFFFFF",
    outline: "none",
    fontSize: "13px",
  },

  clearSearchButton: {
    position: "absolute",
    right: "8px",
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "transparent",
    color: "#888888",
    fontSize: "20px",
    lineHeight: 1,
    cursor: "pointer",
  },

  // Flexbox container instead of Grid
  colorsFlex: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "stretch",
    gap: "16px",
    width: "100%",
  },

  // Individual, separated cards
  colorCard: {
    position: "relative",
    minHeight: "260px",
    minWidth: "220px",
    flex: "1 1 240px",
    maxWidth: "calc(33.333% - 11px)",
    overflow: "hidden",
    isolation: "isolate",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "18px",
    boxSizing: "border-box",
    borderRadius: "18px",
    cursor: "default",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    zIndex: -1,
    pointerEvents: "none",
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.02) 45%, rgba(0,0,0,0.38) 100%)",
  },

  topActions: {
    position: "relative",
    display: "flex",
    justifyContent: "flex-end",
    gap: "7px",
    zIndex: 2,
  },

  iconButton: {
    width: "36px",
    height: "36px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    border: "1px solid",
    fontSize: "19px",
    fontWeight: "600",
    lineHeight: 1,
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  },

  colorDetails: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "14px",
    minWidth: 0,
  },

  colorInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4px",
    minWidth: 0,
    width: "100%",
  },

  colorName: {
    fontSize: "15px",
    fontWeight: "700",
    maxWidth: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  colorCode: {
    fontFamily:
      '"SF Mono", "Roboto Mono", Consolas, monospace',
    fontSize: "12px",
    fontWeight: "550",
    opacity: 0.85,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },

  formatSwitcher: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
  },

  formatButton: {
    border: "1px solid transparent",
    padding: "5px 7px",
    borderRadius: "7px",
    fontSize: "10px",
    fontWeight: "750",
    letterSpacing: "0.02em",
    cursor: "pointer",
    transition: "all 160ms ease",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  },

  emptyState: {
    minHeight: "280px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: "18px",
    border: "1px dashed #303030",
    backgroundColor: "#121212",
    padding: "30px",
  },

  emptyStateIcon: {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "14px",
    backgroundColor: "#1C1C1C",
    color: "#888888",
    fontSize: "25px",
    marginBottom: "14px",
  },

  emptyStateTitle: {
    margin: 0,
    fontSize: "16px",
    color: "#E5E5E5",
  },

  emptyStateText: {
    margin: "8px 0 16px",
    fontSize: "13px",
    color: "#777777",
  },

  emptyStateButton: {
    height: "36px",
    padding: "0 14px",
    border: "1px solid #303030",
    borderRadius: "9px",
    backgroundColor: "#1C1C1C",
    color: "#D5D5D5",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
};