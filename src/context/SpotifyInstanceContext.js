import React, { useEffect, useState, createContext } from "react";
import { db, firebaseApp } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import axios from "axios";

const SpotifyInstanceContext = createContext();

const CURRENT_TRACK_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

export function ProvideSpotifyCred({ children }) {
   const spotFunc = SetCurrTrack();
   return <SpotifyInstanceContext.Provider value={spotFunc}>{children}</SpotifyInstanceContext.Provider>
}

const SetCurrTrack = () => {
   //const navigate = useNavigate();
   // const localUser = JSON.parse(localStorage.getItem("localUser"));
   // console.log(localUser);
   // const uid = localUser.uid;

   const [token, setToken] = useState("");
   const [data, setData] = useState({});
   const [album, setAlbum] = useState("");
   const [artists, setArtists] = useState("");
   const [image, setImage] = useState("");
   const [timeLeft, setTimeLeft] = useState(0);
   const [title, setTitle] = useState("");
   const [trackLink, setTrackLink] = useState("");
   const code = JSON.stringify(localStorage.getItem("localUser")).code
   const [uid, setUid] = useState();

   const helpSetToken = () => {
      const tokenInStorage = JSON.parse(JSON.stringify(localStorage.getItem("spotifyToken")));
      console.log(`tokenInStorage: ${tokenInStorage}`);
      setToken(tokenInStorage);
   };

   const helpSetUid = () => {
      const localUid = JSON.parse(JSON.stringify(localStorage.getItem("localUser"))).uid;
      console.log(`localUid: ${localUid}`);
      setUid(localUid);
   };

   // const helpSetToken = async () => {
   //    // const docRef = doc(db, "spotify-tokens", uid);
   //    // const snapshot = await getDoc(docRef);
   //    // const docData = snapshot.data();
   //    // const contents = JSON.parse(JSON.stringify(docData));
   //    // if (contents.token) {
   //    //    setToken(contents.token);
   //    // }
   // };

   const getCurrentTrack = () => {
      axios.get(CURRENT_TRACK_ENDPOINT, {
         headers: {
            Authorization: "Bearer " + token,
         },
      })
         .then((response) => {
            setData(response.data);
            console.log(`Get Current Track response: ${response.data}`);
         })
         .catch((error) => {
            console.log(error);
         });
   };

   const setTrackInFirestore = async () => {
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
         .then(docRef => { console.log("Current track successfully updated in Firestore."); })
         .catch(error => { console.log(error); })
   };

   const setTrackInLocalStorage = () => {
      const toUpdate = JSON.stringify({
         album: album,
         artists: artists,
         image: image,
         name: title,
         link: trackLink,
         time_left: timeLeft
      });
      localStorage.setItem("track", toUpdate);
   };

   useEffect(() => {
      if (!localStorage.getItem("spotifyToken") || ~localStorage.getItem("localUser")) {
         return;
      }
      if (!token) {
         helpSetToken();
      };

      helpSetUid();
      getCurrentTrack();
      setAlbum(data.item.album.name);
      setImage(data.item.image);
      setTimeLeft(data.item.duration_ms - data.progress_ms);
      setTitle(data.item.name);
      setTrackLink(data.item.external_urls.spotify);
      const arts = data.item.artists.reduce((total, item) => {
         total.push(item.name);
      }, []);
      setArtists(arts);

      setTrackInFirestore();
      // setTimeout(() => {
      //    getCurrentTrack();
      //    setAlbum(data.item.album.name);
      //    setImage(data.item.image);
      //    setTimeLeft(data.item.duration_ms - data.progress_ms);
      //    setTitle(data.item.name);
      //    setTrackLink(data.item.external_urls.spotify);
      //    const arts = data.item.artists.reduce((total, item) => {
      //       total.push(item.name);
      //    }, []);
      //    setArtists(arts);

      //    setTrackInFirestore();
      // }, timeLeft);
      //navigate(-1);
   }
   );
};

export default SetCurrTrack;