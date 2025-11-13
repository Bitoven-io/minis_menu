import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Settings } from "@shared/schema";

const settingsFormSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  whatsappNumber: z.string().min(1, "WhatsApp number is required"),
  currency: z.string().min(1, "Currency is required"),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  footerText: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Must be a valid email").optional().or(z.literal("")),
  contactAddress: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsFormSchema>;

export default function AdminSettingsPage() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    values: settings ? {
      restaurantName: settings.restaurantName,
      whatsappNumber: settings.whatsappNumber,
      currency: settings.currency,
      logoUrl: settings.logoUrl || "",
      footerText: settings.footerText || "",
      contactPhone: settings.contactPhone || "",
      contactEmail: settings.contactEmail || "",
      contactAddress: settings.contactAddress || "",
    } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      const response = await apiRequest("PUT", "/api/admin/settings", data);
      return await response.json();
    },
    onSuccess: (updatedSettings) => {
      // Update the cache with the new settings data
      queryClient.setQueryData(["/api/settings"], updatedSettings);
      // Also invalidate to ensure fresh data on next page load
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      
      toast({
        title: "Settings updated",
        description: "Your restaurant settings have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Settings">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Restaurant Settings</h2>
          <p className="text-muted-foreground">
            Manage your restaurant information, branding, and contact details
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Core restaurant details and WhatsApp integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="restaurantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Restaurant Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-restaurant-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="+962798230500"
                          data-testid="input-whatsapp"
                        />
                      </FormControl>
                      <FormDescription>
                        Include country code (e.g., +962798230500)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency Symbol</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="$" data-testid="input-currency" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>
                  Logo and footer text for your restaurant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://example.com/logo.png"
                          data-testid="input-logo-url"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a URL to your logo image. Leave empty to show restaurant name only.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="footerText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Footer Tagline (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Fresh burgers made to order"
                          data-testid="input-footer-text"
                        />
                      </FormControl>
                      <FormDescription>
                        A short tagline or description for your footer
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Contact details displayed in the footer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="+962 79 823 0500"
                          data-testid="input-contact-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="info@minisandtwennies.com"
                          data-testid="input-contact-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="123 Main Street, Amman, Jordan"
                          rows={2}
                          data-testid="textarea-contact-address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={updateMutation.isPending}
                data-testid="button-save-settings"
              >
                {updateMutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
