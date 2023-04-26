import React, { useState } from "react";
import { Card } from "react-bootstrap";
import config from "../utilities/config";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Cards(props) {
  let pathColor, trailColor;

  const percentage = Math.trunc(props.movie.vote_average * 10);
  if (percentage >= 70) {
    pathColor = "#5cb85c";
    trailColor = "#1e4228";
  } else {
    pathColor = "#bcc02e";
    trailColor = "#3e3a11";
  }
  return (
    <Card
      className="border-0 card--movie px-2   bg-transparent"
      key={props.movie.id}
    >
      <div className="position-relative">
        <Card.Img
          onClick={() => props.showMovieInfo(props.movie)}
          className="shadow"
          src={`${config.imgUrl}${props.movie.poster_path}`}
        />

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
      </div>
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
