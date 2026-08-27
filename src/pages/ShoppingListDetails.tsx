import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../store/hooks";
import CategoryGroupedItems from "../components/CategoryGroupedItems";
import {
  setItems,
  addItem,
  updateItem,
  deleteItem,
  setLoading,
  setError,
} from "../features/shoppingLists/shoppingItemSlice";

import {
  getShoppingItems,
  createShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
} from "../services/shoppingItemService";

import ShoppingItemForm from "../components/ShoppingItemForm";
import ShoppingItemCard from "../components/ShoppingItemCard";

import type { ShoppingItem } from "../types";

const ShoppingListDetails = () => {
  const { listId } = useParams();

  const dispatch = useAppDispatch();

  const { items, loading, error } =
    useAppSelector(
      (state) => state.shoppingItems
    );

  const lists = useAppSelector(
    (state) => state.shoppingLists.lists
  );

  const shoppingList = lists.find(
    (list) => list.id === listId
  );
const [message, setMessage] =useState("");
  const [searchParams, setSearchParams] =
    useSearchParams();

  const searchQuery =
    searchParams.get("search") ?? "";

  const sortValue =
    searchParams.get("sort") ?? "name";

  const [showForm, setShowForm] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState<ShoppingItem | null>(null);

  /*
   * Load items
   */
  useEffect(() => {
    if (!listId) {
      return;
    }

    const loadItems = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const data =
          await getShoppingItems(listId);

        dispatch(setItems(data));
      } catch {
        dispatch(
          setError(
            "Unable to load shopping items."
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadItems();
  }, [listId, dispatch]);

  /*
   * Search and sorting
   */
  const filteredAndSortedItems =
    useMemo(() => {
      let result = [...items];

      /*
       * Search by item name
       */
      if (searchQuery.trim()) {
        const search =
          searchQuery
            .trim()
            .toLowerCase();

        result = result.filter((item) =>
          item.name
            .toLowerCase()
            .includes(search)
        );
      }

      /*
       * Sort items
       */
      result.sort((a, b) => {
        switch (sortValue) {
          case "name":
            return a.name.localeCompare(
              b.name
            );

          case "category":
            return a.category.localeCompare(
              b.category
            );

          case "date":
            return (
              new Date(
                a.dateAdded
              ).getTime() -
              new Date(
                b.dateAdded
              ).getTime()
            );

          default:
            return 0;
        }
      });

      return result;
    }, [items, searchQuery, sortValue]);
const totalItems = items.length;

const boughtItems = items.filter(
  (item) => item.completed
).length;

const remainingItems =
  totalItems - boughtItems;

const progressPercentage =
  totalItems > 0
    ? Math.round(
        (boughtItems / totalItems) * 100
      )
    : 0;
  /*
   * Search handler
   */
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    const newParams =
      new URLSearchParams(searchParams);

    if (value.trim()) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }

    setSearchParams(newParams);
  };

  /*
   * Sort handler
   */
  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;

    const newParams =
      new URLSearchParams(searchParams);

    if (value) {
      newParams.set("sort", value);
    } else {
      newParams.delete("sort");
    }

    setSearchParams(newParams);
  };
/* check */
const handleToggleItem = async (
  item: ShoppingItem
) => {
  try {
    dispatch(setError(null));

    const updatedItem =
      await updateShoppingItem(item.id, {
        completed: !item.completed,
      });

    dispatch(updateItem(updatedItem));
  } catch {
    dispatch(
      setError(
        "Unable to update shopping item."
      )
    );
  }
};
  /*
   * Create item
   */
  const handleCreateItem = async (
    item: Omit<ShoppingItem, "id">
  ) => {
    try {
      dispatch(setError(null));

      const newItem =
        await createShoppingItem(item);

      dispatch(addItem(newItem));
setMessage(
  "Shopping item added successfully."
);
      setShowForm(false);
    } catch {
      dispatch(
        setError(
          "Unable to create shopping item."
        )
      );

    }
  };

  /*
   * Update item
   */
  const handleUpdateItem = async (
    item: Omit<ShoppingItem, "id">
  ) => {
    if (!editingItem) {
      return;
    }

    try {
      dispatch(setError(null));

      const updatedItem =
        await updateShoppingItem(
          editingItem.id,
          item
        );

      dispatch(updateItem(updatedItem));
setMessage(
  "Shopping item updated successfully."
);
      setEditingItem(null);
      setShowForm(false);
    } catch {
      dispatch(
        setError(
          "Unable to update shopping item."
        )
      );
    }
  };

  /*
   * Delete item
   */
  const handleDeleteItem = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) {
      return;
    }

    try {
      dispatch(setError(null));
setMessage(
  "Shopping item deleted successfully."
);
      await deleteShoppingItem(id);

      dispatch(deleteItem(id));
    } catch {
      dispatch(
        setError(
          "Unable to delete shopping item."
        )
      );
    }
  };

  /*
   * Edit item
   */
  const handleEdit = (
    item: ShoppingItem
  ) => {
    setEditingItem(item);
    setShowForm(true);
  };

  /*
   * Cancel form
   */
  const handleCancel = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  if (!shoppingList) {
    return (
      <main>
        <h1>Shopping list not found</h1>

        <Link to="/">
          Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main>
      <Link to="/">
        ← Back to My Shopping Lists
      </Link>

      <header>
        <h1>{shoppingList.name}</h1>

        <p>
          Created:{" "}
          {new Date(
            shoppingList.dateAdded
          ).toLocaleDateString()}
        </p>
<div className="shopping-progress">
  <div className="shopping-progress-header">
    <span>
      {boughtItems} of {totalItems} items bought
    </span>

    <span>
      {progressPercentage}%
    </span>
  </div>

  <div
    className="shopping-progress-bar"
    aria-label={`${progressPercentage}% of items bought`}
  >
    <div
      className="shopping-progress-fill"
      style={{
        width: `${progressPercentage}%`,
      }}
    />
  </div>

  {remainingItems > 0 ? (
    <p>
      {remainingItems}{" "}
      {remainingItems === 1
        ? "item"
        : "items"}{" "}
      remaining
    </p>
  ) : totalItems > 0 ? (
    <p>
       All items bought!
    </p>
  ) : (
    <p>
      Add items to start shopping.
    </p>
  )}
</div>
        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
        >
          + Add Item
        </button>
      </header>
{message && (
  <p role="status">
    {message}
  </p>
)}
      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {showForm && (
        <ShoppingItemForm
          listId={listId!}
          existingItem={editingItem}
          onSubmit={
            editingItem
              ? handleUpdateItem
              : handleCreateItem
          }
          onCancel={handleCancel}
        />
      )}

      {/* Search and sorting */}
      <section>
        <label htmlFor="item-search">
          Search items
        </label>

        <input
          id="item-search"
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by item name..."
        />

        <label htmlFor="item-sort">
          Sort by
        </label>

        <select
          id="item-sort"
          value={sortValue}
          onChange={handleSortChange}
        >
          <option value="name">
            Name
          </option>

          <option value="category">
            Category
          </option>

          <option value="date">
            Date added
          </option>
        </select>
      </section>

      {/* Items */}
    {/* Items */}
<section>
  <h2>
    Items ({filteredAndSortedItems.length})
  </h2>

  {loading && (
    <p>Loading items...</p>
  )}

  {!loading &&
    filteredAndSortedItems.length === 0 && (
      <p>
        {searchQuery
          ? "No items match your search."
          : "This shopping list doesn't have any items yet."}
      </p>
    )}

  {!loading &&
    filteredAndSortedItems.length > 0 && (
      <>
        {sortValue === "category" ? (
          <CategoryGroupedItems
            items={filteredAndSortedItems}
            onEdit={handleEdit}
            onDelete={handleDeleteItem}
            onToggle={handleToggleItem}
          />
        ) : (
          <div>
            {filteredAndSortedItems.map(
              (item) => (
                <ShoppingItemCard
  key={item.id}
  item={item}
  onEdit={handleEdit}
  onDelete={handleDeleteItem}
  onToggle={handleToggleItem}
/>
              )
            )}
          </div>
        )}
      </>
    )}
</section>
    </main>
  );
};

export default ShoppingListDetails;