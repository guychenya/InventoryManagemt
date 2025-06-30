import { Inter } from "next/font/google"
import "./globals.css"
import { InventoryProvider } from "@/contexts/inventory-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Inventory Management System",
  description: "Professional inventory management solution",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InventoryProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="flex items-center gap-2 px-4">
                  <h2 className="text-lg font-semibold">Inventory Management</h2>
                </div>
              </header>
              <main className="flex-1 p-4 pt-6">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </InventoryProvider>
      </body>
    </html>
  )
}
