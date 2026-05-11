"use client";

import { Button } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useThemeContext } from "@/libs/theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <Button
      type="text"
      icon={isDark ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggleTheme}
      size="large"
    />
  );
}
