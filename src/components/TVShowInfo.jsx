import React from "react";
import config from "../utilities/config";
import { Container, Row, Col } from "react-bootstrap";
export default function TVShowInfo(props) {
  let color;
  const vote = props.show.vote_average * 10;

  if (vote >= 70) {
    color = "success";
  } else if (vote >= 50 && vote < 70) {
    color = "warning";
  } else if (vote < 50) {
    color = "danger";
  }

  return (
    <Row
      className="row--popular"
      ref={(element) => {
        props.refference.current[props.index] = element;
      }}
    >
      <Col className="d-flex " sm={2}>
        <img
          onClick={() => props.showTvInfo(props.show.id)}
          className="image--tvshow_popular my-2 "
          src={`${config.imgUrl}${props.show.poster_path}`}
        />
      </Col>
      <Col sm={8}>
        <h5>
          {props.index + 1}.{" "}
          <span
            className="title--tvshow"
            onClick={() => props.showTvInfo(props.show.id)}
          >
            {props.show.name}
          </span>
        </h5>
        <p className="text-secondary">{props.show.first_air_date}</p>
        <p>{props.show.overview}</p>
      </Col>
      <Col sm={2}>
        <Container
          className={`tvshow-score my-2 bg-${color} rounded  d-flex justify-content-center align-items-center`}
        >
          <h2 className="text-white">{props.show.vote_average * 10}</h2>
        </Container>
      </Col>

      <hr className="hr" />
    </Row>
  );
}
