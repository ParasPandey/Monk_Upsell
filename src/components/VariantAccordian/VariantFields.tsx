import { Box, IconButton, MenuItem, Select, TextField } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import React from "react";
import { ProductDiscount, ProductVariant } from "../../interfaces/Product";
import ClearIcon from "@mui/icons-material/Clear";
import { useSortable } from "@dnd-kit/sortable";
import { useProducts } from "../../store/Context";

interface VariantFieldsProps {
  variant: ProductVariant;
  discount: ProductDiscount | undefined;
  index: number;
  productId: number;
  isOnlyVariant: boolean;
}

const VariantFields: React.FC<VariantFieldsProps> = ({
  variant,
  discount,
  index,
  productId,
  isOnlyVariant,
}) => {
  const { removeVariantFromProduct } = useProducts();
  const handleClear = (index: number) => {
    removeVariantFromProduct(productId, index);
  };
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: variant.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      key={variant.id}
      ref={setNodeRef}
      display="flex"
      alignItems="center"
      className={`sortable-item ${isDragging ? "grabbing" : ""}`}
      style={style}
      gap={1}
      sx={{
        marginBottom: "8px",
        width: "100%",
      }}
    >
      <div className="drag-handle" {...listeners} {...attributes}>
        <DragIndicatorIcon />
      </div>

      <TextField
        value={variant.title}
        disabled
        variant="outlined"
        size="small"
        sx={{
          width: 240,
          flex: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
          },
        }}
      />

      {discount?.amount && (
        <>
          <TextField
            value={discount?.amount ?? 0}
            type="number"
            disabled
            variant="outlined"
            size="small"
            sx={{
              width: "80px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
              },
            }}
            inputProps={{ min: 0 }}
          />

          <Select
            value={discount?.type || "% Off"}
            variant="outlined"
            disabled
            size="small"
            sx={{
              width: "100px",
              borderRadius: "16px",
            }}
          >
            <MenuItem value="% Off">% Off</MenuItem>
            <MenuItem value="Flat Off">Flat Off</MenuItem>
          </Select>
        </>
      )}

      {!isOnlyVariant && (
        <IconButton onClick={() => handleClear(index)}>
          <ClearIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default VariantFields;
