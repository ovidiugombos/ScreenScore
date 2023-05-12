import React from "react";
import Home from "./components/menu/Home";
import PageNavbar from "./components/PageNavbar";
import MovieOverview from "./components/MovieOverview";
import TvShowOverView from "./components/TvShowOverview";
import Movies from "./components/menu/Movies";
import Reviews from "./components/Reviews";
import TVShows from "./components/menu/TVShows";
import Profile from "./components/Profile";
import SearchResults from "./components/SearchResults";
import { UserContext, useUser } from "./firebase/context";
import Footer from "./components/Footer";
import "./styles/App.css";
// @ts-ignore
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const user = useUser();

  return (
    <>
      <UserContext.Provider value={user}>
        <PageNavbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tvshows" element={<TVShows />} />
          <Route path="/movieoverview/:movieId" element={<MovieOverview />} />
          <Route path="/reviews/:movieId" element={<Reviews />} />
          <Route path="/searchresults/:searchId" element={<SearchResults />} />
          <Route
            path="/tvshowoverview/:tvshowid"
            element={<TvShowOverView />}
          />
          <Route path="/profile/:param" element={<Profile />} />
        </Routes>
        <Footer />
      </UserContext.Provider>
    </>
  );
}

export default App;
