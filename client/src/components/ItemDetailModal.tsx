import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus } from "lucide-react";
import type { MenuItem } from "@shared/schema";

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, note?: string) => void;
  currency?: string;
}

export default function ItemDetailModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
  currency = "$",
}: ItemDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const handleClose = () => {
    setQuantity(1);
    setNote("");
    onClose();
  };

  const handleAddToCart = () => {
    if (item) {
      onAddToCart(item, quantity, note || undefined);
      handleClose();
    }
  };

  if (!item) return null;

  const totalPrice = (item.price * quantity) / 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 gap-0" data-testid="modal-item-detail">
        {item.imageUrl && (
          <div className="w-full h-64 bg-muted">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              data-testid="img-modal-item"
            />
          </div>
        )}

        <div className="p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl" data-testid="text-modal-item-name">
              {item.name}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground" data-testid="text-modal-item-desc">
            {item.description}
          </p>

          <p className="text-lg font-bold text-primary" data-testid="text-modal-item-price">
            {currency}{(item.price / 100).toFixed(2)}
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                data-testid="button-decrease-quantity"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold w-12 text-center" data-testid="text-quantity">
                {quantity}
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
                data-testid="button-increase-quantity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="note" className="text-sm font-medium">
              Special Instructions (Optional)
            </label>
            <Textarea
              id="note"
              placeholder="e.g., No onions, extra sauce..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              data-testid="input-item-note"
            />
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleAddToCart}
            data-testid="button-add-to-cart"
          >
            Add to Cart • {currency}{totalPrice.toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
