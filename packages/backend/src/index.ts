import * as functions from 'firebase-functions';
import * as express from 'express';
import { config as dotenv } from 'dotenv';
import { getQuestions, createQuestion } from './controllers/questions';
import { loginUser, signUpUser, getUserDetail } from './controllers/users';
import { isAuthenticated, isAuthorized } from './utils/auth';

dotenv({ path: `${__dirname}/../.env` });

const app = express();

app.use(express.json());

app.get('/questions', isAuthenticated, getQuestions);
app.post('/questions', isAuthenticated, isAuthorized({ hasRole: ['admin'] }), createQuestion);

app.get('/user', isAuthenticated, getUserDetail);
app.post('/login', loginUser);
app.post('/signup', signUpUser);

// Error handlers
app.use((_req, res, _next) => {
  res.status(404).send({ error: 'Route not found.' });
});
app.use((err, _req, res: any) => {
  res.status(500).send({ error: err });
});

export const api = functions.https.onRequest(app);
