import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Dashboard } from "./pages/Dashboard"
import POSSystemSimple from "./pages/POSSystemSimple"
import ProductManagementSimple from "./pages/ProductManagementSimple"
import { OrderHub } from "./pages/OrderHub"
import InventoryManagementSimple from "./pages/InventoryManagementSimple"
import { EcommerceIntegration } from "./pages/EcommerceIntegration"
import { CustomerManagement } from "./pages/CustomerManagement"
import { HRManagement } from "./pages/HRManagement"
import { FinanceManagement } from "./pages/FinanceManagement"
import { Reports } from "./pages/Reports"
import { Settings } from "./pages/Settings"
import { SupplyChainManagement } from "./pages/SupplyChainManagement"
import { ProductAnalytics } from "./pages/ProductAnalytics"
import { Presentation } from "./pages/Presentation"
import BranchesPage from "./pages/branches"
import WarehouseDisplaySystem from "./pages/warehouse"
import type React from "react"
import { Header } from "./components/Header"
import { Sidebar } from "./components/Sidebar"

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

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pos" element={<POSSystemSimple />} />
          <Route path="/products" element={<ProductManagementSimple />} />
          <Route path="/orders" element={<OrderHub />} />
          <Route path="/inventory" element={<InventoryManagementSimple />} />
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
