import axios from "axios";
import { Product } from "../interfaces/Product";

const GetProducts = async (page: number, query: string): Promise<Product[]> => {
  try {
    const baseUrl: string = process.env.REACT_APP_API_URL as string;
    const url = new URL(baseUrl);

    // Add query parameters if they exist
    if (query) {
      url.searchParams.append("search", query);
    }
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", "10");

    const data = await axios.get(url.toString(), {
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
    });
    return data.data ?? [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export default GetProducts;
