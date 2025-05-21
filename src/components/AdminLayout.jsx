import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminLayout = () => {
  const { logout, user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
          isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
        onClick={() => setOpen(false)}
      >
        <Icon size={18} />
        <span>{children}</span>
      </Link>
    );
  };

  const SidebarContent = () => (
    <nav className="space-y-2 p-2">
      <NavLink to="/admin/dashboard" icon={LayoutDashboard}>
        Dashboard
      </NavLink>
      <NavLink to="/admin/blogs" icon={FileText}>
        Blogs
      </NavLink>
      <Button
        variant="ghost"
        className="w-full justify-start text-base font-normal"
        onClick={handleLogout}
      >
        <LogOut size={18} />
        Logout
      </Button>
    </nav>
  );

  const SidebarTrigger = () => (
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu />
      </Button>
    </SheetTrigger>
  );

  // If still loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is null after loading is complete, redirect to login
  if (!user) {
    // Don't navigate immediately, just show a message with a button
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col">
        <h1 className="responsive-h2">Authentication Required</h1>
        <p className="text-muted-foreground mb-4">
          Please log in to access the admin panel
        </p>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="md:flex min-h-screen">
      {/* Desktop sidebar - fixed and not scrollable */}
      <aside className="hidden w-64 border-r bg-background p-4 md:block md:py-8 md:fixed md:h-screen overflow-y-auto">
        <div className="mb-8">
          <h2 className="responsive-h2">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">
            Welcome, {user.name || "Admin"}
          </p>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar with sheet */}
      {isMobile && (
        <Sheet open={open} onOpenChange={setOpen}>
          <div className="sticky top-0 z-30 flex h-16 w-full items-center border-b bg-background px-4 md:hidden">
            <SidebarTrigger />
            <h1 className="ml-4 responsive-h3">Admin Panel</h1>
          </div>
          <SheetContent side="left" className="w-64 p-4">
            <div className="mb-8">
              <h2 className="responsive-h2">Admin Panel</h2>
              <p className="text-sm text-muted-foreground">
                Welcome, {user.name || "Admin"}
              </p>
            </div>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}

      {/* Main content - adjusted for fixed sidebar */}
      <main className="flex-1 w-full overflow-auto p-6 pt-6 md:pt-0 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
