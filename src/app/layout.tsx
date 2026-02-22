import type { Metadata, Viewport } from "next";
import Header, { HEADER_HEIGHT } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "배부룩",
  description: "배부룩 - 맛집 추천 서비스",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="safe-area-x min-h-screen bg-gray-50">
        <Header />
        <main
          className="max-w-[900px] mx-auto px-4"
          style={{ paddingTop: HEADER_HEIGHT }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
