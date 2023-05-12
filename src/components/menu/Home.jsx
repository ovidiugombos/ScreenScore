import React, { useEffect, useState, useRef, useContext } from "react";
import Slideshow from "../Slideshow";
import PopularMovies from "../PopularMovies";
import TopRatedMovies from "../TopRatedMovies";
import { observer } from "../../utilities/intersectionObserver";
import { Container, Row, Col, Button } from "react-bootstrap";
import { UserContext } from "../../firebase/context";

export default function Home() {
  const joinUsContainer = useRef(null);
  const user = useContext(UserContext);

  //observing elements

  useEffect(() => {
    window.scrollTo(0, 0);
    joinUsContainer.current && observer.observe(joinUsContainer.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home bg-white">
      <Slideshow />
      <PopularMovies />

      <Container
        fluid
        ref={joinUsContainer}
        className="container--join_today my-4 text-white"
      >
        <Row>
          <Col sm={8}>
            <Container className="p-4">
              <h2>Join us</h2>
              <p className="my-4">
                Calling all movie enthusiasts! Are you tired of struggling to
                remember which movies you've watched, or wishing you had a place
                to keep track of your all-time favorites? Join us now and become
                part of our vibrant movie-loving community on our movie info
                website. With us, you'll have the perfect platform to create
                personalized movie lists, rate and review films, and connect
                with like-minded cinephiles. Plus, you'll get access to
                exclusive features like curated movie recommendations based on
                your interests, engaging discussions, and the opportunity to
                broaden your movie horizons. Don't miss out on this exciting
                cinematic journey – sign up for free and join us today!
              </p>
              <Button variant="info">Sign Up</Button>
            </Container>
          </Col>
          <Col sm={4} className="d-flex align-items-center">
            <ul>
              <li>Maintain a personal watchlist</li>
              <li>Add your review</li>
              <li>Create your collections</li>
              <li>Log the movies and TV shows you've seen</li>
            </ul>
          </Col>
        </Row>
      </Container>

      <TopRatedMovies />
    </div>
  );
}
