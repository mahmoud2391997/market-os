import { 
  Customer, 
  Employee, 
  Branch, 
  Order, 
  OrderItem, 
  Table,
  InventoryItem,
  Category,
  Reservation,
  Transaction,
  Expense,
  Supplier,
  PurchaseOrder,
  PurchaseOrderItem
} from '../types/entities'

// Define MenuItem interface since it's missing from entities
export interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  category_id: string
  is_available: boolean
  preparation_time?: number
  image_url?: string
  ingredients?: string[]
  allergens?: string[]
  spice_level?: number
  dietary?: string[]
  created_at: Date
  updated_at: Date
}

// Define Attendance interface since it's missing from entities
export interface Attendance {
  id: string
  employeeId: string
  date: string
  checkIn?: string
  checkOut?: string
  method: "QR" | "biometric" | "manual"
}

// Define Notification interface since it's missing from entities
export interface Notification {
  id: string
  type: "order" | "inventory" | "system" | "promotion"
  title: string
  message: string
  priority: "low" | "medium" | "high" | "critical"
  isRead: boolean
  recipientId: string
  createdAt: Date
}

// Mock Categories
export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Appetizers', parentId: null },
  { id: 'cat-2', name: 'Main Course', parentId: null },
  { id: 'cat-3', name: 'Desserts', parentId: null },
  { id: 'cat-4', name: 'Beverages', parentId: null },
  { id: 'cat-5', name: 'Salads', parentId: 'cat-2' },
]

// Mock Menu Items
export const mockMenuItems: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan cheese and croutons',
    price: 12.99,
    categoryId: 'cat-5',
    isAvailable: true,
    preparationTime: 10,
    imageUrl: '/images/caesar-salad.jpg',
    ingredients: ['lettuce', 'parmesan', 'croutons', 'caesar-dressing'],
    allergens: ['dairy', 'gluten'],
    spiceLevel: 0,
    dietary: ['vegetarian'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'menu-2',
    name: 'Grilled Chicken',
    description: 'Herb-marinated grilled chicken breast with vegetables',
    price: 18.99,
    categoryId: 'cat-2',
    isAvailable: true,
    preparationTime: 20,
    imageUrl: '/images/grilled-chicken.jpg',
    ingredients: ['chicken', 'herbs', 'vegetables', 'olive-oil'],
    allergens: [],
    spiceLevel: 1,
    dietary: ['gluten-free', 'high-protein'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'menu-3',
    name: 'Chocolate Cake',
    description: 'Decadent chocolate cake with vanilla frosting',
    price: 8.99,
    categoryId: 'cat-3',
    isAvailable: true,
    preparationTime: 5,
    imageUrl: '/images/chocolate-cake.jpg',
    ingredients: ['chocolate', 'flour', 'sugar', 'butter', 'eggs'],
    allergens: ['dairy', 'gluten', 'eggs'],
    spiceLevel: 0,
    dietary: ['vegetarian'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'menu-4',
    name: 'Coffee',
    description: 'Freshly brewed premium coffee',
    price: 3.99,
    categoryId: 'cat-4',
    isAvailable: true,
    preparationTime: 3,
    imageUrl: '/images/coffee.jpg',
    ingredients: ['coffee-beans', 'water'],
    allergens: [],
    spiceLevel: 0,
    dietary: ['vegan', 'gluten-free'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
]

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'John Smith',
    phone: '+1-555-0101',
    email: 'john.smith@email.com',
    tier: 'Gold',
    loyaltyPoints: 1250,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'cust-2',
    name: 'Jane Doe',
    phone: '+1-555-0102',
    email: 'jane.doe@email.com',
    tier: 'Silver',
    loyaltyPoints: 750,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'cust-3',
    name: 'Mike Johnson',
    phone: '+1-555-0103',
    email: 'mike.j@email.com',
    tier: 'Bronze',
    loyaltyPoints: 250,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
]

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Sarah Wilson',
    role: 'Manager',
    email: 'sarah.w@restaurant.com',
    phone: '+1-555-0201',
    shiftStart: '09:00',
    shiftEnd: '18:00',
    salary: 55000,
    joinDate: '2023-01-15',
    biometricId: 'bio-001',
    createdAt: new Date('2023-01-15')
  },
  {
    id: 'emp-2',
    name: 'Tom Chen',
    role: 'Chef',
    email: 'tom.c@restaurant.com',
    phone: '+1-555-0202',
    shiftStart: '10:00',
    shiftEnd: '22:00',
    salary: 48000,
    joinDate: '2023-03-20',
    biometricId: 'bio-002',
    createdAt: new Date('2023-03-20')
  },
  {
    id: 'emp-3',
    name: 'Lisa Martinez',
    role: 'Waiter',
    email: 'lisa.m@restaurant.com',
    phone: '+1-555-0203',
    shiftStart: '16:00',
    shiftEnd: '00:00',
    salary: 32000,
    joinDate: '2023-06-10',
    biometricId: 'bio-003',
    createdAt: new Date('2023-06-10')
  }
]

// Mock Branches
export const mockBranches: Branch[] = [
  {
    id: 'BRANCH-001',
    name: 'Downtown Branch',
    address: '123 Main Street, Downtown, NY 10001',
    phone: '+1-555-0001',
    email: 'downtown@restaurant.com',
    managerId: 'emp-1',
    isActive: true,
    openingTime: '09:00',
    closingTime: '22:00',
    timezone: 'America/New_York',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'BRANCH-002',
    name: 'Uptown Branch',
    address: '456 Oak Avenue, Uptown, NY 10002',
    phone: '+1-555-0002',
    email: 'uptown@restaurant.com',
    managerId: 'emp-2',
    isActive: true,
    openingTime: '10:00',
    closingTime: '23:00',
    timezone: 'America/New_York',
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-01-10')
  }
]

// Mock Tables
export const mockTables: Table[] = [
  { id: 'table-1', number: 1, zone: 'Indoor', capacity: 4, status: 'available' },
  { id: 'table-2', number: 2, zone: 'Indoor', capacity: 2, status: 'occupied' },
  { id: 'table-3', number: 3, zone: 'Indoor', capacity: 6, status: 'available' },
  { id: 'table-4', number: 4, zone: 'Outdoor', capacity: 4, status: 'reserved' },
  { id: 'table-5', number: 5, zone: 'Outdoor', capacity: 8, status: 'available' },
  { id: 'table-6', number: 6, zone: 'Private', capacity: 10, status: 'available' }
]

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'order-1',
    tableId: 'table-2',
    customerId: 'cust-1',
    employeeId: 'emp-3',
    orderType: 'dine-in',
    status: 'completed',
    totalAmount: 31.98,
    paymentMethod: 'credit_card',
    createdAt: new Date('2024-01-20T12:30:00')
  },
  {
    id: 'order-2',
    tableId: 'table-4',
    customerId: 'cust-2',
    employeeId: 'emp-3',
    orderType: 'dine-in',
    status: 'served',
    totalAmount: 45.97,
    paymentMethod: 'cash',
    createdAt: new Date('2024-01-20T13:15:00')
  },
  {
    id: 'order-3',
    customerId: 'cust-3',
    employeeId: 'emp-3',
    orderType: 'takeaway',
    status: 'prepared',
    totalAmount: 21.98,
    paymentMethod: 'upi',
    createdAt: new Date('2024-01-20T14:00:00')
  }
]

// Mock Order Items
export const mockOrderItems: OrderItem[] = [
  {
    id: 'item-1',
    orderId: 'order-1',
    menuItemId: 'menu-1',
    quantity: 2,
    price: 12.99,
    modifiers: { 'Dressing': 'Light', 'Croutons': 'Extra' }
  },
  {
    id: 'item-2',
    orderId: 'order-1',
    menuItemId: 'menu-4',
    quantity: 2,
    price: 3.99
  },
  {
    id: 'item-3',
    orderId: 'order-2',
    menuItemId: 'menu-2',
    quantity: 1,
    price: 18.99,
    modifiers: { 'Cooking': 'Medium-Rare' }
  },
  {
    id: 'item-4',
    orderId: 'order-2',
    menuItemId: 'menu-3',
    quantity: 3,
    price: 8.99
  },
  {
    id: 'item-5',
    orderId: 'order-3',
    menuItemId: 'menu-2',
    quantity: 1,
    price: 18.99
  },
  {
    id: 'item-6',
    orderId: 'order-3',
    menuItemId: 'menu-4',
    quantity: 1,
    price: 3.99
  }
]

// Mock Inventory Items
export const mockInventoryItems: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Chicken Breast',
    unit: 'kg',
    type: 'raw',
    currentStock: 25.5,
    minimumStock: 10,
    costPerUnit: 8.50,
    locked: false
  },
  {
    id: 'inv-2',
    name: 'Romaine Lettuce',
    unit: 'kg',
    type: 'raw',
    currentStock: 8.2,
    minimumStock: 5,
    costPerUnit: 3.25,
    locked: false
  },
  {
    id: 'inv-3',
    name: 'Coffee Beans',
    unit: 'kg',
    type: 'raw',
    currentStock: 15.0,
    minimumStock: 8,
    costPerUnit: 12.00,
    locked: false
  },
  {
    id: 'inv-4',
    name: 'Chocolate',
    unit: 'kg',
    type: 'raw',
    currentStock: 5.5,
    minimumStock: 3,
    costPerUnit: 15.75,
    locked: false
  }
]

// Mock Reservations
export const mockReservations: Reservation[] = [
  {
    id: 'res-1',
    customerName: 'John Smith',
    customerPhone: '+1-555-0101',
    customerEmail: 'john.smith@email.com',
    tableId: 'table-6',
    partySize: 8,
    reservationDate: new Date('2024-01-25'),
    reservationTime: '19:00',
    status: 'confirmed',
    specialRequests: 'Birthday celebration - need cake',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'res-2',
    customerName: 'Jane Doe',
    customerPhone: '+1-555-0102',
    tableId: 'table-3',
    partySize: 4,
    reservationDate: new Date('2024-01-21'),
    reservationTime: '18:30',
    status: 'confirmed',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  }
]

// Mock Attendance
export const mockAttendance: Attendance[] = [
  {
    id: 'att-1',
    employeeId: 'emp-1',
    date: '2024-01-20',
    checkIn: '09:00',
    checkOut: '18:15',
    method: 'biometric'
  },
  {
    id: 'att-2',
    employeeId: 'emp-2',
    date: '2024-01-20',
    checkIn: '10:05',
    checkOut: '22:30',
    method: 'biometric'
  },
  {
    id: 'att-3',
    employeeId: 'emp-3',
    date: '2024-01-20',
    checkIn: '16:00',
    checkOut: '00:30',
    method: 'QR'
  }
]

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'trans-1',
    restaurant_id: 'BRANCH-001',
    order_id: 'order-1',
    type: 'sale',
    amount: 31.98,
    payment_method: 'credit_card',
    description: 'Order #1 - Table 2',
    category: 'dine_in',
    createdBy: 'emp-3',
    created_at: new Date('2024-01-20T12:30:00')
  },
  {
    id: 'trans-2',
    restaurant_id: 'BRANCH-001',
    order_id: 'order-2',
    type: 'sale',
    amount: 45.97,
    payment_method: 'cash',
    description: 'Order #2 - Table 4',
    category: 'dine_in',
    createdBy: 'emp-3',
    created_at: new Date('2024-01-20T13:15:00')
  }
]

// Mock Expenses
export const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    category: 'Utilities',
    amount: 450.00,
    branch: 'BRANCH-001',
    tags: ['electricity', 'water'],
    transactionDate: '2024-01-15',
    createdBy: 'emp-1'
  },
  {
    id: 'exp-2',
    category: 'Supplies',
    amount: 1250.00,
    branch: 'BRANCH-001',
    tags: ['food', 'ingredients'],
    transactionDate: '2024-01-18',
    createdBy: 'emp-1'
  }
]

// Mock Suppliers
export const mockSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Fresh Produce Co.',
    contactPerson: 'Robert Green',
    email: 'robert@freshproduce.com',
    phone: '+1-555-1001',
    address: '789 Farm Road, Agricultural District, NY 10003',
    rating: 4.8,
    totalOrders: 156,
    onTimeDelivery: 95.5,
    categories: ['vegetables', 'fruits', 'herbs'],
    status: 'active',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'sup-2',
    name: 'Premium Meats Inc.',
    contactPerson: 'James Butcher',
    email: 'james@premiummeats.com',
    phone: '+1-555-1002',
    address: '321 Meat Processing Blvd, Industrial Zone, NY 10004',
    rating: 4.6,
    totalOrders: 89,
    onTimeDelivery: 92.3,
    categories: ['chicken', 'beef', 'pork', 'lamb'],
    status: 'active',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2024-01-10')
  }
]

// Mock Purchase Orders
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-1',
    supplierId: 'sup-1',
    status: 'delivered',
    orderDate: new Date('2024-01-15'),
    expectedDelivery: new Date('2024-01-17'),
    actualDelivery: new Date('2024-01-17'),
    totalAmount: 1250.00,
    createdBy: 'emp-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-17')
  }
]

// Mock Purchase Order Items
export const mockPurchaseOrderItems: PurchaseOrderItem[] = [
  {
    id: 'poi-1',
    purchaseOrderId: 'po-1',
    inventoryItemId: 'inv-2',
    quantity: 50,
    unitPrice: 3.25,
    totalPrice: 162.50
  },
  {
    id: 'poi-2',
    purchaseOrderId: 'po-1',
    inventoryItemId: 'inv-3',
    quantity: 25,
    unitPrice: 12.00,
    totalPrice: 300.00
  }
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #3 is ready for pickup',
    priority: 'medium',
    isRead: false,
    recipientId: 'emp-3',
    createdAt: new Date('2024-01-20T14:00:00')
  },
  {
    id: 'notif-2',
    type: 'inventory',
    title: 'Low Stock Alert',
    message: 'Chocolate is running low (5.5kg remaining)',
    priority: 'high',
    isRead: false,
    recipientId: 'emp-1',
    createdAt: new Date('2024-01-20T10:30:00')
  }
]

// Export all mock data as a single object for easy access
export const mockData = {
  categories: mockCategories,
  menuItems: mockMenuItems,
  customers: mockCustomers,
  employees: mockEmployees,
  branches: mockBranches,
  tables: mockTables,
  orders: mockOrders,
  orderItems: mockOrderItems,
  inventoryItems: mockInventoryItems,
  reservations: mockReservations,
  attendance: mockAttendance,
  transactions: mockTransactions,
  expenses: mockExpenses,
  suppliers: mockSuppliers,
  purchaseOrders: mockPurchaseOrders,
  purchaseOrderItems: mockPurchaseOrderItems,
  notifications: mockNotifications
}
