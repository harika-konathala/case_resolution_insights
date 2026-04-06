import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Building2, 
  AlertTriangle, 
  Users, 
  DollarSign, 
  Search
} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/department", label: "Department Analysis", icon: Building2 },
    { href: "/priority", label: "Priority & Escalation", icon: AlertTriangle },
    { href: "/customer", label: "Customer Insights", icon: Users },
    { href: "/financial", label: "Financial Analytics", icon: DollarSign },
    { href: "/explorer", label: "Case Explorer", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">CR</div>
            <h1 className="font-bold text-lg leading-tight">Case Resolution Analytics</h1>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden border-b border-border bg-card p-4 overflow-x-auto whitespace-nowrap">
        <nav className="flex gap-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="px-5 py-4 pt-[32px] pb-[32px] pl-[24px] pr-[24px]">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
