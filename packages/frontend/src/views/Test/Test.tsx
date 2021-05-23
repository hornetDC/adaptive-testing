import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import { getQuestions } from 'api/questions';
import { FormControlElement, Question as QuestionData } from 'types';
import Question from 'components/Question';

const Test: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionData[]>();
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    (async () => {
      try {
        setQuestions(await getQuestions());
      } catch (err) {
        toast.error(err.response?.error || err.message);
      }
    })();
  }, []);

  const handleQuestionInputChange = (e: React.ChangeEvent<FormControlElement>) => {
    setAnswers(answers => ({ ...answers, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Container
      fluid="sm"
      className="h-100 d-flex flex-column align-items-center justify-content-center">
      <h1 className="text-center mb-4">Test</h1>
      <Form className="border bg-light flex-column p-3 w-100" onSubmit={handleSubmit}>
        {questions?.map((question, idx) => (
          <Question
            key={question.id}
            index={idx + 1}
            data={question}
            onChange={handleQuestionInputChange}
          />
        ))}
        <Button type="submit">Next</Button>
      </Form>
      <LinkContainer to="/">
        <Button className="me-auto mt-3" variant="secondary">
          Home
        </Button>
      </LinkContainer>
    </Container>
  );
};

export default Test;
