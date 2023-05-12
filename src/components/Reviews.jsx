import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getData } from "../utilities/helpers";
import config from "../utilities/config";

export default function Reviews(props) {
  const [movie, setMovie] = useState();
  const [reviews, setReviews] = useState();
  const { movieId } = useParams();

  //creating the reviews

  function createReviews(rev) {
    // console.log(rev);
    const arr = rev.map((review) => {
      let image = null;
      if (review.author_details.avatar_path?.slice(1, 5) === "http") {
        image = review.author_details.avatar_path.slice(
          1,
          review.author_details.avatar_path.length
        );
      }
      return (
        <Row className="container--reviews">
          <Col className="d-flex justify-content-center p-0" sm={2}>
            <img
              className="reviews--review_avatar d-none d-md-block"
              src={
                image || `${config.imgUrl}${review.author_details.avatar_path}`
              }
            />
          </Col>
          <Col className="p-0" sm={10}>
            <p>
              <small>
                Added by{" "}
                <span className="fw-bold text-white">{review.author}</span>{" "}
                <span className="mx-2">
                  {review.updated_at.slice(0, 10).replaceAll("-", "/")}
                </span>
              </small>
              <img
                className="img--rating_star mx-1"
                src="\src\images\rating_star.png"
              />
              <small>{review.author_details.rating}/10</small>
            </p>
            <p>{review.content}</p>
          </Col>
          <hr />
        </Row>
      );
    });
    console.log(arr);
    if (arr.length === 0) {
      setReviews(<h5>There are no reviews for this movie</h5>);
    } else {
      setReviews(arr);
    }
  }

  //fetching the movie and the reviews

  async function getMovieData(url) {
    const movieData = await getData(url);
    setMovie(movieData);
  }

  async function getMovieReviewsData(url) {
    const reviewsData = await getData(url);
    createReviews(reviewsData.results);
  }

  useEffect(() => {
    getMovieData(config.apiMovieId.replace("{movieid}", movieId));
    getMovieReviewsData(config.apiMovieReview.replace("{movieid}", movieId));
  }, []);

  return (
    <Container fluid className="container--reviews p-0 m-0">
      <Container className="p-5">
        <div className="title">
          <h5 className="m-0 lh-1 ">Reviews of</h5>
          <h4 className="fw-bold m-0 lh-1">
            <span className="text-white">{movie?.title}</span>{" "}
            <span className="">{movie?.release_date.slice(0, 4)}</span>
          </h4>
        </div>

        {reviews && (
          <Row>
            <Col sm={8}>
              <hr />
              {reviews}
            </Col>
            <Col className="d-flex justify-content-end  " sm={4}>
              <img
                className="align-self-start rounded"
                src={`${config.imgUrl}${movie.poster_path}`}
              />
            </Col>
          </Row>
        )}
      </Container>
    </Container>
  );
}
