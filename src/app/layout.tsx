import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./globals.css";
import dynamic from "next/dynamic";
import "@rainbow-me/rainbowkit/styles.css";
import Providers from "@/components/Providers";
import FooterAdmin from "@/components/Footers/FooterAdmin";
import Sidebar from "@/components/Sidebar/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EasyMoney",
  description: "Simplify bulk crypto payments for your organization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {" "}
          <Sidebar />
          <div className="relative md:ml-64 bg-blueGray-100">
            {/* Header */}
            {/* <div className="px-4 md:px-10 mx-auto w-full -m-24"> */}
            {children}
            <FooterAdmin />
            {/* </div> */}
          </div>
        </Providers>
      </body>
    </html>
  );
}
