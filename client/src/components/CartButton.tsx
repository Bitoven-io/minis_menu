import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
}

export default function CartButton({ itemCount, onClick }: CartButtonProps) {
  return (
    <Button
      size="icon"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
      onClick={onClick}
      data-testid="button-cart"
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
          data-testid="badge-cart-count"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );
}
