import TVShowInfo from "../TVShowInfo";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../utilities/config";
import { observer } from "../../utilities/intersectionObserver";
import { Container, Col, Row } from "react-bootstrap";
export default function TVShows() {
  const [tvPopular, setTvPopular] = useState([]);
  const [tvTopRated, setTvTopRated] = useState([]);
  const topRatedTvShows = useRef([]);
  const popularTvShows = useRef([]);
  const navigate = useNavigate();

  //scrolling to top

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //observing elements

  useEffect(() => {
    tvTopRated.forEach((tv, index) =>
      observer.observe(topRatedTvShows.current[index])
    );
    return () => {
      observer.disconnect();
    };
  }, [tvTopRated]);

  useEffect(() => {
    tvPopular.forEach((tv, index) =>
      observer.observe(popularTvShows.current[index])
    );
    return () => {
      observer.disconnect();
    };
  }, [tvPopular]);

  function showTvInfo(showId) {
    navigate(`/tvshowoverview/${showId}`);
  }

  function createPopularTvShows(shows) {
    const arr = shows.map((show, index) => (
      <TVShowInfo
        //here i send the ref to the component (refference)
        refference={popularTvShows}
        key={index}
        index={index}
        show={show}
        showTvInfo={showTvInfo}
      />
    ));
    setTvPopular(arr);
  }

  function createTopRatedTvShows(shows) {
    const arr = shows.map((show, index) => (
      <Row
        key={index}
        className="row--top_rated"
        ref={(element) => (topRatedTvShows.current[index] = element)}
      >
        <Col className="d-flex " lg={4}>
          <img
            onClick={() => showTvInfo(show.id)}
            className=" image--tvshow_top_rated"
            src={`${config.imgUrl}${show.poster_path}`}
          />
        </Col>
        <Col lg={8}>
          <h6 className="title--tvshow" onClick={() => showTvInfo(show.id)}>
            {show.name} - <span> {show.vote_average * 10}%</span>
          </h6>
          <p>{show.first_air_date}</p>
        </Col>
        <hr className="hr" />
      </Row>
    ));
    setTvTopRated(arr);
  }

  useEffect(() => {
    try {
      fetch(config.tvApiPopular)
        .then((data) => data.json())
        .then((res) => createPopularTvShows(res.results));
    } catch (error) {
      console.log(error);
    }
    try {
      fetch(config.tvApiTopRated)
        .then((data) => data.json())
        .then((res) => createTopRatedTvShows(res.results));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Container fluid className="p-4">
      <Row>
        <Col className="bg-white p-4" sm={8}>
          <h3>Popular TV Shows</h3>
          <hr className="hr" />
          {tvPopular}
        </Col>

        <Col className=" " sm={4}>
          <Container fluid className="bg-white p-4">
            <h3>Top Rated</h3>
            <hr className="hr" />
            {tvTopRated}
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
