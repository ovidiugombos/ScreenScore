import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import { getDocs, query, collection } from "firebase/firestore";
import Cards from "./Cards";
import TvShowOverview from "./TvShowOverview";
import { db } from "../firebase/firebase";
import config from "../utilities/config";
import { getData } from "../utilities/helpers";
import { UserContext } from "../firebase/context";
export default function Profile() {
  const [filterMovie, setFilterMovie] = useState(true);
  const [filterTv, setFilterTv] = useState(false);
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [reload, setReload] = useState(false);
  const refTvFilter = useRef(null);
  const refMovieFilter = useRef(null);
  const auth = getAuth();
  let { param } = useParams();
  const user = useContext(UserContext);
  const userId = user?.uid;
  const navigate = useNavigate();

  //scrolling to top

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [param]);

  function handleFilter({ target } = e) {
    target.textContent === "Movie" ? handleMovies() : handleTV();
  }

  async function handleMovies() {
    if (!filterMovie) {
      toggleActiveFilter();
      setFilterMovie(true);
      setFilterTv(false);
    }
  }

  function handleTV() {
    if (!filterTv) {
      toggleActiveFilter();
      setFilterMovie(false);
      setFilterTv(true);
    }
  }

  function toggleActiveFilter() {
    [refMovieFilter, refTvFilter].forEach((el) =>
      el.current.classList.toggle("profile--active_filter")
    );
  }

  function showMovie(movie) {
    navigate(`/movieoverview/${movie.id}`);
  }

  async function createMovie(id) {
    const res = await getData(config.apiMovieId.replace("{movieid}", id));
    setMovies((prevMovies) => [
      ...prevMovies,
      <Cards movie={res} showMovieInfo={showMovie} key={res.id} />,
    ]);
  }

  useEffect(() => {
    console.log("reloaded");
    setMovies([]);
    const fetchMovies = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, `users/${userId}/${param}Movies`))
        );
        querySnapshot.forEach((doc) => {
          createMovie(doc.data().id);
          console.log(doc.data().id);
        });
      } catch (error) {
        console.log(error);
      }
    };

    userId && fetchMovies();
  }, [param, userId]);

  //creating the tvShows

  function showTvInfo(id) {
    navigate(`/tvshowoverview/${id}`);
  }

  async function createTvshows(id) {
    const res = await getData(config.apiTvshowId.replace("{tvshowid}", id));

    setTvShows((prevTvShows) => {
      if (res.poster_path) {
        return [
          ...prevTvShows,
          <Card
            className="border-0 card--movie px-2   bg-transparent"
            key={res.id}
          >
            <Card.Img
              onClick={() => showTvInfo(res.id)}
              src={`${config.imgUrl}${res.poster_path}`}
            />
            <Card.Body>
              <Card.Title onClick={() => showTvInfo(res.id)}>
                {res.name}
              </Card.Title>
              <Card.Text className="text-secondary">
                {res.first_air_date}
              </Card.Text>
            </Card.Body>
          </Card>,
        ];
      } else {
        return [...prevTvShows];
      }
    });
  }

  useEffect(() => {
    setTvShows([]);
    const fetchTvshows = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, `users/${userId}/${param}Tvshows`))
        );
        querySnapshot.forEach((doc) => {
          createTvshows(doc.data().id);
        });
      } catch (error) {
        console.log(error);
      }
    };

    userId && fetchTvshows();
  }, [param, userId]);

  return (
    <>
      <Container fluid className="p-0 profile--info ">
        <Container className="p-4">
          <Row>
            <Col md={2} className="">
              <div className="profile--icon d-flex justify-content-center align-items-center text-white rounded-circle">
                {auth.currentUser?.email[0]}
              </div>
            </Col>
            <Col
              className="text-white d-flex flex-column justify-content-center"
              md={4}
            >
              <h4> Logged in as {auth.currentUser?.email}</h4>
              <h6 className="profile--due_date">
                member since{" "}
                {new Date(
                  auth.currentUser?.metadata.creationTime
                ).toLocaleDateString()}
              </h6>
            </Col>
            <Col md={6}></Col>
          </Row>
        </Container>
      </Container>
      <Container fluid className="profile--list_container bg-white p-3">
        <h3 className="d-inline mx-3">My {param}</h3>
        <p
          ref={refMovieFilter}
          className="profile--filter profile--active_filter d-inline mx-2 p-1 "
          onClick={handleFilter}
        >
          Movie
        </p>
        <p
          ref={refTvFilter}
          className="profile--filter d-inline mx-2 p-1"
          onClick={handleFilter}
        >
          TV
        </p>
        <hr className="hr" />
        {filterMovie && (
          <Container fluid className="container--movies_cards my-4 d-flex ">
            {movies}
          </Container>
        )}
        {filterTv && (
          <Container fluid className="container--movies_cards my-4 d-flex ">
            {tvShows}
          </Container>
        )}
        {/* <hr className="h" /> */}
      </Container>
    </>
  );
}
