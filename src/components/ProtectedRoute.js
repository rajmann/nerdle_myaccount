import React from "react";

import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isAllowed, redirectTo = "/", children }) => {
  const location = useLocation();
  
  if (!isAllowed) {
    // Store the current path (including params) for post-login redirect
    localStorage.setItem("redirectPath", location.pathname);
    return <Navigate to={redirectTo} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
