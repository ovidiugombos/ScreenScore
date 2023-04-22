import React, { useEffect, useRef, useState } from "react";
import config from "../../utilities/config";
import { observer } from "../../utilities/intersectionObserver";
import { useNavigate } from "react-router-dom";
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
  const [filter, setFilter] = useState("Popular now");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [moviesApiPage, setMoviesApiPage] = useState(config.apiPopularUrl);
  const [currentApi, setCurrentApi] = useState(config.apiPopularUrl);
  const movieCard = useRef([]);
  const navigate = useNavigate();

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
    const cards = movies.map((movie, index) => (
      <Card
        ref={(element) => (movieCard.current[index] = element)}
        className="card--movie mx-3 my-2  shadow"
        key={movie.id}
      >
        <Card.Img
          onClick={() => showMovieInfo(movie)}
          src={`${config.imgUrl}${movie.poster_path}`}
        ></Card.Img>
        <Card.Body>
          <Card.Title onClick={() => showMovieInfo(movie)} className="lh-1">
            {movie.title}
          </Card.Title>
          <Card.Text className="text-secondary lh-1">
            {movie.release_date}
          </Card.Text>
        </Card.Body>
      </Card>
    ));
    setMovies(cards);
  }

  //change the filter
  function changeFilter(name) {
    setFilter(name);
  }

  function handleGenre(e) {
    if (e.target.classList.contains("accordion-body")) {
      setCurrentApi(config.apiGenresUrl.replace("{genre_id}", e.target.id));
      changeFilter(e.target.textContent);
    }
  }

  function handleRating(e) {
    if (e.target.textContent.includes("Descending")) {
      setCurrentApi(config.apiTopRatedUrl);
      changeFilter(e.target.textContent);
    } else if (e.target.textContent.includes("Ascending")) {
    }
  }

  function handleUpcoming(e) {
    if (e.target.textContent === "Upcoming") {
      setCurrentApi(config.apiUpcomingUrl);
      changeFilter(e.target.textContent);
    }
  }

  //change the page
  function movePage(direction) {
    setMoviesApiPage(currentApi + `&page=${page + direction}`);
    setPage((prevPage) => prevPage + direction);
  }

  //observe the elements with intersection observer
  useEffect(() => {
    movies.forEach((movie, index) => {
      observer.observe(movieCard.current[index]);
    });
    return () => {
      observer.disconnect();
    };
  }, [movies]);

  //update the current url
  useEffect(() => {
    setMoviesApiPage(currentApi + `&page=${1}`);
    setPage(1);
  }, [currentApi]);

  //fetch the url
  useEffect(() => {
    window.scrollTo(0, 0);

    fetch(moviesApiPage)
      .then((data) => data.json())
      .then((res) => {
        createMovieCards(res.results);
      });
  }, [moviesApiPage]);

  return (
    <Container fluid className="p-4  ">
      <Row>
        <Col lg={2} className="">
          <Accordion
            defaultActiveKey="0"
            flush
            className="border  mx-auto mb-4 bg-white shadow-sm "
          >
            <Accordion.Item eventKey="1" onClick={handleGenre}>
              <Accordion.Header>Genres</Accordion.Header>
              <Accordion.Body id="18">Drama</Accordion.Body>
              <Accordion.Body id="28">Action</Accordion.Body>
              <Accordion.Body id="35">Comedy</Accordion.Body>
              <Accordion.Body id="10749">Romance</Accordion.Body>
              <Accordion.Body id="878">Science Fiction</Accordion.Body>
              <Accordion.Body id="27">Horror</Accordion.Body>
              <Accordion.Body id="53">Thriller</Accordion.Body>
              <Accordion.Body id="12">Adventure</Accordion.Body>
              <Accordion.Body id="14">Fantasy</Accordion.Body>
              <Accordion.Body id="16">Animation</Accordion.Body>
              <Accordion.Body id="10751">Family</Accordion.Body>
              <Accordion.Body id="36">Historical</Accordion.Body>
              <Accordion.Body id="99">Documentary</Accordion.Body>
              <Accordion.Body id="10402">Music</Accordion.Body>
              <Accordion.Body id="9648">Mistery</Accordion.Body>
              <Accordion.Body id="10752">War</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2" onClick={handleRating}>
              <Accordion.Header>Rating</Accordion.Header>
              <Accordion.Body>Rating Ascending</Accordion.Body>
              <Accordion.Body>Rating Descending</Accordion.Body>
            </Accordion.Item>
            <p className="mx-3 my-2 p-1 btn--upcoming" onClick={handleUpcoming}>
              Upcoming
            </p>
          </Accordion>
        </Col>

        <Col
          lg={10}
          className="border align-self-start rounded bg-white  shadow-sm "
        >
          <h3 className="mx-4 my-3">{filter}</h3>
          <Container className="d-flex flex-wrap justify-content-center">
            {movies}
            <Container className=" d-flex justify-content-center " fluid>
              <Button
                disabled={page === 1}
                onClick={() => movePage(-1)}
                className="m-3"
              >
                {"<"}
              </Button>
              <Button onClick={() => movePage(1)} className="m-3">
                {">"}
              </Button>
            </Container>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
// https://api.themoviedb.org/3/discover/movie?api_key=5da148ae85fba43a0abfb7bff2aca05a&with_genres={genre_id}
