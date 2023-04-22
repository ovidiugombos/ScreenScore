import MovieOverview from "./MovieOverview";
import Cards from "./Cards";
import config from "../utilities/config";
import { observer } from "../utilities/intersectionObserver";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CarouselItem,
  Container,
  Carousel,
  Card,
  Row,
  Col,
} from "react-bootstrap";

export default function TopRatedMovies() {
  const [cards, setCards] = useState([]);
  const mainContainer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    observer.observe(mainContainer.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  //showing movie info when clicking on a movie
  function showMovieInfo(movie) {
    navigate(`/movieoverview/${movie.id}`);
  }

  // creating the popular movies cards
  function createCards(results) {
    const arr = results.map((movie, index) => (
      <Cards showMovieInfo={showMovieInfo} movie={movie} key={index} />
    ));
    setCards(arr);
  }

  useEffect(() => {
    try {
      fetch(config.apiTopRatedUrl)
        .then((data) => data.json())
        .then((res) => {
          createCards(res.results);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div ref={mainContainer} className="container--home_movies ">
      <h3 className="my-4 mx-2">Top Rated</h3>
      <Container fluid className="container--movies_cards  d-flex ">
        {cards}
      </Container>
    </div>
  );
}
