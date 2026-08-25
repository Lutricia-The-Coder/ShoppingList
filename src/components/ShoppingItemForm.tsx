import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import type { ShoppingItem } from "../types";

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

  useEffect(() => {
    if (existingItem) {
      setName(existingItem.name);
      setQuantity(existingItem.quantity);
      setNotes(existingItem.notes ?? "");
      setCategory(existingItem.category);
      setImage(existingItem.image ?? "");
    } else {
      setName("");
      setQuantity(1);
      setNotes("");
      setCategory("");
      setImage("");
    }
  }, [existingItem]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    if (quantity < 1) {
      return;
    }

    if (!category) {
      return;
    }

    onSubmit({
      listId,
      name: name.trim(),
      quantity,
      notes: notes.trim(),
      category,
      image: image.trim(),
      dateAdded:
        existingItem?.dateAdded ??
        new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>
        {existingItem
          ? "Edit Shopping Item"
          : "Add Shopping Item"}
      </h2>

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

      <label htmlFor="item-quantity">
        Quantity
      </label>

      <input
        id="item-quantity"
        type="number"
        min="1"
        value={quantity}
        onChange={(event) =>
          setQuantity(Number(event.target.value))
        }
        required
      />

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

      <label htmlFor="item-image">
        Image URL
      </label>

      <input
        id="item-image"
        type="url"
        value={image}
        onChange={(event) =>
          setImage(event.target.value)
        }
        placeholder="https://example.com/image.jpg"
      />

      <div>
        <button type="submit">
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
  );
};

export default ShoppingItemForm;