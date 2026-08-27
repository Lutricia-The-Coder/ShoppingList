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

  /*
   * When true, this form is being used
   * to add items to an existing list.
   */
  addItemMode?: boolean;

  /*
   * The existing list ID when adding items.
   */
  listId?: string;

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
  addItemMode = false,
  listId,
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
   * Populate/reset form.
   */
  useEffect(() => {
    /*
     * ADD ITEM MODE
     *
     * We are adding items to an existing
     * shopping list.
     */
    if (addItemMode && existingList) {
      setName(existingList.name);

      setCategories([
        createCategoryGroup(),
      ]);

      setImageError(null);
      setLoadingImage(null);

      return;
    }

    /*
     * EDIT EXISTING LIST
     */
    if (existingList) {
      setName(existingList.name);

      /*
       * Existing list items are managed
       * separately on ShoppingListDetails.
       */
      setCategories([]);

      setImageError(null);
      setLoadingImage(null);

      return;
    }

    /*
     * CREATE NEW LIST
     */
    setName("");

    setCategories([
      createCategoryGroup(),
    ]);

    setImageError(null);
    setLoadingImage(null);
  }, [existingList, addItemMode]);

  /*
   * Change category.
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
   * Change item field.
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
   * Find an image from Unsplash.
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

  /*
   * Add another item to the
   * same category.
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
   * Remove an item.
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
   * Add another category.
   */
  const handleAddCategory = () => {
    setCategories((previous) => [
      ...previous,
      createCategoryGroup(),
    ]);
  };

  /*
   * Remove a category.
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
   * Submit form.
   */
  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault();

    setImageError(null);

    /*
     * =================================================
     * ADD ITEM MODE
     * =================================================
     *
     * We do NOT create a new ShoppingList.
     *
     * We only return the items so that
     * ShoppingListDetails can save them
     * using the existing list ID.
     */
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

      /*
       * We don't need to create a new list.
       *
       * The parent already knows which list
       * we're adding these items to.
       */
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

    /*
     * =================================================
     * EDIT EXISTING LIST
     * =================================================
     */
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

    /*
     * =================================================
     * CREATE NEW LIST
     * =================================================
     */

    if (!name.trim()) {
      setImageError(
        "Please enter a shopping list name."
      );

      return;
    }

    /*
     * Validate categories.
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
     * has an item.
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
     * Validate items.
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
     * Convert categories into items.
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
      {/* HEADER */}

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

      {/* LIST NAME */}

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

      {/* EXISTING LIST NAME */}

      {addItemMode && existingList && (
        <div className="shopping-form-existing-list">
          <span>Shopping list</span>

          <strong>
            {existingList.name}
          </strong>
        </div>
      )}

      {/* CATEGORY GROUPS */}

      {(!existingList ||
        addItemMode) && (
        <>
          {categories.map(
            (group, categoryIndex) => (
              <section
                className="category-group"
                key={group.id}
              >
                {/* CATEGORY HEADER */}

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

                          {/* NOTES */}

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

                          {/* REMOVE ITEM */}

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

                {/* ADD ITEM */}

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
                </div>
              </section>
            )
          )}

          {/* ADD CATEGORY */}

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

      {/* EDIT LIST ERROR */}

      {existingList &&
        !addItemMode &&
        imageError && (
          <p role="alert">
            {imageError}
          </p>
        )}

      {/* FORM ACTIONS */}

      <div className="form-actions">
        <button type="submit">
          {existingList
            ? addItemMode
              ? "Add Items"
              : "Save Changes"
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