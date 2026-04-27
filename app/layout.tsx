import type { Metadata } from "next";
import { Neuton } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const neuton = Neuton({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Baby Adelina Trivia",
  description: "Daily photo trivia game for the grandparents",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={neuton.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
