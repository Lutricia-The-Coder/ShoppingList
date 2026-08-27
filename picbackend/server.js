import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = 4000;

app.use(cors());
app.use(express.json());

const SERPAPI_API_KEY =
  process.env.SERPAPI_API_KEY;


 * Search Google Shopping for a product
 * and return its image.
 */
app.get("/api/shopping-image", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        message: "Product name is required.",
      });
    }

    if (!SERPAPI_API_KEY) {
      return res.status(500).json({
        message:
          "SerpApi API key is not configured.",
      });
    }

    const params = new URLSearchParams({
      engine: "google_shopping",
      q: query.trim(),
      api_key: SERPAPI_API_KEY,
    });

    const response = await fetch(
      `https://serpapi.com/search.json?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        `SerpApi returned ${response.status}`
      );
    }

    const data = await response.json();

    const firstResult =
      data.shopping_results?.[0];

    if (!firstResult) {
      return res.status(404).json({
        message:
          "No product image was found.",
        image: null,
      });
    }

    return res.json({
      image:
        firstResult.thumbnail ?? null,

      title:
        firstResult.title ?? query,
    });
  } catch (error) {
    console.error(
      "SerpApi error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to search for product image.",
      image: null,
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `SerpApi server running on http://localhost:${PORT}`
  );
});