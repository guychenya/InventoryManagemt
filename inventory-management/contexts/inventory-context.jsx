"use client"

import { createContext, useContext, useEffect, useState } from "react"

const InventoryContext = createContext(undefined)

// Sample data
const sampleCategories = [
  { id: "1", name: "Electronics", description: "Electronic devices and components" },
  { id: "2", name: "Clothing", description: "Apparel and accessories" },
  { id: "3", name: "Books", description: "Books and publications" },
  { id: "4", name: "Home & Garden", description: "Home improvement and gardening supplies" },
  { id: "5", name: "Sports", description: "Sports equipment and accessories" },
]

const sampleSuppliers = [
  {
    id: "1",
    name: "TechCorp Inc.",
    contact: "John Smith",
    email: "john@techcorp.com",
    phone: "+1-555-0101",
    address: "123 Tech Street, Silicon Valley, CA",
  },
  {
    id: "2",
    name: "Fashion Forward",
    contact: "Sarah Johnson",
    email: "sarah@fashionforward.com",
    phone: "+1-555-0102",
    address: "456 Fashion Ave, New York, NY",
  },
  {
    id: "3",
    name: "BookWorld",
    contact: "Mike Wilson",
    email: "mike@bookworld.com",
    phone: "+1-555-0103",
    address: "789 Library Lane, Boston, MA",
  },
  {
    id: "4",
    name: "Garden Plus",
    contact: "Lisa Brown",
    email: "lisa@gardenplus.com",
    phone: "+1-555-0104",
    address: "321 Green Street, Portland, OR",
  },
  {
    id: "5",
    name: "SportZone",
    contact: "David Lee",
    email: "david@sportzone.com",
    phone: "+1-555-0105",
    address: "654 Athletic Blvd, Denver, CO",
  },
]

const sampleProducts = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    sku: "WBH-001",
    categoryId: "1",
    supplierId: "1",
    price: 99.99,
    stock: 45,
    minStock: 10,
    location: "A1-B2",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Cotton T-Shirt",
    description: "100% organic cotton t-shirt, available in multiple colors",
    sku: "CTS-001",
    categoryId: "2",
    supplierId: "2",
    price: 24.99,
    stock: 8,
    minStock: 15,
    location: "B2-C3",
    createdAt: "2024-01-16T11:00:00Z",
    updatedAt: "2024-01-16T11:00:00Z",
  },
  {
    id: "3",
    name: "JavaScript Programming Guide",
    description: "Comprehensive guide to modern JavaScript development",
    sku: "JSG-001",
    categoryId: "3",
    supplierId: "3",
    price: 39.99,
    stock: 0,
    minStock: 5,
    location: "C3-D4",
    createdAt: "2024-01-17T12:00:00Z",
    updatedAt: "2024-01-17T12:00:00Z",
  },
  {
    id: "4",
    name: "Garden Hose 50ft",
    description: "Durable 50-foot garden hose with spray nozzle",
    sku: "GH-050",
    categoryId: "4",
    supplierId: "4",
    price: 34.99,
    stock: 22,
    minStock: 8,
    location: "D4-E5",
    createdAt: "2024-01-18T13:00:00Z",
    updatedAt: "2024-01-18T13:00:00Z",
  },
  {
    id: "5",
    name: "Basketball",
    description: "Official size basketball for indoor and outdoor use",
    sku: "BB-001",
    categoryId: "5",
    supplierId: "5",
    price: 29.99,
    stock: 3,
    minStock: 10,
    location: "E5-F6",
    createdAt: "2024-01-19T14:00:00Z",
    updatedAt: "2024-01-19T14:00:00Z",
  },
  {
    id: "6",
    name: "Smartphone Case",
    description: "Protective case for latest smartphone models",
    sku: "SPC-001",
    categoryId: "1",
    supplierId: "1",
    price: 19.99,
    stock: 67,
    minStock: 20,
    location: "A1-B1",
    createdAt: "2024-01-20T15:00:00Z",
    updatedAt: "2024-01-20T15:00:00Z",
  },
]

const sampleMovements = [
  {
    id: "1",
    productId: "1",
    type: "in",
    quantity: 50,
    reason: "Purchase",
    notes: "Initial stock purchase",
    date: "2024-01-15T10:30:00Z",
    userId: "user1",
  },
  {
    id: "2",
    productId: "1",
    type: "out",
    quantity: 5,
    reason: "Sale",
    notes: "Sold to customer",
    date: "2024-01-16T14:20:00Z",
    userId: "user1",
  },
  {
    id: "3",
    productId: "2",
    type: "in",
    quantity: 25,
    reason: "Purchase",
    notes: "Restocking popular item",
    date: "2024-01-16T11:30:00Z",
    userId: "user1",
  },
  {
    id: "4",
    productId: "2",
    type: "out",
    quantity: 17,
    reason: "Sale",
    notes: "Bulk order",
    date: "2024-01-17T16:45:00Z",
    userId: "user1",
  },
  {
    id: "5",
    productId: "3",
    type: "in",
    quantity: 15,
    reason: "Purchase",
    notes: "New edition arrival",
    date: "2024-01-17T12:30:00Z",
    userId: "user1",
  },
  {
    id: "6",
    productId: "3",
    type: "out",
    quantity: 15,
    reason: "Sale",
    notes: "All copies sold out",
    date: "2024-01-18T18:00:00Z",
    userId: "user1",
  },
]

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [movements, setMovements] = useState([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("inventory-products")
    const savedCategories = localStorage.getItem("inventory-categories")
    const savedSuppliers = localStorage.getItem("inventory-suppliers")
    const savedMovements = localStorage.getItem("inventory-movements")

    setProducts(savedProducts ? JSON.parse(savedProducts) : sampleProducts)
    setCategories(savedCategories ? JSON.parse(savedCategories) : sampleCategories)
    setSuppliers(savedSuppliers ? JSON.parse(savedSuppliers) : sampleSuppliers)
    setMovements(savedMovements ? JSON.parse(savedMovements) : sampleMovements)
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("inventory-products", JSON.stringify(products))
    }
  }, [products])

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("inventory-categories", JSON.stringify(categories))
    }
  }, [categories])

  useEffect(() => {
    if (suppliers.length > 0) {
      localStorage.setItem("inventory-suppliers", JSON.stringify(suppliers))
    }
  }, [suppliers])

  useEffect(() => {
    if (movements.length > 0) {
      localStorage.setItem("inventory-movements", JSON.stringify(movements))
    }
  }, [movements])

  // Product functions
  const addProduct = (product) => {
    setProducts((prev) => [...prev, product])
  }

  const updateProduct = (updatedProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
  }

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  // Category functions
  const addCategory = (category) => {
    setCategories((prev) => [...prev, category])
  }

  const updateCategory = (updatedCategory) => {
    setCategories((prev) => prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)))
  }

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  // Supplier functions
  const addSupplier = (supplier) => {
    setSuppliers((prev) => [...prev, supplier])
  }

  const updateSupplier = (updatedSupplier) => {
    setSuppliers((prev) => prev.map((s) => (s.id === updatedSupplier.id ? updatedSupplier : s)))
  }

  const deleteSupplier = (id) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id))
  }

  // Movement functions
  const addMovement = (movement) => {
    setMovements((prev) => [...prev, movement])

    // Update product stock
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === movement.productId) {
          const newStock =
            movement.type === "in" ? product.stock + movement.quantity : product.stock - movement.quantity
          return { ...product, stock: Math.max(0, newStock), updatedAt: new Date().toISOString() }
        }
        return product
      }),
    )
  }

  const value = {
    products,
    categories,
    suppliers,
    movements,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addMovement,
  }

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}
