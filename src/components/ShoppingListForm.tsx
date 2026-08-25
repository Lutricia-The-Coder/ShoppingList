import { type FormEvent, useEffect, useState } from "react";
import type { ShoppingList } from "../types";

interface ShoppingListFormProps {
  existingList?: ShoppingList | null;
  onSubmit: (
    shoppingList: Omit<ShoppingList, "id">
  ) => void;
  onCancel: () => void;
}

const ShoppingListForm = ({
  existingList,
  onSubmit,
  onCancel,
}: ShoppingListFormProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (existingList) {
      setName(existingList.name);
    } else {
      setName("");
    }
  }, [existingList]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      userId: existingList?.userId ?? "",
      dateAdded:
        existingList?.dateAdded ??
        new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>
        {existingList
          ? "Edit Shopping List"
          : "Create Shopping List"}
      </h2>

      <label htmlFor="list-name">
        List name
      </label>

      <input
        id="list-name"
        type="text"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
        placeholder="e.g. Weekend Groceries"
        required
      />

      <div>
        <button type="submit">
          {existingList
            ? "Save Changes"
            : "Create List"}
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

export default ShoppingListForm;