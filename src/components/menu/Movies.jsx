import React, { useEffect, useRef, useState } from "react";
import config from "../../utilities/config";
import { observer } from "../../utilities/intersectionObserver";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { CircularProgressbar } from "react-circular-progressbar";

import {
  Accordion,
  Container,
  Button,
  Card,
  Row,
  Col,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

export default function Movies() {
  const [filter, setFilter] = useState("Popularity");
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [moviesApiPage, setMoviesApiPage] = useState(config.apiPopularUrl);
  const [currentApi, setCurrentApi] = useState(config.apiPopularUrl);
  const movieCard = useRef([]);
  const navigate = useNavigate();
  const [color, setColor] = useState("#228ce9");

  //scrolling to top

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //go to movie overview
  function showMovieInfo(movie) {
    navigate(`/movieoverview/${movie.id}`);
  }

  //create the cards
  function createMovieCards(movies) {
    console.log("create");
    const cards = movies.map(function (movie, index) {
      let pathColor, trailColor;
      const vote = Math.trunc(movie.vote_average * 10);
      const percentage = vote;
      if (vote >= 70) {
        pathColor = "#5cb85c";
        trailColor = "#1e4228";
      } else {
        pathColor = "#bcc02e";
        trailColor = "#3e3a11";
      }

      return (
        <Card className="card--movie mx-2 my-2  shadow">
          <div className="position-relative">
            <Card.Img
              onClick={() => showMovieInfo(movie)}
              src={`${config.imgUrl}${movie.poster_path}`}
            />
            {vote > 0 && (
              <div className="card--score">
                <CircularProgressbar
                  value={percentage}
                  text={percentage}
                  background={true}
                  backgroundPadding={6}
                  strokeWidth={4}
                  styles={{
                    text: {
                      fontSize: "30px",
                      fontWeight: "bold",
                      fill: "white",
                    },
                    background: { fill: `#081c22` },
                    path: {
                      stroke: `${pathColor}`,
                    },
                    trail: { stroke: `${trailColor}` },
                  }}
                />
              </div>
            )}
          </div>
          <Card.Body>
            <Card.Title onClick={() => showMovieInfo(movie)}>
              {movie.title}
            </Card.Title>
            <Card.Text className="text-secondary lh-1">
              {movie.release_date}
            </Card.Text>
          </Card.Body>
        </Card>
      );
    });
    return cards;
  }

  useEffect(() => {
    if (page === 1) setAllMovies(movies);
    else setAllMovies((prevAllMovies) => [...prevAllMovies, ...movies]);
  }, [movies]);

  //change the filter
  function changeFilter(name) {
    setFilter(name);
  }

  function handleGenre(e) {
    setCurrentApi(config.apiGenresUrl.replace("{genre_id}", e.target.id));
    changeFilter(e.target.textContent);
  }

  function handleRating(e) {
    setCurrentApi(config.apiTopRatedUrl);
    changeFilter(e.target.textContent);
  }

  function handleUpcoming(e) {
    setCurrentApi(config.apiUpcomingUrl);
    changeFilter(e.target.textContent);
  }

  function handlePopular(e) {
    setCurrentApi(config.apiPopularUrl);
    changeFilter(e.target.textContent);
  }

  //change the page
  function loadMore() {
    setMoviesApiPage(currentApi + `&page=${page + 1}`);
    setPage((prevPage) => prevPage + 1);
  }

  useEffect(() => {
    setAllMovies([]);
  }, [filter]);

  //update the current url
  useEffect(() => {
    setMoviesApiPage(currentApi + `&page=${1}`);
    setPage(1);
  }, [currentApi]);

  //fetch the url
  useEffect(() => {
    fetch(moviesApiPage)
      .then((data) => data.json())
      .then((res) => {
        setMovies(createMovieCards(res.results));
      });
  }, [moviesApiPage]);

  return (
    <Container fluid className="p-4 bg-white ">
      <Row>
        <Col lg={3} className="container--movie_filters">
          <Container className="mx-2" fluid>
            <h4 className=" my-2 align-self-start">{filter}</h4>
            <hr className="hr" />
            <h5>Search by: </h5>
            <p className="filter_category" onClick={handlePopular}>
              Popularity
            </p>
            <p className="filter_category" onClick={handleRating}>
              Rating
            </p>
            <p className="filter_category" onClick={handleUpcoming}>
              Upcoming
            </p>
            <hr className="hr" />
            <h5>Search by movie genres</h5>

            <p className="filter_category" onClick={handleGenre} id="28">
              Action
            </p>
            <p className="filter_category" onClick={handleGenre} id="12">
              Adventure
            </p>
            <p className="filter_category" onClick={handleGenre} id="16">
              Animation
            </p>
            <p className="filter_category" onClick={handleGenre} id="35">
              Comedy
            </p>
            <p className="filter_category" onClick={handleGenre} id="99">
              Documentary
            </p>
            <p className="filter_category" onClick={handleGenre} id="18">
              Drama
            </p>
            <p className="filter_category" onClick={handleGenre} id="10751">
              Family
            </p>
            <p className="filter_category" onClick={handleGenre} id="14">
              Fantasy
            </p>
            <p className="filter_category" onClick={handleGenre} id="36">
              Historical
            </p>
            <p className="filter_category" onClick={handleGenre} id="27">
              Horror
            </p>
            <p className="filter_category" onClick={handleGenre} id="10402">
              Music
            </p>
            <p className="filter_category" onClick={handleGenre} id="9648">
              Mistery
            </p>
            <p className="filter_category" onClick={handleGenre} id="10749">
              Romance
            </p>
            <p className="filter_category" onClick={handleGenre} id="878">
              Science Fiction
            </p>
            <p className="filter_category" onClick={handleGenre} id="53">
              Thriller
            </p>
            <p className="filter_category" onClick={handleGenre} id="10752">
              War
            </p>
          </Container>
        </Col>

        <Col
          lg={9}
          className=" d-flex flex-column align-items-center  bg-white  "
        >
          {allMovies?.length > 0 ? (
            <Container
              fluid
              className=" d-flex flex-wrap justify-content-center"
            >
              {allMovies}
              <Button onClick={loadMore}>Load more...</Button>
            </Container>
          ) : (
            <ClipLoader color={color} />
          )}
        </Col>
      </Row>
    </Container>
  );
}
// https://api.themoviedb.org/3/discover/movie?api_key=5da148ae85fba43a0abfb7bff2aca05a&with_genres={genre_id}
