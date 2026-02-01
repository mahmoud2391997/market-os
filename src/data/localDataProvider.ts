// Simple local data provider to replace API calls
// This provides mock data without complex type dependencies

export interface SimpleInventoryItem {
  id: string
  name: string
  unit: string
  type: string
  currentStock: number
  minimumStock: number
  costPerUnit: number
  locked: boolean
}

export interface SimpleMenuItem {
  id: string
  name: string
  description?: string
  price: number
  category_id: string
  is_available: boolean
  preparation_time?: number
  image_url?: string
}

export interface SimpleCategory {
  id: string
  name: string
  parentId?: string
}

// Mock inventory data
export const mockInventoryItems: SimpleInventoryItem[] = [
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
  },
  {
    id: 'inv-5',
    name: 'Tomatoes',
    unit: 'kg',
    type: 'raw',
    currentStock: 12.0,
    minimumStock: 6,
    costPerUnit: 2.50,
    locked: false
  },
  {
    id: 'inv-6',
    name: 'Olive Oil',
    unit: 'L',
    type: 'raw',
    currentStock: 8.5,
    minimumStock: 4,
    costPerUnit: 18.00,
    locked: false
  }
]

// Mock menu categories
export const mockCategories: SimpleCategory[] = [
  { id: 'cat-1', name: 'Appetizers', parentId: null },
  { id: 'cat-2', name: 'Main Course', parentId: null },
  { id: 'cat-3', name: 'Desserts', parentId: null },
  { id: 'cat-4', name: 'Beverages', parentId: null },
  { id: 'cat-5', name: 'Salads', parentId: 'cat-2' },
]

// Mock menu items
export const mockMenuItems: SimpleMenuItem[] = [
  {
    id: 'menu-1',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan cheese and croutons',
    price: 12.99,
    category_id: 'cat-5',
    is_available: true,
    preparation_time: 10,
    image_url: '/images/caesar-salad.jpg'
  },
  {
    id: 'menu-2',
    name: 'Grilled Chicken',
    description: 'Herb-marinated grilled chicken breast with vegetables',
    price: 18.99,
    category_id: 'cat-2',
    is_available: true,
    preparation_time: 20,
    image_url: '/images/grilled-chicken.jpg'
  },
  {
    id: 'menu-3',
    name: 'Chocolate Cake',
    description: 'Decadent chocolate cake with vanilla frosting',
    price: 8.99,
    category_id: 'cat-3',
    is_available: true,
    preparation_time: 5,
    image_url: '/images/chocolate-cake.jpg'
  },
  {
    id: 'menu-4',
    name: 'Coffee',
    description: 'Freshly brewed premium coffee',
    price: 3.99,
    category_id: 'cat-4',
    is_available: true,
    preparation_time: 3,
    image_url: '/images/coffee.jpg'
  },
  {
    id: 'menu-5',
    name: 'Tomato Soup',
    description: 'Fresh tomato soup with basil',
    price: 6.99,
    category_id: 'cat-1',
    is_available: true,
    preparation_time: 8,
    image_url: '/images/tomato-soup.jpg'
  },
  {
    id: 'menu-6',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with lemon butter',
    price: 24.99,
    category_id: 'cat-2',
    is_available: true,
    preparation_time: 25,
    image_url: '/images/grilled-salmon.jpg'
  }
]

// Simulate API calls with promises
export const localApi = {
  // Inventory API
  getInventoryItems: async (params?: any) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let items = [...mockInventoryItems]
    
    // Apply pagination
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedItems = items.slice(startIndex, endIndex)
    
    return {
      data: paginatedItems,
      total: items.length,
      page,
      limit,
      totalPages: Math.ceil(items.length / limit)
    }
  },
  
  createInventoryItem: async (item: SimpleInventoryItem) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newItem = { ...item, id: `inv-${Date.now()}` }
    mockInventoryItems.push(newItem)
    return newItem
  },
  
  updateInventoryItem: async (id: string, updates: Partial<SimpleInventoryItem>) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockInventoryItems.findIndex(item => item.id === id)
    if (index !== -1) {
      mockInventoryItems[index] = { ...mockInventoryItems[index], ...updates }
      return mockInventoryItems[index]
    }
    throw new Error('Item not found')
  },
  
  deleteInventoryItem: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockInventoryItems.findIndex(item => item.id === id)
    if (index !== -1) {
      mockInventoryItems.splice(index, 1)
      return true
    }
    throw new Error('Item not found')
  },
  
  // Menu API
  getMenuCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockCategories
  },
  
  getMenuItems: async (params?: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let items = [...mockMenuItems]
    
    // Apply filters
    if (params?.category_id) {
      items = items.filter(item => item.category_id === params.category_id)
    }
    if (params?.is_available !== undefined) {
      items = items.filter(item => item.is_available === params.is_available)
    }
    
    // Apply search
    if (params?.search) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(params.search.toLowerCase()) ||
        item.description?.toLowerCase().includes(params.search.toLowerCase())
      )
    }
    
    // Apply sorting
    if (params?.sortBy) {
      items.sort((a, b) => {
        const aValue = a[params.sortBy as keyof SimpleMenuItem]
        const bValue = b[params.sortBy as keyof SimpleMenuItem]
        if (params.sortOrder === 'desc') {
          return aValue > bValue ? -1 : 1
        }
        return aValue > bValue ? 1 : -1
      })
    }
    
    // Apply pagination
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedItems = items.slice(startIndex, endIndex)
    
    return {
      data: paginatedItems,
      total: items.length,
      page,
      limit,
      totalPages: Math.ceil(items.length / limit)
    }
  },
  
  createMenuItem: async (item: SimpleMenuItem) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newItem = { ...item, id: `menu-${Date.now()}` }
    mockMenuItems.push(newItem)
    return newItem
  },
  
  updateMenuItem: async (id: string, updates: Partial<SimpleMenuItem>) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockMenuItems.findIndex(item => item.id === id)
    if (index !== -1) {
      mockMenuItems[index] = { ...mockMenuItems[index], ...updates }
      return mockMenuItems[index]
    }
    throw new Error('Item not found')
  },
  
  deleteMenuItem: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockMenuItems.findIndex(item => item.id === id)
    if (index !== -1) {
      mockMenuItems.splice(index, 1)
      return true
    }
    throw new Error('Item not found')
  }
}
