import type { MenuItem } from '../types'

interface FoodMenuProps {
  items: MenuItem[]
  onAdd: (item: MenuItem) => void
}

export const FoodMenu = ({ items, onAdd }: FoodMenuProps) => (
  <section className="vf-food-grid">
    {items.map((item) => (
      <article key={item.id} className="glass-card vf-food-card">
        <div className="vf-food-top">
          <h3>{item.name}</h3>
          <span className="badge badge-purple">{item.category}</span>
        </div>

        <p className="vf-food-meta">Prep time: {item.prepMinutes} minutes</p>

        <div className="vf-food-bottom">
          <strong>Rs {item.price}</strong>
          <button className="btn btn-primary" onClick={() => onAdd(item)}>
            Add
          </button>
        </div>
      </article>
    ))}
  </section>
)
