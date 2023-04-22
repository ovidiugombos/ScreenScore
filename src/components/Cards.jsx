import React from "react";
import { Card } from "react-bootstrap";
import config from "../utilities/config";

export default function Cards(props) {
  return (
    <Card
      className="border-0 card--movie px-2   bg-transparent"
      key={props.movie.id}
    >
      <Card.Img
        onClick={() => props.showMovieInfo(props.movie)}
        className="shadow"
        src={`${config.imgUrl}${props.movie.poster_path}`}
      />
      <Card.Body>
        <Card.Title onClick={() => props.showMovieInfo(props.movie)}>
          {props.movie.title}
        </Card.Title>
        <Card.Text className="text-secondary">
          {props.movie.release_date}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
