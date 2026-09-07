import axios from "axios";

const api = axios.create({
  baseURL: "https://shoppinglist-v19o.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;