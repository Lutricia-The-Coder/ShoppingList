import api from "./api";
import type { ShoppingItem } from "../types";

export const getShoppingItems = async (
  listId: string
): Promise<ShoppingItem[]> => {
  const response = await api.get<ShoppingItem[]>(
    "/shoppingItems",
    {
      params: {
        listId,
      },
    }
  );

  return response.data;
};

export const createShoppingItem = async (
  item: Omit<ShoppingItem, "id">
): Promise<ShoppingItem> => {
  const response = await api.post<ShoppingItem>(
    "/shoppingItems",
    item
  );

  return response.data;
};

export const updateShoppingItem = async (
  id: string,
  item: Partial<ShoppingItem>
): Promise<ShoppingItem> => {
  const response = await api.patch<ShoppingItem>(
    `/shoppingItems/${id}`,
    item
  );

  return response.data;
};

export const deleteShoppingItem = async (
  id: string
): Promise<void> => {
  await api.delete(`/shoppingItems/${id}`);
};