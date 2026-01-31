import './globals.css'

export const metadata = {
  title: "George's Weekend | London Family Activities",
  description: "Weekly curated activities for George - dinosaurs, trains, tractors and more across London!",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦖</text></svg>",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-stone-950">{children}</body>
    </html>
  )
}
