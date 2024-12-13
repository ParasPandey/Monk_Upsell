import { arrayMove } from "@dnd-kit/sortable";
import React, { createContext, useContext, useState } from "react";
import { Product } from "../interfaces/Product";
import { DiscountType } from "../enums/DiscountType";

// Define the type for a product
type SelectedProduct = {
  id: number;
  detail?: Product;
};

// Define the type for the context value
type ProductContextType = {
  products: SelectedProduct[];
  addProduct: () => void;
  removeProduct: (id: number) => void;
  updateProduct: (id: number, items: Product[]) => void;
  dragProducts: (oldIndex: number, newIndex: number) => void;
  dragProductVariants: (
    oldIndex: number,
    newIndex: number,
    productId: number
  ) => void;
  addDiscountAmount: (id: number, amount?: number, type?: DiscountType) => void;
  removeVariantFromProduct: (productId: number, variantIndex: number) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Define the initial products
const initialProducts: SelectedProduct[] = [{ id: 1, detail: {} as Product }];

interface ProductProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

// Provider component
export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [products, setProducts] = useState<SelectedProduct[]>(initialProducts);

  // Function to add a new product
  const addProduct = () => {
    const newProduct: SelectedProduct = {
      id: products.length + 1,
    };
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  // function to update product
  const updateProduct = (id: number, items: Product[]) => {
    setProducts((prevProducts) => {
      const index = prevProducts.findIndex((product) => product.id === id);

      if (index === -1) {
        return prevProducts;
      }
      const updatedProduct = {
        ...prevProducts[index],
        detail: { ...items[0] },
      };

      const newItems = items.slice(1).map((item, idx) => ({
        id: id + idx + 1,
        detail: item,
      }));

      const beforeProducts = prevProducts.slice(0, index);
      const afterProducts = prevProducts.slice(index + 1);

      return [...beforeProducts, updatedProduct, ...newItems, ...afterProducts];
    });
  };

  // function to remove product
  const removeProduct = (id: number) => {
    setProducts((prevProducts) => {
      // Check if the product list has only one product
      if (prevProducts.length === 1) {
        // Replace the last product with a blank one
        return [
          {
            id: 1,
            detail: {},
          },
        ] as SelectedProduct[];
      }

      // Otherwise, filter out the specified product
      return prevProducts.filter((product) => product.id !== id);
    });
  };

  // Function to reorder products on drag and drop
  const dragProducts = (oldIndex: number, newIndex: number) => {
    const reshuffledList = arrayMove(products, oldIndex, newIndex);
    setProducts(reshuffledList);
  };

  // Function to reorder products variants on drag and drop
  const dragProductVariants = (
    oldIndex: number,
    newIndex: number,
    productId: number
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        // Find the product to update by ID
        if (product.id === productId && product.detail?.variants) {
          return {
            ...product,
            detail: {
              ...product.detail,
              variants: arrayMove(product.detail.variants, oldIndex, newIndex),
            },
          };
        }
        return product;
      })
    );
  };

  const addDiscountAmount = (
    id: number,
    amount?: number,
    type?: DiscountType
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id && product.detail
          ? {
              ...product,
              detail: {
                ...product.detail,
                discount: {
                  ...product.detail.discount,
                  ...(amount !== undefined && { amount }), // Update amount only if it's provided
                  ...(type !== undefined && { type }), // Update type only if it's provided
                },
              },
            }
          : product
      )
    );
  };

  const removeVariantFromProduct = (
    productId: number,
    variantIndex: number
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId && product.detail?.variants) {
          return {
            ...product,
            detail: {
              ...product.detail,
              variants: product.detail.variants.filter(
                (_, index) => index !== variantIndex
              ),
            },
          };
        }
        return product;
      })
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        removeProduct,
        dragProducts,
        addDiscountAmount,
        dragProductVariants,
        removeVariantFromProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the ProductContext
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
