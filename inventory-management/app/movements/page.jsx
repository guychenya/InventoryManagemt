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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, TrendingUp, TrendingDown, Package } from "lucide-react"

export default function MovementsPage() {
  const { products, movements, addMovement } = useInventory()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [formData, setFormData] = useState({
    productId: "",
    type: "in",
    quantity: "",
    reason: "",
    notes: "",
  })

  // Filter movements
  const filteredMovements = movements
    .filter((movement) => {
      const product = products.find((p) => p.id === movement.productId)
      const matchesSearch =
        product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.sku.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || movement.type === typeFilter
      return matchesSearch && matchesType
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleSubmit = (e) => {
    e.preventDefault()

    const movement = {
      id: Date.now().toString(),
      productId: formData.productId,
      type: formData.type,
      quantity: Number.parseInt(formData.quantity),
      reason: formData.reason,
      notes: formData.notes,
      date: new Date().toISOString(),
      userId: "current-user", // In a real app, this would come from auth
    }

    addMovement(movement)
    setFormData({
      productId: "",
      type: "in",
      quantity: "",
      reason: "",
      notes: "",
    })
    setIsDialogOpen(false)
  }

  const getProductName = (productId) => {
    return products.find((p) => p.id === productId)?.name || "Unknown Product"
  }

  const getProductSku = (productId) => {
    return products.find((p) => p.id === productId)?.sku || "Unknown SKU"
  }

  // Calculate totals
  const totalIn = movements.filter((m) => m.type === "in").reduce((sum, m) => sum + m.quantity, 0)
  const totalOut = movements.filter((m) => m.type === "out").reduce((sum, m) => sum + m.quantity, 0)
  const netMovement = totalIn - totalOut

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Movements</h1>
          <p className="text-muted-foreground">Track all inventory movements and transactions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Movement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Record Stock Movement</DialogTitle>
                <DialogDescription>Add a new stock in or stock out transaction</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product *</Label>
                  <Select
                    value={formData.productId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, productId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">Stock In</SelectItem>
                        <SelectItem value="out">Stock Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason *</Label>
                  <Select
                    value={formData.reason}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, reason: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.type === "in" ? (
                        <>
                          <SelectItem value="Purchase">Purchase</SelectItem>
                          <SelectItem value="Return">Return</SelectItem>
                          <SelectItem value="Adjustment">Adjustment</SelectItem>
                          <SelectItem value="Transfer In">Transfer In</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Sale">Sale</SelectItem>
                          <SelectItem value="Damage">Damage</SelectItem>
                          <SelectItem value="Loss">Loss</SelectItem>
                          <SelectItem value="Transfer Out">Transfer Out</SelectItem>
                          <SelectItem value="Adjustment">Adjustment</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional notes"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Movement</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock In</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{totalIn}</div>
            <p className="text-xs text-muted-foreground">Units added to inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Out</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-{totalOut}</div>
            <p className="text-xs text-muted-foreground">Units removed from inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Movement</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netMovement >= 0 ? "text-green-600" : "text-red-600"}`}>
              {netMovement >= 0 ? "+" : ""}
              {netMovement}
            </div>
            <p className="text-xs text-muted-foreground">Overall inventory change</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter movements by product or type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="in">Stock In</SelectItem>
                <SelectItem value="out">Stock Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Movements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Movement History</CardTitle>
          <CardDescription>{filteredMovements.length} movements found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      {new Date(movement.date).toLocaleDateString()} {new Date(movement.date).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{getProductName(movement.productId)}</div>
                        <div className="text-sm text-muted-foreground">{getProductSku(movement.productId)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={movement.type === "in" ? "default" : "destructive"}>
                        {movement.type === "in" ? "Stock In" : "Stock Out"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={movement.type === "in" ? "text-green-600" : "text-red-600"}>
                        {movement.type === "in" ? "+" : "-"}
                        {movement.quantity}
                      </span>
                    </TableCell>
                    <TableCell>{movement.reason}</TableCell>
                    <TableCell>{movement.notes || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredMovements.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No movements found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
