import React, { useState, useRef, useEffect, useContext } from "react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import config from "../utilities/config";
import ClipLoader from "react-spinners/ClipLoader";
import { getData } from "../utilities/helpers";
import { Link, BrowserRouter, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  InputGroup,
  Button,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { UserContext } from "../firebase/context";
import auth from "../firebase/firebase.js";
import { getAuth, signOut } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PageNavbar() {
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showModalSignup, setShowModalSignup] = useState(false);
  const [searchMovieText, setSearchMovieText] = useState("");
  const [realtimeMovieResults, setRealtimeMovieResults] = useState([]);
  const [realtimeTvshowsResults, setRealtimeTvshowsResults] = useState([]);
  const [term, setTerm] = useState();
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const search = useRef(null);
  const realtimeResults = useRef(null);
  const navigate = useNavigate();
  const currentActiveNavBtn = useRef(null);
  const [color, setColor] = useState("#228ce9");
  const user = useContext(UserContext);

  //Signing out

  function handleSignOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        alert("Signed out succesfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //typing in search input

  function handleChange(e) {
    setSearchMovieText(e.target.value);
  }

  //submiting the results

  function handleSubmit(e) {
    setDebouncedTerm("");
    e.preventDefault();
    search.current.blur();
    if (searchMovieText) {
      search.current.value = "";
      navigate(`/searchresults/${searchMovieText}`);
    }
  }

  //handling user state modals

  function showLogin() {
    setShowModalLogin(true);
  }
  function showSignup() {
    setShowModalSignup(true);
  }
  function closeModalLogin() {
    setShowModalLogin(false);
  }
  function closeModalSignup() {
    setShowModalSignup(false);
  }

  //active nav page yellow border

  function activeNavButton(e) {
    currentActiveNavBtn.current &&
      currentActiveNavBtn.current.classList.remove("nav-link-active");
    e.target.classList.add("nav-link-active");
    currentActiveNavBtn.current = e.target;
  }

  //handling the search term with a debounced term to delay the fetch

  function handleChangeTerm(e) {
    e.preventDefault();
    setDebouncedTerm(e.target.value);
  }

  useEffect(() => {
    const timer = setTimeout(() => setTerm(debouncedTerm), 500);
    return () => clearTimeout(timer);
  }, [debouncedTerm]);

  //clicking on a result => navigate

  function goToMovie(res) {
    navigate(`/movieoverview/${res.id}`);
    realtimeResults.current.classList.add("hide");
    search.current.value = res.title;
  }

  function goToTvshow(res) {
    navigate(`/tvshowoverview/${res.id}`);
    realtimeResults.current.classList.add("hide");
    search.current.value = res.name;
  }

  //creating the actors for search results

  async function createActors(res, type) {
    const actors = await Promise.all(
      res.map(async (mov) => {
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/${mov.id}/credits?api_key=5da148ae85fba43a0abfb7bff2aca05a`
        );
        const data = await response.json();
        if (data.cast[0] && data.cast[1])
          return `${data.cast[0]?.name}, ${data.cast[1]?.name}`;
        else return "";
      })
    );

    return actors;
  }

  //reltime movie and tv results

  async function createRealtimeMovieResults(res) {
    res.sort((a, b) => b.popularity - a.popularity);
    res = res.slice(0, 4);
    const actors = await createActors(res, "movie");
    const arr = res.map((mov, index) => {
      return (
        <Row
          className="row--realtime_results my-2"
          onClick={() => goToMovie(mov)}
        >
          <Col sm={2}>
            {mov.poster_path && (
              <img
                className="realtime_images rounded"
                src={`${config.imgUrl}${mov.poster_path}`}
              />
            )}
          </Col>
          <Col className="d-flex flex-column justify-content-center" sm={10}>
            <div>
              <p className="fw-bold m-0">
                {mov.title}{" "}
                <span className="text-secondary m-0 ">
                  ({mov.release_date.slice(0, 4)})
                </span>
              </p>
              <p>{actors[index]}</p>
            </div>
          </Col>
        </Row>
      );
    });

    if (arr.length === 0) {
      setRealtimeMovieResults(<p>No movie results!</p>);
    }
    if (arr.length === 4) {
      setRealtimeMovieResults(arr);
    }
  }

  async function createRealtimeTvshowResults(res) {
    res.sort((a, b) => b.popularity - a.popularity);
    res = res.slice(0, 4);

    const actors = await createActors(res, "tv");
    const arr = res.map((mov, index) => {
      return (
        <Row
          className="row--realtime_results my-2"
          onClick={() => goToTvshow(mov)}
        >
          <Col sm={2}>
            {mov.poster_path && (
              <img
                className="realtime_images rounded"
                src={`${config.imgUrl}${mov.poster_path}`}
              />
            )}
          </Col>
          <Col className="d-flex flex-column justify-content-center" sm={10}>
            <div>
              <p className="fw-bold m-0">
                {mov.name}{" "}
                <span className="text-secondary m-0 ">
                  ({mov.first_air_date.slice(0, 4)})
                </span>
              </p>
              <p>{actors[index]}</p>
            </div>
          </Col>
        </Row>
      );
    });

    if (arr.length === 0) {
      setRealtimeTvshowsResults(<p>No TV results!</p>);
    }
    if (arr.length === 4) {
      setRealtimeTvshowsResults(arr);
    }
  }

  //fetchilg the data with getData from helpers

  async function getMovieResults(url) {
    const res = await getData(url);
    createRealtimeMovieResults(res.results);
  }

  async function getTvResults(url) {
    const res = await getData(url);
    createRealtimeTvshowResults(res.results);
  }

  //displaying or not the results , checking if user clicks outside the results

  useEffect(() => {
    if (term) {
      realtimeResults.current.classList.remove("hide");
      getMovieResults(`${config.searchMovieUrl}${term}`);
      getTvResults(`${config.searchTvShowUrl}${term}`);
    }
    if (!term) {
      realtimeResults.current.classList.add("hide");
    }

    function checkClickOutsideResults(e) {
      if (
        realtimeResults.current &&
        !realtimeResults.current.contains(e.target) &&
        e.target !== search.current
      ) {
        realtimeResults.current.classList.add("hide");
        search.current.value = "";
        setRealtimeMovieResults([]);
        setRealtimeTvshowsResults([]);
      }
    }

    document.addEventListener("click", checkClickOutsideResults);

    return () =>
      document.removeEventListener("click", checkClickOutsideResults);
  }, [term]);

  return (
    <div>
      <Navbar expand="lg" className="px-5 py-1 text-white sticky-top">
        <Navbar.Brand
          as={Link}
          to="/home"
          className="fw-bold nav--brand d-none d-lg-block "
        >
          ScreenScore
        </Navbar.Brand>

        <Form
          onSubmit={handleSubmit}
          className="mx-3 d-none d-sm-block nav--input "
        >
          <div className="position-relative">
            <InputGroup onChange={handleChange}>
              <InputGroup.Text
                onClick={handleSubmit}
                className="bg-info text-white search--btn"
              >
                Search
              </InputGroup.Text>
              <FormControl
                onChange={handleChangeTerm}
                ref={search}
                placeholder="Lookin' for something? "
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
              />
            </InputGroup>
            <div
              ref={realtimeResults}
              className=" shadow hide text-dark my-2 rounded position-absolute container--realtime_results"
            >
              {realtimeMovieResults.length === 0 &&
              realtimeTvshowsResults.length === 0 ? (
                <Row className="d-flex justify-content-center">
                  <ClipLoader color={color} />
                </Row>
              ) : (
                <Row>
                  <Col sm={6}>
                    <h5 className="title--realtime_results mb-3">Movies</h5>
                    {realtimeMovieResults}
                  </Col>

                  <Col sm={6}>
                    <h5 className="title--realtime_results mb-3">Tv Shows</h5>
                    {realtimeTvshowsResults}
                  </Col>
                </Row>
              )}
            </div>
          </div>
        </Form>

        <Navbar.Toggle
          className="bg-white my-1"
          aria-controls="collapsible-navbar"
        />
        <Navbar.Collapse
          className="justify-content-end"
          id="collapsible-navbar"
        >
          <Nav>
            <Nav.Link
              className="text-white"
              onClick={activeNavButton}
              as={Link}
              to="/home"
            >
              Home
            </Nav.Link>

            <Nav.Link
              className="text-white"
              onClick={activeNavButton}
              as={Link}
              to="/movies"
            >
              Movies
            </Nav.Link>

            <Nav.Link
              className="text-white"
              onClick={activeNavButton}
              as={Link}
              to="/tvshows"
            >
              TV
            </Nav.Link>

            {user && (
              <>
                <Nav.Link
                  className="text-white"
                  onClick={activeNavButton}
                  as={Link}
                  to="/profile/favourite"
                >
                  Favourites
                </Nav.Link>

                <Nav.Link
                  className="text-white"
                  onClick={activeNavButton}
                  as={Link}
                  to="/profile/watchlist"
                >
                  Watchlist
                </Nav.Link>

                <Nav.Link
                  className="fw-bold text-white"
                  variant="primary"
                  onClick={handleSignOut}
                >
                  Logout
                </Nav.Link>
              </>
            )}

            {!user && (
              <Nav.Link className="fw-bold text-white" onClick={showLogin}>
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <LoginModal
        show={showModalLogin}
        closeModal={closeModalLogin}
        openSignup={showSignup}
      />
      <SignupModal
        show={showModalSignup}
        closeModal={closeModalSignup}
        openLogin={showLogin}
      />
    </div>
  );
}
