import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Pencil, Trash2, Plus, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import type { Category } from "@shared/schema";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      return apiRequest("POST", "/api/admin/categories", { ...data, order: categories.length });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Category created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to create category", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryFormData }) => {
      return apiRequest("PUT", `/api/admin/categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Category updated successfully" });
      setIsDialogOpen(false);
      setEditingCategory(null);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to update category", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Category deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete category", variant: "destructive" });
    },
  });

  const moveCategory = async (index: number, direction: "up" | "down") => {
    const newOrder = [...categories];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    
    const categoryIds = newOrder.map(c => c.id);
    
    setIsReordering(true);
    try {
      await apiRequest("POST", "/api/admin/categories/reorder", { categoryIds });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Category order updated" });
    } catch {
      toast({ title: "Failed to reorder categories", variant: "destructive" });
    } finally {
      setIsReordering(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      form.reset({ name: category.name });
    } else {
      setEditingCategory(null);
      form.reset({ name: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    form.reset();
  };

  const onSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category? This will not delete menu items in this category.")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Categories">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Categories">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Categories</h2>
            <p className="text-muted-foreground">
              Manage your menu categories and their display order
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} data-testid="button-add-category">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {categories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No categories yet</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Category
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {categories.map((category, index) => (
              <Card key={category.id} data-testid={`card-category-${category.id}`}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 py-4">
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base" data-testid={`text-name-${category.id}`}>{category.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveCategory(index, "up")}
                      disabled={index === 0 || isReordering}
                      data-testid={`button-move-up-${category.id}`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveCategory(index, "down")}
                      disabled={index === categories.length - 1 || isReordering}
                      data-testid={`button-move-down-${category.id}`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(category)}
                      data-testid={`button-edit-${category.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                      data-testid={`button-delete-${category.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent data-testid="dialog-category-form">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add Category"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Update the category name"
                  : "Create a new category for your menu items"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Burgers, Sides, Drinks"
                          data-testid="input-category-name"
                        />
                      </FormControl>
                      <FormMessage />
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
                    data-testid="button-submit-category"
                  >
                    {editingCategory ? "Update" : "Create"}
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
