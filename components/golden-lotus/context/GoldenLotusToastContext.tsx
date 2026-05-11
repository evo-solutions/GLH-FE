"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastCtx = {
  pushToast: (message: string, kind?: string) => void;
};

const GoldenLotusToastContext = createContext<ToastCtx | null>(null);

export function GoldenLotusToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<{ id: number; msg: string; kind: string }[]>(
    []
  );
  const toastId = useRef(0);

  const pushToast = useCallback((message: string, kind = "") => {
    const id = ++toastId.current;
    setToasts((x) => [...x, { id, msg: message, kind }]);
    setTimeout(() => {
      setToasts((x) => x.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  return (
    <GoldenLotusToastContext.Provider value={{ pushToast }}>
      {children}
      <div className="gl-toast-host" aria-live="polite">
        {toasts.map((x) => (
          <div key={x.id} className={`gl-toast ${x.kind}`}>
            {x.msg}
          </div>
        ))}
      </div>
    </GoldenLotusToastContext.Provider>
  );
}

export function useGoldenLotusToast() {
  const c = useContext(GoldenLotusToastContext);
  if (!c)
    throw new Error("useGoldenLotusToast must be used within GoldenLotusToastProvider");
  return c;
}
