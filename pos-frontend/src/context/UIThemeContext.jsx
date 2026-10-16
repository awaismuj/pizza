import React, { createContext, useContext, useState, useEffect } from "react";

const UIThemeContext = createContext();

export const UIThemeProvider = ({ children }) => {
  // Default to modern Tossdown UI, persist choice in localStorage
  const [uiMode, setUiMode] = useState(() => {
    return localStorage.getItem("genz_pos_ui_mode") || "modern";
  });

  const toggleUiMode = () => {
    setUiMode((prev) => {
      const next = prev === "modern" ? "classic" : "modern";
      localStorage.setItem("genz_pos_ui_mode", next);
      return next;
    });
  };

  const setMode = (mode) => {
    localStorage.setItem("genz_pos_ui_mode", mode);
    setUiMode(mode);
  };

  return (
    <UIThemeContext.Provider value={{ uiMode, isModern: uiMode === "modern", toggleUiMode, setMode }}>
      {children}
    </UIThemeContext.Provider>
  );
};

export const useUITheme = () => {
  const context = useContext(UIThemeContext);
  if (!context) {
    return { uiMode: "modern", isModern: true, toggleUiMode: () => {}, setMode: () => {} };
  }
  return context;
};
