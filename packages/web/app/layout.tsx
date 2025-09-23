import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/component/ui/theme-provider";
import { WebVitals } from "@/component/ui/web-vitals";
import Nav from "@/component/nav";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function Layout(props: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Nav />
        <ThemeProvider>{props.children}</ThemeProvider>
        <WebVitals />
      </body>
    </html>
  );
}
