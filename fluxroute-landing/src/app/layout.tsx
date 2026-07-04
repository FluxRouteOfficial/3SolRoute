import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { StructuredData } from "@/components/StructuredData";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fluxroute.xyz";

export const metadata: Metadata = {
  title: "FluxRoute - MCP Routing for Solana Payments",
  description:
    "A Solana-native AI microservice routing layer. Connect your agent once and pay per call in SOL or USDC-SPL.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "FluxRoute - MCP Routing for Solana Payments",
    description:
      "A Solana-native AI microservice routing layer. Connect your agent once and pay per call in SOL or USDC-SPL.",
    url: siteUrl,
    siteName: "FluxRoute",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "FluxRoute" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FluxRoute - MCP Routing for Solana Payments",
    description:
      "A Solana-native AI microservice routing layer. Connect your agent once and pay per call in SOL or USDC-SPL.",
    site: "@FluxRoutexyz",
    creator: "@FluxRoutexyz",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#12100d" },
  ],
};

/**
 * Applied before paint to prevent a flash of the wrong theme.
 * Honours an explicit user choice in localStorage, otherwise defaults to light.
 */
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('fluxroute-theme');
    var dark = stored === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only rounded-md focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-contrast"
        >
          Skip to content
        </a>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
