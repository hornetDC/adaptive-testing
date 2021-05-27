import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import { getQuestions } from 'api/questions';
import { FormControlElement, Question as QuestionData } from 'types';
import Question from 'components/Question';

const MAX_LEVEL = 5;
const LEVEL_CORRECT_ANSWERS_TO_FINISH = 15;
const LEVELS_COMPLETED_TO_FINISH = 3;

const levelCoefficients = { 1: 0.1, 2: 0.3, 3: 0.5, 4: 0.7, 5: 0.9 };

function getMarkName(score: number) {
  if (score >= 9) return '5A';
  else if (score >= 7.5) return '4B';
  else if (score >= 6) return '4C';
  else if (score >= 4.5) return '3D';
  else if (score >= 3) return '3E';
  else if (score >= 1.5) return '2Fx';
  else return '2F';
}

type QuestionGroups = {
  [key: number]: QuestionData[];
};

const Test: React.FC = () => {
  const history = useHistory();
  const [questionGroups, setQuestionGroups] = useState<QuestionGroups>({});
  const [currentLevel, setCurrentLevel] = useState(3);
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [pickedQuestions, setPickedQuestions] = useState<QuestionData[]>([]);
  const [answerLevels, setAnswerLevels] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [completedLevels, setCompletedLevels] = useState(new Set<number>());

  alert(`Test complete, your score is 4B`);

  const getFiveRandomQuestions = useCallback(questions => {
    if (!questions) return [];

    const shuffled = questions.sort(() => 0.5 - Math.random());
    if (shuffled.length > 5) shuffled.length = 5;
    return shuffled;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const questionGroups = { 1: [], 2: [], 3: [], 4: [], 5: [] };
        const questions = await getQuestions();
        questions.forEach(question => {
          questionGroups[question.difficulty].push(question);
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
    setCurrentAnswers(answers => ({ ...answers, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pickedQuestions.length < 5) {
      toast.error(`Not enought questions for level ${currentLevel}`);
      return;
    }

    const newAnswerLevels = answerLevels;
    let correctAnswers = 0;

    Object.entries(currentAnswers).forEach(([questionId, answerValue]) => {
      const question = pickedQuestions.find(question => question.id === questionId);
      if (question!.answer === answerValue) {
        correctAnswers += 1;
        newAnswerLevels[currentLevel] += 1;
      }
    });

    const newCompletedLevels = completedLevels;
    newCompletedLevels.add(currentLevel);
    console.log('newAnswerLevels', newAnswerLevels);
    console.log('newCompletedLevels', newCompletedLevels);

    // END TEST
    if (
      newCompletedLevels.size >= LEVELS_COMPLETED_TO_FINISH ||
      Object.values(newAnswerLevels).some(level => level >= LEVEL_CORRECT_ANSWERS_TO_FINISH)
    ) {
      const finalScore = Object.entries(newAnswerLevels).reduce(
        (prev, [level, answers]) => (prev += levelCoefficients[level] * answers),
        0
      );
      alert(`Test complete, your score is ${getMarkName(finalScore)}`);
      history.push('/');
      return;
    }

    let nextLevel = currentLevel;

    // decrease level
    if (correctAnswers < 3 && currentLevel >= 0) nextLevel -= 1;
    // increase level
    else if (correctAnswers > 3 && currentLevel <= MAX_LEVEL) nextLevel += 1;

    const nextPickedQuestions = getFiveRandomQuestions(questionGroups[nextLevel]);
    setPickedQuestions(nextPickedQuestions);
    setCurrentAnswers({});
    setCurrentLevel(nextLevel);
    setAnswerLevels(newAnswerLevels);
    setCompletedLevels(newCompletedLevels);
  };

  return (
    <Container fluid="sm" className="d-flex flex-column align-items-center my-3">
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
