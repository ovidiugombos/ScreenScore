import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { UserContext } from "../firebase/context";
import { useNavigate } from "react-router-dom";
import phoneIcon from "../images/phone.png";
import emailIcon from "../images/email.png";
import locationIcon from "../images/location.png";

export default function Footer() {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  function goToMenu(e) {
    navigate(`/${e.target.textContent}`);
  }
  function goToProfile(e) {
    navigate(`/profile/${e.target.textContent.toLowerCase()}`);
  }
  return (
    <Container fluid className="footer">
      <Container className="px-3 py-5 text-white">
        <Row>
          <Col lg={3} md={6}>
            <h3 className="nav--brand">ScreenScore</h3>
            <p>Your Ultimate Screen Score Destination!</p>
          </Col>
          <Col lg={9} md={6}>
            <Row>
              <Col className="d-none d-md-block" lg={3} md={4} sm={6}>
                <h6>NAVIGATION</h6>
                <ul className="footer--navigation">
                  <li
                    className="footer--navigation_link my-1"
                    onClick={goToMenu}
                  >
                    Home
                  </li>
                  <li
                    className="footer--navigation_link my-1"
                    onClick={goToMenu}
                  >
                    Movies
                  </li>
                  <li
                    className="footer--navigation_link my-1"
                    onClick={goToMenu}
                  >
                    TvShows
                  </li>
                </ul>
              </Col>
              {user && (
                <Col className="d-none d-md-block" lg={3} md={4} sm={6}>
                  <h6>SELECTION</h6>
                  <ul className="footer--navigation">
                    <li
                      className="footer--navigation_link my-1"
                      onClick={goToProfile}
                    >
                      Watchlist
                    </li>
                    <li
                      className="footer--navigation_link my-1"
                      onClick={goToProfile}
                    >
                      Favourite
                    </li>
                  </ul>
                </Col>
              )}
              <Col lg={3} md={4} sm={6}>
                <h6>LEGAL</h6>
                <ul className="footer--navigation">
                  <li className="footer--navigation_link my-1">Terms of use</li>
                  <li className="footer--navigation_link my-1">
                    Privacy Policy
                  </li>
                </ul>
              </Col>
              <Col lg={3} md={12} sm={6}>
                <h6>CONTACT</h6>
                <ul className="footer--navigation">
                  <li className="footer--navigation_link my-1">
                    <img className="footer--icon " src={phoneIcon} />
                    <span className="mx-2">0770 700 700</span>
                  </li>
                  <li className="footer--navigation_link my-1">
                    <img className="footer--icon " src={emailIcon} />
                    <span className="mx-2">contact@screenscore.com</span>
                  </li>
                  <li className="footer--navigation_link my-1">
                    <img className="footer--icon " src={locationIcon} />
                    <span className="mx-2">1234 Hollywood, CA 90028</span>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Container fluid className="d-flex justify-content-center">
        <p className="footer--copyright">
          &copy; 2023 Screen Score. All rights reserved.
        </p>
      </Container>
    </Container>
  );
}
