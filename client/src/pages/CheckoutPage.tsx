import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import OrderSummary from "@/components/OrderSummary";
import type { CartItem, Settings } from "@shared/schema";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      setLocation("/");
    }
  }, [cartItems.length, setLocation]);

  const handleSendToWhatsApp = () => {
    const whatsappNumber = settings?.whatsappNumber || "1234567890";
    const restaurantName = settings?.restaurantName || "Mini's & Twennies";
    const currency = settings?.currency || "$";

    let message = `*${restaurantName} - New Order*\n\n`;
    message += `*Order Details:*\n`;

    cartItems.forEach((item, index) => {
      message += `\n${index + 1}. *${item.menuItem.name}*\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ${currency}${((item.menuItem.price * item.quantity) / 100).toFixed(2)}\n`;
      if (item.note) {
        message += `   Note: ${item.note}\n`;
      }
    });

    const total = cartItems.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    message += `\n*Total: ${currency}${(total / 100).toFixed(2)}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    
    // Clear cart after sending order
    localStorage.removeItem("cart");
    setCartItems([]);
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background border-b p-4">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Checkout</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4">
        <OrderSummary cartItems={cartItems} onSendToWhatsApp={handleSendToWhatsApp} currency={settings?.currency} />
      </div>
    </div>
  );
}
