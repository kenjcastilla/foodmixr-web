import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN, SIGN_UP, SIGN_OUT, SPOTIFY_LOGIN } from "../../constants/routes";
import { useAuth } from "../../context/AuthContext";
import "./Home.css"

const validateCode = (code) => {
   const validCodes = ["1234", "4321", "1357", "2468"];
   for (let c of validCodes) {
      if (code === c) {
         return true;
      }
   }
   return false;
};

const Home = () => {
   const [code, setCode] = useState("");
   const auth = useAuth();
   const navigate = useNavigate();

   const redirect = (destination) => {
      switch (destination) {
         case "Signup":
            navigate(SIGN_UP);
            break;
         case "Login":
            navigate(LOGIN);
            break;
         case "SharePlayback":
            navigate(SPOTIFY_LOGIN);
            break;
         case "SignOut":
            auth.signout();
            navigate(SIGN_OUT);
            break;
      }
   }
   return (
      <div className="Hero">
         <div className="HomeHeaderContainer">
            <h1 className="HomeHeader">foodmixr</h1>
         </div>
         <div className="HomeButtonsContainer">
            {auth.user ? (
               <>
                  <button className="HomeButton" value="SharePlayback" onClick={e => redirect(e.target.value)}>Share Playback</button>
                  <button className="HomeButton" value="SignOut" onClick={e => redirect(e.target.value)}>Sign Out</button>
               </>
            ) :
               <>
                  <button className="HomeButton" value="Signup" onClick={e => redirect(e.target.value)}>Sign Up</button>
                  <button className="HomeButton" value="Login" onClick={e => redirect(e.target.value)}>Log In</button>
               </>
            }
         </div>
      </div >
   );
};

export default Home;