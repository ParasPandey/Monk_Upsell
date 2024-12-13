import { useQuery } from "@tanstack/react-query";
import { Product } from "../interfaces/Product";
import GetProducts from "../service/Product";

interface UseProductsParams {
  page: number;
  query: string;
}

const useFetchProduct = ({ page, query }: UseProductsParams) => {
  return useQuery<Product[], Error>({
    queryKey: ["products", { page, query }],
    queryFn: () => GetProducts(page, query),
  });
};

export default useFetchProduct;
