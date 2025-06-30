"use client"

import { useState } from "react"
import { useInventory } from "@/contexts/inventory-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"
import { Download, Calendar, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

export default function ReportsPage() {
  const { products, movements, categories } = useInventory()
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days ago
    to: new Date().toISOString().split("T")[0], // today
  })
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Filter movements by date range
  const filteredMovements = movements.filter((movement) => {
    const movementDate = new Date(movement.date).toISOString().split("T")[0]
    return movementDate >= dateRange.from && movementDate <= dateRange.to
  })

  // Calculate metrics
  const totalIn = filteredMovements.filter((m) => m.type === "in").reduce((sum, m) => sum + m.quantity, 0)
  const totalOut = filteredMovements.filter((m) => m.type === "out").reduce((sum, m) => sum + m.quantity, 0)
  const netMovement = totalIn - totalOut

  // Low stock products
  const lowStockProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory
    return matchesCategory && product.stock <= product.minStock
  })

  // Category breakdown
  const categoryBreakdown = categories.map((category) => {
    const categoryProducts = products.filter((p) => p.categoryId === category.id)
    const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0)
    const totalValue = categoryProducts.reduce((sum, p) => sum + p.price * p.stock, 0)
    const lowStock = categoryProducts.filter((p) => p.stock <= p.minStock).length

    return {
      name: category.name,
      products: categoryProducts.length,
      totalStock,
      totalValue,
      lowStock,
    }
  })

  // Daily movement trend (last 7 days)
  const dailyTrend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split("T")[0]
    const dayMovements = movements.filter((m) => m.date.split("T")[0] === dateStr)
    const stockIn = dayMovements.filter((m) => m.type === "in").reduce((sum, m) => sum + m.quantity, 0)
    const stockOut = dayMovements.filter((m) => m.type === "out").reduce((sum, m) => sum + m.quantity, 0)

    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      stockIn,
      stockOut,
      net: stockIn - stockOut,
    }
  }).reverse()

  const exportToCSV = () => {
    const headers = ["Product Name", "SKU", "Category", "Current Stock", "Min Stock", "Price", "Total Value", "Status"]
    const rows = products.map((product) => {
      const category = categories.find((c) => c.id === product.categoryId)?.name || "Unknown"
      const status = product.stock === 0 ? "Out of Stock" : product.stock <= product.minStock ? "Low Stock" : "In Stock"
      return [
        product.name,
        product.sku,
        category,
        product.stock,
        product.minStock,
        product.price,
        product.price * product.stock,
        status,
      ]
    })

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `inventory-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Analyze your inventory data and trends</p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Customize your report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="from-date">From Date</Label>
              <Input
                id="from-date"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-date">To Date</Label>
              <Input
                id="to-date"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movement Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock In</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{totalIn}</div>
            <p className="text-xs text-muted-foreground">Units added in selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Out</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-{totalOut}</div>
            <p className="text-xs text-muted-foreground">Units removed in selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Movement</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netMovement >= 0 ? "text-green-600" : "text-red-600"}`}>
              {netMovement >= 0 ? "+" : ""}
              {netMovement}
            </div>
            <p className="text-xs text-muted-foreground">Overall change in selected period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Daily Movement Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Movement Trend</CardTitle>
            <CardDescription>Stock in/out over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                stockIn: {
                  label: "Stock In",
                  color: "hsl(var(--chart-1))",
                },
                stockOut: {
                  label: "Stock Out",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrend}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="stockIn" stroke="var(--color-stockIn)" strokeWidth={2} />
                  <Line type="monotone" dataKey="stockOut" stroke="var(--color-stockOut)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Inventory value by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                totalValue: {
                  label: "Total Value",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBreakdown}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="totalValue" fill="var(--color-totalValue)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Summary</CardTitle>
          <CardDescription>Detailed breakdown by product category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total Stock</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Low Stock Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryBreakdown.map((category) => (
                  <TableRow key={category.name}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.products}</TableCell>
                    <TableCell>{category.totalStock}</TableCell>
                    <TableCell>${category.totalValue.toLocaleString()}</TableCell>
                    <TableCell>
                      {category.lowStock > 0 ? (
                        <Badge variant="secondary" className="text-yellow-600">
                          {category.lowStock}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Low Stock Products
          </CardTitle>
          <CardDescription>Products that need immediate attention ({lowStockProducts.length} items)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>
                      <span
                        className={product.stock === 0 ? "text-red-600 font-medium" : "text-yellow-600 font-medium"}
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>{product.minStock}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                        {product.stock === 0 ? "Out of Stock" : "Low Stock"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {lowStockProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">All products are well stocked!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
