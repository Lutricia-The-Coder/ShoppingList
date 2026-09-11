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
import { getItemCategory } from "../types/categoryRules";

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

 
  addItemMode?: boolean;

  listId?: string;

  onSubmit: (
    shoppingList: Omit<ShoppingList, "id">,
    items?: Omit<
      ShoppingItem,
      "id" | "listId"
    >[]
  ) => void | Promise<void>;

  onCancel: () => void;
  isSubmitting?: boolean;
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
  addItemMode = false,
  listId,
  onSubmit,
  onCancel,
  isSubmitting = false,
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

  useEffect(() => {

    if (addItemMode && existingList) {
      setName(existingList.name);

      setCategories([
        createCategoryGroup(),
      ]);

      setImageError(null);
      setLoadingImage(null);

      return;
    }

    if (existingList) {
      setName(existingList.name);

      setCategories([]);

      setImageError(null);
      setLoadingImage(null);

      return;
    }

    
    setName("");

    setCategories([
      createCategoryGroup(),
    ]);

    setImageError(null);
    setLoadingImage(null);
  }, [existingList, addItemMode]);

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
        await searchUnsplashImage(
          itemName.trim()
        );

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
                  imageAuthor:
                    photo.user.name,
                  imageUsername:
                    photo.user.username,
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


  const handleAddCategory = () => {
    setCategories((previous) => [
      ...previous,
      createCategoryGroup(),
    ]);
  };


  const handleRemoveCategory = (
    categoryId: string
  ) => {
    setCategories((previous) =>
      previous.filter(
        (group) => group.id !== categoryId
      )
    );
  };

  
  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault();

    setImageError(null);

    
   
    if (addItemMode) {
      if (!listId) {
        setImageError(
          "Unable to identify the shopping list."
        );

        return;
      }

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

      const mismatchedItem = categories
        .flatMap((group) =>
          group.items.map((item) => ({
            category: group.category,
            name: item.name.trim(),
          }))
        )
        .find((item) => {
          const detectedCategory = getItemCategory(item.name);

          return detectedCategory && detectedCategory !== item.category;
        });

      if (mismatchedItem) {
        setImageError(
          `"${mismatchedItem.name}" does not match the ${mismatchedItem.category} category.`
        );

        return;
      }

      const dateAdded =
        new Date().toISOString();

      const shoppingItems =
        categories.flatMap(
          (group) =>
            group.items.map((item) => ({
              name: item.name.trim(),
              quantity: item.quantity,
              notes: item.notes.trim(),
              category: group.category,
              image: item.image,
              imageAuthor:
                item.imageAuthor,
              imageUsername:
                item.imageUsername,
              completed: false,
              dateAdded,
            }))
        );

     

      onSubmit(
        {
          name:
            existingList?.name ?? "",
          userId:
            existingList?.userId ?? "",
          dateAdded:
            existingList?.dateAdded ??
            dateAdded,
        },
        shoppingItems
      );

      return;
    }

    if (existingList) {
      if (!name.trim()) {
        setImageError(
          "Please enter a shopping list name."
        );

        return;
      }

      onSubmit({
        name: name.trim(),
        userId: existingList.userId,
        dateAdded: existingList.dateAdded,
      });

      return;
    }

    if (!name.trim()) {
      setImageError(
        "Please enter a shopping list name."
      );

      return;
    }

   
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

    const mismatchedItem = categories
      .flatMap((group) =>
        group.items.map((item) => ({
          category: group.category,
          name: item.name.trim(),
        }))
      )
      .find((item) => {
        const detectedCategory = getItemCategory(item.name);

        return detectedCategory && detectedCategory !== item.category;
      });

    if (mismatchedItem) {
      setImageError(
        `"${mismatchedItem.name}" does not match the ${mismatchedItem.category} category.`
      );

      return;
    }

    const dateAdded =
      new Date().toISOString();

    
    const shoppingList: Omit<
      ShoppingList,
      "id"
    > = {
      name: name.trim(),
      userId: "",
      dateAdded,
    };

 
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
          imageAuthor:
            item.imageAuthor,
          imageUsername:
            item.imageUsername,
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
   

      <div className="shopping-list-form-header">
        <h2>
          {existingList
            ? addItemMode
              ? "Add Shopping Items"
              : "Edit Shopping List"
            : "Create Shopping List"}
        </h2>

        <p>
          {existingList
            ? addItemMode
              ? `Add items to "${existingList.name}".`
              : "Update the details of your shopping list."
            : "Create a shopping list and add your items."}
        </p>
      </div>

      

      {!addItemMode && (
        <>
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
        </>
      )}


      {addItemMode && existingList && (
        <div className="shopping-form-existing-list">
          <span>Shopping list</span>

          <strong>
            {existingList.name}
          </strong>
        </div>
      )}

    

      {(!existingList ||
        addItemMode) && (
        <>
          {categories.map(
            (group, categoryIndex) => (
              <section
                className="category-group"
                key={group.id}
              >
                

                <div className="category-header">
                  <h3>
                    Category{" "}
                    {categoryIndex + 1}
                  </h3>

                  {categories.length >
                    1 && (
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveCategory(
                          group.id
                        )
                      }
                    >
                      Remove Category
                    </button>
                  )}
                </div>


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

               

                <div className="category-items">
                  {group.items.map(
                    (
                      item,
                      itemIndex
                    ) => {
                      const loadingKey =
                        `${group.id}-${itemIndex}`;

                      return (
                        <div
                          className="new-item"
                          key={`${group.id}-${itemIndex}`}
                        >
                         

                          <label
                            htmlFor={`item-name-${group.id}-${itemIndex}`}
                          >
                            Item name
                          </label>

                          <input
                            id={`item-name-${group.id}-${itemIndex}`}
                            type="text"
                            value={item.name}
                            onChange={(
                              event
                            ) =>
                              handleItemChange(
                                group.id,
                                itemIndex,
                                "name",
                                event.target
                                  .value
                              )
                            }
                            onBlur={() =>
                              handleFindImage(
                                group.id,
                                itemIndex,
                                item.name
                              )
                            }
                            onKeyDown={(
                              event
                            ) => {
                              if (
                                event.key ===
                                "Enter"
                              ) {
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

                         

                          {loadingImage ===
                            loadingKey && (
                            <p>
                              Finding image...
                            </p>
                          )}

                        

                          {item.image && (
                            <div className="item-image-preview">
                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.name
                                }
                              />

                              {item.imageAuthor && (
                                <small>
                                  Photo by{" "}
                                  <a
                                    href={`https://unsplash.com/@${item.imageUsername}?utm_source=shopping_list_app&utm_medium=referral`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {
                                      item.imageAuthor
                                    }
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

                       

                          <label
                            htmlFor={`item-quantity-${group.id}-${itemIndex}`}
                          >
                            Quantity
                          </label>

                          <input
                            id={`item-quantity-${group.id}-${itemIndex}`}
                            type="number"
                            min="1"
                            value={
                              item.quantity
                            }
                            onChange={(
                              event
                            ) =>
                              handleItemChange(
                                group.id,
                                itemIndex,
                                "quantity",
                                Number(
                                  event.target
                                    .value
                                )
                              )
                            }
                            required
                          />

                        

                          <label
                            htmlFor={`item-notes-${group.id}-${itemIndex}`}
                          >
                            Notes
                          </label>

                          <textarea
                            id={`item-notes-${group.id}-${itemIndex}`}
                            value={
                              item.notes
                            }
                            onChange={(
                              event
                            ) =>
                              handleItemChange(
                                group.id,
                                itemIndex,
                                "notes",
                                event.target
                                  .value
                              )
                            }
                            placeholder="Optional notes"
                            rows={3}
                          />

                       

                          {group.items.length >
                            1 && (
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

          
                <div className="category-action-row">
                  <button
                    type="button"
                    onClick={() =>
                      handleAddItem(
                        group.id
                      )
                    }
                  >
                    + ADD ANOTHER ITEM
                  </button>
                   <button
            type="button"
            onClick={handleAddCategory}
          >
            + ADD ANOTHER CATEGORY
          </button>
                </div>
              </section>
            )
          )}



          {imageError && (
            <p role="alert">
              {imageError}
            </p>
          )}
        </>
      )}


      {existingList &&
        !addItemMode &&
        imageError && (
          <p role="alert">
            {imageError}
          </p>
        )}

   

      <div className="form-actions">
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {existingList
            ? addItemMode
              ? isSubmitting ? "Adding..." : "Add Items"
              : isSubmitting ? "Saving..." : "Save Changes"
            : isSubmitting ? "Creating..." : "Create List"}
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