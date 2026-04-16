import express from 'express'
import { listMenu, listOrders, placeOrder } from '../mock/menuData.js'

const router = express.Router()

router.get('/menu', (_req, res) => {
  res.json({ items: listMenu() })
})

router.post('/order', (req, res) => {
  try {
    const { itemIds } = req.body
    const order = placeOrder({ itemIds: Array.isArray(itemIds) ? itemIds : [] })
    res.status(201).json(order)
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Unable to place order'
    })
  }
})

router.get('/orders', (_req, res) => {
  res.json({ orders: listOrders() })
})

export default router
