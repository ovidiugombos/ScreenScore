import React, { useEffect, useState, useContext } from "react";
import { getData } from "../utilities/helpers";
import config from "../utilities/config";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { db } from "../firebase/firebase";
import { UserContext } from "../firebase/context";
import ClipLoader from "react-spinners/ClipLoader";

import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
export default function TvShowOverview() {
  const tvShowId = useParams().tvshowid;
  const [genres, setGenres] = useState([]);
  const [tvShow, setTvShow] = useState("");
  const [isFavourite, setIsFavourite] = useState(false);
  const [similarTvShows, setSimilarTvShows] = useState([]);
  const [isOnWatchList, setIsOnWatchList] = useState(false);
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const userId = user?.uid;
  const [color, setColor] = useState("#ffffff");

  //check if tvshow is added to favourite or watchlist

  async function check(document) {
    const tvshowsRef = collection(db, `users/${userId}/${document}`);
    const querySnapshot = await getDocs(
      query(tvshowsRef, where("id", "==", tvShowId))
    );
    return querySnapshot;
  }

  //setting is favourite and is on whatchlist buttons

  useEffect(() => {
    async function checkIsFavourite() {
      const querySnapshot = await check("favouriteTvshows");
      setIsFavourite(!querySnapshot.empty);
    }
    userId && checkIsFavourite();
  }, [tvShowId, userId]);

  useEffect(() => {
    async function checkIsOnWatchList() {
      const querySnapshot = await check("watchlistTvshows");
      setIsOnWatchList(!querySnapshot.empty);
    }
    userId && checkIsOnWatchList();
  }, [tvShowId, userId]);

  //changing states for isFavourite and IsOnWatchlist

  function handleIsFavourite() {
    setIsFavourite((prevIsFavourite) => !prevIsFavourite);
  }

  function handleWatchList() {
    setIsOnWatchList((prevIsOnWatchList) => !prevIsOnWatchList);
  }
  //adding tvshow on database

  async function addFavourite() {
    const isInCollection = await check("favouriteTvshows");
    isInCollection.empty &&
      (await addDoc(collection(db, `users/${userId}/favouriteTvshows`), {
        id: tvShowId,
      }));
  }

  async function addOnWatchList() {
    const isInCollection = await check("watchlistTvshows");
    isInCollection.empty &&
      (await addDoc(collection(db, `users/${userId}/watchlistTvshows`), {
        id: tvShowId,
      }));
  }

  //removing tvshow from favourites and watchlist

  async function removeFavourite() {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, `users/${userId}/favouriteTvshows`),
          where("id", "==", tvShowId)
        )
      );

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      console.log(`Tv show with the id ${tvShowId} deleted succesfully`);
    } catch (error) {
      console.log(error);
    }
  }

  async function removeFromWatchList() {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, `users/${userId}/watchlistTvshows`),
          where("id", "==", tvShowId)
        )
      );

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      console.log(`Tvshow with ID ${tvShowId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting tv show:", error);
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

  //handling tvgenres

  function handleTvGenres(tvGenres) {
    const createGenres = tvGenres.map((genre) => `  ${genre.name}  `);
    setGenres(createGenres);
  }

  //fetching the tvshow

  async function handleTvshowData(url) {
    const res = await getData(url);
    console.log(res);
    setTvShow(res);
    handleTvGenres(res.genres);
  }

  useEffect(() => {
    console.log("ok");
    handleTvshowData(config.apiTvshowId.replace("{tvshowid}", tvShowId));
  }, [tvShowId]);

  //navigate on click to another tvshowinfo

  function showTvInfo(showId) {
    navigate(`/tvshowoverview/${showId}`);
  }

  //creating similar tvShows

  function createSimilarTvshows(tvshows) {
    console.log(tvshows);
    const arr = tvshows.map((show) => {
      if (show.poster_path) {
        return (
          <Card
            className="border-0 card--movie px-2   bg-transparent"
            key={show.id}
          >
            <Card.Img
              onClick={() => showTvInfo(show.id)}
              src={`${config.imgUrl}${show.poster_path}`}
            />
            <Card.Body>
              <Card.Title onClick={() => showTvInfo(show.id)}>
                {show.name}
              </Card.Title>
              <Card.Text className="text-secondary">
                {show.first_air_date}
              </Card.Text>
            </Card.Body>
          </Card>
        );
      }
    });
    setSimilarTvShows(arr);
  }

  //fetching similar tvshows
  async function handleSimilarTvshowsData(url) {
    const res = await getData(url);
    createSimilarTvshows(res.results);
  }

  useEffect(() => {
    handleSimilarTvshowsData(
      config.apiSimilarTvshows.replace("{tvshowid}", tvShowId)
    );
  }, [tvShow]);

  return (
    <>
      <Container
        fluid
        className="container--tvshow_overview text-white p-5 d-flex align-items-center justify-content-center"
      >
        {tvShow ? (
          <Row>
            <Col className="d-flex" md={3}>
              <img
                className="  rounded shadow-lg  image--tv_overview"
                src={`${config.imgUrl}${tvShow.poster_path}`}
              />
            </Col>
            <Col className="my-3" md={9}>
              <h1>
                <span className="title--movie">{tvShow.name} </span>
                <span className="title--year">
                  ({tvShow.first_air_date?.slice(0, 4)})
                </span>
              </h1>
              <p>
                <img
                  className=" img--rating_star mx-1"
                  src="\src\images\rating_star.png"
                />
                {tvShow.vote_average?.toFixed(1)}
                /10 - {genres.join(",")}
              </p>
              <hr className="hr" />

              <h4>{tvShow.tagline || "Overview"}</h4>
              <p>{tvShow.overview}</p>
              {user && (
                <Container className="mb-3" fluid>
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

              <a href={`${tvShow.homepage}`}>
                Click here to go at the movie homepage!{" "}
              </a>
            </Col>
          </Row>
        ) : (
          <ClipLoader color={color} />
        )}
      </Container>

      {similarTvShows.length > 0 && (
        <div className="bg-white rounded shadow-sm container--similar">
          <h4 className="p-4">Similar Tvshows</h4>
          <Container
            // ref={containerSiminarMovies}
            fluid
            className="d-flex container--similar_movies_cards "
          >
            {similarTvShows}
          </Container>
        </div>
      )}
    </>
  );
}
