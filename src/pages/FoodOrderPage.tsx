import { useMemo, useState } from 'react'
import { FoodMenu } from '../components/FoodMenu'
import { menuSeed } from '../data/mockData'
import type { MenuItem } from '../types'

type OrderState = 'idle' | 'processing' | 'preparing' | 'ready'
type PaymentMode = 'counter' | 'online'

interface CartLine {
  item: MenuItem
  quantity: number
}

interface ActiveOrder {
  tokenNumber: string
  counterName: string
  totalAmount: number
  totalItems: number
  pickupEtaMinutes: number
  createdAt: string
}

const categoryList: Array<MenuItem['category'] | 'All'> = ['All', 'Veg', 'Non-Veg', 'Drinks', 'Combo']

const stallNameById: Record<string, string> = {
  'f-01': 'Smash Burger Bay Counter',
  'f-02': 'Masala Wrap Point Counter'
}

const buildTokenNumber = () => {
  const segmentA = Math.floor(100 + Math.random() * 900)
  const segmentB = Math.floor(1000 + Math.random() * 9000)
  return `FO-${segmentA}-${segmentB}`
}

export const FoodOrderPage = () => {
  const [category, setCategory] = useState<MenuItem['category'] | 'All'>('All')
  const [cartLines, setCartLines] = useState<CartLine[]>([])
  const [orderState, setOrderState] = useState<OrderState>('idle')
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('counter')
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null)

  const visibleItems = useMemo(
    () => (category === 'All' ? menuSeed : menuSeed.filter((item) => item.category === category)),
    [category]
  )

  const itemCountById = useMemo(
    () =>
      cartLines.reduce<Record<string, number>>((acc, line) => {
        acc[line.item.id] = line.quantity
        return acc
      }, {}),
    [cartLines]
  )

  const totalItems = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.quantity, 0),
    [cartLines]
  )

  const subtotal = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.item.price * line.quantity, 0),
    [cartLines]
  )

  const serviceFee = subtotal > 0 ? 18 : 0
  const finalTotal = subtotal + serviceFee

  const pickupEta = useMemo(() => {
    if (cartLines.length === 0) {
      return 0
    }

    const peakPrep = cartLines.reduce((maxPrep, line) => Math.max(maxPrep, line.item.prepMinutes), 0)
    return peakPrep + Math.min(8, totalItems)
  }, [cartLines, totalItems])

  const statusLabel =
    orderState === 'idle'
      ? 'Waiting for checkout'
      : orderState === 'processing'
        ? 'Generating token'
        : orderState === 'preparing'
          ? 'Preparing order'
          : 'Ready for pickup'

  const addToCart = (item: MenuItem) => {
    setCartLines((prev) => {
      const existingIndex = prev.findIndex((line) => line.item.id === item.id)

      if (existingIndex === -1) {
        return [...prev, { item, quantity: 1 }]
      }

      return prev.map((line, index) => (index === existingIndex ? { ...line, quantity: line.quantity + 1 } : line))
    })
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setCartLines((prev) =>
      prev
        .map((line) =>
          line.item.id === itemId
            ? {
                ...line,
                quantity: line.quantity + delta
              }
            : line
        )
        .filter((line) => line.quantity > 0)
    )
  }

  const clearCart = () => {
    setCartLines([])
  }

  const checkoutOrder = () => {
    if (cartLines.length === 0 || paymentMode !== 'counter' || orderState === 'processing') {
      return
    }

    const totalSnapshot = finalTotal
    const itemCountSnapshot = totalItems
    const pickupEtaSnapshot = Math.max(pickupEta, 6)
    const dominantLine = [...cartLines].sort((a, b) => b.quantity - a.quantity)[0]
    const counterName = stallNameById[dominantLine.item.stallId] ?? 'Main Food Court Counter'

    setOrderState('processing')

    window.setTimeout(() => {
      setActiveOrder({
        tokenNumber: buildTokenNumber(),
        counterName,
        totalAmount: totalSnapshot,
        totalItems: itemCountSnapshot,
        pickupEtaMinutes: pickupEtaSnapshot,
        createdAt: new Date().toISOString()
      })
      setOrderState('preparing')
      setCartLines([])
    }, 1200)

    window.setTimeout(() => {
      setOrderState('ready')
    }, 9000)
  }

  const activeOrderTime = useMemo(() => {
    if (!activeOrder) {
      return ''
    }

    return new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }, [activeOrder])

  const handleNewOrder = () => {
    setOrderState('idle')
    setActiveOrder(null)
    setPaymentMode('counter')
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Food and Beverage Pre-Order</h1>
        <p className="page-subtitle">Order from your seat, checkout with Pay on Counter, and collect using your token.</p>
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
      <section className="vf-food-layout">
        <div>
          <FoodMenu items={visibleItems} onAdd={addToCart} itemCountById={itemCountById} />
        </div>

        <aside className="glass-card vf-cart-panel vf-food-checkout-panel">
          <div className="vf-food-checkout-head">
            <h3>Checkout ({totalItems})</h3>
            <span aria-live="polite" className={orderState === 'ready' ? 'badge badge-green' : orderState === 'processing' ? 'badge badge-amber' : 'badge badge-blue'}>
              {statusLabel}
            </span>
          </div>

          {cartLines.length ? (
            <ul className="vf-food-cart-list">
              {cartLines.map((line) => (
                <li key={line.item.id} className="vf-food-cart-item">
                  <div>
                    <p>{line.item.name}</p>
                    <p className="vf-muted">Rs {line.item.price} each</p>
                  </div>
                  <div className="vf-food-qty-controls">
                    <button className="btn btn-secondary" aria-label={`Reduce quantity of ${line.item.name}`} onClick={() => updateQuantity(line.item.id, -1)}>
                      -
                    </button>
                    <strong>{line.quantity}</strong>
                    <button className="btn btn-secondary" aria-label={`Increase quantity of ${line.item.name}`} onClick={() => updateQuantity(line.item.id, 1)}>
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="vf-muted">Your cart is empty. Add dishes to begin checkout.</p>
          )}

          <div className="vf-food-bill">
            <p>
              <span>Subtotal</span>
              <strong>Rs {subtotal}</strong>
            </p>
            <p>
              <span>Platform fee</span>
              <strong>Rs {serviceFee}</strong>
            </p>
            <p>
              <span>Total</span>
              <strong>Rs {finalTotal}</strong>
            </p>
          </div>

          <div className="vf-food-payment-panel">
            <p className="vf-section-label">Checkout Options</p>
            <div className="vf-food-payment-tabs">
              <button
                className={paymentMode === 'counter' ? 'tab active' : 'tab'}
                onClick={() => setPaymentMode('counter')}
              >
                Pay on Counter
              </button>
              <button
                className={paymentMode === 'online' ? 'tab active' : 'tab'}
                onClick={() => setPaymentMode('online')}
              >
                Pay Online (Soon)
              </button>
            </div>
            {paymentMode === 'counter' ? (
              <p className="vf-inline-note">Token will be generated instantly. Pay when you collect your order.</p>
            ) : (
              <p className="vf-inline-note">Online payments are being rolled out. Switch to Pay on Counter for now.</p>
            )}
          </div>

          <button
            className="btn btn-success"
            onClick={checkoutOrder}
            disabled={cartLines.length === 0 || paymentMode !== 'counter' || orderState === 'processing'}
          >
            {orderState === 'processing' ? 'Generating token...' : 'Checkout & Generate Token'}
          </button>
          <button className="btn btn-secondary" onClick={clearCart} disabled={cartLines.length === 0 || orderState === 'processing'}>
            Clear Cart
          </button>

          {activeOrder ? (
            <section className="vf-food-token-card" role="status" aria-live="polite">
              <p className="badge badge-green">Token Generated</p>
              <h4>Token #{activeOrder.tokenNumber}</h4>
              <p>
                Pickup counter: <strong>{activeOrder.counterName}</strong>
              </p>
              <p>
                Items: <strong>{activeOrder.totalItems}</strong> - Payable amount: <strong>Rs {activeOrder.totalAmount}</strong>
              </p>
              <p>
                Ordered at {activeOrderTime} - Estimated pickup in {activeOrder.pickupEtaMinutes} min
              </p>
              <p className="vf-muted">Show this token at the counter to complete payment and collect your order.</p>
              {orderState === 'ready' ? (
                <button className="btn btn-primary" onClick={handleNewOrder}>
                  Place Another Order
                </button>
              ) : null}
            </section>
          ) : null}
        </aside>
      </section>
    </div>
  )
}
