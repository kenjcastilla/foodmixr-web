import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
//import SetCurrentTrack from "../../spotify/SetCurrentTrack";
import SetCurrentTrack from "../../context/SpotifyInstanceContext";
import { useNavigate } from "react-router-dom";
import "./SongDisplay.css"


const SongDisplay = () => {
   const params = useParams();
   const navigate = useNavigate();
   const [album, setAlbum] = useState("");
   const [artists, setArtists] = useState("");
   const [image, setImage] = useState("");
   const [timeLeft, setTimeLeft] = useState(5000);
   const [title, setTitle] = useState("");
   const [trackLink, setTrackLink] = useState("");
   //const [userId, setUserId] = useState("");
   const user = JSON.parse(localStorage.getItem("localUser"));
   const uid = user.uid;

   // const helpSetUserId = async () => {
   //    const userRef = doc(db, "users", params.code);
   //    const snapshot = await getDoc(userRef).then((snapshot) => {
   //       const docData = snapshot.data();
   //       const contents = JSON.parse(JSON.stringify(docData));
   //       console.log(contents);
   //       //setUserId(contents.user_id);
   //       console.log(`UserId set to ${contents.user_id}`);
   //    });
   // };

   const setTrack = async () => {
      //SetCurrentTrack();
      const trackRef = doc(db, "current-track", uid);
      const snapshot = await getDoc(trackRef).then((snapshot) => {
         const docData = snapshot.data();
         const track = JSON.parse(JSON.stringify(docData));
         console.log(track);
         console.log(`Next track in ${track.time_left}ms.`);
         setAlbum(track.album);
         setArtists(track.artists[0]);
         setImage(track.image);
         setTimeLeft(parseInt(track.time_left));
         setTitle(track.name);
         setTrackLink(track.link);
      });
   };

   useEffect(() => {
      // if (!userId) {
      //    helpSetUserId();
      // }
      setTrack();
      //setInterval(() => { setTrack(); }, timeLeft);
   });

   return (
      // <div className="container">
      //    <div className="playSource">
      //       <h1 className="currPlaying">Currently Playing at "KennyJC's"</h1>
      //    </div>
      //    <div className="songContainer">
      //       <img className="artwork" alt="Album Artwork">
      //       </img>
      //    </div>
      //    <div className="songInfo">
      //       <h2 className="songTitle">Title</h2>
      //       <h3 className="songArtists">Artists</h3>
      //    </div>
      // </div>

      <div className="container">
         <div className="playSource">
            <h1 className="currPlaying">Currently Playing at "KennyJC's"</h1>
         </div>
         <div className="songContainer">
            <a href={trackLink}>
               <img className="artwork" src={image} alt="Album Artwork" />
            </a>
         </div>
         <div className="songInfo">
            <h2 className="songTitle">{title}</h2>
            <h3 className="songArtists">{artists}</h3>
         </div>
      </div>

   );

};

export default SongDisplay;