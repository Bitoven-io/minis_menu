import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, Edit } from "lucide-react";
import type { CartItem } from "@shared/schema";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (index: number) => void;
  onEditItem: (index: number) => void;
  onProceedToCheckout: () => void;
  currency?: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onEditItem,
  onProceedToCheckout,
  currency = "$",
}: CartDrawerProps) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh]" data-testid="drawer-cart">
        <SheetHeader>
          <SheetTitle>Your Order ({cartItems.length} items)</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted-foreground" data-testid="text-empty-cart">
              Your cart is empty
            </p>
            <Button variant="outline" className="mt-4" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 my-4">
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} data-testid={`cart-item-${index}`}>
                    <div className="flex gap-3">
                      {item.menuItem.imageUrl && (
                        <img
                          src={item.menuItem.imageUrl}
                          alt={item.menuItem.name}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm" data-testid={`text-cart-item-name-${index}`}>
                            {item.menuItem.name}
                          </h4>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={() => onRemoveItem(index)}
                            data-testid={`button-remove-item-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Qty: {item.quantity} × {currency}
                          {(item.menuItem.price / 100).toFixed(2)}
                        </p>
                        {item.note && (
                          <p className="text-sm italic text-muted-foreground mt-1" data-testid={`text-cart-item-note-${index}`}>
                            Note: {item.note}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <p className="font-bold text-sm" data-testid={`text-cart-item-total-${index}`}>
                            {currency}
                            {((item.menuItem.price * item.quantity) / 100).toFixed(2)}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7"
                            onClick={() => onEditItem(index)}
                            data-testid={`button-edit-item-${index}`}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                    {index < cartItems.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Subtotal</span>
                <span className="font-bold text-lg" data-testid="text-cart-subtotal">
                  {currency}
                  {(subtotal / 100).toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={onProceedToCheckout}
                data-testid="button-proceed-checkout"
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
