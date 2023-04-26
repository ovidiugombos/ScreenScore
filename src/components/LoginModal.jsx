import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate, NavLink } from "react-router-dom";
import { Modal, Form, Button } from "react-bootstrap";
// import { Form } from "react-bootstrap";
// import { Button } from "react-bootstrap";

export default function LoginModal(props) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  function handleClose() {
    props.closeModal();
  }
  function goToSignup() {
    handleClose();
    props.openSignup();
  }
  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }
  function handleChangePassword(e) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        handleClose();
        console.log(user);
      })
      .catch((error) => alert(error));
  }
  return (
    <>
      <Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                onChange={handleChangeEmail}
                type="email"
                placeholder="Enter email"
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                onChange={handleChangePassword}
                type="password"
                placeholder="Password"
              />
            </Form.Group>

            <Modal.Footer>
              <p>
                You don't have an account?
                <a
                  onClick={goToSignup}
                  className="text-primary mx-3 modal--link"
                >
                  Signup
                </a>
              </p>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
