import { Request, Response, NextFunction } from 'express';
import { admin } from './admin';

export const auth = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let idToken;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
      idToken = request.headers.authorization.split('Bearer ')[1];
    } else {
      console.error('No token found');
      return response.status(403).json({ error: 'Unauthorized' });
    }

    await admin.auth().verifyIdToken(idToken);

    return next();
  } catch (err) {
    console.error('Error while verifying token', err);
    return response.status(403).json(err);
  }
};
