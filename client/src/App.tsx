import type { CSSProperties } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/hooks/use-auth";
import HomePage from "@/pages/HomePage";
import CheckoutPage from "@/pages/CheckoutPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminPage from "@/pages/AdminPage";
import AdminCategoriesPage from "@/pages/AdminCategoriesPage";
import AdminMenuItemsPage from "@/pages/AdminMenuItemsPage";
import AdminBannersPage from "@/pages/AdminBannersPage";
import AdminSettingsPage from "@/pages/AdminSettingsPage";
import NotFound from "@/pages/not-found";

function AdminRoutes() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" data-testid="loading-auth">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (and not already on login page)
  if (!isAuthenticated && location !== "/admin/login") {
    return (
      <>
        <Redirect to="/admin/login" />
        {null}
      </>
    );
  }

  // Redirect to dashboard if authenticated and on login page
  if (isAuthenticated && location === "/admin/login") {
    return (
      <>
        <Redirect to="/admin" />
        {null}
      </>
    );
  }

  // Only render admin UI if authenticated and not on login page
  if (!isAuthenticated) {
    return null;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Switch>
            <Route path="/admin" component={AdminPage} />
            <Route path="/admin/categories" component={AdminCategoriesPage} />
            <Route path="/admin/items" component={AdminMenuItemsPage} />
            <Route path="/admin/banners" component={AdminBannersPage} />
            <Route path="/admin/settings" component={AdminSettingsPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  if (isAdminRoute) {
    if (location === "/admin/login") {
      return <AdminLoginPage />;
    }
    return <AdminRoutes />;
  }

  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
