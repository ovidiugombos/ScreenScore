import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import auth from "../firebase/firebase.js";
export default function SignupModal(props) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  function handleClose() {
    props.closeModal();
  }
  function goToLogin() {
    handleClose();
    props.openLogin();
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
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        alert(error.message);
      });
  }
  return (
    <>
      <Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Signup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email adress</Form.Label>
              <Form.Control
                required
                onChange={handleChangeEmail}
                className="mb-3"
                type="email"
                placeholder="Enter email"
                autoFocus
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                onChange={handleChangePassword}
                className="mb-3"
                type="password"
                placeholder="Enter password"
              />
            </Form.Group>
            <Modal.Footer>
              <p>
                Already have an account?
                <a
                  onClick={goToLogin}
                  className="text-primary mx-3 modal--link"
                >
                  Login
                </a>
              </p>
              <Button onClick={handleClose} variant="secondary">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
