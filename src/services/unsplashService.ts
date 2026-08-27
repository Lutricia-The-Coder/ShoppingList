import api from "./api";

export interface UnsplashPhoto {
  urls: {
    small: string;
    regular: string;
  };

  user: {
    name: string;
    username: string;
  };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
}

const UNSPLASH_ACCESS_KEY =
  import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export const searchUnsplashImage = async (
  itemName: string
): Promise<UnsplashPhoto | null> => {
  const response =
    await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        itemName
      )}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
    );

  if (!response.ok) {
    throw new Error(
      "Unable to search Unsplash"
    );
  }

  const data =
    (await response.json()) as UnsplashSearchResponse;

  return data.results.length > 0
    ? data.results[0]
    : null;
};