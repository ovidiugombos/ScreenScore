import TVShowInfo from "../TVShowInfo";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../utilities/config";
import { observer } from "../../utilities/intersectionObserver";
import { getData } from "../../utilities/helpers";
import { Container, Col, Row } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";

export default function TVShows() {
  const [tvPopular, setTvPopular] = useState([]);
  const [tvTopRated, setTvTopRated] = useState([]);
  const topRatedTvShows = useRef([]);
  const popularTvShows = useRef([]);
  const navigate = useNavigate();
  const [color, setColor] = useState("#228ce9");

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

  async function handleTvshowsData(url) {
    const res = await getData(url);
    return res;
  }

  useEffect(() => {
    async function getTvData() {
      const tvPopularData = await handleTvshowsData(config.tvApiPopular);
      const tvTopRatedData = await handleTvshowsData(config.tvApiTopRated);
      createPopularTvShows(tvPopularData.results);
      createTopRatedTvShows(tvTopRatedData.results);
    }
    getTvData();
  }, []);

  return (
    <Container fluid className="p-4">
      <Row>
        {tvPopular.length > 0 ? (
          <Col className=" bg-white p-4  " sm={8}>
            <h3 className="title">Popular TV Shows</h3>
            <hr className="hr" />
            {tvPopular}
          </Col>
        ) : (
          <Col
            className="container--spinner_tvshows d-flex justify-content-center align-items-center bg-white"
            sm={8}
          >
            <ClipLoader color={color} />
          </Col>
        )}

        {tvTopRated.length > 0 ? (
          <Col sm={4}>
            <Container fluid className="bg-white p-4">
              <h3 className="title">Top Rated</h3>
              <hr className="hr" />
              {tvTopRated}
            </Container>
          </Col>
        ) : (
          <Col>
            <Container className="container--spinner_tvshows bg-white p-4 d-flex justify-content-center align-items-center">
              <ClipLoader color={color} />
            </Container>
          </Col>
        )}
      </Row>
    </Container>
  );
}
