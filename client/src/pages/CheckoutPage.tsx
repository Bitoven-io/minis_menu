import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import OrderSummary from "@/components/OrderSummary";
import type { CartItem } from "@shared/schema";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const [cartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (cartItems.length === 0) {
      setLocation("/");
    }
  }, [cartItems.length, setLocation]);

  const handleSendToWhatsApp = () => {
    // TODO: Replace with actual WhatsApp number from settings
    const whatsappNumber = "1234567890";
    const restaurantName = "Delicious Bites";

    let message = `*${restaurantName} - New Order*\n\n`;
    message += `*Order Details:*\n`;

    cartItems.forEach((item, index) => {
      message += `\n${index + 1}. *${item.menuItem.name}*\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: $${((item.menuItem.price * item.quantity) / 100).toFixed(2)}\n`;
      if (item.note) {
        message += `   Note: ${item.note}\n`;
      }
    });

    const total = cartItems.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    message += `\n*Total: $${(total / 100).toFixed(2)}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
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
        <OrderSummary cartItems={cartItems} onSendToWhatsApp={handleSendToWhatsApp} />
      </div>
    </div>
  );
}
