import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  Box,
  Typography,
  Avatar,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Product } from "../../interfaces/Product";
import { useProducts } from "../../store/Context";
import useFetchProduct from "../../hooks/useFetchProduct";
import useDebounce from "../../hooks/useDebounce";

interface ProductModalProps {
  open: boolean;
  selectedProduct: Product | undefined;
  onClose: () => void;
  selectedId: number;
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  selectedProduct,
  onClose,
  selectedId,
}) => {
  const { updateProduct } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Set<number>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const dialogContentRef = useRef<HTMLDivElement | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  // Debounce the searchQuery and pageNumber
  const debouncedSearchQuery = useDebounce(searchQuery, 2000);
  const debouncedPageNumber = useDebounce(pageNumber, 2000);

  const { data, isLoading } = useFetchProduct({
    page: debouncedPageNumber,
    query: debouncedSearchQuery,
  });

  useEffect(() => {
    if (open && data && !isLoading) {
      try {
        if (pageNumber === 1 || searchQuery) {
          setProducts(data);
          setIsInitialLoading(false);
        } else {
          setProducts((prevProducts) => {
            return [...prevProducts, ...data];
          });
        }
      } catch (err) {
        console.error("something went wrong");
      } finally {
        setIsSearching(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, open]);

  useEffect(() => {
    if (selectedProduct && selectedProduct.variants) {
      const selectedVariantIds = new Set(
        selectedProduct.variants.map((variant) => variant.id)
      );
      setSelectedVariants(selectedVariantIds);
    }
  }, [selectedProduct]);

  const handleVariantSelection = (variantId: number) => {
    setSelectedVariants((prevSelectedVariants) => {
      const newSelectedVariants = new Set(prevSelectedVariants);
      if (newSelectedVariants.has(variantId)) {
        newSelectedVariants.delete(variantId);
      } else {
        newSelectedVariants.add(variantId);
      }
      return newSelectedVariants;
    });
  };

  const isVariantSelected = (variantId: number) =>
    selectedVariants.has(variantId);

  const isProductSelected = (productId: number) => {
    const variants =
      products.find((product) => product.id === productId)?.variants || [];
    const selectedVariantsCount = variants.filter((variant) =>
      isVariantSelected(variant.id)
    ).length;

    if (selectedVariantsCount === variants.length) {
      return { all: true, indeterminate: false };
    } else if (selectedVariantsCount > 0) {
      return { all: false, indeterminate: true };
    }

    return false;
  };

  const handleProductCheckboxChange = (productId: number) => {
    const product = products.find((product) => product.id === productId);
    if (!product || !product.variants) return;

    const allSelected = product.variants.every((variant) =>
      isVariantSelected(variant.id)
    );

    const newSelectedVariants = new Set(selectedVariants);
    if (allSelected) {
      product.variants.forEach((variant) =>
        newSelectedVariants.delete(variant.id)
      );
    } else {
      product.variants.forEach((variant) =>
        newSelectedVariants.add(variant.id)
      );
    }
    setSelectedVariants(newSelectedVariants);
  };

  const handleScroll = useCallback(() => {
    if (!dialogContentRef.current || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = dialogContentRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setPageNumber((prevPage) => prevPage + 1);
    }
  }, [isLoading]);

  const debouncedHandleScroll = useCallback(() => {
    handleScroll();
  }, [handleScroll]);

  const handleAddProducts = () => {
    const selectedProducts = products.filter((product) =>
      product.variants?.some((variant) => selectedVariants.has(variant.id))
    );

    const productsToAdd = selectedProducts.map((product) => ({
      ...product,
      variants: product.variants?.filter((variant) =>
        selectedVariants.has(variant.id)
      ),
    }));

    updateProduct(selectedId, productsToAdd);

    onClose();
  };

  const handleSearchQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchQuery = event.target.value;
      setSearchQuery(newSearchQuery);
      setProducts([]);
      setPageNumber(1);
      setIsSearching(true);
    },
    []
  );

  const debouncedHandleSearchQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleSearchQueryChange(event);
    },
    [handleSearchQueryChange]
  );
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{ "& .MuiPaper-root": { padding: "16px" } }}
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
        Select Products
      </DialogTitle>

      <DialogContent
        dividers
        ref={dialogContentRef}
        onScroll={debouncedHandleScroll}
        sx={{ maxHeight: "400px", overflowY: "auto" }}
      >
        <TextField
          fullWidth
          placeholder="Search product"
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          value={searchQuery}
          onChange={debouncedHandleSearchQueryChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {isSearching || isInitialLoading ? (
          <div className="product-loader">
            <CircularProgress />
          </div>
        ) : products && products.length > 0 ? (
          products.map((product) => {
            const productSelectionState = isProductSelected(product.id);

            const all =
              productSelectionState !== false && productSelectionState.all;
            const indeterminate =
              productSelectionState !== false &&
              productSelectionState.indeterminate;

            return (
              <Box key={product.id} sx={{ mb: 2 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    padding: "8px 0",
                    borderBottom: "1px solid #e0e0e0",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <Checkbox
                    checked={all}
                    indeterminate={indeterminate}
                    onChange={() => handleProductCheckboxChange(product.id)}
                  />
                  <Avatar
                    src={product.image.src}
                    alt={product.title}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    {product.title}
                  </Typography>
                </Box>

                {product?.variants?.map((variant) => (
                  <Box
                    key={variant.id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      pl: 6,
                      py: 1,
                      borderBottom: "1px solid #f5f5f5",
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={isVariantSelected(variant.id)}
                        onChange={() => handleVariantSelection(variant.id)}
                      />
                      <Typography sx={{ fontSize: "0.85rem", ml: 1 }}>
                        {variant.title}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                      {variant.inventory_quantity &&
                        variant.inventory_quantity > 0 && (
                          <Typography sx={{ fontSize: "0.85rem" }}>
                            {variant.inventory_quantity} available
                          </Typography>
                        )}
                      <Typography
                        sx={{ fontSize: "0.85rem", fontWeight: "bold" }}
                      >
                        ${variant.price}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            );
          })
        ) : (
          <Typography>No result found</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Typography
          sx={{
            flex: 1,
            fontSize: "0.85rem",
            color: "gray",
          }}
        >
          {selectedVariants.size} product
          {selectedVariants.size > 1 ? "s" : ""} selected
        </Typography>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAddProducts}
          variant="contained"
          color="success"
          disabled={selectedVariants.size <= 0}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;
