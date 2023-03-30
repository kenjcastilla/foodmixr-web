import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, firebaseApp } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { SPOTIFY_LOGIN } from "../constants/routes";

//making sure tracking upstream
const CURRENT_TRACK_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

const SetCurrentTrack = () => {
   const navigate = useNavigate();
   const localUser = JSON.parse(localStorage.getItem("localUser"));
   const uid = localUser.uid;
   const code = JSON.stringify(localStorage.getItem("localUser")).code;

   const helpSetToken = () => {
      const tokenInStorage = JSON.parse(JSON.stringify(localStorage.getItem("spotifyToken")));
      console.log(tokenInStorage);
      return tokenInStorage;
   };

   const getCurrentTrack = () => {
      const token = JSON.parse(JSON.stringify(localStorage.getItem("spotifyToken")));
      axios.get(CURRENT_TRACK_ENDPOINT, {
         headers: {
            Authorization: "Bearer " + token,
         },
      })
         .then((response) => {
            console.log(`Get Current Track response: ${response.data}`);
            setTrackInFirestore(response.data);
         })
         .catch((error) => {
            console.log(error);
            console.log('TOKEN EXPIRED. REDIRECTING TO SPOTIFY LOGIN PAGE...');
            navigate(SPOTIFY_LOGIN);
         });
   };

   const setTrackInFirestore = async (data) => {
      const album = data.item.album.name;
      const image = data.item.album.images[0].url;
      const timeLeft = data.item.duration_ms - data.progress_ms;
      const title = data.item.name;
      const trackLink = data.item.external_urls.spotify;
      const artists = data.item.artists.reduce((arr, item) => {
         arr.push(item.name);
         return arr;
      }, []);
      console.log(artists);

      console.log("setTrackInFirestore initiated...")
      const toUpdate = {
         album: album,
         artists: artists,
         image: image,
         name: title,
         link: trackLink,
         time_left: timeLeft,
      };
      const docRef = doc(db, "current-track", uid);
      await updateDoc(docRef, toUpdate)
         .then(docRef => {
            console.log("Current track successfully updated in Firestore.");
            return timeLeft;
         })
         .catch(error => { console.log(error); })
      return timeLeft;
   };

   useEffect(() => {
      getCurrentTrack();
      setInterval(() => {
         window.location.reload(false);
      }, 90000);

   });
   return (
      <h1 style={{ marginTop: '5em', textAlign: 'center', fontSize: 45 }}>
         You are currently sharing your playback with others!
         <br />Leaving this page will cease updating your viewers on what you're listening to.
      </h1>

   );
}

export default SetCurrentTrack;