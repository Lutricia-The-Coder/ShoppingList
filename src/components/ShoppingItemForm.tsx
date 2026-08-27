import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import type { ShoppingItem } from "../types";
import { searchUnsplashImage } from "../services/unsplashService";

interface ShoppingItemFormProps {
  listId: string;
  existingItem?: ShoppingItem | null;
  onSubmit: (
    item: Omit<ShoppingItem, "id">
  ) => void;
  onCancel: () => void;
}

const ShoppingItemForm = ({
  listId,
  existingItem,
  onSubmit,
  onCancel,
}: ShoppingItemFormProps) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [completed, setCompleted] = useState(false);

  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (existingItem) {
      setName(existingItem.name);
      setQuantity(existingItem.quantity);
      setNotes(existingItem.notes ?? "");
      setCategory(existingItem.category);
      setImage(existingItem.image ?? "");
      setCompleted(existingItem.completed);
    } else {
      setName("");
      setQuantity(1);
      setNotes("");
      setCategory("");
      setImage("");
      setCompleted(false);
    }

    setImageError("");
  }, [existingItem]);

  /*
   * Search Unsplash when the user finishes
   * entering the item name.
   */
  const handleImageSearch = async () => {
    if (!name.trim()) {
      setImageError("Enter an item name first.");
      return;
    }

    try {
      setImageLoading(true);
      setImageError("");

      const photo = await searchUnsplashImage(
        name.trim()
      );

      if (!photo) {
        setImage("");
        setImageError(
          "No image found for this item."
        );
        return;
      }

      setImage(photo.urls.small);
    } catch {
      setImageError(
        "Unable to find an image right now."
      );
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!name.trim()) return;
    if (quantity < 1) return;
    if (!category) return;

    onSubmit({
      listId,
      name: name.trim(),
      quantity,
      notes: notes.trim(),
      category,
      image,
      completed,
      dateAdded:
        existingItem?.dateAdded ??
        new Date().toISOString(),
    });
  };

  return (
    <div className="shopping-item-form-page">
      <form
        className="shopping-item-form"
        onSubmit={handleSubmit}
      >
       <div className="shopping-list-form-header">
  <h2>
    {existingItem
      ? "Edit Shopping Item"
      : "Add Shopping Item"}
  </h2>

  <p>
    {existingItem
      ? "Update the details of your shopping item."
      : "Add a new item to your shopping list."}
  </p>
</div>

        {/* ITEM NAME */}

        <div className="test-styler">
          <label htmlFor="item-name">
            Item name
          </label>

          <input
            id="item-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="e.g. Milk"
            required
          />
        </div>

        {/* QUANTITY */}

        <div className="shopping-form-field">
          <label htmlFor="item-quantity">
            Quantity
          </label>

          <input
            id="item-quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(event) =>
              setQuantity(
                Number(event.target.value)
              )
            }
            required
          />
        </div>

        {/* CATEGORY */}

        <div className="shopping-form-field">
          <label htmlFor="item-category">
            Category
          </label>

          <select
            id="item-category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            required
          >
            <option value="">
              Select a category
            </option>

            <option value="Groceries">
              Groceries
            </option>

            <option value="Household">
              Household
            </option>

            <option value="Electronics">
              Electronics
            </option>

            <option value="Clothing">
              Clothing
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        {/* NOTES */}

        <div className="shopping-form-field">
          <label htmlFor="item-notes">
            Notes
          </label>

          <textarea
            id="item-notes"
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            placeholder="Optional notes about this item"
            rows={4}
          />
        </div>

        {/* UNSPLASH IMAGE */}

        <div className="shopping-form-field">
  <label>Item image</label>

  <button
  type="button"
  className="shopping-image-search-button"
  onClick={handleImageSearch}
  disabled={imageLoading}
>
  {imageLoading ? "Searching..." : "Search Unsplash"}
</button>
{imageError && (
  <p className="shopping-image-error">
    {imageError}
  </p>
)}
  {image && (
    <div className="shopping-form-image-preview">
      <img
        src={image}
        alt={name || "Item preview"}
      />

    </div>
  )}
</div>

        {/* COMPLETED */}

        {existingItem && (
          <label className="shopping-completed-option">
            <input
              type="checkbox"
              checked={completed}
              onChange={(event) =>
                setCompleted(
                  event.target.checked
                )
              }
            />

            <span>Already bought</span>
          </label>
        )}

        {/* ACTIONS */}

        <div className="shopping-item-form-actions">
          <button
            type="button"
            className="shopping-form-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="shopping-form-submit"
          >
            {existingItem
              ? "Save Changes"
              : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShoppingItemForm;