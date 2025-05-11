import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import ErrorPage from "../pages/404Page";
import LoginPage from "../pages/LoginPage";
import { RoutesData } from "../data/RouteData";
import AuthChecker from "../auth/AuthChecker";
import Loading from "../components/shared/Loading";
import TicketsPage from "../pages/TicketsPage";
import AddTicketPage from "../pages/AddTicketPage";
import TicketDetailsPage from "../pages/TicketDetailsPage";
import ProductPage from "../pages/ProductPage";
import "../firebase/firebase.jsx";
import { onMessageListener } from "../firebase/firebase";
import { ToastContainer } from "react-toastify";
import UnAuthorizedPage from "../pages/403Page.jsx";
const AppRoutes = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onMessageListener(navigate).then((payload) => {
      console.log("Foreground message handled:", payload);
    });

    return () => {
      unsubscribe;
    };
  }, [navigate]);

  const [loading, setLoading] = useState(true);
  const login = AuthChecker();

  // Redirect unauthenticated users to the login page
  const RequireAuth = ({ children }) => {
    return login ? children : <Navigate to="/login" />;
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/">
        <Route path="login" element={<LoginPage />} />
        <>
          {RoutesData.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<RequireAuth>{route.element}</RequireAuth>}
            />
          ))}
          <Route path="*" element={<ErrorPage />} />
          <Route path="/unathorized" element={<UnAuthorizedPage />} />
        </>
      </Route>
    </Routes>
  );
};

const Routing = () => {
  return (
    <BrowserRouter>
      <ToastContainer stacked />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default Routing;
