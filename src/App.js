import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as ROUTES from "./constants/routes.js";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import SignupForm from "./pages/SignupForm";
import LoginForm from "./pages/LoginForm";
import PrivateRoute from "./components/PrivateRoute";
import SongDisplay from "./pages/SongDisplay";
import SpotifyLoginForm from "./pages/SpotifyLoginForm";
import { useAuth } from "./context/AuthContext.js";
import AfterSpotifyLogin from "./pages/AfterSpotifyLogin";
import PrivateRouteAfterSpotifyLogin from "./components/PrivateRouteAfterSpotifyLogin/PrivateRouteAfterSpotifyLogin.js";
import SetCurrentTrack from "./spotify/SetCurrentTrack.js";
import PrivateRouteSetCurrTrack from "./components/PrivateRouteSetCurrTrack/PrivateRouteSetCurrTrack.js";

function App() {
  const { isLoading } = useAuth();
  return isLoading ? (
    <h1>hold on, loading...</h1>
  ) : (
    <Router>
      <NavigationBar />

      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginForm />} />
        <Route path={ROUTES.SIGN_UP} element={<SignupForm />} />
        <Route path={ROUTES.SPOTIFY_LOGIN}
          element={
            <PrivateRoute>
              <SpotifyLoginForm />
            </PrivateRoute>
          }
        />
        <Route path={ROUTES.AFTER_SPOTIFY_LOGIN}
          element={
            <PrivateRouteAfterSpotifyLogin>
              <AfterSpotifyLogin />
            </PrivateRouteAfterSpotifyLogin>
          }
        />
        <Route path={ROUTES.SET_CURR_TRACK}
          element={
            <PrivateRouteSetCurrTrack>
              <SetCurrentTrack />
            </PrivateRouteSetCurrTrack>
          }
        />
        <Route path={ROUTES.SONG_DISPLAY} element={<SongDisplay />} />
        <Route path={ROUTES.HOME} element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
