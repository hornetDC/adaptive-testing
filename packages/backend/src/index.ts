import * as functions from 'firebase-functions';
import * as express from 'express';
import { config as dotenv } from 'dotenv';
// import cors from 'cors';
import { getQuestions, createQuestion, deleteQuestion } from './controllers/questions';
import {
  loginUser,
  registerUser,
  getUsers,
  giveUserAdminRights,
  submitTestResult
} from './controllers/users';
import { isAuthenticated, isAuthorized } from './utils/auth';

dotenv({ path: `${__dirname}/../.env` });

const app = express();

app.use(express.json());

app.get('/questions', isAuthenticated, getQuestions);
app.post('/questions', isAuthenticated, isAuthorized({ hasRole: ['admin'] }), createQuestion);
app.delete('/questions/:id', isAuthenticated, isAuthorized({ hasRole: ['admin'] }), deleteQuestion);

app.get('/users', isAuthenticated, isAuthorized({ hasRole: ['admin'] }), getUsers);
app.post(
  '/users/give-admin/:id',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'] }),
  giveUserAdminRights
);
app.post('/users/test-result', isAuthenticated, submitTestResult);
app.post('/login', loginUser);
app.post('/register', registerUser);

// Error handlers
app.use((_req, res, _next) => {
  res.status(404).send({ error: 'Route not found.' });
});
app.use((err, _req, res: any) => {
  res.status(500).send({ error: err });
});

export const api = functions.https.onRequest(app);
