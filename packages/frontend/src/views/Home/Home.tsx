import React, { useContext } from 'react';
import { Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AuthContext from 'context/AuthContext';

const Home: React.FC = () => {
  const { authData, logout } = useContext(AuthContext);

  return (
    <Container fluid="sm" className="d-flex flex-column">
      <h1 className="text-center my-4">
        Welcome {authData?.email} {authData?.role === 'admin' && '(A)'}
      </h1>
      <div className="border bg-light flex-column p-3 w-100">
        <h3 className="mb-4">Adaptive test</h3>
        <LinkContainer to="/test">
          <Button className="w-100 my-2">Start</Button>
        </LinkContainer>
        {authData?.role === 'admin' && (
          <>
            <LinkContainer to="/users">
              <Button className="w-100 my-2" variant="outline-success">
                Users
              </Button>
            </LinkContainer>
            <LinkContainer to="/edit-questions">
              <Button className="w-100 my-2" variant="outline-success">
                Edit Questions
              </Button>
            </LinkContainer>
          </>
        )}
        <Button className="mt-4" variant="outline-danger" onClick={logout}>
          Logout
        </Button>
      </div>
    </Container>
  );
};

export default Home;
