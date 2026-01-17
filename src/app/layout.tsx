import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Bodoni_Moda, Inter, Vazirmatn } from "next/font/google";
import "./globals.css";

// Heading Font
const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
});

// Normal UI Font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
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

    icons: {
      icon: [
        {
          url: "/favicon-light.ico", // black icon
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/favicon-dark.ico", // white icon
          media: "(prefers-color-scheme: dark)",
        },
      ],
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
      <body
        className={`${inter.className} ${bodoniModa.variable} ${vazirmatn.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            gap={10}
            toastOptions={{
              classNames: {
                toast: "!rounded-[0px]",
                title: "!text-[15px]/4.75 font-medium",
                description:
                  "!text-neutral-700 dark:!text-white !text-[14px]/4.25",
                actionButton: "!rounded-[3px]",
                success:
                  "dark:!bg-green-600/50 !bg-green-200/50 backdrop-blur-xl  !border-green-300",
                info: "dark:!bg-blue-600/50 !bg-blue-200/50 backdrop-blur-xl !border-blue-300 dark:!text-blue-300",
                warning:
                  "dark:!bg-orange-600/50 !bg-orange-200/50 backdrop-blur-xl   !border-orange-300 !text-orange-500 dark:!text-orange-300",
                error:
                  "dark:!bg-red-600/50 !bg-red-200/50 backdrop-blur-xl   !border-red-300 ",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
