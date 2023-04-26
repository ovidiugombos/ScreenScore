import React, { useEffect, useState } from "react";
import config from "../utilities/config";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";

export default function SearchResults() {
  const searchText = useParams().searchId;
  const [results, setResults] = useState();
  const [filter, setFilter] = useState("Movies");
  const [selectedOption, setSelectesOption] = useState("movies");
  const navigate = useNavigate();
  const [color, setColor] = useState("#228ce9");

  function showResultInfo(result) {
    // console.log(result.id);
    selectedOption === "movies" && navigate(`/movieoverview/${result.id}`);
    selectedOption === "tvshows" && navigate(`/tvshowoverview/${result.id}`);
  }

  function createResults(results) {
    results.sort((a, b) => b.popularity - a.popularity);
    console.log(results);
    const arr = results.map((result) => {
      if (result.poster_path)
        return (
          <Row key={result.id}>
            <Col className="d-flex" sm={2} lg={1}>
              <img
                className="search--img"
                src={`${config.imgUrl}${result.poster_path}`}
              />
            </Col>
            <Col sm={10} lg={11}>
              <h5>
                <span
                  className="text-primary search--title"
                  onClick={() => showResultInfo(result)}
                >
                  {result.title || result.name}{" "}
                </span>

                <span className="text-secondary">
                  (
                  {(
                    result.release_date ||
                    result.first_air_date ||
                    "-_-"
                  )?.slice(0, 4)}
                  )
                </span>
                {result.vote_average ? (
                  <span>
                    <img
                      className="img--rating_star mx-2"
                      src="\src\images\rating_star.png"
                    />
                    {result.vote_average.toFixed(1)}
                  </span>
                ) : null}
              </h5>
              <p>{result.overview}</p>
            </Col>
            <hr className="hr" />
          </Row>
        );
    });
    setResults(arr);
  }

  function handleOptionChange(e) {
    setSelectesOption(e.target.value);
  }

  useEffect(() => {
    selectedOption === "tvshows" &&
      fetch(`${config.searchTvShowUrl}${searchText}`)
        .then((data) => data.json())
        .then((res) => createResults(res.results));
  }, [searchText, selectedOption]);

  useEffect(() => {
    selectedOption === "movies" &&
      fetch(`${config.searchMovieUrl}${searchText}`)
        .then((data) => data.json())
        .then((res) => createResults(res.results));
  }, [searchText, selectedOption]);

  return results ? (
    <Container className="container--show_results" fluid>
      <Row className="m-4">
        <Col className="bg-white p-3" sm={2}>
          <h3 className="py-2">Filter</h3>
          <Form>
            <Form.Check
              className="py-2"
              label="Movies"
              type="radio"
              value="movies"
              checked={selectedOption === "movies"}
              onChange={handleOptionChange}
            />
            <Form.Check
              className="py-2"
              label="Tv Shows"
              type="radio"
              value="tvshows"
              checked={selectedOption === "tvshows"}
              onChange={handleOptionChange}
            />
          </Form>
        </Col>

        <Col className="p-4 bg-white" sm={10}>
          {results.length > 0 && (
            <div>
              <h4>Most Popular Results:</h4>
              <hr className="hr" />
              {results}
            </div>
          )}
          {results.length === 0 && (
            <div>
              <h4 className="text-danger">No results!</h4>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  ) : (
    <Container className="container--show_results d-flex justify-content-center align-items-center">
      <ClipLoader color={color} />
    </Container>
  );
}
