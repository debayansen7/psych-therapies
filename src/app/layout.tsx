import type { Metadata, Viewport } from "next";
import "@fontsource-variable/sora";
import "anexui/styles";
import "./globals.css";
import { site } from "@/content";

export const metadata: Metadata = {
  title: {
    default: `${site.practice.name} | Clinical Psychologists in Loughborough, Nottingham and Online`,
    template: `%s | ${site.practice.name}`,
  },
  description: site.practice.description,
  openGraph: {
    title: site.practice.name,
    description: site.practice.description,
    locale: "en_GB",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fff8f6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
