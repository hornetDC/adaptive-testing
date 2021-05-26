import fetch from 'utils/fetch';
import { Question } from 'types';

export async function getQuestions(): Promise<Question[]> {
  const response = await fetch(`/questions`);
  const data = await response.json();
  return data;
}

export async function createQuestion(body: Omit<Question, 'id'>): Promise<Question> {
  const response = await fetch(`/questions`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  return data;
}

export async function deleteQuestion(id: string): Promise<void> {
  await fetch(`/questions/${id}`, { method: 'DELETE' });
}
