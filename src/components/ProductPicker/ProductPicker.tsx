import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import DragableCard from "./DragableCard";
import { useProducts } from "../../store/Context";

const ProductPicker = () => {
  const { addProduct } = useProducts();
  return (
    <div className="product-picker-container">
      <h1 className="product-picker-title">Add Products</h1>

      <Grid className="product-discount-header">
        <Typography>Product</Typography>
        <Typography>Discount</Typography>
      </Grid>
      <DragableCard />
      <Grid className="add-product-container">
        <Button
          variant="outlined"
          className="add-product-btn"
          onClick={() => addProduct()}
        >
          Add Product
        </Button>
      </Grid>
    </div>
  );
};

export default ProductPicker;
