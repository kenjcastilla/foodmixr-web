import React from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, firebaseApp } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { LOGIN } from "../../constants/routes";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRouteAfterSpotifyLogin = ({ children, ...rest }) => {
   let { user } = useAuth();
   const userId = firebaseApp.auth().currentUser.uid;

   // Check if Spotify auth token is present in 
   // Firestore document tied to current user
   const checkToken = async (userId) => {
      console.log(userId);
      const docRef = doc(db, "spotify-tokens", userId);
      const snapshot = await getDoc(docRef);
      const docData = snapshot.data();
      const fields = JSON.parse(JSON.stringify(docData));
      return (fields.token ? true : false);
   };

   // Navigate to app login if there is no user or 
   // Spotify auth token detected
   if (!user || !checkToken(userId)) {
      return <Navigate to={LOGIN} />;
   }
   
   return children;
};

export default PrivateRouteAfterSpotifyLogin;