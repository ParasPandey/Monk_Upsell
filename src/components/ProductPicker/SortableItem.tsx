import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSortable } from "@dnd-kit/sortable";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ProductModal from "../ProductModal";
import { useProducts } from "../../store/Context";
import DiscountSelector from "../Discount";
import ClearIcon from "@mui/icons-material/Clear";
import VariantAccordion from "../VariantAccordian";

const SortableItem = ({
  id,
  children,
  count,
}: {
  id: number;
  children: React.ReactNode;
  count: number;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const { products, removeProduct } = useProducts();
  const [openProductModal, setOpenProductModal] = useState(false);
  const [isDiscountVisible, setIsDiscountVisible] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleOpenProductModal = () => {
    setOpenProductModal(true);
  };
  const handleCloseProductModal = () => setOpenProductModal(false);

  const showDiscountContainer = () => setIsDiscountVisible(true);

  const clearFields = (id: number) => {
    removeProduct(id);
  };

  const currentProduct = products.filter((product) => product.id === id)[0]
    .detail;
  return (
    <>
      <div
        ref={setNodeRef}
        className={`sortable-item ${isDragging ? "grabbing" : ""}`}
        style={style}
      >
        <div className="drag-handle" {...listeners} {...attributes}>
          <DragIndicatorIcon />
        </div>

        <div className="card-content">
          <div className="card-counter">{count}.</div>
          <div className="product-picker-grid">
            <TextField
              className="input-field"
              variant="outlined"
              placeholder="Select Product"
              value={children ? children : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className="add-product-icon"
                    onClick={handleOpenProductModal}
                  >
                    <EditIcon />
                  </InputAdornment>
                ),
              }}
            />
            {isDiscountVisible && Object.keys(currentProduct!).length !== 0 ? (
              <DiscountSelector selectedId={id} />
            ) : (
              <Button
                variant="contained"
                onClick={() => children && showDiscountContainer()}
                className="product-picker-add-discount"
              >
                Add Discount
              </Button>
            )}
            {children && (
              <IconButton onClick={() => clearFields(id)}>
                <ClearIcon />
              </IconButton>
            )}
          </div>
        </div>
        {openProductModal && (
          <ProductModal
            selectedId={id}
            selectedProduct={currentProduct}
            open={openProductModal}
            onClose={handleCloseProductModal}
          />
        )}
      </div>
      {currentProduct &&
        Object.keys(currentProduct).length > 0 &&
        currentProduct.variants &&
        currentProduct.variants.length > 0 && (
          <VariantAccordion productId={id} product={currentProduct} />
        )}
    </>
  );
};

export default SortableItem;
