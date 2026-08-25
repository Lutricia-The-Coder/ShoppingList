import { Link } from "react-router-dom";
import type { ShoppingList } from "../types";

interface ShoppingListCardProps {
  shoppingList: ShoppingList;
  onEdit: (shoppingList: ShoppingList) => void;
  onDelete: (id: string) => void;
  onShare?: (shoppingList: ShoppingList) => void;
}

const ShoppingListCard = ({
  shoppingList,
  onEdit,
  onDelete,
  onShare,
}: ShoppingListCardProps) => {
  return (
    <article className="shopping-card">
      <h2>{shoppingList.name}</h2>

      <p>
        Created:{" "}
        {new Date(
          shoppingList.dateAdded
        ).toLocaleDateString()}
      </p>

      <div className="card-actions">
        <Link
          to={`/lists/${shoppingList.id}`}
        >
          View List
        </Link>

        <button
          type="button"
          onClick={() =>
            onEdit(shoppingList)
          }
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() =>
            onDelete(shoppingList.id)
          }
        >
          Delete
        </button>

        {onShare && (
          <button
            type="button"
            onClick={() =>
              onShare(shoppingList)
            }
          >
            Share
          </button>
        )}
      </div>
    </article>
  );
};

export default ShoppingListCard;