import './globals.css'

export const metadata = {
  title: 'Canteen Management System',
  description: 'A system to manage canteen orders and menus',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
