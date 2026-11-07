import type { Metadata, Viewport } from "next"
import { Manrope, Unbounded } from "next/font/google"

import { Providers } from "@/components/site/providers"
import "./globals.css"

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
})

const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "KURS Barbershop — круті укладки, рівні стрижки | Київ",
  description:
    "Барбершоп KURS у Києві: чоловічі, подовжені та дитячі стрижки, стрижка бороди, камуфлювання сивини. Онлайн-запис до барбера.",
}

export const viewport: Viewport = {
  themeColor: "#151311",
  colorScheme: "dark",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uk"
      className={`dark ${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="grain flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Перейти до змісту
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
