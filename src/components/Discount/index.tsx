import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  Box,
  SelectChangeEvent,
} from "@mui/material";
import { useProducts } from "../../store/Context";
import { DiscountType } from "../../enums/DiscountType";

interface DiscountSelectorProps {
  selectedId: number;
}

const DiscountSelector: React.FC<DiscountSelectorProps> = ({ selectedId }) => {
  const [amount, setAmount] = useState<number | string>(0);
  const [discountType, setDiscountType] = useState<DiscountType>(
    DiscountType.PERC_OFF
  );
  const { addDiscountAmount } = useProducts();

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(event.target.value) || 0;
    setAmount(newAmount);
    addDiscountAmount(selectedId, newAmount, undefined);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const newType = event.target.value;
    setDiscountType(newType as DiscountType);
    addDiscountAmount(selectedId, undefined, newType as DiscountType);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <TextField
        defaultValue={amount}
        onChange={handleAmountChange}
        type="number"
        variant="outlined"
        size="small"
        style={{ width: 90 }}
        InputProps={{
          inputProps: {
            max: 100,
            min: 0,
            style: {
              MozAppearance: "textfield",
            },
          },
        }}
        sx={{
          "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
            {
              WebkitAppearance: "none",
              margin: 0,
            },
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
        }}
      />

      <Select
        value={discountType}
        onChange={handleTypeChange}
        variant="outlined"
        size="small"
        style={{ width: 100 }}
      >
        <MenuItem value="% Off">% Off</MenuItem>
        <MenuItem value="Flat Off">Flat Off</MenuItem>
      </Select>
    </Box>
  );
};

export default DiscountSelector;
