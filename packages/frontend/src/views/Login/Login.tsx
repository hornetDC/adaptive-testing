import AuthContext from 'context/AuthContext';
import React, { useContext, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useHistory } from 'react-router';

interface AuthProps {}

const Auth: React.FC<AuthProps> = () => {
  const history = useHistory();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formValues = { email, password };
      await login(formValues);
      history.replace('/');
    } catch (err) {
      alert(err.response?.general || err.message);
    }
  };

  return (
    <Container className="h-100 d-flex align-items-center justify-content-center">
      <Form className="border p-3 w-100" onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            // name="email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mt-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            // name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button className="mt-3" variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default Auth;
