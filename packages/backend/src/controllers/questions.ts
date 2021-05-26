import { Request, Response } from 'express';
import { Question } from 'types';
import { validateQuestionData } from '../utils/validators';
import { db } from '../utils/admin';

export async function getQuestions(
  _request: Request,
  response: Response
): Promise<Response<Question[]>> {
  try {
    const data = await db.collection('questions').orderBy('difficulty').get();
    const questions = data.docs.map(item => ({ id: item.id, ...item.data() }));
    return response.json(questions);
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err.message });
  }
}

export async function createQuestion(
  request: Request,
  response: Response
): Promise<Response<Question[]>> {
  try {
    const newQuestion = request.body;

    const { valid, errors } = validateQuestionData(newQuestion);
    if (!valid) return response.status(400).json(errors);

    const doc = await db.collection('questions').add(newQuestion);
    return response.json({ id: doc.id, ...newQuestion });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err.message });
  }
}

export async function deleteQuestion(
  request: Request,
  response: Response
): Promise<Response<Question[]>> {
  try {
    const { id } = request.params;
    if (!id) throw Error('No ID');

    await db
      .collection('questions')
      .doc(id as string)
      .delete();
    return response.status(200).json('success');
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err.message });
  }
}
