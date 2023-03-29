import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SPOTIFY_LOGIN } from "../../constants/routes";
import { useAuth } from "../../context/AuthContext";
import { db, firebaseApp } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import "./SignupForm.css"


const SignupForm = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [username, setUsername] = useState("");
   const navigate = useNavigate();
   const auth = useAuth();

   const addToFirestore = async () => {
      const uid = firebaseApp.auth().currentUser.uid;
      const data = {token: "", token_type: "", expires_in: 0};
      await setDoc(doc(db, "spotify-tokens", uid), data);
      await setDoc(doc(db, "users", uid), {username: username});
   };

   return (
      <div className="SignupContainer">
         <form onSubmit={(event) => {
            event.preventDefault();
            auth.signup({ email, password, callback: () => navigate(SPOTIFY_LOGIN) });
            addToFirestore();
            setEmail("");
            setPassword("");
            setUsername("");
         }}
         >
            <label className="SignupLabel">Enter an email:</label>
            <input
            className="SignupInput"
               type="email"
               placeholder="Email"
               value={email}
               onChange={(event) => setEmail(event.target.value)}
            />
            <label className="SignupLabel">Create a password:</label>
            <input
            className="SignupInput"
               type="password"
               placeholder="Password"
               value={password}
               onChange={(event) => setPassword(event.target.value)}
            />
            <label className="SignupLabel">Create a username (guests will see this):</label>
            <input
            className="SignupInput"
               type="text"
               placeholder="Username"
               value={username}
               onChange={(event) => setUsername(event.target.value)}
            />
            <button className="SignupButton" type="submit">Sign up</button>
         </form>
      </div>
   );
};

export default SignupForm;