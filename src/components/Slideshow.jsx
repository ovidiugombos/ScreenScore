import React, { useEffect, useRef } from "react";
import { observer } from "../utilities/intersectionObserver";
import { Carousel } from "react-bootstrap";
export default function Slideshow() {
  const carousel = useRef(null);

  useEffect(() => {
    // console.log(carousel.current.element);
    observer.observe(carousel.current.element);

    // //stop observing when component dismounts
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Carousel ref={carousel}>
      <Carousel.Item>
        <img
          className="d-block  img"
          src="./src/images/avatar2.jpg"
          alt="First slide"
        />
        <Carousel.Caption className="carousel--shape  bg-danger">
          <h3 className="carousel--shape_text">Discover movies</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block img "
          src="/src/images/indiana.jpg"
          alt="Second slide"
        />

        <Carousel.Caption className="carousel--shape bg-success">
          <h3 className="carousel--shape_text">Look up for reviews</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block img "
          src="./src/images/idk.jpg"
          alt="Third slide"
        />

        <Carousel.Caption className="carousel--shape bg-primary">
          <h3 className="carousel--shape_text">Explore now</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
