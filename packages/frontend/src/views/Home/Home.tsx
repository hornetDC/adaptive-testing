import React, { useContext } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AuthContext from 'context/AuthContext';

const Home: React.FC = () => {
  const { authData, logout } = useContext(AuthContext);

  return (
    <Container
      fluid="sm"
      className="h-100 d-flex flex-column align-items-center justify-content-center">
      <h1 className="text-center mb-4">Welcome {authData?.email}</h1>
      <div className="border bg-light flex-column p-3 w-100">
        <h3>Adaptive test</h3>
        <LinkContainer to="/test">
          <Button className="w-100 mt-4 mb-2">Start</Button>
        </LinkContainer>
        <Form.Group className="mt-2 mb-4" controlId="formBasicEmail">
          <Form.Label>Test Level</Form.Label>
          <Form.Control as="select" placeholder="Select">
            <option>5A</option>
            <option>4B</option>
            <option>4C</option>
            <option>3D</option>
            <option>3E</option>
            <option>2Fx</option>
            <option>2F</option>
          </Form.Control>
        </Form.Group>
        <Button variant="outline-danger" onClick={logout}>
          Logout
        </Button>
      </div>
    </Container>
  );
};

export default Home;
