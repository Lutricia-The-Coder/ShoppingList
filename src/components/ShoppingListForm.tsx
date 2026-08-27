
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
  const [imageAuthor, setImageAuthor] =
    useState("");
  const [imageUsername, setImageUsername] =
    useState("");

  const [completed, setCompleted] =
    useState(false);

  const [imageLoading, setImageLoading] =
    useState(false);

  const [imageError, setImageError] =
    useState("");

  /*
   * Populate the form when editing.
   * Reset the form when adding a new item.
   */
  useEffect(() => {
    if (existingItem) {
      setName(existingItem.name);
      setQuantity(existingItem.quantity);
      setNotes(existingItem.notes ?? "");
      setCategory(existingItem.category);
      setImage(existingItem.image ?? "");
      setImageAuthor(
        existingItem.imageAuthor ?? ""
      );
      setImageUsername(
        existingItem.imageUsername ?? ""
      );
      setCompleted(existingItem.completed);
    } else {
      setName("");
      setQuantity(1);
      setNotes("");
      setCategory("");
      setImage("");
      setImageAuthor("");
      setImageUsername("");
      setCompleted(false);
    }

    setImageError("");
  }, [existingItem]);

  /*
   * Find an image from Unsplash.
   */
  const handleImageSearch = async () => {
    if (!name.trim()) {
      setImageError(
        "Please enter an item name first."
      );
      return;
    }

    try {
      setImageLoading(true);
      setImageError("");

      const photo =
        await searchUnsplashImage(
          name.trim()
        );

      if (!photo) {
        setImage("");
        setImageAuthor("");
        setImageUsername("");

        setImageError(
          `No image found for "${name}".`
        );

        return;
      }

      setImage(photo.urls.small);
      setImageAuthor(photo.user.name);
      setImageUsername(
        photo.user.username
      );
    } catch (error) {
      console.error(
        "Unsplash image search error:",
        error
      );

      setImageError(
        "Unable to find an image right now."
      );
    } finally {
      setImageLoading(false);
    }
  };

  /*
   * Search image when leaving the item name.
   */
  const handleNameBlur = () => {
    if (
      name.trim() &&
      !image
    ) {
      handleImageSearch();
    }
  };

  /*
   * Submit item.
   */
  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault();

    setImageError("");

    if (!name.trim()) {
      setImageError(
        "Please enter an item name."
      );
      return;
    }

    if (quantity < 1) {
      setImageError(
        "Quantity must be at least 1."
      );
      return;
    }

    if (!category) {
      setImageError(
        "Please select a category."
      );
      return;
    }

    onSubmit({
      listId,
      name: name.trim(),
      quantity,
      notes: notes.trim(),
      category,
      image,
      imageAuthor,
      imageUsername,
      completed,
      dateAdded:
        existingItem?.dateAdded ??
        new Date().toISOString(),
    });
  };

  return (
    <main className="dashboard-container">
      <section className="dashboard-form-section">
        <form
          className="shopping-list-form"
          onSubmit={handleSubmit}
        >
          {/* HEADER */}

          <h2>
            {existingItem
              ? "Edit Shopping Item"
              : "Add Shopping Item"}
          </h2>

          {/* ITEM NAME */}

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
            onBlur={handleNameBlur}
            onKeyDown={(event) => {
              if (
                event.key === "Enter"
              ) {
                event.preventDefault();

                if (name.trim()) {
                  handleImageSearch();
                }
              }
            }}
            placeholder="e.g. Milk"
            required
          />

          {/* CATEGORY */}

          <label htmlFor="item-category">
            Category
          </label>

          <select
            id="item-category"
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
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

          {/* IMAGE SEARCH */}

          <div className="shopping-form-field">
            <label>
              Item image
            </label>

            <button
              type="button"
              className="shopping-image-search-button"
              onClick={handleImageSearch}
              disabled={imageLoading}
            >
              {imageLoading
                ? "Searching..."
                : "Search Unsplash"}
            </button>

            {imageError && (
              <p
                className="shopping-image-error"
                role="alert"
              >
                {imageError}
              </p>
            )}

            {image && (
              <div className="item-image-preview">
                <img
                  src={image}
                  alt={
                    name ||
                    "Shopping item"
                  }
                />

                {imageAuthor && (
                  <small>
                    Photo by{" "}
                    <a
                      href={
                        imageUsername
                          ? `https://unsplash.com/@${imageUsername}?utm_source=shopping_list_app&utm_medium=referral`
                          : "https://unsplash.com/?utm_source=shopping_list_app&utm_medium=referral"
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {imageAuthor}
                    </a>{" "}
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
          </div>

          {/* QUANTITY */}

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

          {/* NOTES */}

          <label htmlFor="item-notes">
            Notes
          </label>

          <textarea
            id="item-notes"
            value={notes}
            onChange={(event) =>
              setNotes(
                event.target.value
              )
            }
            placeholder="Optional notes"
            rows={3}
          />

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

              <span>
                Already bought
              </span>
            </label>
          )}

          {/* ACTIONS */}

          <div className="form-actions">
            <button
              type="submit"
            >
              {existingItem
                ? "Save Changes"
                : "Add Item"}
            </button>

            <button
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default ShoppingItemForm;

