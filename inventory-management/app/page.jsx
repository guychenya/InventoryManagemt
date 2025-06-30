"use client"

import { useInventory } from "@/contexts/inventory-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Package, TrendingDown, TrendingUp, AlertTriangle, Eye, Plus } from "lucide-react"
import Link from "next/link"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function Dashboard() {
  const { products, movements, categories } = useInventory()

  // Calculate metrics
  const totalProducts = products.length
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)
  const lowStockProducts = products.filter((product) => product.stock <= product.minStock)
  const outOfStockProducts = products.filter((product) => product.stock === 0)

  // Recent movements (last 5)
  const recentMovements = movements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  // Category data for chart
  const categoryData = categories.map((category) => {
    const categoryProducts = products.filter((p) => p.categoryId === category.id)
    const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0)
    const totalValue = categoryProducts.reduce((sum, p) => sum + p.price * p.stock, 0)
    return {
      name: category.name,
      products: categoryProducts.length,
      stock: totalStock,
      value: totalValue,
    }
  })

  // Stock level distribution
  const stockLevelData = [
    { name: "In Stock", value: products.filter((p) => p.stock > p.minStock).length },
    { name: "Low Stock", value: lowStockProducts.length },
    { name: "Out of Stock", value: outOfStockProducts.length },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your inventory management system</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/products">
              <Eye className="mr-2 h-4 w-4" />
              View Products
            </Link>
          </Button>
          <Button asChild>
            <Link href="/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Items below minimum stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Items completely out of stock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Inventory by Category */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Stock levels and values across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                stock: {
                  label: "Stock",
                  color: "hsl(var(--chart-1))",
                },
                value: {
                  label: "Value",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="stock" fill="var(--color-stock)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Stock Level Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Stock Level Distribution</CardTitle>
            <CardDescription>Overview of stock status across all products</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Products",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockLevelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stockLevelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Stock Movements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
            <CardDescription>Latest inventory transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement) => {
                const product = products.find((p) => p.id === movement.productId)
                return (
                  <div key={movement.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-2 h-2 rounded-full ${movement.type === "in" ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <div>
                        <p className="text-sm font-medium">{product?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {movement.reason} • {new Date(movement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={movement.type === "in" ? "default" : "destructive"}>
                      {movement.type === "in" ? "+" : "-"}
                      {movement.quantity}
                    </Badge>
                  </div>
                )
              })}
              {recentMovements.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent movements</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Products that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                      {product.stock} / {product.minStock}
                    </Badge>
                  </div>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">All products are well stocked</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
