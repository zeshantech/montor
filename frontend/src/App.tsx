// src/App.tsx

import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./contexts/AuthContext";
import SocketProvider from "./contexts/SocketContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import theme from "./theme";
import NotificationsProvider from "./contexts/NotificationsContext";
import NotificationsCenter from "./components/Notifications/NotificationsCenter";
import { ClerkProvider } from "@clerk/clerk-react";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        onError: () => {
          alert('error')
        }
      },
    }
  });

  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <AuthProvider>
              <SocketProvider>
                <NotificationsProvider>
                  <AppRoutes />
                  <NotificationsCenter />
                  <ToastContainer />
                </NotificationsProvider>
              </SocketProvider>
            </AuthProvider>
          </ClerkProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

export default App;
