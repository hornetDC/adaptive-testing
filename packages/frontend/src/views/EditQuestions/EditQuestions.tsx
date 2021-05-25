import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import serialize from 'form-serialize';
import { Question } from 'types';
import { createQuestion } from 'api/questions';

type QuestionType = 'options' | 'input';

const EditQuestions: React.FC = () => {
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [questionType, setQuestionType] = useState<QuestionType>('options');
  const [optionsString, setOptionsString] = useState('');
  const optionsArray = optionsString.trim().split(',').filter(Boolean);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const values = serialize(e.currentTarget, { hash: true }) as any;
      const newQuestion: Omit<Question, 'id'> = {
        type: values.type,
        text: values.text,
        answer: values.answer,
        difficulty: values.difficulty,
        options: optionsArray.length ? optionsArray : undefined
      };
      await createQuestion(newQuestion);
    } catch (err) {
      toast.error(err.response?.error || err.message);
    }
  };

  return (
    <Container
      fluid="sm"
      className="h-100 d-flex flex-column align-items-center justify-content-center">
      <div className="border bg-light flex-column p-3 w-100">
        <h3 className="mb-4">Edit Questions</h3>
        {isAddingQuestion ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="my-3" controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                name="type"
                as="select"
                placeholder="Select"
                onChange={e => setQuestionType(e.target.value as QuestionType)}>
                <option value="options">Options</option>
                <option value="input">Input</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="my-3" controlId="formDifficulty">
              <Form.Label>Difficulty (0-100)</Form.Label>
              <Form.Control
                name="difficulty"
                placeholder="Enter"
                type="number"
                min={0}
                max={100}
                required
              />
            </Form.Group>
            <Form.Group className="my-3" controlId="formText">
              <Form.Label>
                Text <span className="text-secondary">(300 max)</span>
              </Form.Label>
              <Form.Control
                name="text"
                as="textarea"
                placeholder="Enter"
                maxLength={300}
                required
              />
            </Form.Group>
            <Form.Group className="my-3" controlId="formAnswer">
              <Form.Label>
                Answer{' '}
                {questionType === 'options' && (
                  <span className="text-secondary">(must be present in options)</span>
                )}
              </Form.Label>
              <Form.Control
                name="answer"
                placeholder="Enter"
                required
                pattern={questionType === 'options' ? optionsArray.join('|') : undefined}
              />
            </Form.Group>

            {questionType === 'options' && (
              <Form.Group className="my-3" controlId="formOptions">
                <Form.Label>
                  Options <span className="text-secondary">(separated by commas)</span>
                </Form.Label>
                <Form.Control
                  className="mb-1"
                  name="options"
                  placeholder="Enter"
                  required
                  defaultValue={optionsString}
                  onChange={e => setOptionsString(e.target.value)}
                />
                {optionsArray.map((item, idx) => (
                  <span
                    key={`${item}-${idx}`}
                    className="me-1 d-inline-block border lh-1 p-1 rounded">
                    {item}
                  </span>
                ))}
              </Form.Group>
            )}

            <div className="mt-4">
              <Button className="me-2" type="submit">
                Submit
              </Button>
              <Button variant="secondary" type="button" onClick={() => setIsAddingQuestion(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        ) : (
          <Button onClick={() => setIsAddingQuestion(true)}>Add</Button>
        )}

        <div className="border mt-5">Questions...</div>
      </div>
      <LinkContainer to="/">
        <Button className="me-auto mt-3" variant="secondary">
          Home
        </Button>
      </LinkContainer>
    </Container>
  );
};

export default EditQuestions;
