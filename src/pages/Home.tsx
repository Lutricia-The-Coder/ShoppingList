import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import emptyCartImg from "../assets/empty-removebg-preview.png";
import { addList, deleteList, setError,setLists, setLoading,updateList,} from "../features/shoppingLists/shoppingListSlice";
import {  createShoppingList, deleteShoppingList, getShoppingLists, updateShoppingList,} from "../services/shoppingListService";
import { createShoppingItem } from "../services/shoppingItemService";
import type { ShoppingItem,ShoppingList,} from "../types";
import ShoppingListCard from "../components/ShoppingListCard";
import ShoppingListForm from "../components/ShoppingListForm";
import toast from "react-hot-toast";
const Home = () => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(
    (state) => state.auth.currentUser
  );

  const {
    lists,
    loading,
  } = useAppSelector(
    (state) => state.shoppingLists
  );

  const [showForm, setShowForm] =
    useState(false);

  const [editingList, setEditingList] =
    useState<ShoppingList | null>(null);

  
  useEffect(() => {
    const loadShoppingLists =
      async () => {
        if (!currentUser) return;

        try {
          dispatch(setLoading(true));
          dispatch(setError(null));

          const data =
            await getShoppingLists(
              currentUser.id
            );

          dispatch(setLists(data));
        } catch {
          toast.error("Unable to load shopping lists.");
        } finally {
          dispatch(setLoading(false));
        }
      };

    loadShoppingLists();
  }, [currentUser, dispatch]);
 
  const handleCreateList = async (
    shoppingList: Omit<
      ShoppingList,
      "id"
    >,
    items: Omit<
      ShoppingItem,
      "id" | "listId"
    >[] = []
  ) => {
    if (!currentUser) {
      return;
    }

    try {
      dispatch(setError(null));

      const newList =
        await createShoppingList({
          ...shoppingList,
          userId: currentUser.id,
        });

      
      for (const item of items) {
        await createShoppingItem({
          ...item,
          listId: newList.id,
        });
      }

      dispatch(addList(newList));

      toast.success("Shopping list created successfully.");

      setShowForm(false);
    } catch (error) {
      toast.error("Unable to create shopping list.");
      console.error(
        "Create shopping list error:",
        error
      );

      dispatch(setError(null));
    }
  };

  
  const handleUpdateList = async (
    shoppingList: Omit<
      ShoppingList,
      "id"
    >
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

      toast.success("Shopping list updated successfully.");

      setEditingList(null);
      setShowForm(false);
    } catch {
      toast.error("Unable to update shopping list.");
    }
  };


  const handleDeleteList = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this shopping list?"
      );

    if (!confirmed) {
      return;
    }

    try {
      dispatch(setError(null));

      await deleteShoppingList(id);

      dispatch(deleteList(id));

      toast.success("Shopping list deleted successfully.");
    } catch {
      toast.error("Unable to delete shopping list.");
    }
  };

  const handleEdit = (
    shoppingList: ShoppingList
  ) => {
    setEditingList(shoppingList);
    setShowForm(true);
  };

 
  const handleCancel = () => {
    setShowForm(false);
    setEditingList(null);
  };

  
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

        toast.success("Shopping list shared successfully.");

        return;
      }

      await navigator.clipboard.writeText(
        shareUrl
      );

      toast.success("Shopping list link copied to clipboard.");
    } catch {
      toast.error("Failed to share the shopping list.");
    }
  };


  const handleNewList = () => {
    setEditingList(null);
    setShowForm(true);
    dispatch(setError(null));
  };

  if (!currentUser) {
    return null;
  }

  return (
    <main className="dashboard-container">

      <header className="dashboard-header">

        <div className="dashboard-brand-title">
          <h1>
            My Shopping Lists
          </h1>

          
        </div>

        <button
          type="button"
          className="btn-pill-submit-sm"
          onClick={handleNewList}
        >
          + New List
        </button>

      </header>


      {showForm && (
        <section className="dashboard-form-section">

          <ShoppingListForm
            existingList={editingList}
            onSubmit={
              editingList
                ? handleUpdateList
                : handleCreateList
            }
            onCancel={handleCancel}
          />

        </section>
      )}


   
      {loading && (
        <div className="dashboard-loading">
          <p>
            Loading shopping lists...
          </p>
        </div>
      )}

      {!loading &&
        lists.length === 0 &&
        !showForm && (
          <section className="dashboard-empty-state">

           <img
  src={emptyCartImg}
  alt="No shopping lists"
  className="empty-state-image"
/>
            <h2>
              No shopping lists yet
            </h2>
<p>
            Manage all your shopping lists
            in one place.
          </p>
            <p>
              Create your first shopping
              list to get started.
            </p>

            <button
              type="button"
              className="btn-pill-submit-sm"
              onClick={handleNewList}
            >
              + Create List
            </button>

          </section>
        )}


      {!loading &&
        lists.length > 0 &&
        !showForm && (
          <section className="shopping-lists-section">

            <div className="shopping-lists-heading">
              <div>
                <h2>
                  Your Lists
                </h2>

                <p>
                  {lists.length}{" "}
                  {lists.length === 1
                    ? "shopping list"
                    : "shopping lists"}
                </p>
              </div>
            </div>


            <div className="shopping-lists-grid">

              {lists.map(
                (shoppingList) => (
                  <ShoppingListCard
                    key={shoppingList.id}
                    shoppingList={
                      shoppingList
                    }
                    onEdit={
                      handleEdit
                    }
                    onDelete={
                      handleDeleteList
                    }
                    onShare={
                      handleShare
                    }
                  />
                )
              )}

            </div>

          </section>
        )}

    </main>
  );
};

export default Home;