import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MenuItem } from "@shared/schema";

interface MenuItemCardProps {
  item: MenuItem;
  currency?: string;
  onClick: () => void;
}

export default function MenuItemCard({ item, currency = "$", onClick }: MenuItemCardProps) {
  const isUnavailable = !item.isAvailable;

  return (
    <Card
      className={`p-3 flex gap-3 hover-elevate active-elevate-2 cursor-pointer ${
        isUnavailable ? "opacity-60" : ""
      }`}
      onClick={onClick}
      data-testid={`card-menu-item-${item.id}`}
    >
      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            data-testid={`img-item-${item.id}`}
          />
        )}
        {isUnavailable && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary" className="text-xs">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base line-clamp-1" data-testid={`text-item-name-${item.id}`}>
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1" data-testid={`text-item-desc-${item.id}`}>
          {item.description}
        </p>
        <p className="text-lg font-bold text-primary mt-2" data-testid={`text-item-price-${item.id}`}>
          {currency}{(item.price / 100).toFixed(2)}
        </p>
      </div>
    </Card>
  );
}
