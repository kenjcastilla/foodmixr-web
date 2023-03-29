import React, { useState, useEffect } from "react";
import { ReactDOM } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase/config";
import { db } from "../../firebase/config";
import "./AfterSpotifyLogin.css";
import Wrapper from "../../spotify/Wrapper.js";
import { useAuth } from "../../context/AuthContext";
import SetCurrentTrack from "../../spotify/SetCurrentTrack";
import { HOME, SET_CURR_TRACK } from "../../constants/routes";

const getReturnedParamsFromSpotifyAuth = (hash) => {
   console.log(`\nBeginning of getReturnedParamsFromSpotifyAuth():\n`);
   const stringAfterHashtag = hash.substring(1);
   const paramsInUrl = stringAfterHashtag.split("&");
   const paramsSplitUp = paramsInUrl.reduce((accumulator, currentValue) => {
      // console.log(`currentValue:  ${currentValue}, ${typeof currentValue}`);
      const [key, value] = currentValue.split("=");
      // console.log(`Key: ${key}, Value: ${value}`);
      accumulator[key] = value;
      return accumulator;
   }, {});
   if (Object.keys(paramsSplitUp).length === 1) {
      return { access_token: 'error', expires_in: 'error', access_token: '10' };
   };
   console.log(paramsSplitUp);
   return paramsSplitUp;
};

const AfterSpotifyLogin = () => {
   const [token, setToken] = useState();
   const auth = useAuth();
   const code = auth.userCode;
   const navigate = useNavigate();

   const goHome = () => {
      Wrapper();
      navigate("/");
   };

   const sharePlayback = async () => {
      const uid = firebaseApp.auth().currentUser.uid;
      const docRef = doc(db, "users", uid);
      const snapshot = await getDoc(docRef);
      const docData = snapshot.data();
      const fields = JSON.parse(JSON.stringify(docData));
      const code = fields.code;
      navigate(SET_CURR_TRACK)
   };

   useEffect(() => {
      if (window.location.hash) {
         const {
            access_token,
            expires_in,
            token_type,
         } = getReturnedParamsFromSpotifyAuth(window.location.hash);
         if (access_token === 'error') {
            navigate(HOME);
         }
         setToken(access_token);

         const setTokenInFirestore = async (accessToken, tokenType, expiresIn) => {
            const user = firebaseApp.auth().currentUser;
            const docRef = doc(db, "spotify-tokens", user.uid);
            const data = {
               token: accessToken,
               token_type: tokenType,
               expires_in: parseInt(expiresIn)
            };
            await updateDoc(docRef, data)
               .then(docRef => { console.log(" 'spotify-tokens' document fields successfully updated in Firestore."); })
               .catch(error => { console.log(error); })
         };
         setTokenInFirestore(access_token, token_type, expires_in);
         localStorage.setItem("spotifyToken", access_token);
      }
   });

   return (
      <div className="aferSpotifyRedirectContainer">
         <div className="afterSpotifyMessageContainer">
            <h1 className="afterSpotifyShareMessage">Click 'Start Sharing' to share your playback!</h1>
         </div>
         <div className="afterSpotifyRedirectDecision">
            <button className="afterSpotifyRedirectButton" onClick={goHome}>Back Home</button>
            <button className="afterSpotifyRedirectButton" onClick={sharePlayback}>Start Sharing</button>
         </div>
      </div>
   );
};

export default AfterSpotifyLogin;