import MovieOverview from "./MovieOverview";
import Cards from "./Cards";
import config from "../utilities/config";
import { observer } from "../utilities/intersectionObserver";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { getData } from "../utilities/helpers";
import {
  Button,
  CarouselItem,
  Container,
  Carousel,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { getAuth } from "firebase/auth";

export default function PopularMovies() {
  const [cards, setCards] = useState([]);
  const mainContainer = useRef(null);
  const navigate = useNavigate();
  const [color, setColor] = useState("#228ce9");

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
  async function handleData() {
    const res = await getData(config.apiPopularUrl);
    createCards(res.results);
  }

  useEffect(() => {
    handleData();
  }, []);

  return (
    <div ref={mainContainer} className="container--home_movies ">
      <h3 className="my-4 mx-2">Trending now</h3>
      {/* <ClipLoader color={color} /> */}
      <Container fluid className="container--movies_cards  d-flex ">
        {cards}
      </Container>
    </div>
  );
}
