import type { ShoppingItem } from "../types";

interface ShoppingItemCardProps {
  item: ShoppingItem;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
  onToggle: (item: ShoppingItem) => void;
}

const ShoppingItemCard = ({
  item,
  onEdit,
  onDelete,
  onToggle,
}: ShoppingItemCardProps) => {


  return (
    <article
      className={`shopping-item-card ${
        item.completed
          ? "shopping-item-completed"
          : ""
      }`}
    >
   
      <div className="shopping-item-checkbox">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggle(item)}
          aria-label={`Mark ${item.name} as ${
            item.completed
              ? "not bought"
              : "bought"
          }`}
        />
      </div>

   
      {item.image && (
        <div className="shopping-item-image">
          <img
            src={item.image}
            alt={item.name}
          />
        </div>
      )}

    
      <div className="shopping-item-content">
        <div className="shopping-item-main">
          <h3>{item.name}</h3>

          <span className="shopping-item-category">
            {item.category}
          </span>
        </div>

        <div className="shopping-item-meta">
          <span>
            Quantity: {item.quantity}
          </span>

          <span>
            Added:{" "}
            {new Date(
              item.dateAdded
            ).toLocaleDateString()}
          </span>
        </div>

        {item.notes && (
          <p className="shopping-item-notes">
            {item.notes}
          </p>
        )}

        <span className="shopping-item-status">
          {item.completed
            ? "✓ Bought"
            : "Not bought"}
        </span>
      </div>

   
      <div className="shopping-item-actions">
        <button
          type="button"
          onClick={() => onEdit(item)}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() =>
            onDelete(item.id)
          }
        >
          Delete
        </button>
      </div>

    </article>
  );
};

export default ShoppingItemCard;