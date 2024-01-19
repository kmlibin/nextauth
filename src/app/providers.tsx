"use client";

import { NextUIProvider } from "@nextui-org/react";
//how we get information about whether or not the user is signed in, so we can access in client components
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}
export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </SessionProvider>
  );
}
