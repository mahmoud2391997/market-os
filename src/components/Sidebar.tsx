import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  Package2,
  Package,
  Users,
  UserCheck,
  DollarSign,
  BarChart3,
  Settings,
  Truck,
  TrendingUp,
  Presentation,
  Globe,
  Warehouse,
  Building2,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "POS System", href: "/pos", icon: ShoppingCart },
  { name: "Menu Management", href: "/products", icon: Package2 },
  { name: "Warehouse View", href: "/warehouse", icon: Warehouse },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "E-commerce", href: "/ecommerce", icon: Globe },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "HR Management", href: "/hr", icon: UserCheck },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Supply Chain", href: "/supply-chain", icon: Truck },
  { name: "Menu Analytics", href: "/product-analytics", icon: TrendingUp },
  { name: "Branches", href: "/branches", icon: Building2 },
  { name: "Presentation", href: "/presentation", icon: Presentation },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  let location
  try {
    location = useLocation()
  } catch (e) {
    console.error("useLocation hook error:", e)
    location = { pathname: "/" } // fallback
  }
  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
        <h1 className="text-xl font-bold text-white">Restaurant OS</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500",
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
