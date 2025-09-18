import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Dashboard } from "./pages/Dashboard"
import POSSystem from "./pages/POSSystem"
import ProductManagement from "./pages/ProductManagement"
import { OrderHub } from "./pages/OrderHub"
import InventoryManagement from "./pages/InventoryManagement"
import { EcommerceIntegration } from "./pages/EcommerceIntegration"
import { CustomerManagement } from "./pages/CustomerManagement"
import { HRManagement } from "./pages/HRManagement"
import { FinanceManagement } from "./pages/FinanceManagement"
import { Reports } from "./pages/Reports"
import { Settings } from "./pages/Settings"
import { SupplyChainManagement } from "./pages/SupplyChainManagement"
import { ProductAnalytics } from "./pages/ProductAnalytics"
import { Presentation } from "./pages/Presentation"

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pos" element={<POSSystem />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/orders" element={<OrderHub />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/ecommerce" element={<EcommerceIntegration />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/hr" element={<HRManagement />} />
          <Route path="/finance" element={<FinanceManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/supply-chain" element={<SupplyChainManagement />} />
          <Route path="/product-analytics" element={<ProductAnalytics />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/warehouse" element={<WarehouseDisplaySystem />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
import type React from "react"
import { Header } from "../src/components/Header"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  )
}
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
  Truck,
  TrendingUp,
  Globe,
  Presentation,
  Settings,
  Building2,
  Warehouse
} from "lucide-react"
import BranchesPage from "./pages/branches"
import WarehouseDisplaySystem from "./pages/warehouse"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "POS System", href: "/pos", icon: ShoppingCart },
  { name: "Warehouse View", href: "/warehouse", icon: Warehouse },
  { name: "Product Management", href: "/products", icon: Package2 },
  { name: "Order Hub", href: "/orders", icon: Package },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "E-commerce", href: "/ecommerce", icon: Globe },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "HR Management", href: "/hr", icon: UserCheck },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Supply Chain", href: "/supply-chain", icon: Truck },
  { name: "Product Analytics", href: "/product-analytics", icon: TrendingUp },
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
        <h1 className="text-xl font-bold text-white">Market OS</h1>
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
