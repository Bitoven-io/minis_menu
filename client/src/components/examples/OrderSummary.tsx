import OrderSummary from "../OrderSummary";
import pizzaImg from "@assets/generated_images/Margherita_pizza_item_68c1ddf8.png";
import saladImg from "@assets/generated_images/Caesar_salad_item_aa63fe79.png";

export default function OrderSummaryExample() {
  const cartItems = [
    {
      menuItem: {
        id: "1",
        categoryId: "1",
        name: "Margherita Pizza",
        description: "Fresh mozzarella, tomato sauce, and basil",
        price: 1299,
        imageUrl: pizzaImg,
        isAvailable: true,
        isHidden: false,
      },
      quantity: 2,
      note: "Extra cheese please",
    },
    {
      menuItem: {
        id: "2",
        categoryId: "2",
        name: "Caesar Salad",
        description: "Crispy lettuce with parmesan",
        price: 899,
        imageUrl: saladImg,
        isAvailable: true,
        isHidden: false,
      },
      quantity: 1,
    },
  ];

  return (
    <div className="p-4 max-w-lg mx-auto">
      <OrderSummary
        cartItems={cartItems}
        onSendToWhatsApp={() => console.log("Send to WhatsApp")}
      />
    </div>
  );
}
