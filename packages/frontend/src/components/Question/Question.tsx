import React, { ChangeEventHandler, useMemo } from 'react';
import { Form } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { FormControlElement, Question as QuestionData } from 'types';
import styles from './styles.module.scss';

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
      <div className="d-flex title">
        <span className="text-secondary me-2">{index}.</span>{' '}
        <ReactMarkdown className={styles.markdown}>{data.text}</ReactMarkdown>
      </div>
      {answerSection}
    </div>
  );
};

export default React.memo(Question);
