import { useState } from "react";
import CategoryNav from "../CategoryNav";

export default function CategoryNavExample() {
  const [activeCategory, setActiveCategory] = useState("1");

  const categories = [
    { id: "1", name: "Appetizers" },
    { id: "2", name: "Main Courses" },
    { id: "3", name: "Desserts" },
    { id: "4", name: "Beverages" },
  ];

  return (
    <CategoryNav
      categories={categories}
      activeCategory={activeCategory}
      onCategoryClick={setActiveCategory}
    />
  );
}
