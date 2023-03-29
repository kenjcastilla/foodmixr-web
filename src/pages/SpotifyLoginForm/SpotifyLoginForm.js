import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase/config";
import "./SpotifyLoginForm.css";
import { useAuth } from "../../context/AuthContext";


const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/afterspotifylogin"
console.log(REDIRECT_URL_AFTER_LOGIN);
const SCOPES = ["user-read-currently-playing", "user-read-playback-state"];
const SCOPES_URL_PARAM = SCOPES.join("%20");

const SpotifyLoginForm = () => {
   const [code, setCode] = useState();
   const auth = useAuth();
   const uid = firebaseApp.auth().currentUser.uid;

   const handleLogin = () => {
      window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
   }

   useEffect(() => {
      const helpSetUserCode = async () => {
         const docRef = doc(db, "users", uid);
         const snapshot = await getDoc(docRef)
            .then((snapshot) => {
               const data = snapshot.data();
               const contents = JSON.parse(JSON.stringify(data));
               setCode(contents.code);
            });
      }
      helpSetUserCode();
      const user = firebaseApp.auth().currentUser;
      const localUser = JSON.stringify({ uid: user.uid, code: code });
      localStorage.setItem("localUser", localUser);
   });

   return (
      <div className="SpotifyLoginContainer">
         <h1>Once you log in to Spotify, your profile id will be added to our database.
            <br></br>Then, others will be able to view your playback!
         </h1>
         <button className="SpotifyLoginButton" onClick={handleLogin}>Log in to Spotify</button>
      </div>

   );
};

export default SpotifyLoginForm;
