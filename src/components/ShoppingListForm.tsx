import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import type {
  ShoppingItem,
  ShoppingList,
} from "../types";

import { searchUnsplashImage } from "../services/unsplashService";

interface NewListItem {
  name: string;
  quantity: number;
  notes: string;
  image: string;
  imageAuthor: string;
imageUsername: string;

}

interface CategoryGroup {
  id: string;
  category: string;
  items: NewListItem[];
}

interface ShoppingListFormProps {
  existingList?: ShoppingList | null;

  onSubmit: (
    shoppingList: Omit<ShoppingList, "id">,
    items?: Omit<
      ShoppingItem,
      "id" | "listId"
    >[]
  ) => void;

  onCancel: () => void;
}

const createEmptyItem = (): NewListItem => ({
  name: "",
  quantity: 1,
  notes: "",
  image: "",
  imageAuthor: "",
    imageUsername: "",
});

const createCategoryGroup = (): CategoryGroup => ({
  id: crypto.randomUUID(),
  category: "",
  items: [createEmptyItem()],
});

const ShoppingListForm = ({
  existingList,
  onSubmit,
  onCancel,
}: ShoppingListFormProps) => {
  const [name, setName] = useState("");

  const [categories, setCategories] =
    useState<CategoryGroup[]>([
      createCategoryGroup(),
    ]);

  const [loadingImage, setLoadingImage] =
    useState<string | null>(null);

  const [imageError, setImageError] =
    useState<string | null>(null);

  /*
   * Populate form when editing
   * or reset it when creating.
   */
  useEffect(() => {
    if (existingList) {
      setName(existingList.name);

      /*
       * Items are managed separately
       * on the ShoppingListDetails page.
       */
      setCategories([]);
    } else {
      setName("");

      setCategories([
        createCategoryGroup(),
      ]);
    }

    setImageError(null);
  }, [existingList]);

  /*
   * Change category
   */
  const handleCategoryChange = (
    categoryId: string,
    value: string
  ) => {
    setCategories((previous) =>
      previous.map((group) =>
        group.id === categoryId
          ? {
              ...group,
              category: value,
            }
          : group
      )
    );
  };

  /*
   * Change item field
   */
  const handleItemChange = (
    categoryId: string,
    itemIndex: number,
    field: keyof NewListItem,
    value: string | number
  ) => {
    setCategories((previous) =>
      previous.map((group) => {
        if (group.id !== categoryId) {
          return group;
        }

        return {
          ...group,
          items: group.items.map(
            (item, index) =>
              index === itemIndex
                ? {
                    ...item,
                    [field]: value,
                  }
                : item
          ),
        };
      })
    );
  };

  /*
   * Find an image from Unsplash
   *
   * Runs when the user leaves
   * the item name field.
   */
  const handleFindImage = async (
    categoryId: string,
    itemIndex: number,
    itemName: string
  ) => {
    if (!itemName.trim()) {
      return;
    }

    const loadingKey =
      `${categoryId}-${itemIndex}`;

    try {
      setLoadingImage(loadingKey);
      setImageError(null);

      const photo =
        await searchUnsplashImage(itemName);

      if (!photo) {
        setImageError(
          `No image found for "${itemName}".`
        );

        return;
      }

      setCategories((previous) =>
        previous.map((group) => {
          if (group.id !== categoryId) {
            return group;
          }

          return {
            ...group,

            items: group.items.map(
              (item, index) => {
                if (index !== itemIndex) {
                  return item;
                }

                return {
                  ...item,
                  image: photo.urls.small,
                  imageAuthor: photo.user.name,
                  imageAuthorUrl:
                    `https://unsplash.com/@${photo.user.username}`,
                };
              }
            ),
          };
        })
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
      setLoadingImage(null);
    }
  };

  /*
   * Add another item to the
   * SAME category.
   */
  const handleAddItem = (
    categoryId: string
  ) => {
    setCategories((previous) =>
      previous.map((group) =>
        group.id === categoryId
          ? {
              ...group,
              items: [
                ...group.items,
                createEmptyItem(),
              ],
            }
          : group
      )
    );
  };

  /*
   * Remove an item
   */
  const handleRemoveItem = (
    categoryId: string,
    itemIndex: number
  ) => {
    setCategories((previous) =>
      previous.map((group) => {
        if (group.id !== categoryId) {
          return group;
        }

        return {
          ...group,
          items: group.items.filter(
            (_, index) =>
              index !== itemIndex
          ),
        };
      })
    );
  };

  /*
   * Add another category
   */
  const handleAddCategory = () => {
    setCategories((previous) => [
      ...previous,
      createCategoryGroup(),
    ]);
  };

  /*
   * Remove a category
   */
  const handleRemoveCategory = (
    categoryId: string
  ) => {
    setCategories((previous) =>
      previous.filter(
        (group) => group.id !== categoryId
      )
    );
  };

  /*
   * Submit form
   */
  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault();

    setImageError(null);

    if (!name.trim()) {
      setImageError(
        "Please enter a shopping list name."
      );
      return;
    }

    /*
     * Editing an existing list only
     * changes the list name.
     */
    if (existingList) {
      onSubmit({
        name: name.trim(),
        userId: existingList.userId,
        dateAdded: existingList.dateAdded,
      });

      return;
    }

    /*
     * Make sure every category
     * has been selected.
     */
    const invalidCategory =
      categories.some(
        (group) => !group.category
      );

    if (invalidCategory) {
      setImageError(
        "Please select a category for every section."
      );

      return;
    }

    /*
     * Make sure every category
     * contains at least one item.
     */
    const emptyCategory =
      categories.some(
        (group) =>
          group.items.length === 0
      );

    if (emptyCategory) {
      setImageError(
        "Every category must contain at least one item."
      );

      return;
    }

    /*
     * Validate item names and quantities.
     */
    const invalidItem =
      categories.some((group) =>
        group.items.some(
          (item) =>
            !item.name.trim() ||
            item.quantity < 1
        )
      );

    if (invalidItem) {
      setImageError(
        "Please enter a name and valid quantity for every item."
      );

      return;
    }

    const dateAdded =
      new Date().toISOString();

    /*
     * Create the shopping list.
     */
    const shoppingList: Omit<
      ShoppingList,
      "id"
    > = {
      name: name.trim(),
      userId: "",
      dateAdded,
    };

    /*
     * Convert category groups into
     * individual ShoppingItems.
     *
     * The category selected for the
     * group is saved on every item.
     */
    const shoppingItems: Omit<
      ShoppingItem,
      "id" | "listId"
    >[] = categories.flatMap(
      (group) =>
        group.items.map((item) => ({
          name: item.name.trim(),
          quantity: item.quantity,
          notes: item.notes.trim(),
          category: group.category,
          image: item.image,
          imageAuthor: item.imageAuthor,
      
          imageUsername: item.imageUsername,
          completed: false,
          dateAdded,
        }))
    );

    onSubmit(
      shoppingList,
      shoppingItems
    );
  };

 
return (
  
  <form
    className="shopping-list-form"
    onSubmit={handleSubmit}
  >
    <h2>
      {existingList
        ? "Edit Shopping List"
        : "Create Shopping List"}
    </h2>

    {/* LIST NAME */}

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
      placeholder="e.g. Weekend Shopping"
      required
    />

    {!existingList && (
      <>
        {/* CATEGORY GROUPS */}

        {categories.map((group, categoryIndex) => (
          <section
            className="category-group"
            key={group.id}
          >
            {/* CATEGORY HEADER */}

            <div className="category-header">
              <h3>
                Category {categoryIndex + 1}
              </h3>

              {categories.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveCategory(group.id)
                  }
                >
                  Remove Category
                </button>
              )}
            </div>

            {/* CATEGORY */}

            <label
              htmlFor={`category-${group.id}`}
            >
              Category
            </label>

            <select
              id={`category-${group.id}`}
              value={group.category}
              onChange={(event) =>
                handleCategoryChange(
                  group.id,
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

            {/* ITEMS */}

            <div className="category-items">
              {group.items.map(
                (item, itemIndex) => {
                  const loadingKey =
                    `${group.id}-${itemIndex}`;

                  return (
                    <div
                      className="new-item"
                      key={`${group.id}-${itemIndex}`}
                    >
                      {/* ITEM NAME */}

                      <label
                        htmlFor={`item-name-${group.id}-${itemIndex}`}
                      >
                        Item name
                      </label>

                      <input
  id={`item-name-${group.id}-${itemIndex}`}
  type="text"
  value={item.name}
  onChange={(event) =>
    handleItemChange(
      group.id,
      itemIndex,
      "name",
      event.target.value
    )
  }
  onBlur={() =>
    handleFindImage(
      group.id,
      itemIndex,
      item.name
    )
  }
  onKeyDown={(event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      handleFindImage(
        group.id,
        itemIndex,
        item.name
      );
    }
  }}
  placeholder="e.g. Milk"
  required
/>

                      {/* IMAGE LOADING */}

                      {loadingImage ===
                        loadingKey && (
                        <p>
                          Finding image...
                        </p>
                      )}

                      {/* IMAGE */}

                      {item.image && (
                        <div className="item-image-preview">
                          <img
                            src={item.image}
                            alt={item.name}
                          />

                          {item.imageAuthor && (
                            <small>
                              Photo by{" "}
                              <a
                                href={`${item.imageUsername}?utm_source=shopping_list_app&utm_medium=referral`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {item.imageAuthor}
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
 
                      {/* QUANTITY */} 
 
                      <label 
                        htmlFor={`item-quantity-${group.id}-${itemIndex}`} 
                      > 
                        Quantity 
                      </label> 
 
                      <input 
                        id={`item-quantity-${group.id}-${itemIndex}`} 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(event) => 
                          handleItemChange( 
                            group.id, 
                            itemIndex, 
                            "quantity", 
                            Number( 
                              event.target.value 
                            ) 
                          ) 
                        } 
                        required 
                      /> 
 
                      {/* NOTES */} 
 
                      <label 
                        htmlFor={`item-notes-${group.id}-${itemIndex}`} 
                      > 
                        Notes 
                      </label> 
 
                      <textarea 
                        id={`item-notes-${group.id}-${itemIndex}`} 
                        value={item.notes} 
                        onChange={(event) => 
                          handleItemChange( 
                            group.id, 
                            itemIndex, 
                            "notes", 
                            event.target.value 
                          ) 
                        } 
                        placeholder="Optional notes" 
                        rows={3} 
                      /> 
 
                      {/* REMOVE ITEM */} 
 
                      {group.items.length > 1 && ( 
                        <button 
                          type="button" 
                          onClick={() => 
                            handleRemoveItem( 
                              group.id, 
                              itemIndex 
                            ) 
                          } 
                        > 
                          Remove Item 
                        </button> 
                      )} 
                    </div> 
                  ); 
                } 
              )} 
            </div> 
 
            {/* CATEGORY BUTTONS */} 
 
            <div className="category-action-row"> 
              <button 
                type="button" 
                onClick={() => 
                  handleAddItem(group.id) 
                } 
              > 
                + ADD ANOTHER ITEM 
              </button> 
 
            </div> 
          </section> 
        ))} 
 
              <button 
                type="button" 
                onClick={handleAddCategory} 
              > 
                + ADD ANOTHER CATEGORY 
              </button> 
        {/* ERROR */} 
 
        {imageError && ( 
          <p role="alert"> 
            {imageError} 
          </p> 
        )} 
      </> 
    )} 
 
    {/* FORM ACTIONS */} 
 
    <div className="form-actions"> 
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
} 
export default ShoppingListForm; 
