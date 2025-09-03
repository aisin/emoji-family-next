"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      theme="system"
      richColors
      duration={1400}
      closeButton={false}
    />
  );
}

