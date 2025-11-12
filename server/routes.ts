import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Customer-facing API routes
  
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get all menu items
  app.get("/api/menu-items", async (req, res) => {
    try {
      const menuItems = await storage.getAllMenuItems();
      // Filter out hidden items for customer view
      const visibleItems = menuItems.filter(item => !item.isHidden);
      res.json(visibleItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  // Get menu items by category
  app.get("/api/menu-items/category/:categoryId", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const menuItems = await storage.getMenuItemsByCategory(categoryId);
      // Filter out hidden items for customer view
      const visibleItems = menuItems.filter(item => !item.isHidden);
      res.json(visibleItems);
    } catch (error) {
      console.error("Error fetching menu items by category:", error);
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  // Get active banners
  app.get("/api/banners", async (req, res) => {
    try {
      const banners = await storage.getActiveBanners();
      res.json(banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).json({ error: "Failed to fetch banners" });
    }
  });

  // Get settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      if (!settings) {
        // Return default settings if none exist
        res.json({
          whatsappNumber: "",
          restaurantName: "Mini's & Twennies",
          currency: "$"
        });
      } else {
        res.json(settings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
