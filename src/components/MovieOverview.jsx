import config from "../utilities/config";
import Cards from "./Cards";
import { observer } from "../utilities/intersectionObserver";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { UserContext } from "../firebase/context";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { async } from "@firebase/util";
import { db } from "../firebase/firebase";
import NavbarOffcanvas from "react-bootstrap/esm/NavbarOffcanvas";

export default function MovieOverview() {
  const [movie, setMovie] = useState("");
  const [review, setReview] = useState("");
  const [genres, setGenres] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isOnWatchList, setIsOnWatchList] = useState(false);
  const { movieId } = useParams();
  const containerMovieOverview = useRef(null);
  const containerSiminarMovies = useRef(null);
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const userId = user?.uid;

  //scrolling to top

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //observer

  useEffect(() => {
    observer.observe(containerMovieOverview.current);
    containerSiminarMovies.current &&
      observer.observe(containerSiminarMovies.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  //reload on title click

  function reload() {
    window.location.reload();
  }

  //navigate on another movie overview

  function showMovieInfo(mov) {
    navigate(`/movieoverview/${mov.id}`);
  }
  //check if a movie is in collections

  async function check(document) {
    const moviesRef = collection(db, `users/${userId}/${document}`);
    const querySnapshot = await getDocs(
      query(moviesRef, where("id", "==", movieId))
    );
    return querySnapshot;
  }

  // handling isFavourite and watchlist button

  function handleIsFavourite() {
    setIsFavourite((prevIsFavourite) => !prevIsFavourite);
  }

  function handleWatchList() {
    setIsOnWatchList((prevIsOnWatchList) => !prevIsOnWatchList);
  }

  //adding to favourites and watchlist

  async function addFavourite() {
    const isInCollection = await check("favouriteMovies");
    isInCollection.empty &&
      (await addDoc(collection(db, `users/${userId}/favouriteMovies`), {
        id: movieId,
      }));
  }

  async function addOnWatchList() {
    const isInCollection = await check("watchlistMovies");
    isInCollection.empty &&
      (await addDoc(collection(db, `users/${userId}/watchlistMovies`), {
        id: movieId,
      }));
  }

  // csetting is favourite and is on watchlist states, when userId is not undefined

  useEffect(() => {
    async function checkFavourite() {
      const querySnapshot = await check("favouriteMovies");
      setIsFavourite(!querySnapshot.empty);
    }
    userId && checkFavourite();
  }, [movieId, userId]);

  useEffect(() => {
    async function checkWatchlist() {
      const querySnapshot = await check("watchlistMovies");
      setIsOnWatchList(!querySnapshot.empty);
    }
    userId && checkWatchlist();
  }, [movieId, userId]);

  //removing from db

  async function removeFavourite() {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, `users/${userId}/favouriteMovies`),
          where("id", "==", movieId)
        )
      );

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      console.log(`Movie with ID ${movieId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  }

  async function removeFromWatchList() {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, `users/${userId}/watchlistMovies`),
          where("id", "==", movieId)
        )
      );

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      console.log(`Movie with ID ${movieId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  }

  //managing favourite

  useEffect(() => {
    isFavourite && addFavourite();
    !isFavourite && removeFavourite();
  }, [isFavourite]);

  //managing watchlist

  useEffect(() => {
    isOnWatchList && addOnWatchList();
    !isOnWatchList && removeFromWatchList();
  }, [isOnWatchList]);

  //creating similar movies

  function createSimilarMovies(movies) {
    const arr = movies.map(function (mov) {
      if (mov.poster_path) {
        return <Cards showMovieInfo={showMovieInfo} movie={mov} key={mov.id} />;
      }
    });
    setSimilarMovies(arr);
  }

  //fetching similar movies

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=5da148ae85fba43a0abfb7bff2aca05a`
    )
      .then((data) => data.json())
      .then((res) => createSimilarMovies(res.results));
  }, [movie]);

  // creating the genres os a movie

  function handleMovieGenres(movieGenres) {
    const createGenres = movieGenres.map((genre) => `  ${genre.name}  `);
    setGenres(createGenres);
  }

  //fetching the movies and movies reviews

  useEffect(() => {
    try {
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=5da148ae85fba43a0abfb7bff2aca05a&language=en-US`
      )
        .then((data) => data.json())
        .then((res) => {
          setMovie(res);
          handleMovieGenres(res.genres);
        });
    } catch (error) {
      console.log(error);
    }

    try {
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=5da148ae85fba43a0abfb7bff2aca05a&language=en-US&page=1`
      )
        .then((data) => data.json())
        .then((res) => setReview(res.results));
    } catch (error) {
      console.log(error);
    }
  }, [movieId]);

  return (
    <>
      <Container
        ref={containerMovieOverview}
        fluid
        className="container--movie_overview  text-white"
      >
        <Container className="p-5">
          <Row>
            <Col md={4}>
              {movie.poster_path && (
                <img
                  className="  rounded shadow-lg"
                  src={`${config.imgUrl}${movie.poster_path}`}
                />
              )}
            </Col>
            <Col className="my-3" md={8}>
              <h1>
                <span className="title--movie" onClick={reload}>
                  {movie.title}{" "}
                </span>
                <span className="title--year">
                  ({movie.release_date?.slice(0, 4)})
                </span>
              </h1>
              <p>
                <img
                  className="img--rating_star mx-1"
                  src="\src\images\rating_star.png"
                />
                {movie.vote_average?.toFixed(1)}
                /10 -{"  "}
                {genres.join(",")}
              </p>
              <hr className="hr" />

              <h4>{movie.tagline || "Overview"}</h4>
              <p>{movie.overview}</p>

              {user && (
                <Container fluid>
                  <button
                    className="mx-2 btn--favourites btn--overview "
                    onClick={handleIsFavourite}
                  >
                    <img
                      className="btn--overview_true"
                      src={`/src/images/${isFavourite}.png`}
                    />
                  </button>
                  <button
                    className="mx-2 btn--watchlist btn--overview"
                    onClick={handleWatchList}
                  >
                    <img
                      className="btn--overview_true"
                      src={`/src/images/watch_${isOnWatchList}.png`}
                    />
                  </button>
                </Container>
              )}

              <a className="d-block mt-3" href={`${movie.homepage}`}>
                Click here to go at the movie homepage!{" "}
              </a>
            </Col>
          </Row>
        </Container>
      </Container>

      {review.length > 0 && (
        <div className="bg-white rounded shadow-sm container--reviews">
          <h4 className="p-4">Reviews</h4>

          <Row className="mx-3">
            <Col md={1} className="d-none d-md-block  ">
              <div className="review--avatar">{review[0].author[0]}</div>
            </Col>

            <Col md={11} className="">
              <Container className="container--review" fluid>
                <p>
                  <span className="text-secondary">Review by </span>
                  <span className="fw-bold">{review[0].author} </span>
                  {review[0].author_details.rating &&
                    [...Array(Math.trunc(review[0].author_details.rating))].map(
                      (index) => (
                        <img
                          className="img--rating_star "
                          src="\src\images\rating_star.png"
                          key={index}
                        />
                      )
                    )}
                </p>
                <p
                  className="fst-italic"
                  dangerouslySetInnerHTML={{ __html: review[0].content }}
                ></p>
              </Container>
              <hr className="hr" />
            </Col>
          </Row>
        </div>
      )}
      {similarMovies.length > 0 && (
        <div className="bg-white rounded shadow-sm container--similar">
          <h4 className="p-4">Similar movies</h4>
          <Container
            ref={containerSiminarMovies}
            fluid
            className="d-flex container--similar_movies_cards "
          >
            {similarMovies}
          </Container>
        </div>
      )}
    </>
  );
}
