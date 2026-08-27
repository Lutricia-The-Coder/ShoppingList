import type { ShoppingItem } from "../types";
import ShoppingItemCard from "./ShoppingItemCard";

interface CategoryGroupedItemsProps {
  items: ShoppingItem[];
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
   onToggle: (item: ShoppingItem) => void;
}

const CategoryGroupedItems = ({
  items,
  onEdit,
  onDelete,
  onToggle,
}: CategoryGroupedItemsProps) => {
  const groupedItems = items.reduce<
    Record<string, ShoppingItem[]>
  >((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }

    groups[item.category].push(item);

    return groups;
  }, {});

  const categories = Object.keys(
    groupedItems
  ).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <div className="category-groups">
      {categories.map((category) => (
        <section
          key={category}
          className="category-section"
        >
          <div className="category-section-header">
            <h3>{category}</h3>

            <span>
              {groupedItems[category].length}{" "}
              {groupedItems[category].length === 1
                ? "item"
                : "items"}
            </span>
          </div>

          <div className="shopping-items-grid">
            {groupedItems[category].map(
              (item) => (
 <ShoppingItemCard
  key={item.id}
  item={item}
  onEdit={onEdit}
  onDelete={onDelete}
  onToggle={onToggle}
/>
              )
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default CategoryGroupedItems;