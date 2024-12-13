import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Product } from "../../interfaces/Product";
import DragableVariants from "./DragableVariants";

interface VariantAccordianProps {
  productId: number;
  product: Product;
}

const VariantAccordion: React.FC<VariantAccordianProps> = ({
  productId,
  product,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };
  if (!product.variants) {
    return null;
  }
  return (
    <Accordion
      expanded={expanded}
      disableGutters
      className="variant-accordian"
      sx={{
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        onClick={toggleAccordion}
        className="accordian-summary"
        sx={{
          justifyContent: "space-between",
          padding: "8px 16px",
          "& .MuiAccordionSummary-content": {
            margin: 0,
          },
        }}
      >
        <Typography variant="body1" className="accordian-summary-text">
          {expanded ? "Hide variants" : "Show variants"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ padding: "8px 16px" }}
        className="variants-accordian-details"
      >
        <DragableVariants
          variants={product.variants}
          discount={product.discount}
          productId={productId}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default VariantAccordion;
