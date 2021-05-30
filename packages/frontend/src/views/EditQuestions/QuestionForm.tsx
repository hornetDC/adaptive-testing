import React, { useState } from 'react';
import serialize from 'form-serialize';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createQuestion } from 'api/questions';
import { Question } from 'types';

type QuestionType = 'options' | 'input';

interface QuestionFormProps {
  onSubmit: (data: Question) => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onCancel, onSubmit }) => {
  const [questionType, setQuestionType] = useState<QuestionType>('options');
  const [optionsString, setOptionsString] = useState('');
  const optionsArray = optionsString
    .split('$')
    .filter(Boolean)
    .map(item => item.trim());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const values = serialize(e.currentTarget, { hash: true }) as any;
      const newQuestion: Omit<Question, 'id'> = {
        type: values.type,
        text: values.text,
        answer: values.answer,
        difficulty: Number(values.difficulty),
        options: optionsArray.length ? optionsArray : undefined
      };
      const createdQuestion = await createQuestion(newQuestion);
      onSubmit(createdQuestion);
    } catch (err) {
      toast.error(err.response?.error || err.message);
    }
  };

  return (
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
        <Form.Label>Difficulty</Form.Label>
        <Form.Control name="difficulty" defaultValue="3" as="select" placeholder="Enter" required>
          <option value="1">0.1</option>
          <option value="2">0.3</option>
          <option value="3">0.5</option>
          <option value="4">0.7</option>
          <option value="5">0.9</option>
        </Form.Control>
      </Form.Group>
      <Form.Group className="my-3" controlId="formText">
        <Form.Label>
          Text <span className="text-secondary">(300 max)</span>
        </Form.Label>
        <Form.Control name="text" as="textarea" placeholder="Enter" maxLength={300} required />
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
            Options <span className="text-secondary">(separated by '$' symbols)</span>
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
            <span key={`${item}-${idx}`} className="me-1 d-inline-block border lh-1 p-1 rounded">
              {item}
            </span>
          ))}
        </Form.Group>
      )}

      <div className="mt-4">
        <Button className="me-2" type="submit">
          Submit
        </Button>
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default QuestionForm;
