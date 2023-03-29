import React from 'react';
import { Link } from 'react-router-dom';
import "./NavigationBar.css";
import * as ROUTES from "../../constants/routes.js"
import { useAuth } from '../../context/AuthContext';

const NavigationBar = () => {
   const auth = useAuth();

   return (
      <header className="NavigationBar">
         <nav>
            <ul>
               <Link to={ROUTES.HOME}>
                  <li>Home</li>
               </Link>
               {auth.user ? ( //if a user is logged in, then use this fragment
                  <>
                     <Link to={ROUTES.AFTER_SPOTIFY_LOGIN}>
                        <li>Share Playback</li>
                     </Link>
                     <Link to={ROUTES.SIGN_OUT}>
                        <li onClick={() => auth.signout()}>Sign Out</li>
                     </Link>
                  </>
               ) : ( //otherwise use this fragment
                  <>
                     <Link to={ROUTES.SIGN_UP}>
                        <li>Signup</li>
                     </Link><Link to={ROUTES.LOGIN}>
                        <li>Login</li>
                     </Link></>
               )}
            </ul>
         </nav>
      </header >
   );
};

export default NavigationBar;