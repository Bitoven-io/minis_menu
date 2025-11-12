import { Badge } from "@/components/ui/badge";

interface CategoryNavProps {
  categories: { id: string; name: string }[];
  activeCategory?: string;
  onCategoryClick: (categoryId: string) => void;
}

export default function CategoryNav({ categories, activeCategory, onCategoryClick }: CategoryNavProps) {
  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 p-4 min-w-max">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 text-sm whitespace-nowrap no-default-active-elevate"
              onClick={() => onCategoryClick(category.id)}
              data-testid={`badge-category-${category.id}`}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
