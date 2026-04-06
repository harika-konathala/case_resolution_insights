import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, Router as WouterRouter } from "wouter";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/theme-provider";

import Layout from "@/components/layout";
import OverviewPage from "@/pages/overview";
import DepartmentPage from "@/pages/department";
import PriorityPage from "@/pages/priority";
import CustomerPage from "@/pages/customer";
import FinancialPage from "@/pages/financial";
import ExplorerPage from "@/pages/explorer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={OverviewPage} />
        <Route path="/department" component={DepartmentPage} />
        <Route path="/priority" component={PriorityPage} />
        <Route path="/customer" component={CustomerPage} />
        <Route path="/financial" component={FinancialPage} />
        <Route path="/explorer" component={ExplorerPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
