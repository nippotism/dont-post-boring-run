import "./globals.css";
import { Cal_Sans, Crimson_Pro} from 'next/font/google';
import { ThemeProvider } from "@/components/ui/theme-provider";

const calsans = Cal_Sans({
    subsets: ['latin'],
    variable: '--font-calsans',
    weight: ['400'],
})

const crimson = Crimson_Pro({
    subsets: ['latin'],
    variable: '--font-crimson',
    weight: ['400', '600', '700'],
})




export const metadata = {
    title: 'DPBR',
    description: 'Create and share "not boring" strava activities.',
    icons: {
        icon: '/favicon/favicon.ico',
    },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}