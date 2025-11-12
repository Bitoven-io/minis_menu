import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/HomePage";
import CheckoutPage from "@/pages/CheckoutPage";
import AdminPage from "@/pages/AdminPage";
import AdminCategoriesPage from "@/pages/AdminCategoriesPage";
import AdminMenuItemsPage from "@/pages/AdminMenuItemsPage";
import AdminBannersPage from "@/pages/AdminBannersPage";
import AdminSettingsPage from "@/pages/AdminSettingsPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/categories" component={AdminCategoriesPage} />
      <Route path="/admin/items" component={AdminMenuItemsPage} />
      <Route path="/admin/banners" component={AdminBannersPage} />
      <Route path="/admin/settings" component={AdminSettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
