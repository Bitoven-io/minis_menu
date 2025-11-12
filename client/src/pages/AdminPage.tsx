import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Grid3x3, Image } from "lucide-react";

export default function AdminPage() {
  const stats = [
    { title: "Total Items", value: "24", icon: Package },
    { title: "Categories", value: "6", icon: Grid3x3 },
    { title: "Active Banners", value: "3", icon: Image },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2" data-testid="text-welcome">Welcome back!</h2>
          <p className="text-muted-foreground" data-testid="text-subtitle">
            Manage your restaurant menu and settings
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid={`text-stat-value-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card data-testid="card-quick-actions">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your restaurant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Use the sidebar to navigate to different sections of the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
