"use client";
import { GenkitClientProvider as Provider } from "@genkit-ai/next/client";

export function GenkitClientProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
