
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    localStorage.setItem(storageKey, defaultTheme);
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    // Remove todas as classes de tema
    root.classList.remove("light", "dark", "system-gradient");
    body.classList.remove("light", "dark", "system-gradient");

    if (theme === "system") {
      // Detecta se o sistema está em modo escuro ou claro
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      // Aplica tema personalizado com gradiente moderno
      root.classList.add("system-gradient");
      body.classList.add("system-gradient");
      
      // Adiciona classe dark se o sistema preferir modo escuro
      if (systemPrefersDark) {
        root.classList.add("dark");
        body.classList.add("dark");
      }

      // Listener para mudanças no tema do sistema
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          root.classList.add("dark");
          body.classList.add("dark");
        } else {
          root.classList.remove("dark");
          body.classList.remove("dark");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    // Aplica tema light ou dark
    root.classList.add(theme);
    body.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
