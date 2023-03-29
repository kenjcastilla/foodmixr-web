import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LOGIN } from "../../constants/routes";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ children, ...rest }) => {
   let { user } = useAuth();
   if (!user) {
      return <Navigate to={LOGIN} />;
   }
   return children;
};

export default PrivateRoute;