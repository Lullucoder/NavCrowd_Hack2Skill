import { useMemo, useState } from 'react'
import { FoodMenu } from '../components/FoodMenu'
import { menuSeed } from '../data/mockData'
import type { MenuItem } from '../types'

type OrderState = 'idle' | 'preparing' | 'ready'

const categoryList: Array<MenuItem['category'] | 'All'> = ['All', 'Veg', 'Non-Veg', 'Drinks', 'Combo']

export const FoodOrderPage = () => {
  const [category, setCategory] = useState<MenuItem['category'] | 'All'>('All')
  const [cart, setCart] = useState<MenuItem[]>([])
  const [orderState, setOrderState] = useState<OrderState>('idle')

  const visibleItems = useMemo(
    () => (category === 'All' ? menuSeed : menuSeed.filter((item) => item.category === category)),
    [category]
  )

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart])

  const placeOrder = () => {
    if (cart.length === 0) {
      return
    }

    setOrderState('preparing')

    window.setTimeout(() => {
      setOrderState('ready')
      setCart([])
    }, 8000)
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Food and Beverage Pre-Order</h1>
        <p className="page-subtitle">Order from your seat and pick up once your order is ready.</p>
      </header>

      <section className="vf-filter-row">
        {categoryList.map((item) => (
          <button
            key={item}
            className={item === category ? 'tab active' : 'tab'}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </section>

      <div className="vf-section-space" />
      <FoodMenu items={visibleItems} onAdd={(item) => setCart((prev) => [...prev, item])} />

      <div className="vf-section-space" />
      <section className="glass-card vf-cart-panel">
        <h3>Cart ({cart.length})</h3>
        <p>Total: Rs {total}</p>
        <p>Status: {orderState === 'idle' ? 'Waiting for checkout' : orderState === 'preparing' ? 'Preparing' : 'Ready for pickup'}</p>
        <button className="btn btn-success" onClick={placeOrder} disabled={cart.length === 0 || orderState === 'preparing'}>
          {orderState === 'preparing' ? 'Preparing...' : 'Place Order'}
        </button>
      </section>
    </div>
  )
}
