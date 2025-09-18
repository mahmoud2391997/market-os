"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { 
  fetchCategories,
  fetchModifiers,
  fetchMenuItems,
  fetchItemModifiersByMenuItem,
  setCategoriesSearch,
  setModifiersSearch,
  selectCategories,
  selectModifiers,
  selectItemModifiers,
  selectCategoriesLoading,
  selectModifiersLoading,
  selectItemModifiersLoading,
  createCategory,
  addItemModifier,
  createMenuItem,
  createModifier,
} from "../store/slices/menuSlice"
import { AppDispatch } from "../store/index"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Plus, Search, Edit, Trash2, Eye, EyeOff, DollarSign, Package, TrendingUp, Settings, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Switch } from "../../components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "../../components/ui/use-toast"

// Form validation schemas
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0.01, "Price must be greater than 0"),
  cost: z.number().min(0, "Cost cannot be negative"),
  category_id: z.string().min(1, "Category is required"),
  available: z.boolean().default(true),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
})

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

const variantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["single", "multiple"]),
  is_required: z.boolean().default(false),
  max_selections: z.number().min(1).default(1),
  options: z.array(
    z.object({
      name: z.string().min(1, "Option name is required"),
      price_adjustment: z.number().default(0),
      is_available: z.boolean().default(true),
    })
  ).min(1, "At least one option is required")
  .superRefine((options, ctx) => {
    options.forEach((option, index) => {
      if (!option.name || option.name.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Option name is required",
          path: [index, "name"]
        });
      }
    });
  }),
});

type VariantFormData = z.infer<typeof variantSchema>;
type ProductFormData = z.infer<typeof productSchema>
type CategoryFormData = z.infer<typeof categorySchema>

// Mock data for market products
const mockCategories = [
  { _id: "CAT-001", name: "Groceries", description: "Fresh produce and food items" },
  { _id: "CAT-002", name: "Electronics", description: "Consumer electronics and gadgets" },
  { _id: "CAT-003", name: "Clothing", description: "Apparel and accessories" },
  { _id: "CAT-004", name: "Home & Garden", description: "Home improvement and garden supplies" },
  { _id: "CAT-005", name: "Health & Beauty", description: "Personal care and wellness products" },
];

const mockProducts = [
  {
    id: "PROD-001",
    name: "Organic Apples",
    description: "Fresh organic red apples, 1lb bag",
    price: 4.99,
    cost: 2.50,
    category_id: "CAT-001",
    available: true,
    popularity: 85,
    profit: 2.49,
    sku: "ORG-APL-001",
    barcode: "123456789012",
  },
  {
    id: "PROD-002",
    name: "Wireless Headphones",
    description: "Bluetooth wireless headphones with noise cancellation",
    price: 89.99,
    cost: 45.00,
    category_id: "CAT-002",
    available: true,
    popularity: 78,
    profit: 44.99,
    sku: "WH-BT-001",
    barcode: "234567890123",
  },
  {
    id: "PROD-003",
    name: "Cotton T-Shirt",
    description: "100% cotton crew neck t-shirt, various colors",
    price: 19.99,
    cost: 8.00,
    category_id: "CAT-003",
    available: true,
    popularity: 92,
    profit: 11.99,
    sku: "TSH-COT-001",
    barcode: "345678901234",
  },
  {
    id: "PROD-004",
    name: "Garden Hose",
    description: "50ft expandable garden hose with spray nozzle",
    price: 34.99,
    cost: 18.00,
    category_id: "CAT-004",
    available: false,
    popularity: 65,
    profit: 16.99,
    sku: "GH-EXP-001",
    barcode: "456789012345",
  },
];

const mockVariants = [
  {
    id: "VAR-001",
    product_ids: ["PROD-001", "PROD-003"],
    type: "single",
    name: "Size Options",
    price_adjustment: 0,
    is_required: true,
    max_selections: 1,
    options: [
      {
        id: "OPT-001",
        variant_id: "VAR-001",
        name: "Small",
        price_adjustment: 0,
        is_available: true,
      },
      {
        id: "OPT-002",
        variant_id: "VAR-001",
        name: "Medium",
        price_adjustment: 2.00,
        is_available: true,
      },
      {
        id: "OPT-003",
        variant_id: "VAR-001",
        name: "Large",
        price_adjustment: 4.00,
        is_available: true,
      },
    ],
  },
  {
    id: "VAR-002",
    product_ids: ["PROD-003"],
    type: "single",
    name: "Color Options",
    price_adjustment: 0,
    is_required: true,
    max_selections: 1,
    options: [
      {
        id: "OPT-004",
        variant_id: "VAR-002",
        name: "Red",
        price_adjustment: 0,
        is_available: true,
      },
      {
        id: "OPT-005",
        variant_id: "VAR-002",
        name: "Blue",
        price_adjustment: 0,
        is_available: true,
      },
      {
        id: "OPT-006",
        variant_id: "VAR-002",
        name: "Green",
        price_adjustment: 0,
        is_available: false,
      },
    ],
  },
];

export default function ProductManagement() {
  const dispatch = useDispatch<AppDispatch>()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("products")
  const [openProductDialog, setOpenProductDialog] = useState(false)
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
  const [openVariantDialog, setOpenVariantDialog] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Use mock data for preview
  const categories = mockCategories;
  const variants = mockVariants;
  const products = mockProducts;

  // Form hooks
  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      cost: 0,
      category_id: "",
      available: true,
      sku: "",
      barcode: "",
      weight: undefined,
      dimensions: "",
    }
  })

  const categoryForm = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    }
  })

  const variantForm = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "single",
      is_required: false,
      max_selections: 1,
      options: [{ name: "", price_adjustment: 0, is_available: true }],
    }
  })

  // Mock form submissions
  const onSubmitProduct = async (data: ProductFormData) => {
    setIsCreating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Product created successfully",
        variant: "default",
      })
      
      setOpenProductDialog(false)
      productForm.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const onSubmitCategory = async (data: CategoryFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Category created successfully",
        variant: "default",
      })
      setOpenCategoryDialog(false)
      categoryForm.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    }
  }

  const onSubmitVariant = async (data: VariantFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Product variant created successfully",
        variant: "default",
      })
      setOpenVariantDialog(false)
      variantForm.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create variant",
        variant: "destructive",
      })
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categories.find(cat => cat._id === product.category_id)?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalProducts = products.length
  const availableProducts = products.filter((product) => product.available).length
  const avgProfit = products.reduce((sum, product) => sum + product.profit, 0) / products.length
  const topPerformer = products.reduce((prev, current) => (prev.popularity > current.popularity ? prev : current))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your market products and pricing</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Product Settings
          </Button>
          
          <Dialog open={openProductDialog} onOpenChange={setOpenProductDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name*</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. Organic Apples" 
                      {...productForm.register("name")} 
                    />
                    {productForm.formState.errors.name && (
                      <p className="text-sm text-red-500">{productForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category_id">Category*</Label>
                    <Select 
                      onValueChange={(value) => productForm.setValue("category_id", value)}
                      value={productForm.watch("category_id")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {productForm.formState.errors.category_id && (
                      <p className="text-sm text-red-500">{productForm.formState.errors.category_id.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Product description" 
                    {...productForm.register("description")} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price*</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...productForm.register("price", { valueAsNumber: true })} 
                    />
                    {productForm.formState.errors.price && (
                      <p className="text-sm text-red-500">{productForm.formState.errors.price.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost</Label>
                    <Input 
                      id="cost" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...productForm.register("cost", { valueAsNumber: true })} 
                    />
                    {productForm.formState.errors.cost && (
                      <p className="text-sm text-red-500">{productForm.formState.errors.cost.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input 
                      id="sku" 
                      placeholder="Product SKU" 
                      {...productForm.register("sku")} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input 
                      id="barcode" 
                      placeholder="Product barcode" 
                      {...productForm.register("barcode")} 
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="available" 
                    checked={productForm.watch("available")} 
                    onCheckedChange={(checked) => productForm.setValue("available", checked)}
                  />
                  <Label htmlFor="available">
                    {productForm.watch("available") ? "Available" : "Unavailable"}
                  </Label>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setOpenProductDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Add Product"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">All products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            {availableProducts === totalProducts ? (
              <Eye className="h-4 w-4 text-green-500" />
            ) : (
              <EyeOff className="h-4 w-4 text-yellow-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableProducts}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((availableProducts / totalProducts) * 100)}% available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per product</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topPerformer.name}</div>
            <p className="text-xs text-muted-foreground">
              {topPerformer.popularity}% popularity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="products" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="analytics">Product Analytics</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Search ${activeTab}...`}
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Products</CardTitle>
                <Dialog open={openProductDialog} onOpenChange={setOpenProductDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const category = categories.find(cat => cat._id === product.category_id)
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {product.name}
                          </div>
                          {product.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {product.description}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>{category?.name || "Uncategorized"}</TableCell>
                        <TableCell>{product.sku || "-"}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>${product.cost.toFixed(2)}</TableCell>
                        <TableCell>${product.profit.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={product.available ? "default" : "secondary"}>
                            {product.available ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Product Categories</CardTitle>
                <Dialog open={openCategoryDialog} onOpenChange={setOpenCategoryDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-name">Category Name*</Label>
                        <Input 
                          id="category-name" 
                          placeholder="e.g. Electronics, Clothing, Groceries" 
                          {...categoryForm.register("name")} 
                        />
                        {categoryForm.formState.errors.name && (
                          <p className="text-sm text-red-500">{categoryForm.formState.errors.name.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category-description">Description</Label>
                        <Textarea 
                          id="category-description" 
                          placeholder="Category description" 
                          {...categoryForm.register("description")} 
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setOpenCategoryDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Add Category</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Card key={category._id} className="border-2 hover:border-primary/50 cursor-pointer">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {products.filter(product => product.category_id === category._id).length} products
                        </p>
                        {category.description && (
                          <p className="text-sm">{category.description}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Product Variants</CardTitle>
                <Dialog open={openVariantDialog} onOpenChange={setOpenVariantDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Variant
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New Product Variant</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={variantForm.handleSubmit(onSubmitVariant)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="variant-name">Variant Name*</Label>
                          <Input 
                            id="variant-name" 
                            placeholder="e.g. Size Options, Color Options" 
                            {...variantForm.register("name")} 
                          />
                          {variantForm.formState.errors.name && (
                            <p className="text-sm text-red-500">{variantForm.formState.errors.name.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="variant-type">Type*</Label>
                          <Select
                            onValueChange={(value) => variantForm.setValue("type", value as "single" | "multiple")}
                            defaultValue={variantForm.watch("type")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single Selection</SelectItem>
                              <SelectItem value="multiple">Multiple Selection</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="is_required" 
                            checked={variantForm.watch("is_required")} 
                            onCheckedChange={(checked) => variantForm.setValue("is_required", checked)}
                          />
                          <Label htmlFor="is_required">Required</Label>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="max_selections">Max Selections</Label>
                          <Input 
                            id="max_selections" 
                            type="number" 
                            min="1"
                            {...variantForm.register("max_selections", { valueAsNumber: true })} 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Options*</Label>
                        <div className="space-y-4">
                          {variantForm.watch("options")?.map((option, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 items-end">
                              <div className="space-y-2">
                                <Label>Option Name*</Label>
                                <Input
                                  placeholder="e.g. Small, Red, Cotton"
                                  {...variantForm.register(`options.${index}.name`, { required: true })}
                                />
                                {variantForm.formState.errors.options?.[index]?.name && (
                                  <p className="text-sm text-red-500">Option name is required</p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label>Price Adjustment</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  {...variantForm.register(`options.${index}.price_adjustment`, { 
                                    valueAsNumber: true,
                                    required: true 
                                  })}
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={variantForm.watch(`options.${index}.is_available`)}
                                  onCheckedChange={(checked) => 
                                    variantForm.setValue(`options.${index}.is_available`, checked)
                                  }
                                />
                                <Label>Available</Label>
                                {variantForm.watch("options").length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const options = [...variantForm.getValues().options]
                                      options.splice(index, 1)
                                      variantForm.setValue("options", options)
                                    }}
                                  >
                                    <X className="h-4 w-4 text-red-500" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              variantForm.setValue("options", [
                                ...variantForm.getValues().options,
                                { name: "", price_adjustment: 0, is_available: true },
                              ])
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                        {variantForm.formState.errors.options && (
                          <p className="text-sm text-red-500">
                            {variantForm.formState.errors.options.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setOpenVariantDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Add Variant</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell className="font-medium">
                        {variant.name}
                        <div className="text-sm text-muted-foreground">
                          Max {variant.max_selections} selection{variant.max_selections > 1 ? 's' : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {variant.type === 'single' ? 'Single' : 'Multiple'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {variant.is_required ? (
                          <Badge variant="default">Required</Badge>
                        ) : (
                          <Badge variant="outline">Optional</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {variant.options.map(option => (
                            <Badge 
                              key={option.id} 
                              variant={option.is_available ? "default" : "secondary"}
                              className="flex items-center gap-1"
                            >
                              {option.name}
                              {option.price_adjustment > 0 && (
                                <span>(+${option.price_adjustment.toFixed(2)})</span>
                              )}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {variant.product_ids.length} product{variant.product_ids.length !== 1 ? 's' : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}