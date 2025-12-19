import { GlobalConfirmDialog } from "@/components/global-confirm-dialog";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalConfirmDialog />
        <Toaster theme="dark" richColors position="top-center" />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
