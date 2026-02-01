import { useState, useEffect, useCallback } from 'react'
import { localApi, SimpleInventoryItem, SimpleMenuItem, SimpleCategory } from '../data/localDataProvider'

// Inventory hook
export const useLocalInventory = () => {
  const [items, setItems] = useState<SimpleInventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const fetchItems = useCallback(async (params?: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await localApi.getInventoryItems(params)
      setItems(response.data)
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }, [])

  const createItem = useCallback(async (item: Omit<SimpleInventoryItem, 'id'>) => {
    setLoading(true)
    setError(null)
    try {
      const newItem = await localApi.createInventoryItem(item)
      setItems(prev => [...prev, newItem])
      return newItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateItem = useCallback(async (id: string, updates: Partial<SimpleInventoryItem>) => {
    setLoading(true)
    setError(null)
    try {
      const updatedItem = await localApi.updateInventoryItem(id, updates)
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item))
      return updatedItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteItem = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await localApi.deleteInventoryItem(id)
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return {
    items,
    loading,
    error,
    pagination,
    fetchItems,
    createItem,
    updateItem,
    deleteItem
  }
}

// Menu hook
export const useLocalMenu = () => {
  const [items, setItems] = useState<SimpleMenuItem[]>([])
  const [categories, setCategories] = useState<SimpleCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const fetchItems = useCallback(async (params?: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await localApi.getMenuItems(params)
      setItems(response.data)
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const cats = await localApi.getMenuCategories()
      setCategories(cats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }, [])

  const createItem = useCallback(async (item: Omit<SimpleMenuItem, 'id'>) => {
    setLoading(true)
    setError(null)
    try {
      const newItem = await localApi.createMenuItem(item)
      setItems(prev => [...prev, newItem])
      return newItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateItem = useCallback(async (id: string, updates: Partial<SimpleMenuItem>) => {
    setLoading(true)
    setError(null)
    try {
      const updatedItem = await localApi.updateMenuItem(id, updates)
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item))
      return updatedItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteItem = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await localApi.deleteMenuItem(id)
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
    fetchCategories()
  }, [fetchItems, fetchCategories])

  return {
    items,
    categories,
    loading,
    error,
    pagination,
    fetchItems,
    fetchCategories,
    createItem,
    updateItem,
    deleteItem
  }
}
