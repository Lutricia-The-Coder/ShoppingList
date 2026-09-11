const categoryKeywords: Record<string, string[]> = {
  Groceries: [
    "apple", "banana", "bread", "butter", "cheese", "chicken", "chips",
    "chocolate", "coffee", "egg", "flour", "fruit", "juice", "meat",
    "milk", "pasta", "rice", "snack", "soda", "vegetable", "water",
    "yoghurt", "yogurt",
  ],
  Household: [
    "bleach", "broom", "bucket", "cleaner", "detergent", "dishwasher",
    "dustpan", "laundry", "mop", "napkin", "paper towel", "soap",
    "sponge", "tissue", "toilet paper", "washing powder",
  ],
  Electronics: [
    "battery", "cable", "camera", "charger", "computer", "earphone",
    "headphone", "keyboard", "laptop", "monitor", "mouse", "phone",
    "printer", "remote", "screen", "speaker", "tablet", "television",
    "tv", "usb",
  ],
  Clothing: [
    "blazer", "blouse", "boot", "cap", "clothes", "dress", "glove",
    "hat", "jacket", "jeans", "pants", "shirt", "shoe", "shorts",
    "skirt", "sock", "sweater", "trouser", "t-shirt", "underwear",
  ],
};

export const getItemCategory = (itemName: string) => {
  const normalizedName = itemName.trim().toLowerCase();

  return Object.entries(categoryKeywords).find(([, keywords]) =>
    keywords.some((keyword) => normalizedName.includes(keyword))
  )?.[0];
};
