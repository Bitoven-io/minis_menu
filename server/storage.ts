import { db } from "../db";
import { 
  users, categories, menuItems, banners, settings,
  type User, type InsertUser,
  type Category, type InsertCategory,
  type MenuItem, type InsertMenuItem,
  type Banner, type InsertBanner,
  type Settings, type InsertSettings
} from "@shared/schema";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  reorderCategories(categoryIds: string[]): Promise<void>;

  // Menu item methods
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<boolean>;
  toggleItemAvailability(id: string, isAvailable: boolean): Promise<MenuItem | undefined>;
  toggleItemVisibility(id: string, isHidden: boolean): Promise<MenuItem | undefined>;

  // Banner methods
  getAllBanners(): Promise<Banner[]>;
  getActiveBanners(): Promise<Banner[]>;
  getBanner(id: string): Promise<Banner | undefined>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBanner(id: string, banner: Partial<InsertBanner>): Promise<Banner | undefined>;
  deleteBanner(id: string): Promise<boolean>;
  reorderBanners(bannerIds: string[]): Promise<void>;
  toggleBannerActive(id: string, isActive: boolean): Promise<Banner | undefined>;

  // Settings methods
  getSettings(): Promise<Settings | undefined>;
  updateSettings(settingsData: Partial<InsertSettings>): Promise<Settings>;
}

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.order));
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db.update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result.length > 0;
  }

  async reorderCategories(categoryIds: string[]): Promise<void> {
    for (let i = 0; i < categoryIds.length; i++) {
      await db.update(categories)
        .set({ order: i })
        .where(eq(categories.id, categoryIds[i]));
    }
  }

  // Menu item methods
  async getAllMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems);
  }

  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.categoryId, categoryId));
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const result = await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1);
    return result[0];
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const result = await db.insert(menuItems).values(item).returning();
    return result[0];
  }

  async updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const result = await db.update(menuItems)
      .set(item)
      .where(eq(menuItems.id, id))
      .returning();
    return result[0];
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    const result = await db.delete(menuItems).where(eq(menuItems.id, id)).returning();
    return result.length > 0;
  }

  async toggleItemAvailability(id: string, isAvailable: boolean): Promise<MenuItem | undefined> {
    const result = await db.update(menuItems)
      .set({ isAvailable })
      .where(eq(menuItems.id, id))
      .returning();
    return result[0];
  }

  async toggleItemVisibility(id: string, isHidden: boolean): Promise<MenuItem | undefined> {
    const result = await db.update(menuItems)
      .set({ isHidden })
      .where(eq(menuItems.id, id))
      .returning();
    return result[0];
  }

  // Banner methods
  async getAllBanners(): Promise<Banner[]> {
    return await db.select().from(banners).orderBy(asc(banners.order));
  }

  async getActiveBanners(): Promise<Banner[]> {
    return await db.select().from(banners)
      .where(eq(banners.isActive, true))
      .orderBy(asc(banners.order));
  }

  async getBanner(id: string): Promise<Banner | undefined> {
    const result = await db.select().from(banners).where(eq(banners.id, id)).limit(1);
    return result[0];
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const result = await db.insert(banners).values(banner).returning();
    return result[0];
  }

  async updateBanner(id: string, banner: Partial<InsertBanner>): Promise<Banner | undefined> {
    const result = await db.update(banners)
      .set(banner)
      .where(eq(banners.id, id))
      .returning();
    return result[0];
  }

  async deleteBanner(id: string): Promise<boolean> {
    const result = await db.delete(banners).where(eq(banners.id, id)).returning();
    return result.length > 0;
  }

  async reorderBanners(bannerIds: string[]): Promise<void> {
    for (let i = 0; i < bannerIds.length; i++) {
      await db.update(banners)
        .set({ order: i })
        .where(eq(banners.id, bannerIds[i]));
    }
  }

  async toggleBannerActive(id: string, isActive: boolean): Promise<Banner | undefined> {
    const result = await db.update(banners)
      .set({ isActive })
      .where(eq(banners.id, id))
      .returning();
    return result[0];
  }

  // Settings methods
  async getSettings(): Promise<Settings | undefined> {
    const result = await db.select().from(settings).limit(1);
    return result[0];
  }

  async updateSettings(settingsData: Partial<InsertSettings>): Promise<Settings> {
    const existing = await this.getSettings();
    
    if (existing) {
      const result = await db.update(settings)
        .set(settingsData)
        .where(eq(settings.id, existing.id))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(settings)
        .values(settingsData as InsertSettings)
        .returning();
      return result[0];
    }
  }
}

export const storage = new DbStorage();
