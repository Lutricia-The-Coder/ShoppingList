export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  cellNumber: string;
}

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  dateAdded: string;
}

export interface ShoppingItem {
  id: string;
  listId: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  image?: string;
  dateAdded: string;
}