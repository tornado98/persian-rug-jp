import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

// Load Japanese font with specific weights and swap strategy
const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp", // Maps to the CSS variable we defined
  display: "swap",
});

export const metadata: Metadata = {
  title: "ペルシャ絨毯専門店 | PersianRugJP",
  description: "イラン直輸入の手織り絨毯。最高級のペルシャ絨毯をオンラインで。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} font-sans bg-primary-50 text-accent-dark antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
