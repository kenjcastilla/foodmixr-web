import React, { useState, useEffect, useContext, createContext } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { FirebaseContext } from "./FirebaseContext";

const AuthContext = createContext();
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
   const auth = useProvideAuth();
   return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
   return useContext(AuthContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
   const [isLoading, setIsLoading] = useState(true);
   const [user, setUser] = useState(null);
   const [userId, setUserId] = useState("");
   //const [userCode, setUserCode] = useState("");
   const { firebase } = useContext(FirebaseContext);

   // Wrap any Firebase methods we want to use making sure ...
   // ... to save the user to state.
   // const helpSetUserCode = async (uid) => {
   //    const docRef = doc(db, "users", uid);
   //    console.log(docRef);
   //    const snapshot = await getDoc(docRef)
   //       .then((snapshot) => {
   //          const docData = snapshot.data();
   //          const fields = JSON.parse(JSON.stringify(docData));
   //          const code = fields.code;
   //          setUserCode(code);
   //       });
   //    console.log(`Code from local state after setUserCode(code): ${userCode}`);
   // };

   const signin = ({ email, password, callback }) => {
      return firebase
         .auth()
         .signInWithEmailAndPassword(email, password)
         .then((response) => {
            setUser(response.user);
            setUserId(response.user.uid);
            //helpSetUserCode(response.user.uid);
            callback();
            return response.user;
         });
   };

   const signup = ({ email, password, callback }) => {
      return firebase
         .auth()
         .createUserWithEmailAndPassword(email, password)
         .then((response) => {
            setUser(response.user);
            setUserId(response.user.uid);
            callback();
            return response.user;
         });
   };

   const signout = () => {
      return firebase
         .auth()
         .signOut()
         .then(() => {
            setUser(false);
            localStorage.clear();
         });
   };

   const sendPasswordResetEmail = (email) => {
      return firebase
         .auth()
         .sendPasswordResetEmail(email)
         .then(() => {
            return true;
         });
   };

   const confirmPasswordReset = (code, password) => {
      return firebase
         .auth()
         .confirmPasswordReset(code, password)
         .then(() => {
            return true;
         });
   };

   // Subscribe to user on mount
   // Because this sets state in the callback it will cause any ...
   // ... component that utilizes this hook to re-render with the ...
   // ... latest auth object.
   useEffect(() => {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
         if (user) {
            setUser(user);
         } else {
            setUser(false);
         }
         setIsLoading(false);
      });
      // Cleanup subscription on unmount
      return () => unsubscribe();
   },);

   // Return the user object and auth methods
   return {
      isLoading,
      user,
      userId,
      //userCode,
      signin,
      signup,
      signout,
      sendPasswordResetEmail,
      confirmPasswordReset,
   };
}