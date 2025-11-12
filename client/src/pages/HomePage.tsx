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
    { id: "1", name: "Burgers" },
    { id: "2", name: "Sides" },
    { id: "3", name: "Desserts" },
    { id: "4", name: "Drinks" },
  ];

  // TODO: Remove mock data - fetch from API
  const menuItems: MenuItem[] = [
    {
      id: "1",
      categoryId: "1",
      name: "Classic Mini Burger",
      description: "100% beef patty with lettuce, tomato, onion and our special sauce",
      price: 899,
      imageUrl: pizzaImg,
      isAvailable: true,
      isHidden: false,
    },
    {
      id: "2",
      categoryId: "1",
      name: "Twennie Deluxe",
      description: "Double beef patties, cheese, bacon, and all the fixings",
      price: 1499,
      imageUrl: burgerBanner,
      isAvailable: false,
      isHidden: false,
    },
    {
      id: "3",
      categoryId: "1",
      name: "Chicken Supreme",
      description: "Crispy chicken breast with lettuce, mayo, and pickles",
      price: 999,
      imageUrl: tacosImg,
      isAvailable: true,
      isHidden: false,
    },
    {
      id: "4",
      categoryId: "2",
      name: "Golden Fries",
      description: "Crispy golden french fries with sea salt",
      price: 399,
      imageUrl: saladImg,
      isAvailable: true,
      isHidden: false,
    },
    {
      id: "5",
      categoryId: "2",
      name: "Onion Rings",
      description: "Crispy beer-battered onion rings with ranch dip",
      price: 499,
      imageUrl: tacosImg,
      isAvailable: true,
      isHidden: false,
    },
    {
      id: "6",
      categoryId: "3",
      name: "Chocolate Brownie",
      description: "Warm chocolate brownie with vanilla ice cream",
      price: 599,
      imageUrl: cakeImg,
      isAvailable: true,
      isHidden: false,
    },
    {
      id: "7",
      categoryId: "4",
      name: "Fresh Lemonade",
      description: "Freshly squeezed lemonade with mint",
      price: 299,
      imageUrl: smoothieImg,
      isAvailable: true,
      isHidden: false,
    },
    {
      id: "8",
      categoryId: "4",
      name: "Chocolate Shake",
      description: "Thick and creamy chocolate milkshake",
      price: 499,
      imageUrl: smoothieImg,
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
          Mini's & Twennies
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
