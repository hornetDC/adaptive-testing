import React, { ChangeEventHandler, useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { FormControlElement, Question as QuestionData } from 'types';

interface QuestionProps {
  index: number;
  data: QuestionData;
  onChange?: ChangeEventHandler<FormControlElement>;
}

const Question: React.FC<QuestionProps> = ({ index, data, onChange }) => {
  const answerSection = useMemo(() => {
    switch (data.type) {
      case 'input':
        return <Form.Control name={data.id} placeholder="Enter" onChange={onChange} required />;
      case 'options':
        return (
          <Form.Control
            as="select"
            name={data.id}
            placeholder="Select"
            onChange={onChange}
            required>
            <option value="">Select option</option>
            {data.options?.map(option => (
              <option key={option}>{option}</option>
            ))}
          </Form.Control>
        );

      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.type]);

  return (
    <div className="question mt-3 mb-3">
      <h5>
        <span className="text-secondary me-2">{index}.</span> {data.text}
      </h5>
      {answerSection}
    </div>
  );
};

export default React.memo(Question);
