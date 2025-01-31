import type { Metadata } from 'next'
 
import { Spline_Sans } from 'next/font/google'
import './globals.css'

const splieSans = Spline_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Gastos dos senadores brasileiros',
  description:
    'Visualizando os gastos dos senadores brasileiros através de gráficos.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={` ${splieSans.className} antialiased bg-slate-100 text-slate-500 min-h-screen `}
      >
        {children}
      </body>
    </html>
  )
}
