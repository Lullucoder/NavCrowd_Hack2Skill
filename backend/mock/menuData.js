const menu = [
  { id: 'm1', stallId: 'f-01', name: 'Classic Smash Burger', price: 220, category: 'non-veg', prepMinutes: 7 },
  { id: 'm2', stallId: 'f-01', name: 'Loaded Fries', price: 140, category: 'veg', prepMinutes: 5 },
  { id: 'm3', stallId: 'f-02', name: 'Paneer Tikka Wrap', price: 180, category: 'veg', prepMinutes: 6 },
  { id: 'm4', stallId: 'f-02', name: 'Chicken Shawarma Wrap', price: 210, category: 'non-veg', prepMinutes: 7 },
  { id: 'm5', stallId: 'f-01', name: 'Arena Cola', price: 90, category: 'drink', prepMinutes: 2 },
  { id: 'm6', stallId: 'f-02', name: 'Matchday Combo', price: 290, category: 'combo', prepMinutes: 8 }
]

const orders = []
let orderCounter = 880

export const listMenu = () => menu

export const placeOrder = ({ itemIds }) => {
  const items = menu.filter((item) => itemIds.includes(item.id))

  if (!items.length) {
    throw new Error('No valid menu items selected')
  }

  const maxPrep = Math.max(...items.map((item) => item.prepMinutes))
  const total = items.reduce((sum, item) => sum + item.price, 0)

  const order = {
    id: `ORD-${orderCounter += 1}`,
    items,
    total,
    status: 'Preparing',
    pickupCounter: Math.ceil(Math.random() * 8),
    etaMinutes: maxPrep,
    createdAt: new Date().toISOString()
  }

  orders.unshift(order)

  return order
}

export const listOrders = () => orders
