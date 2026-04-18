import type { MenuItem } from '../types'

interface FoodMenuProps {
  items: MenuItem[]
  onAdd: (item: MenuItem) => void
  itemCountById: Record<string, number>
}

const stallNameById: Record<string, string> = {
  'f-01': 'Smash Burger Bay',
  'f-02': 'Masala Wrap Point'
}

export const FoodMenu = ({ items, onAdd, itemCountById }: FoodMenuProps) => (
  <section className="vf-food-grid">
    {items.map((item) => (
      <article key={item.id} className="glass-card vf-food-card">
        <div className="vf-food-top">
          <h3>{item.name}</h3>
          <div className="vf-food-tag-row">
            <span className="badge badge-purple">{item.category}</span>
            {itemCountById[item.id] ? <span className="badge badge-blue">{itemCountById[item.id]} in cart</span> : null}
          </div>
        </div>

        <p className="vf-food-stall">{stallNameById[item.stallId] ?? 'Food Court Stall'}</p>
        <p className="vf-food-meta">Prep time: {item.prepMinutes} minutes</p>

        <div className="vf-food-bottom">
          <strong>Rs {item.price}</strong>
          <button className="btn btn-primary" onClick={() => onAdd(item)}>
            Add +
          </button>
        </div>
      </article>
    ))}
  </section>
)
