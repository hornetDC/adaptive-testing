import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { Form, Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import serialize from 'form-serialize';
import AuthContext from 'context/AuthContext';

const Register: React.FC = () => {
  const history = useHistory();
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const values = serialize(e.currentTarget, { hash: true }) as any;
      if (values.password !== values.passwordConfirm) {
        document
          .querySelector<HTMLInputElement>('#formConfirmPassword')!
          .setCustomValidity(`Passwords don't match`);
        return;
      }
      await register(values);
      history.replace('/');
    } catch (err) {
      toast.error(err.response?.error || err.message);
    }
  };

  return (
    <Container className="flex-column" fluid="sm">
      <h1 className="text-center my-4">Sign Up</h1>
      <Form className="p-3 w-100 bg-light border" onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control name="email" type="email" placeholder="Enter" required />
        </Form.Group>

        <Form.Group className="mt-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type="password" placeholder="Enter" required />
        </Form.Group>

        <Form.Group className="mt-3" controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control name="passwordConfirm" type="password" placeholder="Enter" required />
        </Form.Group>

        <Button className="mt-3" variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <LinkContainer to="/login">
        <Button className="mt-3" variant="outline-success">
          Sign In
        </Button>
      </LinkContainer>
    </Container>
  );
};

export default Register;
