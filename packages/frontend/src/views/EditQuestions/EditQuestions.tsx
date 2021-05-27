import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import { Question } from 'types';
import { getQuestions, deleteQuestion as deleteQuesionRequest } from 'api/questions';
import QuestionForm from './QuestionForm';
import { ReactComponent as SVGTrash } from 'assets/trash.svg';
import styles from './styles.module.scss';
import clsx from 'clsx';

const EditQuestions: React.FC = () => {
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        setQuestions(await getQuestions());
      } catch (err) {
        toast.error(err.response?.error || err.message);
      }
    })();
  }, []);

  const handleQuestionFormSubmit = (newQuestion: Question) => {
    setQuestions(questions => [...questions, newQuestion]);
    setIsAddingQuestion(false);
  };

  const deleteQuesion = async (id: string) => {
    if (!window.confirm('Do you really want to delete this question?')) return;
    setDeletingQuestionId(id);
    try {
      await deleteQuesionRequest(id);
      setQuestions(questions => questions.filter(item => item.id !== id));
    } catch (err) {
      toast.error(err.response?.error || err.message);
    }
    setDeletingQuestionId(undefined);
  };

  return (
    <Container fluid="sm" className="d-flex my-3 flex-column align-items-center">
      <div className="border bg-light flex-column p-3 w-100">
        <h3 className="mb-4">Edit Questions</h3>
        {isAddingQuestion ? (
          <QuestionForm
            onCancel={() => setIsAddingQuestion(false)}
            onSubmit={handleQuestionFormSubmit}
          />
        ) : (
          <>
            <Button onClick={() => setIsAddingQuestion(true)}>New Question</Button>
            <div className={clsx('border bg-white p-2', styles.questionsList)}>
              {questions.map(question => (
                <div key={question.id} className={clsx('border bg-light p-1', styles.question)}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteQuesion(question.id)}
                    disabled={deletingQuestionId === question.id}>
                    <SVGTrash />
                  </button>
                  <div>#{question.id}</div>
                  <div>
                    <strong>Text:</strong> {question.text}
                  </div>
                  <div>
                    <strong>Answer:</strong> {question.answer}
                  </div>
                  {question.options && (
                    <div>
                      <strong>Options:</strong> {question.options.join(' | ')}
                    </div>
                  )}
                  <div>
                    <strong>Difficulty:</strong> {question.difficulty}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
