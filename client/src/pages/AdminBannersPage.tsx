import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Pencil, Trash2, Plus, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import type { Banner } from "@shared/schema";

const bannerFormSchema = z.object({
  imageUrl: z.string().min(1, "Image URL is required"),
  isActive: z.boolean(),
});

type BannerFormData = z.infer<typeof bannerFormSchema>;

export default function AdminBannersPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const { data: banners = [], isLoading } = useQuery<Banner[]>({
    queryKey: ["/api/admin/banners"],
  });

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      imageUrl: "",
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: BannerFormData) => {
      return apiRequest("POST", "/api/admin/banners", { ...data, order: banners.length });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      toast({ title: "Banner created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to create banner", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BannerFormData }) => {
      return apiRequest("PUT", `/api/admin/banners/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      toast({ title: "Banner updated successfully" });
      setIsDialogOpen(false);
      setEditingBanner(null);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to update banner", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      toast({ title: "Banner deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete banner", variant: "destructive" });
    },
  });

  const moveBanner = async (index: number, direction: "up" | "down") => {
    const newOrder = [...banners];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    
    const bannerIds = newOrder.map(b => b.id);
    
    setIsReordering(true);
    try {
      await apiRequest("POST", "/api/admin/banners/reorder", { bannerIds });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      toast({ title: "Banner order updated" });
    } catch {
      toast({ title: "Failed to reorder banners", variant: "destructive" });
    } finally {
      setIsReordering(false);
    }
  };

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      form.reset({ imageUrl: banner.imageUrl, isActive: banner.isActive });
    } else {
      setEditingBanner(null);
      form.reset({ imageUrl: "", isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBanner(null);
    form.reset();
  };

  const onSubmit = (data: BannerFormData) => {
    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Banners">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading banners...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Banners">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Banners</h2>
            <p className="text-muted-foreground">
              Manage your promotional banners and their display order
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} data-testid="button-add-banner">
            <Plus className="h-4 w-4 mr-2" />
            Add Banner
          </Button>
        </div>

        {banners.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No banners yet</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Banner
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {banners.map((banner, index) => (
              <Card key={banner.id} data-testid={`card-banner-${banner.id}`}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 py-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base truncate" data-testid={`text-url-${banner.id}`}>{banner.imageUrl}</CardTitle>
                        {!banner.isActive && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground flex-shrink-0" data-testid={`badge-inactive-${banner.id}`}>
                            Inactive
                          </span>
                        )}
                      </div>
                      {banner.imageUrl && (
                        <div className="h-20 w-40 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img 
                            src={banner.imageUrl} 
                            alt="Banner preview" 
                            className="w-full h-full object-cover"
                            data-testid={`img-preview-${banner.id}`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveBanner(index, "up")}
                      disabled={index === 0 || isReordering}
                      data-testid={`button-move-up-${banner.id}`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveBanner(index, "down")}
                      disabled={index === banners.length - 1 || isReordering}
                      data-testid={`button-move-down-${banner.id}`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(banner)}
                      data-testid={`button-edit-${banner.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(banner.id)}
                      data-testid={`button-delete-${banner.id}`}
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
          <DialogContent data-testid="dialog-banner-form">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? "Edit Banner" : "Add Banner"}
              </DialogTitle>
              <DialogDescription>
                {editingBanner
                  ? "Update the banner details"
                  : "Create a new promotional banner"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://example.com/banner.jpg"
                          data-testid="input-image-url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Display this banner in the carousel
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-active"
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
                    data-testid="button-submit-banner"
                  >
                    {editingBanner ? "Update" : "Create"}
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
