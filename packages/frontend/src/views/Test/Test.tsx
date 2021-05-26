import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import { getQuestions } from 'api/questions';
import { FormControlElement, Question as QuestionData } from 'types';
import Question from 'components/Question';

const MAX_LEVEL = 10;

type QuestionGroups = {
  [key: number]: QuestionData[];
};

const Test: React.FC = () => {
  const [questionGroups, setQuestionGroups] = useState<QuestionGroups>({});
  const [currentLevel, setCurrentLevel] = useState(5);
  const [answers, setAnswers] = useState({});
  const [pickedQuestions, setPickedQuestions] = useState<QuestionData[]>([]);

  const getFiveRandomQuestions = useCallback(questions => {
    if (!questions) return [];

    const shuffled = questions.sort(() => 0.5 - Math.random());
    if (shuffled.length > 5) shuffled.length = 5;
    return shuffled;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const questionGroups = {};
        const questions = await getQuestions();
        questions.forEach(question => {
          const difficultyBracket = Math.floor(question.difficulty / MAX_LEVEL);
          if (questionGroups[difficultyBracket]) questionGroups[difficultyBracket].push(question);
          else questionGroups[difficultyBracket] = [question];
        });

        setQuestionGroups(questionGroups);

        const currentLevelQuestions = questionGroups[currentLevel];
        const pickedQuestions = getFiveRandomQuestions(currentLevelQuestions);
        setPickedQuestions(pickedQuestions);
      } catch (err) {
        toast.error(err.response?.error || err.message);
      }
    })();
  }, [currentLevel, getFiveRandomQuestions]);

  const handleQuestionInputChange = (e: React.ChangeEvent<FormControlElement>) => {
    setAnswers(answers => ({ ...answers, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pickedQuestions.length < 5) {
      toast.error(`Not enought questions for level ${currentLevel}`);
      return;
    }

    let correctAnswers = 0;
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const question = pickedQuestions.find(question => question.id === questionId);
      if (question!.answer === answerValue) correctAnswers += 1;
    });

    let nextLevel = currentLevel;

    // decrease level
    if (correctAnswers < 3) {
      if (currentLevel <= 0) {
        // TODO (dno)
        return;
      }
      nextLevel = currentLevel - 1;
    }
    // increase level
    else if (correctAnswers > 3) {
      if (currentLevel >= MAX_LEVEL) {
        // TODO
        return;
      }
      nextLevel = currentLevel + 1;
    }

    const nextPickedQuestions = getFiveRandomQuestions(questionGroups[nextLevel]);
    setPickedQuestions(nextPickedQuestions);
    setCurrentLevel(nextLevel);

    console.log('correctAnswers', correctAnswers);
  };

  return (
    <Container
      fluid="sm"
      className="h-100 d-flex flex-column align-items-center justify-content-center">
      <h1 className="text-center mb-4">Test</h1>
      <Form className="border bg-light flex-column p-3 w-100" onSubmit={handleSubmit}>
        <div>Current level: {currentLevel}</div>
        {pickedQuestions.map((question, idx) => (
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
