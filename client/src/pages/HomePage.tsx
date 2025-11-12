import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import BannerCarousel from "@/components/BannerCarousel";
import CategoryNav from "@/components/CategoryNav";
import MenuItemCard from "@/components/MenuItemCard";
import ItemDetailModal from "@/components/ItemDetailModal";
import CartButton from "@/components/CartButton";
import CartDrawer from "@/components/CartDrawer";
import type { MenuItem, CartItem, Category, Banner, Settings } from "@shared/schema";
import { useLocation } from "wouter";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  // Fetch data from API
  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  // Set initial active category when categories load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const filteredItems = useMemo(() => {
    if (!activeCategory) return [];
    return menuItems.filter(
      (item) => item.categoryId === activeCategory && !item.isHidden
    );
  }, [menuItems, activeCategory]);

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
          {settings?.restaurantName || "Mini's & Twennies"}
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
