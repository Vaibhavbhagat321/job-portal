"use client";

import { Provider } from "react-redux";
import "./globals.css";
import store from "@/lib/redux/store";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={`antialiased h-screen w-screen`}>
          {children}
          <Toaster />
        </body>
      </html>
    </Provider>
  );
}
