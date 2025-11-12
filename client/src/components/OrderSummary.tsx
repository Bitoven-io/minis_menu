import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageCircle } from "lucide-react";
import type { CartItem } from "@shared/schema";

interface OrderSummaryProps {
  cartItems: CartItem[];
  onSendToWhatsApp: () => void;
  currency?: string;
}

export default function OrderSummary({ cartItems, onSendToWhatsApp, currency = "$" }: OrderSummaryProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Order Summary</h1>

      <Card className="p-4">
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} data-testid={`summary-item-${index}`}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold" data-testid={`text-summary-item-name-${index}`}>
                    {item.menuItem.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity} × {currency}
                    {(item.menuItem.price / 100).toFixed(2)}
                  </p>
                  {item.note && (
                    <p className="text-sm italic text-muted-foreground mt-1" data-testid={`text-summary-item-note-${index}`}>
                      Note: {item.note}
                    </p>
                  )}
                </div>
                <p className="font-bold" data-testid={`text-summary-item-total-${index}`}>
                  {currency}
                  {((item.menuItem.price * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
              {index < cartItems.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-2xl text-primary" data-testid="text-order-total">
            {currency}
            {(subtotal / 100).toFixed(2)}
          </span>
        </div>
      </Card>

      <Button
        className="w-full"
        size="lg"
        onClick={onSendToWhatsApp}
        data-testid="button-send-whatsapp"
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Send Order via WhatsApp
      </Button>
    </div>
  );
}
