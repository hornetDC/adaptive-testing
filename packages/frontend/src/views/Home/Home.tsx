import React, { useContext } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AuthContext from 'context/AuthContext';

const testLevelOptions = ['5A', '4B', '4C', '3D', '3E', '2Fx', '2F'];

const Home: React.FC = () => {
  const { authData, logout } = useContext(AuthContext);

  return (
    <Container
      fluid="sm"
      className="h-100 d-flex flex-column align-items-center justify-content-center">
      <h1 className="text-center mb-4">
        Welcome {authData?.email} {authData?.role === 'admin' && '(A)'}
      </h1>
      <div className="border bg-light flex-column p-3 w-100">
        <h3>Adaptive test</h3>
        <LinkContainer to="/test">
          <Button className="w-100 mt-4 mb-2">Start</Button>
        </LinkContainer>
        <Form.Group className="mt-2 mb-2" controlId="formBasicEmail">
          <Form.Label>Test Level</Form.Label>
          <Form.Control as="select" placeholder="Select">
            {testLevelOptions.map(item => (
              <option key={item}>{item}</option>
            ))}
          </Form.Control>
        </Form.Group>
        {authData?.role === 'admin' && (
          <LinkContainer to="/edit-questions">
            <Button className="w-100 mt-2 mb-3" variant="outline-success">
              Edit Questions
            </Button>
          </LinkContainer>
        )}
        <Button variant="outline-danger" onClick={logout}>
          Logout
        </Button>
      </div>
    </Container>
  );
};

export default Home;
