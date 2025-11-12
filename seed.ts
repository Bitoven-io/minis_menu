import { db } from "./db";
import { categories, menuItems, banners, settings, users } from "./shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Starting database seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.insert(users).values({
    username: "admin",
    password: hashedPassword,
  }).onConflictDoNothing();
  console.log("✓ Admin user created (username: admin, password: admin123)");

  // Create categories
  const categoriesData = [
    { name: "Burgers", order: 0 },
    { name: "Sides", order: 1 },
    { name: "Desserts", order: 2 },
    { name: "Drinks", order: 3 },
  ];

  const categoryIds: string[] = [];
  for (const cat of categoriesData) {
    const result = await db.insert(categories).values(cat).returning().onConflictDoNothing();
    if (result.length > 0) {
      categoryIds.push(result[0].id);
    }
  }
  console.log("✓ Categories created");

  // Create menu items (if categories were created)
  if (categoryIds.length >= 4) {
    await db.insert(menuItems).values([
      {
        categoryId: categoryIds[0],
        name: "Classic Mini Burger",
        description: "100% beef patty with lettuce, tomato, onion and our special sauce",
        price: 899,
        imageUrl: "/api/placeholder-burger.jpg",
        isAvailable: true,
        isHidden: false,
      },
      {
        categoryId: categoryIds[0],
        name: "Twennie Deluxe",
        description: "Double beef patties, cheese, bacon, and all the fixings",
        price: 1499,
        imageUrl: "/api/placeholder-burger.jpg",
        isAvailable: true,
        isHidden: false,
      },
      {
        categoryId: categoryIds[0],
        name: "Chicken Supreme",
        description: "Crispy chicken breast with lettuce, mayo, and pickles",
        price: 999,
        imageUrl: "/api/placeholder-burger.jpg",
        isAvailable: true,
        isHidden: false,
      },
      {
        categoryId: categoryIds[1],
        name: "Golden Fries",
        description: "Crispy golden french fries with sea salt",
        price: 399,
        imageUrl: "/api/placeholder-fries.jpg",
        isAvailable: true,
        isHidden: false,
      },
      {
        categoryId: categoryIds[1],
        name: "Onion Rings",
        description: "Crispy beer-battered onion rings with ranch dip",
        price: 499,
        imageUrl: "/api/placeholder-onion-rings.jpg",
        isAvailable: true,
        isHidden: false,
      },
      {
        categoryId: categoryIds[2],
        name: "Chocolate Brownie",
        description: "Warm chocolate brownie with vanilla ice cream",
        price: 599,
        imageUrl: "/api/placeholder-dessert.jpg",
        isAvailable: true,
        isHidden: false,
      },
      {
        categoryId: categoryIds[3],
        name: "Fresh Lemonade",
        description: "Freshly squeezed lemonade with mint",
        price: 299,
        imageUrl: "/api/placeholder-drink.jpg",
        isAvailable: true,
        isHidden: false,
      },
      {
        categoryId: categoryIds[3],
        name: "Chocolate Shake",
        description: "Thick and creamy chocolate milkshake",
        price: 499,
        imageUrl: "/api/placeholder-shake.jpg",
        isAvailable: true,
        isHidden: false,
      },
    ]).onConflictDoNothing();
    console.log("✓ Menu items created");
  }

  // Create banners
  await db.insert(banners).values([
    { imageUrl: "/api/placeholder-banner1.jpg", order: 0, isActive: true },
    { imageUrl: "/api/placeholder-banner2.jpg", order: 1, isActive: true },
    { imageUrl: "/api/placeholder-banner3.jpg", order: 2, isActive: true },
  ]).onConflictDoNothing();
  console.log("✓ Banners created");

  // Create settings
  await db.insert(settings).values({
    whatsappNumber: "1234567890",
    restaurantName: "Mini's & Twennies",
    currency: "$",
  }).onConflictDoNothing();
  console.log("✓ Settings created");

  console.log("\n✅ Database seed completed successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
