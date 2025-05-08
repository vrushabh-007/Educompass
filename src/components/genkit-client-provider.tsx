"use client";
import type React from 'react';

// The GenkitClientProvider export from '@genkit-ai/next/client' seems to be unavailable
// in the current version of Genkit, or its usage pattern has changed.
// Since the application's flows are primarily invoked as Next.js Server Actions,
// a specific client-side Genkit context provider from the library might not be
// strictly necessary for these operations.
// This custom GenkitClientProvider will now simply render its children.
// If future Genkit client-side features (e.g., direct client-side flow execution
// or streaming not mediated by Server Actions) require a specific context,
// this implementation may need to be updated based on Genkit's documentation.
export function GenkitClientProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
