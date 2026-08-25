import type { ShoppingItem } from "../types";

interface ShoppingItemCardProps {
  item: ShoppingItem;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
}

const ShoppingItemCard = ({
  item,
  onEdit,
  onDelete,
}: ShoppingItemCardProps) => {
  return (
    <article>
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          width="150"
        />
      )}

      <h3>{item.name}</h3>

      <p>
        Quantity: {item.quantity}
      </p>

      <p>
        Category: {item.category}
      </p>

      {item.notes && (
        <p>
          Notes: {item.notes}
        </p>
      )}

      <p>
        Added:{" "}
        {new Date(
          item.dateAdded
        ).toLocaleDateString()}
      </p>

      <button
        type="button"
        onClick={() => onEdit(item)}
      >
        Edit
      </button>

      <button
        type="button"
        onClick={() => onDelete(item.id)}
      >
        Delete
      </button>
    </article>
  );
};

export default ShoppingItemCard;