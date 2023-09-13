import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import axios from "axios";
import { SPOTIFY_LOGIN } from "../constants/routes";

const CURRENT_TRACK_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

const SetCurrentTrack = () => {
   const [duration, setDuration] = useState(240000);
   const [trackTitle, setTrackTitle] = useState("");
   const navigate = useNavigate();
   const localUser = JSON.parse(localStorage.getItem("localUser"));
   const uid = localUser.uid;

   const getTime = useCallback(() => {
      console.log(`DURATION:  ${duration}`);
      return duration;
   }, [duration]);

   const setTrackInFirestore = useCallback(async (data) => {
      const album = data.item.album.name;
      const image = data.item.album.images[0].url;
      const timeLeft = data.item.duration_ms - data.progress_ms;
      const title = data.item.name;
      if (title !== trackTitle) {
         setTrackTitle(title);
         setDuration(timeLeft);
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
      }
      // return timeLeft;

   }, [trackTitle, uid]);

   const getCurrentTrack = useCallback(() => {
      const token = JSON.parse(JSON.stringify(localStorage.getItem("spotifyToken")));
      axios.get(CURRENT_TRACK_ENDPOINT, {
         headers: {
            Authorization: "Bearer " + token,
         },
      })
         .then((response) => {
            setTrackInFirestore(response.data);
         })
         .catch((error) => {
            console.log(error);
            console.log('TOKEN EXPIRED. REDIRECTING TO SPOTIFY LOGIN PAGE...');
            navigate(SPOTIFY_LOGIN);
         });
   }, [navigate, setTrackInFirestore]);


   useEffect(() => {
      console.log(`DURATION: ${duration}`);
      getCurrentTrack();
      setTimeout(() => {
         window.location.reload(false);
      }, duration);

   }, [duration, getCurrentTrack]);
   
   return (
      <>
      <h1 style={{ width: '75%', margin: 'auto', marginTop: '6em', textAlign: 'center', fontSize: 40 }}>
         You are currently sharing your playback with others!
         <br />Keep this page open to continue sharing.
      </h1>
      </>

   );
}

export default SetCurrentTrack;