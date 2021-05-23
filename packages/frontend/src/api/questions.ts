import fetch from 'utils/fetch';
import { Question } from 'types';

export async function getQuestions(): Promise<Question[]> {
  const response = await fetch(`/questions`);
  const data = await response.json();
  return data;
}
