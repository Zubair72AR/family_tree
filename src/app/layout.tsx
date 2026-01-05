import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Bodoni_Moda, Inter } from "next/font/google";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://familytree.ibnejan.com";

  return {
    title: {
      default: "Family Tree",
      template: "%s | Family Tree",
    },
    description:
      "A modern family tree website to create, manage, and share family relationships securely.",
    metadataBase: new URL(baseUrl),

    keywords: [
      "Family Tree",
      "Genealogy",
      "Family History",
      "Ancestry",
      "Family Records",
    ],

    authors: [{ name: "Zubair Ahmed", url: baseUrl }],
    creator: "Zubair Ahmed",
    robots: "index, follow",

    alternates: {
      canonical: baseUrl,
    },

    openGraph: {
      type: "website",
      siteName: "Family Tree",
      url: baseUrl,
      images: [
        {
          url: "/opengraph-image.jpg",
          width: 1200,
          height: 630,
          alt: "Family Tree Website",
        },
      ],
      locale: "en_US",
    },

    twitter: {
      card: "summary_large_image",
      title: "Family Tree",
      description:
        "Build and explore your family tree with a clean and secure platform.",
      images: ["/opengraph-image.jpg"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${bodoniModa.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
