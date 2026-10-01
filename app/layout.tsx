import type { Metadata } from "next";
import "./globals.css";
import {WebMcpTools} from "@/components/webmcp-tools";

export const metadata: Metadata = {
  metadataBase: new URL("https://duduwwl.github.io/grazzi-modas/"),
  title: "Grazzi Modas | Moda feminina em Lavras",
  description: "Conheça os looks da Grazzi Modas, loja de moda feminina em Lavras, Minas Gerais.",
  openGraph: {title:"Grazzi Modas | Moda feminina em Lavras",description:"Conheça os looks da Grazzi Modas, loja de moda feminina em Lavras, Minas Gerais.",type:"website",locale:"pt_BR"},
  icons: {
    icon: "/grazzi-modas/favicon.svg",
    shortcut: "/grazzi-modas/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head><link rel="stylesheet" href="/grazzi-modas/scroll-reveal.css" /></head>
      <body className="antialiased"><WebMcpTools/>{children}</body>
    </html>
  );
}
