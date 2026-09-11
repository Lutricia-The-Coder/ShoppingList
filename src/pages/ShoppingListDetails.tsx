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
import ConfirmationDialog from "../components/ConfirmationDialog";
import toast from "react-hot-toast";

import type { ShoppingItem } from "../types";

const ShoppingListDetails = () => {
  const { listId } = useParams();

  const dispatch = useAppDispatch();

  const { items, loading } =
    useAppSelector(
      (state) => state.shoppingItems
    );

  const lists = useAppSelector(
    (state) => state.shoppingLists.lists
  );

  const shoppingList = lists.find(
    (list) => list.id === listId
  );

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

  const [itemToDelete, setItemToDelete] =
    useState<string | null>(null);

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
        toast.error("Unable to load shopping items.");
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadItems();
  }, [listId, dispatch]);

 
  const filteredAndSortedItems =
    useMemo(() => {
      let result = [...items];

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
    }, [
      items,
      searchQuery,
      sortValue,
    ]);

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


  const handleToggleItem = async (
    item: ShoppingItem
  ) => {
    try {
      dispatch(setError(null));

      const updatedItem =
        await updateShoppingItem(
          item.id,
          {
            completed: !item.completed,
          }
        );

      dispatch(updateItem(updatedItem));
    } catch {
      toast.error("Unable to update shopping item.");
    }
  };


  const handleCreateItem = async (
    item: Omit<ShoppingItem, "id">
  ) => {
    const itemAlreadyOnList = items.some(
      (existingItem) =>
        existingItem.name.trim().toLowerCase() ===
        item.name.trim().toLowerCase()
    );

    if (itemAlreadyOnList) {
      toast.error("Item is already on the list.");
      return;
    }

    try {
      dispatch(setError(null));

      const newItem =
        await createShoppingItem({
          ...item,
          listId: listId!,
        });

      dispatch(addItem(newItem));

      toast.success("Shopping item added successfully.");

      setEditingItem(null);
      setShowForm(false);
    } catch (error) {
      console.error(
        "Create shopping item error:",
        error
      );

      toast.error("Unable to create shopping item.");
    }
  };


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

      toast.success("Shopping item updated successfully.");

      setEditingItem(null);
      setShowForm(false);
    } catch {
      toast.error("Unable to update shopping item.");
    }
  };

 
  const handleDeleteItem = async (id: string) => {
    try {
      dispatch(setError(null));

      await deleteShoppingItem(id);

      dispatch(deleteItem(id));

      toast.success("Shopping item deleted successfully.");
    } catch {
      toast.error("Unable to delete shopping item.");
    } finally {
      setItemToDelete(null);
    }
  };

 
  const handleEdit = (
    item: ShoppingItem
  ) => {
    setEditingItem(item);
    setShowForm(true);
    dispatch(setError(null));
  };

 
  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
    dispatch(setError(null));
  };

 
  const handleCancel = () => {
    setEditingItem(null);
    setShowForm(false);
    dispatch(setError(null));
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

  if (showForm) {
    return (
      <main className="dashboard-container">
        <section className="dashboard-form-section">
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
        </section>
      </main>
    );
  }


  return (
    <main className="dashboard-container">


      <div className="list-top-bar">

        <Link
          to="/"
          className="back-link"
        >
          &lt; Back
        </Link>

        <button
          type="button"
          className="add-item-btn-blue"
          onClick={handleAddItem}
        >
          + Add Item
        </button>

      </div>


      <header>
        <h1>
          {shoppingList.name}
        </h1>

        <p>
          Created:{" "}
          {new Date(
            shoppingList.dateAdded
          ).toLocaleDateString()}
        </p>


        <div className="shopping-progress">

          <div className="shopping-progress-header">

            <span>
              {boughtItems} of{" "}
              {totalItems} items bought
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
      </header>

      


      <section className="shopping-list-controls">

        <div className="shopping-list-control">

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

        </div>

        <div className="shopping-list-control">

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

        </div>

      </section>

      
      <section className="shopping-list-items-section">

        {itemToDelete && (
          <ConfirmationDialog
            title="Delete shopping item?"
            message="This item will be permanently removed from your list."
            onCancel={() => setItemToDelete(null)}
            onConfirm={() => handleDeleteItem(itemToDelete)}
          />
        )}

        <h2>
          Items (
          {filteredAndSortedItems.length}
          )
        </h2>

        {loading && (
          <p>
            Loading items...
          </p>
        )}

        {!loading &&
          filteredAndSortedItems.length ===
            0 && (
            <p>
              {searchQuery
                ? "No items match your search."
                : "This shopping list doesn't have any items yet."}
            </p>
          )}

        {!loading &&
          filteredAndSortedItems.length >
            0 && (
            <>
              {sortValue === "category" ? (
                <CategoryGroupedItems
                  items={
                    filteredAndSortedItems
                  }
                  onEdit={handleEdit}
                  onDelete={
                    setItemToDelete
                  }
                  onToggle={
                    handleToggleItem
                  }
                />
              ) : (
                <div>
                  {filteredAndSortedItems.map(
                    (item) => (
                      <ShoppingItemCard
                        key={item.id}
                        item={item}
                        onEdit={handleEdit}
                        onDelete={
                          setItemToDelete
                        }
                        onToggle={
                          handleToggleItem
                        }
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