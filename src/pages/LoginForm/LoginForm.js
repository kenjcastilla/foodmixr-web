import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SPOTIFY_LOGIN } from "../../constants/routes";
import { useAuth } from "../../context/AuthContext";
import "./LoginForm.css"

const LoginForm = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   const auth = useAuth();

   return (
      <div className="LoginContainer">
         <form onSubmit={(event) => {
            event.preventDefault();
            auth.signin({ email, password, callback: () => navigate(SPOTIFY_LOGIN) });
            setEmail("");
            setPassword("");
         }}
         >
            <label className="LoginLabel">Email:</label>
            <input
            className="LoginInput"
               type="email"
               placeholder="Email"
               value={email}
               onChange={(event) => setEmail(event.target.value)}
            />
            <label className="LoginLabel">Password:</label>
            <input
            className="LoginInput"
               type="password"
               placeholder="Password"
               value={password}
               onChange={(event) => setPassword(event.target.value)}
            />
            <button className="LoginButton" type="submit">Log in</button>
         </form>
      </div>
   );
};

export default LoginForm;