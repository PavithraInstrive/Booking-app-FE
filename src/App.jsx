import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Pages/Auth/Register";
import BusSearch from "./Pages/SearchBus/index";
import BusListing from "./Pages/BusListing/index";
import MenuBar from "./components/menubar";
import DashboardContent from "./components/DashboardContent";
import BusTableListing from "./Pages/Buses";
import AddBusForm from "./Pages/AddBus";
import RouteListing from "./Pages/Route";
import AddRouteForm from "./Pages/AddRoute";
import ScheduleBusForm from "./Pages/ScheduleBus";
import useIdleTimeout from "./common/useIdleTimeout";
import useOnlineStatus from "./common/useOnlineStatus";
import { refreshAccessToken } from "./constants";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenRefreshError, setTokenRefreshError] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const maxRetries = 3;
  const isOnline = useOnlineStatus();

  const handleTokenRefresh = async () => {
    try {
      const newAccessToken = await refreshAccessToken();
      setTokenRefreshError(false);
    } catch (error) {
      if (error.message === "NetworkError") {
        setTokenRefreshError(true);
      } else {
        console.error("Other refresh error, logging out...");
        handleLogout();
      }
    }
  };

  const logoutUser = () => {
    alert("You have been logged out due to inactivity.");
    localStorage.removeItem("token");
    window.location.href = "/";
    setIsAuthenticated(false);
  };

  useIdleTimeout(logoutUser);

  useEffect(() => {
    if (tokenRefreshError && isOnline) {
      console.log("Connection restored. Retrying token refresh...");

      if (retryAttempts < maxRetries) {
        handleTokenRefresh().catch(() => {
          setRetryAttempts((prevAttempts) => prevAttempts + 1);
          if (retryAttempts + 1 >= maxRetries) {
            console.log("Max retry attempts reached. Logging out...");
            handleLogout();
          }
        });
      }
    }
  }, [isOnline, retryAttempts]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated && (
        <MenuBar onLogout={handleLogout}>
          <Routes>
            <Route path="/dashboard" element={<DashboardContent />} />
            <Route path="/searchbus" element={<BusSearch />} />
            <Route path="/buslisting" element={<BusListing />} />
            <Route path="/buses" element={<BusTableListing />} />
            <Route path="/addbus" element={<AddBusForm />} />
            <Route path="/Routelist" element={<RouteListing />} />
            <Route path="addroute" element={<AddRouteForm />} />
            <Route path="/schedulebus" element={<ScheduleBusForm />} />
          </Routes>
        </MenuBar>
      )}
      <Routes>
        <Route
          path="/"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/register" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
