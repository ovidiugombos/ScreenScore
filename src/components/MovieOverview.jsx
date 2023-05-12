import config from "../utilities/config";
import Cards from "./Cards";
import { observer } from "../utilities/intersectionObserver";
import { getData } from "../utilities/helpers";
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
import ClipLoader from "react-spinners/ClipLoader";

export default function MovieOverview() {
  const [movie, setMovie] = useState("");
  const [genres, setGenres] = useState([]);
  const [actors, setActors] = useState();
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isOnWatchList, setIsOnWatchList] = useState(false);
  const { movieId } = useParams();
  const containerMovieOverview = useRef(null);
  const containerSiminarMovies = useRef(null);
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const userId = user?.uid;
  const [color, setColor] = useState("#ffffff");

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

  //creating actors for the movie

  function createActorCards(res) {
    res = res.slice(0, 20);
    const arr = [];
    res.forEach((actor) => {
      if (actor.profile_path) {
        arr.push(
          <Card className="border-0 card--movie px-2 bg-transparent">
            <Card.Img
              className="shadow"
              src={`${config.imgUrl}${actor.profile_path}`}
            />
            <Card.Body>
              <Card.Title className="fw-bold">{actor.name}</Card.Title>
              <Card.Text className="text-secondary">
                {actor.character}
              </Card.Text>
            </Card.Body>
          </Card>
        );
      }
    });
    setActors(arr);
  }

  async function getMovieCredits(url) {
    const res = await getData(url);
    createActorCards(res.cast);
  }

  useEffect(() => {
    getMovieCredits(config.apiMovieCredits.replace("{movieid}", movieId));
  }, [movieId]);

  //creating similar movies

  function createSimilarMovies(movies) {
    const arr = movies.map(function (mov) {
      if (mov.poster_path && mov.vote_average) {
        return <Cards showMovieInfo={showMovieInfo} movie={mov} key={mov.id} />;
      }
    });
    setSimilarMovies(arr);
  }

  //fetching similar movies

  async function handleSimilarMoviesData(url) {
    const res = await getData(url);
    createSimilarMovies(res.results);
  }

  useEffect(() => {
    handleSimilarMoviesData(
      config.apiSimilarMovies.replace("{movieid}", movieId)
    );
  }, [movie]);

  // creating the genres of a movie

  function handleMovieGenres(movieGenres) {
    const createGenres = movieGenres.map((genre) => `  ${genre.name}  `);
    setGenres(createGenres);
  }

  //fetching the movies
  async function handleMovieData(url) {
    const res = await getData(url);
    setMovie(res);
    handleMovieGenres(res.genres);
  }

  useEffect(() => {
    handleMovieData(config.apiMovieId.replace("{movieid}", movieId));
  }, [movieId]);

  //goToMoreReviews

  function goToMoreReviews() {
    navigate(`/reviews/${movieId}`);
  }

  return (
    <>
      <Container
        ref={containerMovieOverview}
        fluid
        className="container--movie_overview d-flex justify-content-center align-items-center text-white"
      >
        {movie ? (
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
                  /10 -{genres.join(",")}
                </p>
                <hr className="hr" />

                {movie.overview && (
                  <div>
                    <h4>{movie.tagline || "Overview"}</h4>
                    <p>{movie.overview}</p>
                  </div>
                )}

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

                <a
                  className="d-block mt-3 btn--more_reviews"
                  onClick={goToMoreReviews}
                >
                  Go to reviews!{" "}
                </a>
              </Col>
            </Row>
          </Container>
        ) : (
          <ClipLoader color={color} />
        )}
      </Container>

      {actors?.length > 0 && (
        <div className="py-2 bg-white rounded shadow-sm container--cards">
          <h4 className="m-3 title">Top Billed Cast</h4>
          <Container fluid className="d-flex container--actors_cards ">
            {actors}
          </Container>
        </div>
      )}

      {similarMovies.length > 0 && (
        <div className="py-2 bg-white rounded shadow-sm container--cards">
          <h4 className="m-3 title">Similar movies</h4>
          <Container
            ref={containerSiminarMovies}
            fluid
            className="d-flex container--similar_movies_cards"
          >
            {similarMovies}
          </Container>
        </div>
      )}
    </>
  );
}
