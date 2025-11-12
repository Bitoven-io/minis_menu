import { useState } from "react";
import ItemDetailModal from "../ItemDetailModal";
import { Button } from "@/components/ui/button";
import pizzaImg from "@assets/generated_images/Margherita_pizza_item_68c1ddf8.png";

export default function ItemDetailModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  const item = {
    id: "1",
    categoryId: "1",
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, and basil on a thin crust",
    price: 1299,
    imageUrl: pizzaImg,
    isAvailable: true,
    isHidden: false,
  };

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>Open Item Modal</Button>
      <ItemDetailModal
        item={item}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAddToCart={(item, qty, note) => {
          console.log("Added to cart:", item.name, "Qty:", qty, "Note:", note);
          setIsOpen(false);
        }}
      />
    </div>
  );
}
