import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { Form, Button, Container } from 'react-bootstrap';
import AuthContext from 'context/AuthContext';

const Auth: React.FC = () => {
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
      toast.error(err.response?.error || err.message);
    }
  };

  return (
    <Container className="h-100 d-flex align-items-center justify-content-center" fluid="sm">
      <Form className="p-3 w-100 bg-light border" onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
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
