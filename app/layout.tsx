import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { CursorManager } from "./cursor-manager";
import { TapAnimation } from "./tap-animation";

const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Baby Adelina Trivia",
  description: "Daily photo trivia game for the grandparents",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={playfair.className}>
        <Providers>
          <CursorManager />
          <TapAnimation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
