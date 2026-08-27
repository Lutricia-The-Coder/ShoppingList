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
  const unsplashAuthorUrl = item.imageUsername
    ? `https://unsplash.com/@${item.imageUsername}?utm_source=shopping_list_app&utm_medium=referral`
    : null;

  return (
    <article
      className={`shopping-item-card ${
        item.completed
          ? "shopping-item-completed"
          : ""
      }`}
    >
      {/* IMAGE */}
      {item.image && (
        <div className="shopping-item-image">
          <img
            src={item.image}
            alt={`Picture of ${item.name}`}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          {item.imageAuthor && (
            <small>
              Photo by{" "}
              {unsplashAuthorUrl ? (
                <a
                  href={unsplashAuthorUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.imageAuthor}
                </a>
              ) : (
                item.imageAuthor
              )}{" "}
              on{" "}
              <a
                href="https://unsplash.com/?utm_source=shopping_list_app&utm_medium=referral"
                target="_blank"
                rel="noreferrer"
              >
                Unsplash
              </a>
            </small>
          )}
        </div>
      )}

      {/* ITEM CONTENT */}
      <div className="shopping-item-content">

        {/* NAME + CHECKBOX */}
        <div className="shopping-item-title">
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

          <h3>{item.name}</h3>
        </div>

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

        <p className="shopping-item-status">
          {item.completed
            ? "✓ Bought"
            : "Not bought"}
        </p>

        {/* ACTION BUTTONS */}
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

      </div>
    </article>
  );
};

export default ShoppingItemCard;