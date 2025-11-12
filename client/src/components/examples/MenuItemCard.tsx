import MenuItemCard from "../MenuItemCard";
import pizzaImg from "@assets/generated_images/Margherita_pizza_item_68c1ddf8.png";

export default function MenuItemCardExample() {
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
      <MenuItemCard item={item} onClick={() => console.log("Item clicked")} />
    </div>
  );
}
