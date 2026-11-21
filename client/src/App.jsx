
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  useEffect(() => {
    const applyTheme = () => {
      const savedTheme = localStorage.getItem("trackwise_theme") || "system";

      const darkMode =
        savedTheme === "dark" ||
        (savedTheme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      document.documentElement.setAttribute(
        "data-theme",
        darkMode ? "dark" : "light"
      );
    };

    applyTheme();

    const handleThemeChange = () => applyTheme();

    window.addEventListener("trackwise-theme-change", handleThemeChange);

    return () => {
      window.removeEventListener("trackwise-theme-change", handleThemeChange);
    };
  }, []);

  return <AppRoutes />;
}

export default App;
