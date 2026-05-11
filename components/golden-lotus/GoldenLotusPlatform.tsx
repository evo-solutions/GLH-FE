"use client";

import { useState } from "react";
import "./golden-lotus.css";
import { GoldenLotusToastProvider } from "./context/GoldenLotusToastContext";
import { GoldenLotusChrome } from "./layout/GoldenLotusChrome";
import { GoldenLotusAntd } from "./providers/GoldenLotusAntd";
import { GoldenLotusScreens } from "./screens/GoldenLotusScreens";
import type { ScreenId } from "./types";

export function GoldenLotusPlatform() {
  const [screen, setScreen] = useState<ScreenId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <GoldenLotusToastProvider>
      <GoldenLotusAntd>
      <div className="gl-root">
        <GoldenLotusChrome
          screen={screen}
          setScreen={setScreen}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        >
          <GoldenLotusScreens screen={screen} />
        </GoldenLotusChrome>
      </div>
      </GoldenLotusAntd>
    </GoldenLotusToastProvider>
  );
}
