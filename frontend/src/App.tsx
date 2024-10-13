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

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SocketProvider>
              <NotificationsProvider>
                <AppRoutes />
                <NotificationsCenter />
                <ToastContainer />
              </NotificationsProvider>
            </SocketProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

export default App;
