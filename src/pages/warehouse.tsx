"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  Package,
  AlertTriangle,
  CheckCircle,
  Users,
  Truck,
  Warehouse as WarehouseIcon,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Bell,
  Settings,
  Filter,
  RefreshCw,
} from "lucide-react"

interface WarehouseOrderItem {
  id: string
  productId: string
  name: string
  quantity: number
  variants?: Record<string, string>
  specialInstructions?: string
  status: "pending" | "picking" | "packed" | "shipped"
  estimatedTime?: number
  actualTime?: number
  startTime?: Date
  completionTime?: Date
  location: "aisle-a" | "aisle-b" | "aisle-c" | "storage" | "electronics" | "clothing"
}

interface WarehouseOrder {
  id: string
  orderNumber: string
  customerName?: string
  orderType: "pickup" | "delivery" | "shipping"
  items: WarehouseOrderItem[]
  priority: "low" | "normal" | "high" | "urgent"
  status: "new" | "acknowledged" | "picking" | "packed" | "shipped" | "delayed"
  orderTime: Date
  estimatedCompletionTime?: Date
  actualCompletionTime?: Date
  totalEstimatedTime: number
  elapsedTime: number
  isRushed: boolean
  specialNotes?: string
  shippingAddress?: string
}

interface WarehouseZone {
  id: string
  name: string
  type: "aisle-a" | "aisle-b" | "aisle-c" | "storage" | "electronics" | "clothing"
  activeOrders: number
  averageTime: number
  status: "active" | "busy" | "offline"
}

export default function WarehouseDisplaySystem() {
  const [orders, setOrders] = useState<WarehouseOrder[]>([])
  const [selectedZone, setSelectedZone] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("active")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Warehouse zones
  const zones: WarehouseZone[] = [
    { id: "aisle-a", name: "Aisle A", type: "aisle-a", activeOrders: 3, averageTime: 8, status: "busy" },
    { id: "aisle-b", name: "Aisle B", type: "aisle-b", activeOrders: 2, averageTime: 6, status: "active" },
    { id: "aisle-c", name: "Aisle C", type: "aisle-c", activeOrders: 1, averageTime: 7, status: "active" },
    { id: "storage", name: "Storage", type: "storage", activeOrders: 0, averageTime: 5, status: "active" },
    { id: "electronics", name: "Electronics", type: "electronics", activeOrders: 4, averageTime: 12, status: "busy" },
    { id: "clothing", name: "Clothing", type: "clothing", activeOrders: 2, averageTime: 9, status: "active" },
  ]

  // Mock orders data
  useEffect(() => {
    const mockOrders: WarehouseOrder[] = [
      {
        id: "ORD-001",
        orderNumber: "001",
        customerName: "John Smith",
        orderType: "delivery",
        items: [
          {
            id: "item-1",
            productId: "PROD-001",
            name: "Organic Apples",
            quantity: 3,
            variants: { Size: "Large", Type: "Red" },
            specialInstructions: "Select ripest ones",
            status: "picking",
            estimatedTime: 5,
            startTime: new Date(Date.now() - 3 * 60 * 1000),
            location: "aisle-a",
          },
          {
            id: "item-2",
            productId: "PROD-015",
            name: "Whole Wheat Bread",
            quantity: 2,
            status: "packed",
            estimatedTime: 3,
            completionTime: new Date(),
            location: "aisle-b",
          },
        ],
        priority: "normal",
        status: "picking",
        orderTime: new Date(Date.now() - 10 * 60 * 1000),
        totalEstimatedTime: 8,
        elapsedTime: 10,
        isRushed: false,
        shippingAddress: "123 Main St, City, State 12345",
      },
      {
        id: "ORD-002",
        orderNumber: "002",
        customerName: "Jane Doe",
        orderType: "pickup",
        items: [
          {
            id: "item-3",
            productId: "PROD-003",
            name: "Wireless Headphones",
            quantity: 1,
            variants: { Color: "Black", Model: "Pro" },
            status: "pending",
            estimatedTime: 10,
            location: "electronics",
          },
          {
            id: "item-4",
            productId: "PROD-020",
            name: "Phone Case",
            quantity: 1,
            status: "pending",
            estimatedTime: 5,
            location: "electronics",
          },
        ],
        priority: "high",
        status: "new",
        orderTime: new Date(Date.now() - 2 * 60 * 1000),
        totalEstimatedTime: 15,
        elapsedTime: 2,
        isRushed: false,
      },
      {
        id: "ORD-003",
        orderNumber: "003",
        customerName: "Mike Johnson",
        orderType: "shipping",
        items: [
          {
            id: "item-5",
            productId: "PROD-008",
            name: "Cotton T-Shirt",
            quantity: 2,
            variants: { Size: "Medium", Color: "Blue" },
            specialInstructions: "Check for defects",
            status: "picking",
            estimatedTime: 12,
            startTime: new Date(Date.now() - 15 * 60 * 1000),
            location: "clothing",
          },
        ],
        priority: "urgent",
        status: "delayed",
        orderTime: new Date(Date.now() - 25 * 60 * 1000),
        totalEstimatedTime: 12,
        elapsedTime: 25,
        isRushed: true,
        specialNotes: "Customer needs urgent delivery",
        shippingAddress: "456 Oak Ave, Another City, State 67890",
      },
    ]
    setOrders(mockOrders)
  }, [])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          elapsedTime: Math.floor((Date.now() - order.orderTime.getTime()) / (1000 * 60)),
        })),
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Filter orders based on selected filters
  const filteredOrders = orders.filter((order) => {
    const zoneMatch = selectedZone === "all" || order.items.some((item) => item.location === selectedZone)
    const statusMatch =
      selectedStatus === "active"
        ? ["new", "acknowledged", "picking"].includes(order.status)
        : selectedStatus === "packed"
          ? order.status === "packed"
          : selectedStatus === "shipped"
            ? ["shipped"].includes(order.status)
            : true

    return zoneMatch && statusMatch
  })

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: WarehouseOrder["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: newStatus }

          switch (newStatus) {
            case "acknowledged":
              console.log(`👁️ Order #${order.orderNumber} acknowledged`)
              break
            case "packed":
              updatedOrder.actualCompletionTime = new Date()
              console.log(`📦 Order #${order.orderNumber} packed!`)
              break
            case "shipped":
              console.log(`🚚 Order #${order.orderNumber} shipped to customer`)
              break
          }

          if (soundEnabled && ["packed", "shipped"].includes(newStatus)) {
            console.log("🔔 Order status notification sound")
          }

          return updatedOrder
        }
        return order
      }),
    )
  }

  // Update item status
  const updateItemStatus = (orderId: string, itemId: string, newStatus: WarehouseOrderItem["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((item) => {
            if (item.id === itemId) {
              const updatedItem = { ...item, status: newStatus }

              if (newStatus === "picking" && !item.startTime) {
                updatedItem.startTime = new Date()
                console.log(`📦 Started picking: ${item.name}`)
              } else if (newStatus === "packed") {
                updatedItem.completionTime = new Date()
                updatedItem.actualTime = item.startTime
                  ? Math.floor((Date.now() - item.startTime.getTime()) / (1000 * 60))
                  : undefined
                console.log(`✅ Item packed: ${item.name}`)

                if (soundEnabled) {
                  console.log("🔔 Item packed notification sound")
                }
              }
              return updatedItem
            }
            return item
          })

          const allItemsPacked = updatedItems.every((item) => item.status === "packed")
          const hasPickingItems = updatedItems.some((item) => item.status === "picking")

          let newOrderStatus = order.status
          if (allItemsPacked && order.status !== "packed") {
            newOrderStatus = "packed"
            console.log(`📦 Order #${order.orderNumber} is packed!`)

            if (soundEnabled) {
              console.log("🔔 Order complete notification sound")
            }
          } else if (hasPickingItems && order.status === "new") {
            newOrderStatus = "picking"
          }

          const updatedOrder = {
            ...order,
            items: updatedItems,
            status: newOrderStatus,
            actualCompletionTime: allItemsPacked ? new Date() : order.actualCompletionTime,
          }

          return updatedOrder
        }
        return order
      }),
    )
  }

  // Get priority color
  const getPriorityColor = (priority: string, isRushed: boolean) => {
    if (isRushed) return "bg-red-600"
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "normal":
        return "bg-blue-500"
      case "low":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-purple-500"
      case "acknowledged":
        return "bg-blue-500"
      case "picking":
        return "bg-yellow-500"
      case "packed":
        return "bg-green-500"
      case "shipped":
        return "bg-gray-500"
      case "delayed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Calculate progress percentage
  const getProgressPercentage = (order: WarehouseOrder) => {
    if (order.status === "shipped") return 100
    if (order.status === "packed") return 90
    if (order.totalEstimatedTime === 0) return 0
    return Math.min((order.elapsedTime / order.totalEstimatedTime) * 100, 85)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <WarehouseIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Warehouse Management System</h1>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {currentTime.toLocaleTimeString()}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
              Auto Refresh
            </Button>

            <Button
              variant={soundEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              <Bell className="h-4 w-4 mr-2" />
              Sound {soundEnabled ? "On" : "Off"}
            </Button>

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Warehouse Zones Overview */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {zones.map((zone) => (
            <Card
              key={zone.id}
              className={`cursor-pointer transition-all ${
                selectedZone === zone.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedZone(selectedZone === zone.id ? "all" : zone.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{zone.name}</h3>
                  <Badge
                    variant={
                      zone.status === "busy" ? "destructive" : zone.status === "active" ? "default" : "secondary"
                    }
                  >
                    {zone.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Active Orders:</span>
                    <span className="font-medium">{zone.activeOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Time:</span>
                    <span className="font-medium">{zone.averageTime}min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Orders</SelectItem>
              <SelectItem value="packed">Packed Orders</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="all">All Orders</SelectItem>
            </SelectContent>
          </Select>

          <Badge variant="outline">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredOrders.map((order) => (
          <Card
            key={order.id}
            className={`relative overflow-hidden border-l-4 ${getPriorityColor(order.priority, order.isRushed)} ${
              order.isRushed ? "animate-pulse" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">#{order.orderNumber}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {order.customerName || "Customer"}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {order.orderType}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <Badge className={`text-xs ${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
                  <Badge
                    variant={
                      order.priority === "urgent" || order.isRushed
                        ? "destructive"
                        : order.priority === "high"
                          ? "default"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {order.isRushed ? "RUSHED" : order.priority.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Timer and Progress */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {order.elapsedTime}min / {order.totalEstimatedTime}min
                    </span>
                  </div>
                  {order.elapsedTime > order.totalEstimatedTime && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      DELAYED
                    </Badge>
                  )}
                </div>
                <Progress
                  value={getProgressPercentage(order)}
                  className={`h-2 ${order.elapsedTime > order.totalEstimatedTime ? "bg-red-100" : "bg-gray-200"}`}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Order Items */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-3 transition-all ${
                      item.status === "picking"
                        ? "bg-yellow-50 border-yellow-200 shadow-md"
                        : item.status === "packed"
                          ? "bg-green-50 border-green-200 shadow-md"
                          : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {item.quantity}x {item.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {item.location}
                          </Badge>
                        </div>

                        {/* Variants */}
                        {item.variants && Object.keys(item.variants).length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {Object.entries(item.variants).map(([key, value]) => (
                              <Badge key={key} variant="secondary" className="text-xs">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Special Instructions */}
                        {item.specialInstructions && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                            <div className="flex items-center gap-1 text-yellow-800">
                              <Eye className="h-3 w-3" />
                              <span className="font-medium">Special Instructions:</span>
                            </div>
                            <p className="text-yellow-700 mt-1">{item.specialInstructions}</p>
                          </div>
                        )}
                      </div>

                      <Badge
                        className={`text-xs ml-2 ${
                          item.status === "packed"
                            ? "bg-green-500"
                            : item.status === "picking"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                        } text-white`}
                      >
                        {item.status}
                      </Badge>
                    </div>

                    {/* Item Actions */}
                    <div className="flex gap-2 mt-2">
                      {item.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          onClick={() => {
                            updateItemStatus(order.id, item.id, "picking")
                            console.log(`▶️ Started picking ${item.name} for Order #${order.orderNumber}`)
                          }}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start Picking
                        </Button>
                      )}

                      {item.status === "picking" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
                            onClick={() => {
                              updateItemStatus(order.id, item.id, "pending")
                              console.log(`⏸️ Paused picking ${item.name} for Order #${order.orderNumber}`)
                            }}
                          >
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 text-xs bg-green-600 hover:bg-green-700 transition-colors"
                            onClick={() => {
                              updateItemStatus(order.id, item.id, "packed")
                              console.log(`✅ ${item.name} is packed for Order #${order.orderNumber}`)
                            }}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark Packed
                          </Button>
                        </>
                      )}

                      {item.status === "packed" && (
                        <div className="flex gap-2 w-full">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              updateItemStatus(order.id, item.id, "picking")
                              console.log(`🔄 Reverted ${item.name} back to picking for Order #${order.orderNumber}`)
                            }}
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Undo
                          </Button>
                          <div className="flex-1 flex items-center justify-center bg-green-100 rounded text-green-800 text-xs font-medium">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ready to Ship
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timing Info */}
                    {item.estimatedTime && (
                      <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                        <span>Est: {item.estimatedTime}min</span>
                        {item.actualTime && <span>Actual: {item.actualTime}min</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Special Notes */}
              {order.specialNotes && (
                <div className="p-2 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center gap-1 text-red-800 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="font-medium">Special Notes:</span>
                  </div>
                  <p className="text-red-700 text-xs mt-1">{order.specialNotes}</p>
                </div>
              )}

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center gap-1 text-blue-800 text-xs">
                    <Truck className="h-3 w-3" />
                    <span className="font-medium">Shipping Address:</span>
                  </div>
                  <p className="text-blue-700 text-xs mt-1">{order.shippingAddress}</p>
                </div>
              )}

              {/* Order Actions */}
              <Separator />
              <div className="flex gap-2">
                {order.status === "new" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => updateOrderStatus(order.id, "acknowledged")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Acknowledge
                  </Button>
                )}

                {["acknowledged", "picking"].includes(order.status) && (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => updateOrderStatus(order.id, "packed")}
                    disabled={!order.items.every((item) => item.status === "packed")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Order
                  </Button>
                )}

                {order.status === "packed" && (
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => updateOrderStatus(order.id, "shipped")}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Ship Order
                  </Button>
                )}
              </div>
            </CardContent>

            {/* Rush Order Indicator */}
            {order.isRushed && (
              <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 text-xs font-bold transform rotate-12 translate-x-2 -translate-y-1">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                RUSH
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <WarehouseIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders to display</h3>
          <p className="text-gray-500">
            {selectedStatus === "active"
              ? "All caught up! No active orders in the warehouse."
              : "No orders match the current filters."}
          </p>
        </div>
      )}
    </div>
  )
}