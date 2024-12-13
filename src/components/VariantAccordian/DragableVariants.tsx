import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import VariantFields from "./VariantFields";
import { ProductDiscount, ProductVariant } from "../../interfaces/Product";
import { useProducts } from "../../store/Context";

interface DragableVariantsProps {
  variants: ProductVariant[];
  discount: ProductDiscount | undefined;
  productId: number;
}

const DragableVariants: React.FC<DragableVariantsProps> = ({
  variants,
  discount,
  productId,
}) => {
  const { dragProductVariants } = useProducts();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = variants.findIndex((item) => item.id === active.id);
      const newIndex = variants.findIndex((item) => item.id === over.id);
      dragProductVariants(oldIndex, newIndex, productId);
    }
  };

  const variantLength: number = variants.length;
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={variants} strategy={verticalListSortingStrategy}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {variants?.map((variant, index) => (
            <VariantFields
              variant={variant}
              discount={discount}
              key={variant.id}
              index={index}
              productId={productId}
              isOnlyVariant={variantLength === 1}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DragableVariants;
