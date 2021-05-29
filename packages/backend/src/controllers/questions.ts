import { Request, Response } from 'express';
import { Question } from 'types';
import { validateQuestionData } from '../utils/validators';
import { db } from '../utils/admin';

export async function getQuestions(
  _req: Request,
  res: Response
): Promise<Response<Question[]>> {
  try {
    const data = await db.collection('questions').orderBy('difficulty').get();
    const questions = data.docs.map(item => ({ id: item.id, ...item.data() }));
    return res.json(questions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function createQuestion(
  req: Request,
  res: Response
): Promise<Response<Question[]>> {
  try {
    const newQuestion = req.body;

    const { valid, errors } = validateQuestionData(newQuestion);
    if (!valid) return res.status(400).json(errors);

    const doc = await db.collection('questions').add(newQuestion);
    return res.json({ id: doc.id, ...newQuestion });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteQuestion(
  req: Request,
  res: Response
): Promise<Response<Question[]>> {
  try {
    const { id } = req.params;
    if (!id) throw Error('No ID');

    await db
      .collection('questions')
      .doc(id as string)
      .delete();
    return res.status(200).json('success');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
