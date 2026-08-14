import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yvanzi.com"),
  title: "圆子 · AI Product Manager",
  description: "圆子的 AI 产品经理作品集：产品项目、AI 实验与行业思考。",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "圆子 · AI Product Manager",
    description: "产品项目、AI 实验与行业思考。",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "圆子 · AI Product Manager" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
