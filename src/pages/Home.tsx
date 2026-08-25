import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import {
  addList,
  deleteList,
  setError,
  setLists,
  setLoading,
  updateList,
} from "../features/shoppingLists/shoppingListSlice";

import {
  createShoppingList,
  deleteShoppingList,
  getShoppingLists,
  updateShoppingList,
} from "../services/shoppingListService";

import ShoppingListCard from "../components/ShoppingListCard";
import ShoppingListForm from "../components/ShoppingListForm";

import type { ShoppingList } from "../types";

const Home = () => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(
    (state) => state.auth.currentUser
  );

  const { lists, loading, error } = useAppSelector(
    (state) => state.shoppingLists
  );
const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingList, setEditingList] =
    useState<ShoppingList | null>(null);

  useEffect(() => {
    const loadShoppingLists = async () => {
      if (!currentUser) {
        return;
      }

      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const data = await getShoppingLists(
          currentUser.id
        );

        dispatch(setLists(data));
      } catch {
        dispatch(
          setError("Unable to load shopping lists.")
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadShoppingLists();
  }, [currentUser, dispatch]);
const handleCreateList = async (
  shoppingList: Omit<ShoppingList, "id">
) => {
  if (!currentUser) {
    return;
  }

  try {
    dispatch(setError(null));

    const newList = await createShoppingList({
      ...shoppingList,
      userId: currentUser.id,
    });

    dispatch(addList(newList));
 setMessage(
  "Shopping list created successfully."
);
    setShowForm(false);
  } catch (error) {
    console.error(
      "Create shopping list error:",
      error
    );

    dispatch(
      setError("Unable to create shopping list.")
    ); 
  }

};

  const handleUpdateList = async (
    shoppingList: Omit<ShoppingList, "id">
  ) => {
    if (!editingList) {
      return;
    }

    try {
      dispatch(setError(null));

      const updatedList =
        await updateShoppingList(
          editingList.id,
          shoppingList
        );

      dispatch(updateList(updatedList));
 setMessage(
  "Shopping list updated successfully."
);
      setEditingList(null);
      setShowForm(false);
    } catch {
      dispatch(
        setError("Unable to update shopping list.")
      );
    }
   
  };

  const handleDeleteList = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this shopping list?"
    );

    if (!confirmed) {
      return;
    }

    try {
      dispatch(setError(null));

      await deleteShoppingList(id);

      dispatch(deleteList(id));
        setMessage(
  "Shopping list deleted successfully."
);
    } catch {
      dispatch(
        setError("Unable to delete shopping list.")
      );
      
    }
  
  };

  const handleEdit = (shoppingList: ShoppingList) => {
    setEditingList(shoppingList);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingList(null);
  };

  if (!currentUser) {
    return null;
  }
const handleShare = async (
  shoppingList: ShoppingList
) => {
  const shareUrl =
    `${window.location.origin}/lists/${shoppingList.id}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: shoppingList.name,
        text: `Check out my shopping list: ${shoppingList.name}`,
        url: shareUrl,
      });

      setMessage(
        "Shopping list shared successfully."
      );

      return;
    }

    await navigator.clipboard.writeText(
      shareUrl
    );

    setMessage(
      "Shopping list link copied to clipboard."
    );
  } catch {
    setError(
      "Unable to share the shopping list."
    );
  }
};
  return (
    <main>
      <header>
        <h1>My Shopping Lists</h1>

        <button
          type="button"
          onClick={() => {
            setEditingList(null);
            setShowForm(true);
          }}
        >
          + New Shopping List
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
        <ShoppingListForm
          existingList={editingList}
          onSubmit={
            editingList
              ? handleUpdateList
              : handleCreateList
          }
          onCancel={handleCancel}
        />
      )}

      {loading && (
        <p>Loading shopping lists...</p>
      )}

      {!loading && lists.length === 0 && (
        <p>
          You don't have any shopping lists yet.
        </p>
      )}

      {!loading && lists.length > 0 && (
        <section>
          {lists.map((shoppingList) => (
         <ShoppingListCard
  key={shoppingList.id}
  shoppingList={shoppingList}
  onEdit={handleEdit}
  onDelete={handleDeleteList}
  onShare={handleShare}
/>
          ))}
        </section>
      )}
    </main>
  );
};

export default Home;