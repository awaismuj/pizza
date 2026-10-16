import React, { createContext, useContext, useState, useEffect } from "react";

const UIThemeContext = createContext();

export const UIThemeProvider = ({ children }) => {
  // Default to modern Tossdown UI, persist choice in localStorage
  const [uiMode, setUiMode] = useState(() => {
    return localStorage.getItem("genz_pos_ui_mode") || "modern";
  });

  // Default to "clean" (Toast / Tossdown high-contrast restaurant standard)
  const [colorTheme, setColorTheme] = useState(() => {
    return localStorage.getItem("genz_pos_color_theme") || "clean";
  });

  useEffect(() => {
    if (colorTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("theme-dark");
      document.body.classList.remove("theme-clean");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("theme-dark");
      document.body.classList.add("theme-clean");
    }
  }, [colorTheme]);

  const toggleUiMode = () => {
    setUiMode((prev) => {
      const next = prev === "modern" ? "classic" : "modern";
      localStorage.setItem("genz_pos_ui_mode", next);
      return next;
    });
  };

  const toggleColorTheme = () => {
    setColorTheme((prev) => {
      const next = prev === "clean" ? "dark" : "clean";
      localStorage.setItem("genz_pos_color_theme", next);
      return next;
    });
  };

  const setMode = (mode) => {
    localStorage.setItem("genz_pos_ui_mode", mode);
    setUiMode(mode);
  };

  const setTheme = (theme) => {
    localStorage.setItem("genz_pos_color_theme", theme);
    setColorTheme(theme);
  };

  return (
    <UIThemeContext.Provider
      value={{
        uiMode,
        isModern: uiMode === "modern",
        toggleUiMode,
        setMode,
        colorTheme,
        isClean: colorTheme === "clean",
        toggleColorTheme,
        setTheme,
      }}
    >
      {children}
    </UIThemeContext.Provider>
  );
};

export const useUITheme = () => {
  const context = useContext(UIThemeContext);
  if (!context) {
    return {
      uiMode: "modern",
      isModern: true,
      toggleUiMode: () => {},
      setMode: () => {},
      colorTheme: "clean",
      isClean: true,
      toggleColorTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
};

