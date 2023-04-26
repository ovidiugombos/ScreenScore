import { React, useState, useRef, useEffect, useContext } from "react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { Link, BrowserRouter, useNavigate } from "react-router-dom";
import {
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
  const search = useRef(null);
  const navigate = useNavigate();
  const currentActiveNavBtn = useRef(null);

  const user = useContext(UserContext);

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

  function handleChange(e) {
    setSearchMovieText(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    search.current.blur();
    if (searchMovieText) {
      search.current.value = "";
      navigate(`/searchresults/${searchMovieText}`);
    }
  }

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

  function activeNavButton(e) {
    currentActiveNavBtn.current &&
      currentActiveNavBtn.current.classList.remove("nav-link-active");
    e.target.classList.add("nav-link-active");
    currentActiveNavBtn.current = e.target;
  }

  return (
    <>
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
          <InputGroup onChange={handleChange}>
            <InputGroup.Text
              onClick={handleSubmit}
              className="bg-info text-white search--btn"
            >
              Search
            </InputGroup.Text>
            <FormControl
              ref={search}
              placeholder="Lookin' for something? "
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
            />
          </InputGroup>
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
              <Nav.Link className="fw-bold" onClick={showLogin}>
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
    </>
  );
}
// https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={query}
