import { Request, Response } from 'express';
import { Question } from 'types';
import { db } from '../utils/admin';

export const getQuestions = async (
  _request: Request,
  response: Response
): Promise<Response<Question[]>> => {
  try {
    const data = await db.collection('questions').orderBy('number').get();
    const questions = data.docs.map(item => ({ id: item.id, ...item.data() }));
    return response.json(questions);
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err.code });
  }
};
