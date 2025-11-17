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
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";
import { Upload, X } from "lucide-react";

const settingsFormSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  whatsappNumber: z.string().min(1, "WhatsApp number is required"),
  currency: z.string().min(1, "Currency is required"),
  logoUrl: z.string().optional(),
  footerText: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Must be a valid email").optional().or(z.literal("")),
  contactAddress: z.string().optional(),
  addressLink: z.union([
    z.string().url("Must be a valid URL"),
    z.literal(""),
    z.null(),
    z.undefined()
  ]).transform(val => val || "").optional(),
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
      addressLink: settings.addressLink || "",
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
                      <FormLabel>Logo (Optional)</FormLabel>
                      <div className="space-y-2">
                        {field.value && (
                          <div className="relative inline-block">
                            <img 
                              src={field.value} 
                              alt="Logo preview" 
                              className="h-24 w-24 object-contain rounded-md bg-muted p-2"
                              data-testid="img-logo-preview"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => field.onChange("")}
                              data-testid="button-remove-logo"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <FormControl>
                          <ObjectUploader
                            maxNumberOfFiles={1}
                            maxFileSize={5242880}
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
                                  title: "Logo uploaded successfully",
                                });
                              }
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {field.value ? "Change Logo" : "Upload Logo"}
                          </ObjectUploader>
                        </FormControl>
                        <FormDescription>
                          Upload your logo image. Leave empty to show restaurant name only.
                        </FormDescription>
                      </div>
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

                <FormField
                  control={form.control}
                  name="addressLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Link (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://maps.google.com/?q=..."
                          data-testid="input-address-link"
                        />
                      </FormControl>
                      <FormDescription>
                        Paste a Google Maps link for your location
                      </FormDescription>
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
