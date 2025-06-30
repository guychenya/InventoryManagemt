"use client"

import { useState } from "react"
import { useInventory } from "@/contexts/inventory-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, SettingsIcon } from "lucide-react"

export default function SettingsPage() {
  const {
    categories,
    suppliers,
    addCategory,
    updateCategory,
    deleteCategory,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  } = useInventory()
  const [categoryDialog, setCategoryDialog] = useState({
    open: false,
    mode: "add",
    data: { id: "", name: "", description: "" },
  })
  const [supplierDialog, setSupplierDialog] = useState({
    open: false,
    mode: "add",
    data: { id: "", name: "", contact: "", email: "", phone: "", address: "" },
  })

  const handleCategorySubmit = (e) => {
    e.preventDefault()
    if (categoryDialog.mode === "add") {
      addCategory({
        id: Date.now().toString(),
        name: categoryDialog.data.name,
        description: categoryDialog.data.description,
      })
    } else {
      updateCategory(categoryDialog.data)
    }
    setCategoryDialog({ open: false, mode: "add", data: { id: "", name: "", description: "" } })
  }

  const handleSupplierSubmit = (e) => {
    e.preventDefault()
    if (supplierDialog.mode === "add") {
      addSupplier({
        id: Date.now().toString(),
        name: supplierDialog.data.name,
        contact: supplierDialog.data.contact,
        email: supplierDialog.data.email,
        phone: supplierDialog.data.phone,
        address: supplierDialog.data.address,
      })
    } else {
      updateSupplier(supplierDialog.data)
    }
    setSupplierDialog({
      open: false,
      mode: "add",
      data: { id: "", name: "", contact: "", email: "", phone: "", address: "" },
    })
  }

  const openCategoryDialog = (mode, category) => {
    setCategoryDialog({
      open: true,
      mode,
      data: category || { id: "", name: "", description: "" },
    })
  }

  const openSupplierDialog = (mode, supplier) => {
    setSupplierDialog({
      open: true,
      mode,
      data: supplier || { id: "", name: "", contact: "", email: "", phone: "", address: "" },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <SettingsIcon className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage categories, suppliers, and system configuration</p>
        </div>
      </div>

      {/* Categories Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Manage product categories for better organization</CardDescription>
            </div>
            <Dialog
              open={categoryDialog.open}
              onOpenChange={(open) => setCategoryDialog((prev) => ({ ...prev, open }))}
            >
              <DialogTrigger asChild>
                <Button onClick={() => openCategoryDialog("add")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCategorySubmit}>
                  <DialogHeader>
                    <DialogTitle>{categoryDialog.mode === "add" ? "Add New Category" : "Edit Category"}</DialogTitle>
                    <DialogDescription>
                      {categoryDialog.mode === "add"
                        ? "Create a new product category"
                        : "Update the category information"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="category-name">Category Name *</Label>
                      <Input
                        id="category-name"
                        value={categoryDialog.data.name}
                        onChange={(e) =>
                          setCategoryDialog((prev) => ({
                            ...prev,
                            data: { ...prev.data, name: e.target.value },
                          }))
                        }
                        placeholder="Enter category name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-description">Description</Label>
                      <Textarea
                        id="category-description"
                        value={categoryDialog.data.description}
                        onChange={(e) =>
                          setCategoryDialog((prev) => ({
                            ...prev,
                            data: { ...prev.data, description: e.target.value },
                          }))
                        }
                        placeholder="Enter category description"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCategoryDialog((prev) => ({ ...prev, open: false }))}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">{categoryDialog.mode === "add" ? "Add Category" : "Update Category"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openCategoryDialog("edit", category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the category "{category.name}
                                " and may affect associated products.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteCategory(category.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {categories.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No categories found. Add your first category to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Suppliers</CardTitle>
              <CardDescription>Manage your supplier information and contacts</CardDescription>
            </div>
            <Dialog
              open={supplierDialog.open}
              onOpenChange={(open) => setSupplierDialog((prev) => ({ ...prev, open }))}
            >
              <DialogTrigger asChild>
                <Button onClick={() => openSupplierDialog("add")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <form onSubmit={handleSupplierSubmit}>
                  <DialogHeader>
                    <DialogTitle>{supplierDialog.mode === "add" ? "Add New Supplier" : "Edit Supplier"}</DialogTitle>
                    <DialogDescription>
                      {supplierDialog.mode === "add"
                        ? "Create a new supplier record"
                        : "Update the supplier information"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="supplier-name">Company Name *</Label>
                        <Input
                          id="supplier-name"
                          value={supplierDialog.data.name}
                          onChange={(e) =>
                            setSupplierDialog((prev) => ({
                              ...prev,
                              data: { ...prev.data, name: e.target.value },
                            }))
                          }
                          placeholder="Enter company name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supplier-contact">Contact Person</Label>
                        <Input
                          id="supplier-contact"
                          value={supplierDialog.data.contact}
                          onChange={(e) =>
                            setSupplierDialog((prev) => ({
                              ...prev,
                              data: { ...prev.data, contact: e.target.value },
                            }))
                          }
                          placeholder="Enter contact person"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="supplier-email">Email</Label>
                        <Input
                          id="supplier-email"
                          type="email"
                          value={supplierDialog.data.email}
                          onChange={(e) =>
                            setSupplierDialog((prev) => ({
                              ...prev,
                              data: { ...prev.data, email: e.target.value },
                            }))
                          }
                          placeholder="Enter email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supplier-phone">Phone</Label>
                        <Input
                          id="supplier-phone"
                          value={supplierDialog.data.phone}
                          onChange={(e) =>
                            setSupplierDialog((prev) => ({
                              ...prev,
                              data: { ...prev.data, phone: e.target.value },
                            }))
                          }
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier-address">Address</Label>
                      <Textarea
                        id="supplier-address"
                        value={supplierDialog.data.address}
                        onChange={(e) =>
                          setSupplierDialog((prev) => ({
                            ...prev,
                            data: { ...prev.data, address: e.target.value },
                          }))
                        }
                        placeholder="Enter full address"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSupplierDialog((prev) => ({ ...prev, open: false }))}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">{supplierDialog.mode === "add" ? "Add Supplier" : "Update Supplier"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact || "-"}</TableCell>
                    <TableCell>{supplier.email || "-"}</TableCell>
                    <TableCell>{supplier.phone || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openSupplierDialog("edit", supplier)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the supplier "{supplier.name}
                                " and may affect associated products.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteSupplier(supplier.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {suppliers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No suppliers found. Add your first supplier to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
