import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Pencil, Trash2, Plus, Upload, X, MoreVertical, Eye, EyeOff } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { MenuItem, Category } from "@shared/schema";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";

const menuItemFormSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required").regex(/^\d+$/, "Price must be a number in cents"),
  categoryId: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean(),
  isHidden: z.boolean(),
});

type MenuItemFormData = z.infer<typeof menuItemFormSchema>;

export default function AdminMenuItemsPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const { data: menuItems = [], isLoading: isLoadingItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/admin/menu-items"],
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/admin/categories"],
  });

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categoryId: "",
      imageUrl: "",
      isAvailable: true,
      isHidden: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: MenuItemFormData) => {
      const payload = {
        ...data,
        price: parseInt(data.price),
        imageUrl: data.imageUrl || undefined,
      };
      return apiRequest("POST", "/api/admin/menu-items", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/menu-items"] });
      toast({ title: "Menu item created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to create menu item", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MenuItemFormData }) => {
      const payload = {
        ...data,
        price: parseInt(data.price),
        imageUrl: data.imageUrl || undefined,
      };
      return apiRequest("PUT", `/api/admin/menu-items/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/menu-items"] });
      toast({ title: "Menu item updated successfully" });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to update menu item", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/menu-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/menu-items"] });
      toast({ title: "Menu item deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete menu item", variant: "destructive" });
    },
  });

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      form.reset({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        categoryId: item.categoryId,
        imageUrl: item.imageUrl || "",
        isAvailable: item.isAvailable,
        isHidden: item.isHidden,
      });
    } else {
      setEditingItem(null);
      form.reset({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        imageUrl: "",
        isAvailable: true,
        isHidden: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    form.reset();
  };

  const onSubmit = (data: MenuItemFormData) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleAvailability = (id: string, isAvailable: boolean) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    
    updateMutation.mutate({
      id,
      data: {
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        categoryId: item.categoryId,
        imageUrl: item.imageUrl || "",
        isAvailable,
        isHidden: item.isHidden,
      }
    });
  };

  const handleToggleHidden = (id: string, isHidden: boolean) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    
    updateMutation.mutate({
      id,
      data: {
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        categoryId: item.categoryId,
        imageUrl: item.imageUrl || "",
        isAvailable: item.isAvailable,
        isHidden,
      }
    });
  };

  const isLoading = isLoadingItems || isLoadingCategories;

  if (isLoading) {
    return (
      <AdminLayout title="Menu Items">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading menu items...</p>
        </div>
      </AdminLayout>
    );
  }

  // Group menu items by category
  const itemsByCategory = categories.map(category => ({
    category,
    items: menuItems.filter(item => item.categoryId === category.id),
  }));

  return (
    <AdminLayout title="Menu Items">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Menu Items</h2>
            <p className="text-muted-foreground">
              Manage your menu items organized by category
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} data-testid="button-add-menu-item">
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        </div>

        {menuItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No menu items yet</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Menu Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {itemsByCategory.map(({ category, items }) => (
              <div key={category.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </span>
                </div>
                {items.length === 0 ? (
                  <Card>
                    <CardContent className="py-8">
                      <p className="text-center text-muted-foreground text-sm">
                        No items in this category
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-3">
                    {items.map((item) => (
                      <Card key={item.id} data-testid={`card-menu-item-${item.id}`}>
                        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 py-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base" data-testid={`text-name-${item.id}`}>{item.name}</CardTitle>
                              {!item.isAvailable && (
                                <span className="text-xs px-2 py-0.5 rounded-md bg-destructive/10 text-destructive" data-testid={`badge-unavailable-${item.id}`}>
                                  Unavailable
                                </span>
                              )}
                              {item.isHidden && (
                                <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground" data-testid={`badge-hidden-${item.id}`}>
                                  Hidden
                                </span>
                              )}
                            </div>
                            <CardDescription className="text-sm line-clamp-2" data-testid={`text-description-${item.id}`}>
                              {item.description}
                            </CardDescription>
                            <p className="text-sm font-semibold" data-testid={`text-price-${item.id}`}>
                              ${(item.price / 100).toFixed(2)}
                            </p>
                            {item.imageUrl && (
                              <p className="text-xs text-muted-foreground truncate" data-testid={`text-image-url-${item.id}`}>
                                Image: {item.imageUrl}
                              </p>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" data-testid={`button-actions-${item.id}`}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenDialog(item)} data-testid={`action-edit-${item.id}`}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleAvailability(item.id, !item.isAvailable)} data-testid={`action-toggle-availability-${item.id}`}>
                                {item.isAvailable ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleHidden(item.id, !item.isHidden)} data-testid={`action-toggle-hidden-${item.id}`}>
                                {item.isHidden ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                                {item.isHidden ? "Show Item" : "Hide Item"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive" data-testid={`action-delete-${item.id}`}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-menu-item-form">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Update the menu item details"
                  : "Create a new menu item for your menu"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Cheeseburger"
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe the menu item..."
                          rows={3}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (in cents)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="e.g., 999 for $9.99"
                          data-testid="input-price"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the price in cents (e.g., 999 = $9.99)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id} data-testid={`option-category-${category.id}`}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <div className="space-y-2">
                        {field.value && (
                          <div className="relative inline-block">
                            <img 
                              src={field.value} 
                              alt="Menu item preview" 
                              className="h-32 w-32 object-cover rounded-md"
                              data-testid="img-preview"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => field.onChange("")}
                              data-testid="button-remove-image"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <FormControl>
                          <ObjectUploader
                            maxNumberOfFiles={1}
                            maxFileSize={10485760}
                            buttonVariant={field.value ? "outline" : "default"}
                            onGetUploadParameters={async () => {
                              const response = await apiRequest("POST", "/api/objects/upload", {});
                              const data = await response.json();
                              return {
                                method: "PUT" as const,
                                url: data.uploadURL,
                              };
                            }}
                            onComplete={async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                              if (result.successful && result.successful.length > 0) {
                                const uploadURL = result.successful[0].uploadURL;
                                
                                // Set ACL policy for the uploaded image
                                const response = await apiRequest("PUT", "/api/images", {
                                  imageURL: uploadURL,
                                });
                                const data = await response.json();
                                
                                // Update the form with the normalized object path
                                field.onChange(data.objectPath);
                                toast({
                                  title: "Image uploaded successfully",
                                });
                              }
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {field.value ? "Change Image" : "Upload Image"}
                          </ObjectUploader>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Available</FormLabel>
                        <FormDescription>
                          Make this item available for ordering
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-available"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isHidden"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Hidden</FormLabel>
                        <FormDescription>
                          Hide this item from the menu
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-hidden"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit-menu-item"
                  >
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
