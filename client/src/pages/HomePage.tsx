import { useState } from "react";
import BannerCarousel from "@/components/BannerCarousel";
import CategoryNav from "@/components/CategoryNav";
import MenuItemCard from "@/components/MenuItemCard";
import ItemDetailModal from "@/components/ItemDetailModal";
import CartButton from "@/components/CartButton";
import CartDrawer from "@/components/CartDrawer";
import type { MenuItem, CartItem } from "@shared/schema";
import burgerBanner from "@assets/generated_images/Burger_special_offer_banner_29506f1a.png";
import pastaBanner from "@assets/generated_images/Pasta_promotion_banner_56244eca.png";
import sushiBanner from "@assets/generated_images/Sushi_special_banner_2f1d67eb.png";
import pizzaImg from "@assets/generated_images/Margherita_pizza_item_68c1ddf8.png";
import saladImg from "@assets/generated_images/Caesar_salad_item_aa63fe79.png";
import cakeImg from "@assets/generated_images/Chocolate_lava_cake_6fb89a3a.png";
import smoothieImg from "@assets/generated_images/Smoothie_bowl_item_22fdaf86.png";
import tacosImg from "@assets/generated_images/Beef_tacos_item_32ca824a.png";
import { useLocation } from "wouter";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("1");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  // TODO: Remove mock data - fetch from API
  const banners = [
    { id: "1", imageUrl: burgerBanner },
    { id: "2", imageUrl: pastaBanner },
    { id: "3", imageUrl: sushiBanner },
  ];

  // TODO: Remove mock data - fetch from API
  const categories = [
    { id: "1", name: "Pizza" },
    { id: "2", name: "Salads" },
    { id: "3", name: "Desserts" },
    { id: "4", name: "Beverages" },
  ];

  // TODO: Remove mock data - fetch from API
  const menuItems: MenuItem[] = [
    {
      id: "1",
      categoryId: "1",
      name: "Margherita Pizza",
      description: "Fresh mozzarella, tomato sauce, and basil on a thin crust",
      price: 1299,
      imageUrl: pizzaImg,
      isAvailable: true,
      isHidden: false,
    },
    {
      id: "2",
      categoryId: "1",
      name: "Pepperoni Pizza",
      description: "Classic pepperoni with extra cheese",
      price: 1499,
      imageUrl: pizzaImg,
      isAvailable: false,
      isHidden: false,
    },
    {
      id: "3",
      categoryId: "2",
      name: "Caesar Salad",
      description: "Crispy lettuce with parmesan and caesar dressing",
      price: 899,
      imageUrl: saladImg,
      isAvailable: true,
      isHidden: false,
    },
    {
      id: "4",
      categoryId: "3",
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with vanilla ice cream",
      price: 699,
      imageUrl: cakeImg,
      isAvailable: true,
      isHidden: false,
    },
    {
      id: "5",
      categoryId: "4",
      name: "Berry Smoothie Bowl",
      description: "Fresh berries with granola and honey",
      price: 799,
      imageUrl: smoothieImg,
      isAvailable: true,
      isHidden: false,
    },
    {
      id: "6",
      categoryId: "1",
      name: "Beef Tacos",
      description: "Three tacos with seasoned beef and fresh toppings",
      price: 1099,
      imageUrl: tacosImg,
      isAvailable: true,
      isHidden: false,
    },
  ];

  const filteredItems = menuItems.filter(
    (item) => item.categoryId === activeCategory && !item.isHidden
  );

  const handleItemClick = (item: MenuItem) => {
    if (!item.isAvailable) return;
    setSelectedItem(item);
    setIsModalOpen(true);
    setEditingItemIndex(null);
  };

  const handleAddToCart = (item: MenuItem, quantity: number, note?: string) => {
    if (editingItemIndex !== null) {
      const newCartItems = [...cartItems];
      newCartItems[editingItemIndex] = { menuItem: item, quantity, note };
      setCartItems(newCartItems);
      setEditingItemIndex(null);
    } else {
      setCartItems([...cartItems, { menuItem: item, quantity, note }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleEditItem = (index: number) => {
    const item = cartItems[index];
    setSelectedItem(item.menuItem);
    setEditingItemIndex(index);
    setIsModalOpen(true);
    setIsCartOpen(false);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setLocation("/checkout");
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 bg-background border-b p-4">
        <h1 className="text-2xl font-semibold text-center" data-testid="text-restaurant-name">
          Delicious Bites
        </h1>
      </header>

      <div className="max-w-lg mx-auto">
        <div className="p-4">
          <BannerCarousel banners={banners} />
        </div>

        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={setActiveCategory}
        />

        <div className="p-4 space-y-3">
          <h2 className="text-lg font-semibold">
            {categories.find((c) => c.id === activeCategory)?.name}
          </h2>
          {filteredItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No items available in this category
            </p>
          ) : (
            filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
              />
            ))
          )}
        </div>
      </div>

      <CartButton itemCount={totalItems} onClick={() => setIsCartOpen(true)} />

      <ItemDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItemIndex(null);
        }}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onEditItem={handleEditItem}
        onProceedToCheckout={handleProceedToCheckout}
      />
    </div>
  );
}
